
import { Link } from "react-router-dom";

const Footer = () => {
  // Check if we're in a browser environment to avoid SSR issues
  const isClient = typeof window !== 'undefined';
  
  // Only render Links if we're in a client environment
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ShopVerse</h3>
            <p className="text-sm text-gray-600">
              Your one-stop shop for all your premium product needs with the best
              prices and quality.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                {isClient && (
                  <Link to="/products" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    All Products
                  </Link>
                )}
              </li>
              <li>
                {isClient && (
                  <Link to="/products" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    Featured Items
                  </Link>
                )}
              </li>
              <li>
                {isClient && (
                  <Link to="/products" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    New Arrivals
                  </Link>
                )}
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                {isClient && (
                  <Link to="/contact" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    Contact Us
                  </Link>
                )}
              </li>
              <li>
                {isClient && (
                  <Link to="/faq" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    FAQ
                  </Link>
                )}
              </li>
              <li>
                {isClient && (
                  <Link to="/shipping" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    Shipping & Returns
                  </Link>
                )}
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                {isClient && (
                  <Link to="/terms" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    Terms & Conditions
                  </Link>
                )}
              </li>
              <li>
                {isClient && (
                  <Link to="/privacy" className="text-sm text-gray-600 hover:text-ecommerce-primary">
                    Privacy Policy
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
