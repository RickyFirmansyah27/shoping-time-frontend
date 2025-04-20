
import { Link } from "react-router-dom";
import { Product, useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  return (
    <Card className="product-card overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="flex-grow">
        <div className="product-image-container h-48 md:h-56">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="product-image w-full h-full object-cover" 
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg truncate">{product.title}</h3>
          <p className="text-ecommerce-muted text-sm mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-2 font-bold text-lg">${product.price.toFixed(2)}</div>
        </CardContent>
      </Link>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full" 
          onClick={() => addToCart(product)}
          variant="default"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
