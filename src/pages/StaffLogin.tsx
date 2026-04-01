import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import aviraLogo from "@/assets/avira-logo.png";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Verify the user has a staff/admin/doctor role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .limit(1);

        if (!roles || roles.length === 0) {
          await supabase.auth.signOut();
          throw new Error("You do not have permission to access this system. Contact the administrator.");
        }
      }

      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" }}>
      <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <img src={aviraLogo} alt="Avira Hospital Logo" className="w-14 h-14 rounded-full object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground">Avira Hospital</h1>
          <p className="text-muted-foreground text-sm mt-1">Staff & Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="px-8 pb-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Staff Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@avirahospital.com"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                required
                minLength={6}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-border" />
                <Label htmlFor="remember" className="text-muted-foreground cursor-pointer">Remember me</Label>
              </div>
              <button type="button" className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Login to Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-accent/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium">Note:</span> Staff credentials are provided by the Master Admin.
              <br />Contact administration if you need access.
            </p>
          </div>

          <div className="text-center mt-4">
            <a href="/" className="text-primary text-sm hover:underline flex items-center justify-center gap-1">
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
