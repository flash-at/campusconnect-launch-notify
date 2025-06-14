
import { supabase } from '@/integrations/supabase/client';

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
      
      // Send welcome email using the edge function
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
      console.log('Calling send-welcome-email function...');
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: { email, firstName }
      });

      if (error) {
        console.error('Error calling welcome email function:', error);
        return false;
      }

      console.log('Welcome email sent successfully:', data);
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
      
      const { data, error } = await supabase.functions.invoke('send-launch-email', {
        body: {}
      });

      if (error) {
        console.error('Error calling launch email function:', error);
        return false;
      }

      console.log('Launch notifications sent successfully:', data);
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
      
      const { data, error } = await supabase.functions.invoke('send-update-email', {
        body: {
          title: updateData.title,
          content: updateData.content,
          recipients: updateData.recipients
        }
      });

      if (error) {
        console.error('Error calling update email function:', error);
        return false;
      }

      console.log('Update notifications sent successfully:', data);
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
