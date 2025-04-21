import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { authService } from "@/services/auth-service";
import { get } from "lodash";
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
import { useGetAllProducts, useDeleteProduct } from "@/services/product-service";

const MerchantProductsListPage = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  const navigate = useNavigate();

  const { data: dataProduct, isLoading, refetch } = useGetAllProducts({});
  const productList = get(dataProduct, "data.data.productList", []);

  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isAuthenticated || user?.is_merchant !== true) {
      navigate("/login");
      toast.error("Please login as a merchant to access this page");
    }
  }, [isAuthenticated, user, navigate]);

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        refetch();
      },
      onError: (error: unknown) => {
        toast.error((error as Error).message || "Failed to delete product");
        refetch();
      }      
    });
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  productList?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="align-middle">
                        <div className="h-20 w-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img
                            src={product.image?.[0] || "https://via.placeholder.com/80"}
                            alt={product.product_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.product_name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>${(parseFloat(product.price) || 0).toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/merchant/products/edit/${product.id}`}>
                          <Button variant="outline" size="icon" disabled={isLoading}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && productList?.length === 0 && (
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