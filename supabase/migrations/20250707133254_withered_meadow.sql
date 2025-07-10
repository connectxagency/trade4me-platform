/*
  # Create tutorials and guides system

  1. New Tables
    - `tutorials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `type` (text, enum: video, pdf)
      - `file_url` (text) - URL to the uploaded file
      - `file_name` (text) - Original filename
      - `file_size` (bigint) - File size in bytes
      - `duration` (integer, optional) - Video duration in seconds
      - `category` (text) - Category for organization
      - `is_active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on tutorials table
    - Partners can read active tutorials
    - Admins can manage all tutorials

  3. Performance
    - Indexes on type, category, is_active, sort_order
    - Triggers for updated_at timestamps
*/

-- Create tutorials table
CREATE TABLE IF NOT EXISTS tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('video', 'pdf')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  duration integer, -- Video duration in seconds
  category text NOT NULL DEFAULT 'general',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS tutorials_type_idx ON tutorials(type);
CREATE INDEX IF NOT EXISTS tutorials_category_idx ON tutorials(category);
CREATE INDEX IF NOT EXISTS tutorials_is_active_idx ON tutorials(is_active);
CREATE INDEX IF NOT EXISTS tutorials_sort_order_idx ON tutorials(sort_order);

-- Create policies for tutorials
CREATE POLICY "Partners can read active tutorials"
  ON tutorials
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Allow anonymous users to read active tutorials (for public access)
CREATE POLICY "Anyone can read active tutorials"
  ON tutorials
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin policies for tutorials
CREATE POLICY "Admins can manage all tutorials"
  ON tutorials
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create trigger for updated_at on tutorials
CREATE TRIGGER update_tutorials_updated_at
  BEFORE UPDATE ON tutorials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample tutorials
INSERT INTO tutorials (title, description, type, file_url, file_name, category, sort_order) VALUES
('Getting Started with Trade4me', 'Learn the basics of our trading platform and how to get started as a partner.', 'video', '/tutorials/getting-started.mp4', 'getting-started.mp4', 'basics', 1),
('Partner Dashboard Overview', 'Complete walkthrough of your partner dashboard and all available features.', 'video', '/tutorials/dashboard-overview.mp4', 'dashboard-overview.mp4', 'basics', 2),
('Understanding Commission Structure', 'Detailed explanation of how commissions work and how to maximize your earnings.', 'pdf', '/tutorials/commission-guide.pdf', 'commission-guide.pdf', 'earnings', 3),
('Referral System Guide', 'How to use the referral system to invite new partners and customers.', 'video', '/tutorials/referral-system.mp4', 'referral-system.mp4', 'referrals', 4),
('Marketing Materials Guide', 'Access and use our marketing materials effectively for your campaigns.', 'pdf', '/tutorials/marketing-materials.pdf', 'marketing-materials.pdf', 'marketing', 5),
('Risk Management Best Practices', 'Important guidelines for risk management when promoting trading strategies.', 'pdf', '/tutorials/risk-management.pdf', 'risk-management.pdf', 'compliance', 6);