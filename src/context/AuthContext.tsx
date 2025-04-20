
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: "merchant" | "customer";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "merchant" | "customer") => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers = [
  { id: "1", email: "merchant@test.com", password: "password", name: "Demo Merchant", role: "merchant" as const },
  { id: "2", email: "customer@test.com", password: "password", name: "Demo Customer", role: "customer" as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string, role: "merchant" | "customer") => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password && u.role === role
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
