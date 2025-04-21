import { useEffect, useState, useMemo } from "react";
import { get } from "lodash";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import Layout from "@/components/Layout";
import { useGetAllProducts } from "@/services/product-service";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1500]);

  const { data: dataProduct, isLoading } = useGetAllProducts({});
  const productList = get(dataProduct, "data.data.productList", []);

  // Hitung maxPrice menggunakan useMemo untuk optimasi
  const maxPrice = useMemo(() => {
    return productList.length > 0 
      ? Math.max(...productList.map(product => product.price))
      : 1500;
  }, [productList]);

  // Filter produk menggunakan useMemo untuk mencegah perhitungan ulang yang tidak perlu
  const filteredProducts = useMemo(() => {
    return productList.filter(product => {
      const matchesSearch = 
        product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesPrice;
    });
  }, [searchTerm, priceRange, productList]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Search</h3>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6"
                disabled={isLoading}
              />
              
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={maxPrice}
                step={1}
                className="mb-4"
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Loading products...</h3>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;