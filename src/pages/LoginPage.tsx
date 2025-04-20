
import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const { login, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role") as "merchant" | "customer" || "customer";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"merchant" | "customer">(roleParam);
  
  useEffect(() => {
    if (roleParam) {
      setActiveTab(roleParam);
    }
  }, [roleParam]);
  
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "merchant") {
        navigate("/merchant/products");
      } else {
        navigate("/products");
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, activeTab);
    if (success) {
      if (activeTab === "merchant") {
        navigate("/merchant/products");
      } else {
        navigate("/products");
      }
    }
  };
  
  // Demo login helpers
  const loginAsMerchant = async () => {
    await login("merchant@test.com", "password", "merchant");
  };
  
  const loginAsCustomer = async () => {
    await login("customer@test.com", "password", "customer");
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "merchant" | "customer")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="merchant">Merchant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">Demo Account</p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={loginAsCustomer}
                    >
                      Use demo customer account
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="merchant">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="merchant-email">Email</Label>
                    <Input
                      id="merchant-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="merchant-password">Password</Label>
                    <Input
                      id="merchant-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">Demo Account</p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={loginAsMerchant}
                    >
                      Use demo merchant account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
