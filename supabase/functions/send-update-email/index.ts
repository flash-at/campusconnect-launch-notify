
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UpdateEmailRequest {
  title: string;
  content: string;
  recipients: string[];
}

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

    const { title, content, recipients }: UpdateEmailRequest = await req.json();
    
    console.log("Sending update email:", title, "to", recipients.length, "recipients");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const email of recipients) {
      // Get user's first name from database
      const { data: subscriber } = await supabase
        .from('email_subscribers')
        .select('first_name')
        .eq('email', email)
        .eq('is_active', true)
        .single();
      
      const firstName = subscriber?.first_name || 'User';

      const emailData = {
        to: [{ email: email, name: firstName }],
        sender: { email: "noreply@lovableai.com", name: "CampusConnect Team" },
        subject: `📢 CampusConnect Update: ${title}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>CampusConnect Update: ${title}</title>
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
                      padding: 30px; 
                      border-radius: 12px 12px 0 0; 
                      text-align: center; 
                  }
                  .content { 
                      background: white; 
                      padding: 30px; 
                      border-radius: 0 0 12px 12px; 
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  }
                  .update-content { 
                      background: #f0fdf4; 
                      padding: 25px; 
                      border-radius: 8px; 
                      margin: 20px 0; 
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
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>📢 CampusConnect Update</h1>
                  <p>Stay in the loop with the latest news</p>
              </div>
              
              <div class="content">
                  <h2>Hi ${firstName}! 👋</h2>
                  
                  <p>We have exciting news to share about CampusConnect!</p>
                  
                  <div class="update-content">
                      <h3>${title}</h3>
                      <p>${content}</p>
                  </div>
                  
                  <p>We're constantly working to improve your CampusConnect experience. Thank you for being part of our community!</p>
                  
                  <p>Best regards,<br>The CampusConnect Team</p>
              </div>
              
              <div class="footer">
                  <p>© 2025 CampusConnect by Mahesh</p>
                  <p>You're receiving this update because you're subscribed to CampusConnect notifications.</p>
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
        console.error("Update email sending failed for", email, ":", errorText);
        
        await supabase
          .from('notifications_sent')
          .insert([{
            type: 'update',
            title: title,
            content: `Email sending failed: ${errorText}`,
            recipient_email: email,
            success: false
          }]);
      } else {
        console.log("Update email sent successfully to:", email);
        
        await supabase
          .from('notifications_sent')
          .insert([{
            type: 'update',
            title: title,
            content: content,
            recipient_email: email,
            success: true
          }]);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Update emails sent to ${recipients.length} recipients` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending update emails:", error);
    
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
