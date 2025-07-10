/*
  # Create marketing materials system

  1. New Tables
    - `marketing_materials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `type` (text, enum: image, video, banner, social, document)
      - `file_url` (text) - URL to the uploaded file
      - `file_name` (text) - Original filename
      - `file_size` (bigint) - File size in bytes
      - `category` (text) - Category for organization
      - `dimensions` (text, optional) - Image/video dimensions
      - `format` (text) - File format (JPG, PNG, MP4, etc.)
      - `is_active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on marketing_materials table
    - Partners can read active materials
    - Admins can manage all materials

  3. Performance
    - Indexes on type, category, is_active, sort_order
    - Triggers for updated_at timestamps
*/

-- Create marketing_materials table
CREATE TABLE IF NOT EXISTS marketing_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('image', 'video', 'banner', 'social', 'document')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  category text NOT NULL DEFAULT 'web',
  dimensions text,
  format text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE marketing_materials ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS marketing_materials_type_idx ON marketing_materials(type);
CREATE INDEX IF NOT EXISTS marketing_materials_category_idx ON marketing_materials(category);
CREATE INDEX IF NOT EXISTS marketing_materials_is_active_idx ON marketing_materials(is_active);
CREATE INDEX IF NOT EXISTS marketing_materials_sort_order_idx ON marketing_materials(sort_order);

-- Create policies for marketing_materials
CREATE POLICY "Partners can read active marketing materials"
  ON marketing_materials
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Allow anonymous users to read active materials (for public access)
CREATE POLICY "Anyone can read active marketing materials"
  ON marketing_materials
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin policies for marketing_materials
CREATE POLICY "Admins can manage all marketing materials"
  ON marketing_materials
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create trigger for updated_at on marketing_materials
CREATE TRIGGER update_marketing_materials_updated_at
  BEFORE UPDATE ON marketing_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample marketing materials
INSERT INTO marketing_materials (title, description, type, file_url, file_name, file_size, category, dimensions, format, sort_order) VALUES
('Trade4me Strategy Banner', 'High-quality banner for website headers and social media', 'banner', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200', 'trade4me-banner-1200x400.jpg', 245000, 'web', '1200x400', 'JPG', 1),
('Instagram Story Template', 'Ready-to-use Instagram story template with Trade4me branding', 'social', 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=600', 'instagram-story-template.png', 180000, 'social', '1080x1920', 'PNG', 2),
('Performance Infographic', 'Visual representation of Trade4me strategy performance', 'image', 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800', 'performance-infographic.png', 320000, 'marketing', '800x1200', 'PNG', 3),
('Partner Presentation Deck', 'Complete presentation for partner meetings and proposals', 'document', '/marketing/partner-presentation.pdf', 'partner-presentation-deck.pdf', 2500000, 'presentations', NULL, 'PDF', 4),
('YouTube Thumbnail Template', 'Eye-catching thumbnail template for YouTube videos', 'image', 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=800', 'youtube-thumbnail-template.png', 150000, 'social', '1280x720', 'PNG', 5),
('Email Newsletter Template', 'Professional email template for partner communications', 'document', '/marketing/email-template.html', 'email-newsletter-template.html', 45000, 'email', NULL, 'HTML', 6);