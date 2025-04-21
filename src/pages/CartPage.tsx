
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash, X, Check } from "lucide-react";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className="md:w-24 md:h-24 flex-shrink-0 mb-4 md:mb-0">
                        <img 
                          src={item.image[0]} 
                          alt={item.product_name} 
                          className="rounded object-cover w-full h-full" 
                        />
                      </div>
                      
                      <div className="md:ml-6 flex-grow">
                        <div className="flex justify-between">
                          <Link to={`/products/${item.id}`} className="font-medium hover:text-ecommerce-primary">
                            {item.product_name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500 mt-1">SKU: {item.sku}</div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center">
                            <button 
                              className="w-8 h-8 flex items-center justify-center border rounded-l-md bg-gray-50"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center border-y">
                              {item.quantity}
                            </span>
                            <button 
                              className="w-8 h-8 flex items-center justify-center border rounded-r-md bg-gray-50"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Button variant="outline" onClick={clearCart} className="text-sm">
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-medium text-xl mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
