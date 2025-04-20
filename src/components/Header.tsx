
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User } from "lucide-react";

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-ecommerce-primary rounded-full p-2">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-ecommerce-primary">ShopVerse</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="font-medium hover:text-ecommerce-primary transition-colors">
            Home
          </Link>
          <Link to="/products" className="font-medium hover:text-ecommerce-primary transition-colors">
            Products
          </Link>
          <Link to="/about" className="font-medium hover:text-ecommerce-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="font-medium hover:text-ecommerce-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-ecommerce-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="text-sm font-medium">
                  Hello, {user?.name} ({user?.role})
                </span>
              </div>
              {user?.role === "merchant" && (
                <Link to="/merchant/products">
                  <Button variant="outline" size="sm">
                    Manage Products
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  <User className="h-4 w-4 mr-1" /> Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
