
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { authService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddProduct } from "@/services/product-service";
import { toast } from "sonner";
import { X } from "lucide-react";
import { AddProduct } from "@/services/types";
import { convertFileToBase64 } from "@/lib/utils";

const AddProductPage = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    sku: "",
    image: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mutateAsync: addProduct,
    isPending,
  } = useAddProduct();

  useEffect(() => {
    if (!isAuthenticated || user?.is_merchant !== true) {
      navigate("/login");
      toast.error("Please login as a merchant to access this page");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      setImageFiles((prevFiles) => [...prevFiles, ...filesArray]);

      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Convert image files to base64
      const imageBase64Array = await Promise.all(
        imageFiles.map(file => convertFileToBase64(file))
      );
  
      const payload: AddProduct = {
        productName: formData.title,
        description: formData.description,
        price: Number(formData.price),
        sku: formData.sku,
        quantity: Number(formData.quantity),
        image: imageBase64Array,
      };
  
      await addProduct(payload);
      toast.success("Product added successfully!");
      navigate("/merchant/products");
    } catch (err) {
      toast.error("Failed to submit product!");
      console.error("Gagal upload produk", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
        
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
                  value={formData.price}
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
                  value={formData.quantity}
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="h-32 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={image} 
                          alt={`Product image ${index + 1}`} 
                          className="h-full w-full object-cover" 
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
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;
