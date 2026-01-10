import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in production this would connect to auth backend
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome, Admin!",
        description: "You've been successfully logged in.",
      });
      navigate("/admin");
    }, 800);
  };

  return (
    <Layout>
      <div className="bg-red-100 min-h-[calc(100vh-8rem)]">
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="w-full max-w-md animate-scale-in">
          <div className="card-elevated">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                <LogIn className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Admin Login
              </h1>
              <p className="text-muted-foreground">
                Sign in to access the ProjectX admin dashboard
              </p>
            </div>

            {/* Admin Notice */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20 mb-6">
              <Shield className="h-5 w-5 text-secondary flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                This login is for authorized administrators only. Contact IT support if you need access.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@central.edu"
                    className="w-full rounded-lg border border-input bg-background px-10 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-background px-10 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-input text-primary focus:ring-primary/20" />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need admin access?{" "}
                <a href="#" className="text-primary font-medium hover:underline">
                  Contact IT Support
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 text-center">
            <Link 
              to="/timetable" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              View public timetable without signing in →
            </Link>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Login;
