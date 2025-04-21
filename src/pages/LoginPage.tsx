import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService, useLogin } from '@/services/auth-service';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [activeTab, setActiveTab] = useState(authService.getUser()?.is_merchant ? "merchant" : "customer");

  const [formValues, setFormValues] = useState<LoginValues>({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form values
    const validationResult = loginSchema.safeParse(formValues);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      toast.error(errors[0].message);
      setLoading(false);
      return;
    }

    const credentials = {
      email: formValues.email,
      password: formValues.password,
    };

    loginMutation.mutate(credentials, {
      onSuccess: (response) => {
        toast.success('Logged in successfully');
        const userData = authService.getUser();
        if (userData?.is_merchant) navigate("/merchant/products");
        else navigate('/products');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to login');
      },
      onSettled: () => setLoading(false),
    });
  };

  const handleDemoLogin = (isMerchant: boolean) => {
    const demoCredentials = {
      email: isMerchant ? "merchant@demo.com" : "customer@demo.com",
      password: "password",
    };

    setFormValues(demoCredentials);
    
    // Create a synthetic form event to trigger the submit
    const form = document.createElement('form');
    handleSubmit({ preventDefault: () => {} } as FormEvent);
  };

  const loginAsCustomer = () => handleDemoLogin(false);
  const loginAsMerchant = () => handleDemoLogin(true);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "merchant" | "customer")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="merchant">Merchant</TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <LoginForm
                  email={formValues.email}
                  password={formValues.password}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  loading={loading}
                  onDemoLogin={loginAsCustomer}
                />
              </TabsContent>

              <TabsContent value="merchant">
                <LoginForm
                  email={formValues.email}
                  password={formValues.password}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  loading={loading}
                  onDemoLogin={loginAsMerchant}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

const LoginForm = ({
  email, password, onChange, onSubmit, loading, onDemoLogin
}: {
  email: string;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  onDemoLogin: () => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={onChange}
        placeholder="your@email.com"
        required
      />
    </div>

    <div>
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={onChange}
        placeholder="••••••••"
        required
      />
    </div>

    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Logging in..." : "Sign In"}
    </Button>

    <div className="text-center mt-4">
      <p className="text-sm text-gray-500">Demo Account</p>
      <Button type="button" variant="link" className="text-sm" onClick={onDemoLogin}>
        Use demo account
      </Button>
    </div>
  </form>
);

export default LoginPage;
