
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";

const MerchantProductsListPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [merchantProducts, setMerchantProducts] = useState(products);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!isAuthenticated || user?.role !== "merchant") {
      navigate("/login?role=merchant");
      toast.error("Please login as a merchant to access this page");
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleDeleteProduct = (id: string) => {
    setMerchantProducts(merchantProducts.filter(p => p.id !== id));
    toast.success("Product deleted successfully");
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Link to="/merchant/products/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add New Product
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchantProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/merchant/products/edit/${product.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {merchantProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first product
              </p>
              <Link to="/merchant/products/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add New Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MerchantProductsListPage;
