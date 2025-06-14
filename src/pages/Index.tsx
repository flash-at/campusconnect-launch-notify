import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Rocket, AlertCircle, Mail } from "lucide-react";
import { NotificationService } from "@/components/NotificationService";

const CustomLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 11V3h6v8h-6z"></path>
    <path d="M9 3v18h6V3H9z"></path>
    <path d="M1 7v10h6V7H1z"></path>
  </svg>
);

const Index = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [notify, setNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Index component mounted successfully");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with:", { email, firstName, notify });
    
    // Validate all required fields
    if (!email || !firstName || !notify) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and check the notification box.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate name (no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(firstName.trim())) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid first name (letters only).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Starting subscription process for:", { email, firstName });

    try {
      const result = await NotificationService.subscribeUser({
        email: email.trim(),
        firstName: firstName.trim(),
        timestamp: new Date().toISOString()
      });

      console.log("Subscription result:", result);

      if (result.success) {
        toast({
          title: result.emailSent ? "Success! 🚀" : "Subscribed! 📧",
          description: result.message,
        });
        
        // Reset form on success
        setEmail("");
        setFirstName("");
        setNotify(false);
        
        // Show additional success message if email was sent
        if (result.emailSent) {
          setTimeout(() => {
            toast({
              title: "Check Your Email! 📬",
              description: "A welcome email has been sent to your inbox.",
            });
          }, 2000);
        }
      } else {
        toast({
          title: "Subscription Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Header */}
      <header className="py-8 md:py-10 border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 rounded-xl backdrop-blur-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <CustomLogo />
            </div>
            <div>
              <span className="text-3xl font-bold text-white tracking-tight">CampusConnect</span>
              <div className="text-xs text-emerald-400 font-medium tracking-wide">COMING SOON</div>
            </div>
          </div>
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a className="text-gray-300 hover:text-white transition-colors font-medium text-sm" href="#">
                Home
              </a>
              <a className="text-gray-300 hover:text-emerald-400 transition-colors font-medium text-sm" href="/admin">
                Admin
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Email Service Notice */}
      <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 mx-6 mt-4 rounded-r-lg">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-emerald-400 mr-3" />
          <div>
            <p className="text-sm text-emerald-200">
              <strong>Email Status:</strong> ✅ Welcome emails are now active! You'll receive a confirmation email after subscribing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                <p className="text-emerald-400 text-sm font-medium tracking-wide">
                  GET READY FOR CAMPUSCONNECT
                </p>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-none">
                Launching<br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Soon
                </span>
              </h1>
              
              <p className="text-gray-300 mb-12 text-xl leading-relaxed">
                Be the first to experience the future of campus connectivity. Join our exclusive 
                community to stay updated on events, clubs, services, and innovative student tools.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-semibold text-gray-200 mb-3">
                      First name <span className="text-emerald-400">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/30 rounded-lg disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                      Email address <span className="text-emerald-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/30 rounded-lg disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="notify"
                      checked={notify}
                      onCheckedChange={(checked) => setNotify(checked === true)}
                      disabled={isLoading}
                      className="border-gray-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-1 disabled:opacity-50"
                    />
                    <Label htmlFor="notify" className="text-sm text-gray-300 leading-relaxed">
                      I want to be notified when CampusConnect launches and receive exclusive updates. <span className="text-emerald-400">*</span>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email || !firstName || !notify}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 h-12 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/25 w-full sm:w-auto disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Subscribing...</span>
                      </div>
                    ) : (
                      "Notify Me"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Join <strong className="text-emerald-400">500+</strong> students already on the waitlist
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
                <div className="relative aspect-square bg-white/5 rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 p-12">
                  <div className="text-center">
                    <Rocket className="h-32 w-32 text-emerald-400 mx-auto mb-6 animate-pulse" />
                    <h3 className="text-xl font-semibold text-white mb-2">Ready for Launch</h3>
                    <p className="text-gray-400 text-sm">Something amazing is coming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-auto border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">© 2025 CampusConnect by Mahesh</p>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                className="text-gray-400 hover:text-emerald-400 transition-colors font-medium text-sm" 
                href="https://www.linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <a 
                className="text-gray-400 hover:text-emerald-400 transition-colors font-medium text-sm" 
                href="/admin"
              >
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
