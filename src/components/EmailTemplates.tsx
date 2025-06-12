
export const WelcomeEmailTemplate = (firstName: string) => `
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
        }
        .header { 
            background: linear-gradient(135deg, #0F172A 0%, #10B981 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 10px 10px 0 0; 
            text-align: center; 
        }
        .content { 
            background: #f8f9fa; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
        }
        .button { 
            background: #10B981; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block; 
            margin: 20px 0; 
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding: 20px; 
            color: #666; 
            font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Welcome to CampusConnect!</h1>
        <p>Get ready for something amazing</p>
    </div>
    
    <div class="content">
        <h2>Hi ${firstName}! 👋</h2>
        
        <p>Thank you for signing up to be notified about CampusConnect! We're thrilled to have you on board.</p>
        
        <p><strong>What is CampusConnect?</strong></p>
        <p>CampusConnect is the ultimate platform designed to revolutionize campus life. We're building something special that will help students:</p>
        
        <ul>
            <li>📅 Stay updated on campus events</li>
            <li>🎭 Discover and join club activities</li>
            <li>🛠️ Submit and track service requests</li>
            <li>📚 Access essential student tools</li>
            <li>🤝 Connect with fellow students</li>
        </ul>
        
        <p>We're putting the finishing touches on CampusConnect and will notify you the moment it's ready!</p>
        
        <p>Stay tuned,<br>The CampusConnect Team</p>
    </div>
    
    <div class="footer">
        <p>© 2025 CampusConnect by Mahesh</p>
        <p>You're receiving this because you signed up for launch notifications.</p>
    </div>
</body>
</html>
`;

export const LaunchNotificationTemplate = (firstName: string) => `
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
        }
        .header { 
            background: linear-gradient(135deg, #0F172A 0%, #10B981 100%); 
            color: white; 
            padding: 40px; 
            border-radius: 10px 10px 0 0; 
            text-align: center; 
        }
        .content { 
            background: #f8f9fa; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
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
            background: white; 
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
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 CampusConnect is NOW LIVE!</h1>
        <p>The wait is over - dive into the future of campus life!</p>
    </div>
    
    <div class="content">
        <h2>Hi ${firstName}! 🚀</h2>
        
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
`;

export const UpdateNotificationTemplate = (firstName: string, updateTitle: string, updateContent: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CampusConnect Update: ${updateTitle}</title>
    <style>
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .header { 
            background: linear-gradient(135deg, #0F172A 0%, #10B981 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 10px 10px 0 0; 
            text-align: center; 
        }
        .content { 
            background: #f8f9fa; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
        }
        .update-content { 
            background: white; 
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
            <h3>${updateTitle}</h3>
            <p>${updateContent}</p>
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
`;
