
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { get } from "lodash";
import { useGetProductById } from "@/services/product-service";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: dataProduct, isLoading, error } = useGetProductById(id);
  const product = get(dataProduct, "data.data.productData", null);
  
  // const product = id ? getProductById(id) : undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!product) {
      toast.error("Product not found");
      navigate("/products");
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              <img 
                src={product.image[0]} 
                alt={product.product_name} 
                className="w-full h-96 object-contain" 
              />
            </div>
            
            {product.image.length > 1 && (
              <div className="flex space-x-2">
                {product.image.map((image, index) => (
                  <div 
                    key={index}
                    className={`border-2 rounded cursor-pointer ${
                      activeImageIndex === index 
                        ? "border-ecommerce-primary" 
                        : "border-gray-200"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.product_name} - view ${index + 1}`} 
                      className="w-20 h-20 object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
            <p className="text-2xl font-bold text-ecommerce-primary mb-4">
              ${product.price}
            </p>
            
            <div className="mb-6">
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              <div className="mt-1">
                <span className={`${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {product.quantity > 0 && (
                  <span className="ml-1 text-gray-500">({product.quantity} available)</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.quantity}
                >
                  +
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
