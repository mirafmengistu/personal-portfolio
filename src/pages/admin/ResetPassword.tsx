import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the reset token in the URL
    const checkSession = async () => {
      const hash = window.location.hash;
      console.log("URL Hash:", hash); // Debug log
      
      // Get the current session - Supabase will automatically handle the token
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log("Session:", session); // Debug log
      
      if (error) {
        console.error("Session error:", error);
        toast.error("Invalid or expired reset link");
        navigate("/admin");
        return;
      }
      
      if (session) {
        setIsValidToken(true);
      } else {
        // If no session, check if we have a hash with access_token
        if (hash && hash.includes('access_token')) {
          // The token is present but session isn't established yet
          // Try to set the session from the hash
          try {
            const { data, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !data.session) {
              toast.error("Unable to process reset link. Please try again.");
              navigate("/admin");
              return;
            }
            setIsValidToken(true);
          } catch (err) {
            toast.error("Invalid reset link");
            navigate("/admin");
          }
        } else {
          toast.error("No reset token found. Please request a new password reset.");
          navigate("/admin");
        }
      }
      
      setIsChecking(false);
    };

    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
      
      // Sign out the user and redirect to login
      await supabase.auth.signOut();
      localStorage.removeItem("adminAuthenticated");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
      
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <Lock className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg">Invalid Reset Link</h3>
              <p className="text-muted-foreground text-sm">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button onClick={() => navigate("/admin")} className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
            <div className="text-center text-sm">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/admin")}
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};