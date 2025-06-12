
import { WelcomeEmailTemplate, LaunchNotificationTemplate, UpdateNotificationTemplate } from './EmailTemplates';

export interface NotificationData {
  email: string;
  firstName: string;
  timestamp: string;
}

export interface UpdateData {
  title: string;
  content: string;
  recipients: string[];
}

export class NotificationService {
  // Store notification data (this will be connected to Supabase)
  static async subscribeUser(data: NotificationData): Promise<boolean> {
    try {
      console.log('Subscribing user to notifications:', data);
      
      // TODO: Save to Supabase database
      // const { data: result, error } = await supabase
      //   .from('notifications_subscribers')
      //   .insert([{
      //     email: data.email,
      //     first_name: data.firstName,
      //     subscribed_at: data.timestamp,
      //     is_active: true
      //   }]);

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send welcome email
      await this.sendWelcomeEmail(data.email, data.firstName);
      
      return true;
    } catch (error) {
      console.error('Error subscribing user:', error);
      return false;
    }
  }

  // Send welcome email when user subscribes
  static async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      const emailContent = WelcomeEmailTemplate(firstName);
      
      console.log('Sending welcome email to:', email);
      console.log('Email content:', emailContent);
      
      // TODO: Connect to email service (via Supabase Edge Function)
      // const { data, error } = await supabase.functions.invoke('send-email', {
      //   body: {
      //     to: email,
      //     subject: 'Welcome to CampusConnect! 🚀',
      //     html: emailContent
      //   }
      // });

      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Send launch notification to all subscribers
  static async sendLaunchNotification(): Promise<boolean> {
    try {
      console.log('Sending launch notifications to all subscribers');
      
      // TODO: Get all subscribers from Supabase
      // const { data: subscribers, error } = await supabase
      //   .from('notifications_subscribers')
      //   .select('email, first_name')
      //   .eq('is_active', true);

      // For demo, simulate subscribers
      const mockSubscribers = [
        { email: 'user@example.com', first_name: 'Demo User' }
      ];

      for (const subscriber of mockSubscribers) {
        const emailContent = LaunchNotificationTemplate(subscriber.first_name);
        
        // TODO: Send via Supabase Edge Function
        console.log(`Sending launch email to: ${subscriber.email}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error sending launch notifications:', error);
      return false;
    }
  }

  // Send custom update to subscribers
  static async sendUpdate(updateData: UpdateData): Promise<boolean> {
    try {
      console.log('Sending update notification:', updateData.title);
      
      for (const email of updateData.recipients) {
        // TODO: Get user's first name from database
        const firstName = 'User'; // Placeholder
        
        const emailContent = UpdateNotificationTemplate(
          firstName, 
          updateData.title, 
          updateData.content
        );
        
        console.log(`Sending update email to: ${email}`);
        // TODO: Send via Supabase Edge Function
      }
      
      return true;
    } catch (error) {
      console.error('Error sending update notifications:', error);
      return false;
    }
  }

  // Get all subscribers (for admin use)
  static async getSubscribers(): Promise<NotificationData[]> {
    try {
      // TODO: Fetch from Supabase
      // const { data, error } = await supabase
      //   .from('notifications_subscribers')
      //   .select('*')
      //   .eq('is_active', true)
      //   .order('subscribed_at', { ascending: false });

      // Mock data for now
      return [
        {
          email: 'user1@example.com',
          firstName: 'John',
          timestamp: new Date().toISOString()
        },
        {
          email: 'user2@example.com',
          firstName: 'Jane',
          timestamp: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }
}
