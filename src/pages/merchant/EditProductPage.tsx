import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "lodash";
import Layout from "@/components/Layout";
import { authService } from "@/services/auth-service";
import { useGetProductById } from "@/services/product-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  const navigate = useNavigate();

  const { data: dataProduct, isLoading, error } = useGetProductById(id);
  const product = get(dataProduct, "data.data.productData", null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    sku: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.product_name || "",
        description: product.description || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        sku: product.sku || "",
      });
      setImages(product?.image);
    }
  }, [product]);

  useEffect(() => {
    if (!isAuthenticated || user?.is_merchant !== true) {
      navigate("/login");
      toast.error("Please login as a merchant to access this page");
    }
  }, [isAuthenticated, navigate, user?.is_merchant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: string[] = [];

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === "string") {
            newImages.push(reader.result);
            if (newImages.length === filesArray.length) {
              setImages([...images, ...newImages]);
              console.log("new images added:", newImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Product updated successfully!");
      navigate("/merchant/products");
      setIsSubmitting(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-red-500">Product not found or an error occurred.</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/merchant/products")}
              className="mt-4"
            >
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price.toString()}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity.toString()}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="images">Product Images</Label>
              <div className="mt-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  multiple
                  className="mb-4"
                />
                {images.length === 0 ? (
                  <p className="text-gray-500">No images uploaded.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="h-32 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => console.error(`Failed to load image ${index}:`, image)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-70 hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/merchant/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProductPage;