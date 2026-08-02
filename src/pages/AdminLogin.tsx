import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add this state
  const navigate = useNavigate();

  // Handle login with Supabase Auth (LIVE)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        localStorage.setItem("adminAuthenticated", "true");
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      }

      if (data.session && rememberMe) {
        // Supabase handles session persistence automatically
        localStorage.setItem("adminAuthenticated", "true");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/admin/reset-password`;
      console.log("Reset password redirect URL:", redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
      setShowResetPassword(false);
      setResetEmail("");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // Forgot Password Form
  const ForgotPasswordForm = () => (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={() => setShowResetPassword(false)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="reset-email"
                type="email"
                placeholder="mirafmengistu89@gmail.com"
                className="pl-10"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={resetLoading}>
            {resetLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  // Main Login Form
  const LoginForm = () => (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
        <CardDescription>Login to manage your portfolio content</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="mirafmengistu89@gmail.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
                onClick={() => {
                  setResetEmail(email || "");
                  setShowResetPassword(true);
                }}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 h-4 w-4"
              />
              <Label htmlFor="remember-me" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Use your registered email and password to login</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      {showResetPassword ? <ForgotPasswordForm /> : <LoginForm />}
    </div>
  );
};