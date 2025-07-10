/*
  # Webinar Booking System

  1. New Tables
    - `webinar_sessions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `time` (time)
      - `duration_minutes` (integer, default 60)
      - `max_participants` (integer, default 100)
      - `zoom_meeting_id` (text, optional)
      - `zoom_join_url` (text, optional)
      - `zoom_password` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `webinar_registrations`
      - `id` (uuid, primary key)
      - `webinar_session_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text)
      - `registration_date` (timestamptz)
      - `status` (text, enum: confirmed, cancelled, attended, no_show)
      - `zoom_registrant_id` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for active webinar sessions
    - Public insert access for registrations
    - Admin full access

  3. Performance
    - Indexes on date, time, email, status
    - Triggers for updated_at timestamps
*/

-- Create webinar_sessions table
CREATE TABLE IF NOT EXISTS webinar_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'FREE Trade4me Education Webinar',
  description text DEFAULT 'Learn professional crypto trading strategies and how to maximize your profits with Trade4me',
  date date NOT NULL,
  time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  max_participants integer DEFAULT 100,
  zoom_meeting_id text,
  zoom_join_url text,
  zoom_password text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, time)
);

-- Create webinar_registrations table
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_session_id uuid NOT NULL REFERENCES webinar_sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  registration_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  zoom_registrant_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(webinar_session_id, email)
);

-- Enable Row Level Security
ALTER TABLE webinar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS webinar_sessions_date_idx ON webinar_sessions(date);
CREATE INDEX IF NOT EXISTS webinar_sessions_date_time_idx ON webinar_sessions(date, time);
CREATE INDEX IF NOT EXISTS webinar_sessions_is_active_idx ON webinar_sessions(is_active);
CREATE INDEX IF NOT EXISTS webinar_registrations_session_idx ON webinar_registrations(webinar_session_id);
CREATE INDEX IF NOT EXISTS webinar_registrations_email_idx ON webinar_registrations(email);
CREATE INDEX IF NOT EXISTS webinar_registrations_status_idx ON webinar_registrations(status);

-- Public policies for webinar_sessions
CREATE POLICY "Anyone can read active webinar sessions"
  ON webinar_sessions
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND date >= CURRENT_DATE);

-- Admin policies for webinar_sessions
CREATE POLICY "Admins can manage all webinar sessions"
  ON webinar_sessions
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Public policy for webinar_registrations (booking)
CREATE POLICY "Anyone can register for webinars"
  ON webinar_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin policies for webinar_registrations
CREATE POLICY "Admins can read all webinar registrations"
  ON webinar_registrations
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update webinar registrations"
  ON webinar_registrations
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create triggers for updated_at
CREATE TRIGGER update_webinar_sessions_updated_at
  BEFORE UPDATE ON webinar_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webinar_registrations_updated_at
  BEFORE UPDATE ON webinar_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample webinar sessions for the next 2 weeks
DO $$
DECLARE
    session_date date := CURRENT_DATE + 1;
    end_date date := CURRENT_DATE + 14;
    time_slots time[] := ARRAY['14:00', '16:00', '18:00', '20:00'];
    time_slot time;
BEGIN
    WHILE session_date <= end_date LOOP
        -- Only add sessions on weekdays
        IF EXTRACT(DOW FROM session_date) BETWEEN 1 AND 5 THEN
            FOREACH time_slot IN ARRAY time_slots LOOP
                INSERT INTO webinar_sessions (
                    title,
                    description,
                    date,
                    time,
                    duration_minutes,
                    max_participants,
                    is_active
                ) VALUES (
                    'FREE Trade4me Education Webinar',
                    'Learn professional crypto trading strategies, risk management, and how to maximize your profits with our proven Trade4me system. Perfect for beginners and experienced traders alike.',
                    session_date,
                    time_slot,
                    60,
                    100,
                    true
                ) ON CONFLICT (date, time) DO NOTHING;
            END LOOP;
        END IF;
        session_date := session_date + 1;
    END LOOP;
END $$;