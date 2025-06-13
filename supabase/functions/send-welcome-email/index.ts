
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  firstName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    // Get the API key from environment
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service not configured" 
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const { email, firstName }: EmailRequest = await req.json();
    
    console.log("Sending welcome email to:", email, "for:", firstName);

    const emailResponse = await resend.emails.send({
      from: "CampusConnect <onboarding@resend.dev>",
      to: [email],
      subject: "🚀 Welcome to CampusConnect!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to CampusConnect</title>
            <style>
                body { 
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                    background-color: #f8f9fa;
                }
                .header { 
                    background: linear-gradient(135deg, #0F172A 0%, #10B981 100%); 
                    color: white; 
                    padding: 40px 30px; 
                    border-radius: 12px 12px 0 0; 
                    text-align: center; 
                }
                .logo {
                    margin-bottom: 20px;
                }
                .content { 
                    background: white; 
                    padding: 40px 30px; 
                    border-radius: 0 0 12px 12px; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .feature-box { 
                    background: #f0fdf4; 
                    padding: 20px; 
                    margin: 20px 0; 
                    border-radius: 8px; 
                    border-left: 4px solid #10B981; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    padding: 20px; 
                    color: #666; 
                    font-size: 14px; 
                }
                h1 { margin: 0; font-size: 28px; font-weight: bold; }
                h2 { color: #10B981; margin-top: 0; }
                h4 { color: #333; margin-bottom: 8px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 11V3h6v8h-6z"></path>
                        <path d="M9 3v18h6V3H9z"></path>
                        <path d="M1 7v10h6V7H1z"></path>
                    </svg>
                </div>
                <h1>🚀 Welcome to CampusConnect!</h1>
                <p style="margin: 0; font-size: 18px; opacity: 0.9;">Get ready for something amazing</p>
            </div>
            
            <div class="content">
                <h2>Hi ${firstName}! 👋</h2>
                
                <p>Thank you for signing up to be notified about CampusConnect! We're thrilled to have you on board as one of our early supporters.</p>
                
                <p><strong>What is CampusConnect?</strong></p>
                <p>CampusConnect is the ultimate platform designed to revolutionize campus life. We're building something special that will help students:</p>
                
                <div class="feature-box">
                    <h4>📅 Stay Updated on Campus Events</h4>
                    <p>Never miss important events, workshops, and activities happening on campus.</p>
                </div>
                
                <div class="feature-box">
                    <h4>🎭 Discover and Join Club Activities</h4>
                    <p>Find clubs that match your interests and connect with like-minded students.</p>
                </div>
                
                <div class="feature-box">
                    <h4>🛠️ Submit and Track Service Requests</h4>
                    <p>Easily request maintenance, tech support, and other campus services.</p>
                </div>
                
                <div class="feature-box">
                    <h4>📚 Access Essential Student Tools</h4>
                    <p>Get access to tools and resources that will enhance your academic success.</p>
                </div>
                
                <div class="feature-box">
                    <h4>🤝 Connect with Fellow Students</h4>
                    <p>Build meaningful connections and expand your campus network.</p>
                </div>
                
                <p><strong>What's Next?</strong></p>
                <p>We're putting the finishing touches on CampusConnect and will notify you the moment it's ready to launch! You'll be among the first to experience the future of campus connectivity.</p>
                
                <p>Thank you for believing in our vision. We can't wait to show you what we've been building!</p>
                
                <p>Stay tuned,<br><strong>The CampusConnect Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 CampusConnect by Mahesh</p>
                <p>You're receiving this because you signed up for launch notifications.</p>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Initialize Supabase client for logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log the email sending in notifications_sent table
    await supabase
      .from('notifications_sent')
      .insert([{
        type: 'welcome',
        title: 'Welcome to CampusConnect!',
        content: `Welcome email sent to ${firstName}`,
        recipient_email: email,
        success: true
      }]);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
