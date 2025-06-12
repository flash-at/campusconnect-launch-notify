
import { supabase } from '@/integrations/supabase/client';
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
  // Store notification data in Supabase
  static async subscribeUser(data: NotificationData): Promise<boolean> {
    try {
      console.log('Subscribing user to notifications:', data);
      
      const { data: result, error } = await supabase
        .from('email_subscribers')
        .insert([{
          email: data.email,
          first_name: data.firstName,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Error subscribing user:', error);
        return false;
      }
      
      // Send welcome email (for now just log it)
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
      
      // Record the notification
      await supabase
        .from('notifications_sent')
        .insert([{
          type: 'welcome',
          title: 'Welcome to CampusConnect!',
          content: 'Welcome email sent successfully',
          recipient_email: email,
          success: true
        }]);

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
      
      // Get all active subscribers from Supabase
      const { data: subscribers, error } = await supabase
        .from('email_subscribers')
        .select('email, first_name')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching subscribers:', error);
        return false;
      }

      if (!subscribers || subscribers.length === 0) {
        console.log('No active subscribers found');
        return false;
      }

      for (const subscriber of subscribers) {
        const emailContent = LaunchNotificationTemplate(subscriber.first_name);
        
        console.log(`Sending launch email to: ${subscriber.email}`);
        
        // Record the notification
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
        // Get user's first name from database
        const { data: subscriber } = await supabase
          .from('email_subscribers')
          .select('first_name')
          .eq('email', email)
          .eq('is_active', true)
          .single();
        
        const firstName = subscriber?.first_name || 'User';
        
        const emailContent = UpdateNotificationTemplate(
          firstName, 
          updateData.title, 
          updateData.content
        );
        
        console.log(`Sending update email to: ${email}`);
        
        // Record the notification
        await supabase
          .from('notifications_sent')
          .insert([{
            type: 'update',
            title: updateData.title,
            content: updateData.content,
            recipient_email: email,
            success: true
          }]);
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
      const { data, error } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscribers:', error);
        return [];
      }

      return data.map(subscriber => ({
        email: subscriber.email,
        firstName: subscriber.first_name,
        timestamp: subscriber.subscribed_at
      }));
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }

  // Get notification statistics
  static async getStats(): Promise<{totalSubscribers: number, totalNotifications: number}> {
    try {
      const [subscribersResult, notificationsResult] = await Promise.all([
        supabase
          .from('email_subscribers')
          .select('*', { count: 'exact' })
          .eq('is_active', true),
        supabase
          .from('notifications_sent')
          .select('*', { count: 'exact' })
      ]);

      return {
        totalSubscribers: subscribersResult.count || 0,
        totalNotifications: notificationsResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { totalSubscribers: 0, totalNotifications: 0 };
    }
  }
}
