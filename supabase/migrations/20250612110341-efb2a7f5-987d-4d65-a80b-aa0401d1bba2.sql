
-- Create a table for email subscribers
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for tracking sent notifications
CREATE TABLE public.notifications_sent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'welcome', 'launch', 'update'
  title TEXT,
  content TEXT,
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT true
);

-- Add Row Level Security (RLS) - making tables publicly accessible for this use case
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_sent ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a marketing/notification system)
CREATE POLICY "Allow public read access to email_subscribers" 
  ON public.email_subscribers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to email_subscribers" 
  ON public.email_subscribers 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to notifications_sent" 
  ON public.notifications_sent 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to notifications_sent" 
  ON public.notifications_sent 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX idx_email_subscribers_active ON public.email_subscribers(is_active);
CREATE INDEX idx_notifications_sent_type ON public.notifications_sent(type);
CREATE INDEX idx_notifications_sent_recipient ON public.notifications_sent(recipient_email);
