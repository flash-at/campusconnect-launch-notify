
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
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
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY environment variable is not set");
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

    console.log("Sending launch notifications to all subscribers");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active subscribers from Supabase
    const { data: subscribers, error } = await supabase
      .from('email_subscribers')
      .select('email, first_name')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching subscribers:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to fetch subscribers" 
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

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No active subscribers found" 
        }),
        {
          status: 404,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    for (const subscriber of subscribers) {
      const emailData = {
        to: [{ email: subscriber.email, name: subscriber.first_name }],
        sender: { email: "noreply@lovableai.com", name: "CampusConnect Team" },
        subject: "🎉 CampusConnect is NOW LIVE!",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>CampusConnect is LIVE!</title>
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
                      padding: 40px; 
                      border-radius: 12px 12px 0 0; 
                      text-align: center; 
                  }
                  .content { 
                      background: white; 
                      padding: 30px; 
                      border-radius: 0 0 12px 12px; 
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  }
                  .cta-button { 
                      background: #10B981; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      margin: 20px 0; 
                      font-weight: bold; 
                      text-align: center;
                  }
                  .feature-box { 
                      background: #f0fdf4; 
                      padding: 20px; 
                      margin: 15px 0; 
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
                  h3 { color: #333; margin-bottom: 10px; }
                  h4 { color: #333; margin-bottom: 8px; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>🎉 CampusConnect is NOW LIVE!</h1>
                  <p>The wait is over - dive into the future of campus life!</p>
              </div>
              
              <div class="content">
                  <h2>Hi ${subscriber.first_name}! 🚀</h2>
                  
                  <p>The moment you've been waiting for is here! CampusConnect is officially live and ready to transform your campus experience.</p>
                  
                  <div style="text-align: center;">
                      <a href="#" class="cta-button">🚀 Launch CampusConnect Now</a>
                  </div>
                  
                  <h3>🌟 What's Available Right Now:</h3>
                  
                  <div class="feature-box">
                      <h4>📅 Campus Events Hub</h4>
                      <p>Discover upcoming events, workshops, and activities happening on campus.</p>
                  </div>
                  
                  <div class="feature-box">
                      <h4>🎭 Club Directory</h4>
                      <p>Find and join clubs that match your interests and passions.</p>
                  </div>
                  
                  <div class="feature-box">
                      <h4>🛠️ Service Requests</h4>
                      <p>Submit maintenance requests, tech support, and other campus services.</p>
                  </div>
                  
                  <div class="feature-box">
                      <h4>📚 Student Tools</h4>
                      <p>Access essential tools and resources for academic success.</p>
                  </div>
                  
                  <p><strong>Ready to get started?</strong> Click the button above and explore everything CampusConnect has to offer!</p>
                  
                  <p>Thank you for being an early supporter. We can't wait to see how CampusConnect enhances your campus life!</p>
                  
                  <p>Welcome aboard,<br>The CampusConnect Team 🎓</p>
              </div>
              
              <div class="footer">
                  <p>© 2025 CampusConnect by Mahesh</p>
                  <p>Need help? Reply to this email or visit our support center.</p>
              </div>
          </body>
          </html>
        `
      };

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Launch email sending failed for", subscriber.email, ":", errorText);
        
        await supabase
          .from('notifications_sent')
          .insert([{
            type: 'launch',
            title: 'CampusConnect is LIVE!',
            content: `Email sending failed: ${errorText}`,
            recipient_email: subscriber.email,
            success: false
          }]);
      } else {
        console.log("Launch email sent successfully to:", subscriber.email);
        
        await supabase
          .from('notifications_sent')
          .insert([{
            type: 'launch',
            title: 'CampusConnect is LIVE!',
            content: 'Launch notification sent',
            recipient_email: subscriber.email,
            success: true
          }]);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Launch notifications sent to ${subscribers.length} subscribers` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending launch notifications:", error);
    
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
