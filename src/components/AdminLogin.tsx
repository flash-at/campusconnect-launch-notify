
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if password matches
    if (password === "@Mahesh06") {
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel!",
      });
      onLogin();
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
    setPassword("");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-8">
      <Card className="bg-white/10 border-white/20 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="mx-auto h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          <CardTitle className="text-white text-2xl">Admin Access</CardTitle>
          <CardDescription className="text-gray-300">
            Enter the admin password to access the control panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              <Lock className="h-4 w-4 mr-2" />
              {isLoading ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
