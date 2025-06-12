
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Rocket, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [notify, setNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !firstName || !notify) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and check the notification box.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Submitting notification request:", { email, firstName, notify });

    try {
      // Insert subscriber into Supabase
      const { data, error } = await supabase
        .from('email_subscribers')
        .insert([{
          email: email,
          first_name: firstName,
          is_active: true
        }])
        .select();

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          toast({
            title: "Already Subscribed! 🎉",
            description: `${firstName}, you're already on our list! We'll notify you when CampusConnect launches.`,
          });
        } else {
          throw error;
        }
      } else {
        // Record the welcome notification
        await supabase
          .from('notifications_sent')
          .insert([{
            type: 'welcome',
            title: 'Welcome to CampusConnect!',
            content: 'Thank you for subscribing to CampusConnect updates.',
            recipient_email: email,
            success: true
          }]);

        toast({
          title: "Success! 🚀",
          description: `Thanks ${firstName}! We'll notify you at ${email} when CampusConnect launches.`,
        });
      }
      
      // Reset form
      setEmail("");
      setFirstName("");
      setNotify(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <header className="py-6 md:py-8">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-white" strokeWidth={2} />
            <span className="text-3xl font-bold text-white tracking-tight">CampusConnect</span>
          </div>
          <nav>
            <a className="text-gray-200 hover:text-white transition-colors font-medium" href="#">
              Home
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <p className="text-emerald-400 text-lg font-medium mb-3 tracking-wide">
                GET READY FOR CAMPUSCONNECT
              </p>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Launching<br />Soon
              </h1>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed max-w-xl">
                Be the first to experience the power of CampusConnect. Join our newsletter to stay updated, 
                in touch and get the latest news on campus events, club activities, service requests, and student tools.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1.5">
                    Email address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-emerald-500 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1.5">
                    First name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-emerald-500 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify"
                      checked={notify}
                      onCheckedChange={(checked) => setNotify(checked === true)}
                      className="border-gray-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label htmlFor="notify" className="text-sm text-gray-300">
                      Notify me when it's launched. <span className="text-red-400">*</span>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white text-slate-900 hover:bg-emerald-500 hover:text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    {isLoading ? "Submitting..." : "Notify Me"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="hidden md:block">
              <div className="aspect-square bg-white/5 rounded-lg shadow-2xl flex items-center justify-center backdrop-blur-sm">
                <Rocket className="h-40 w-40 text-emerald-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 CampusConnect by Mahesh</p>
          <a 
            className="hover:text-emerald-300 transition-colors font-medium" 
            href="https://www.linkedin.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Connect on LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
