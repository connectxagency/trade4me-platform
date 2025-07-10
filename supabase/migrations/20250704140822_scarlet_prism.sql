/*
  # Create consultation booking system

  1. New Tables
    - `available_slots`
      - `id` (uuid, primary key)
      - `date` (date)
      - `time` (time)
      - `is_available` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on (date, time)

    - `consultations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `company` (text, optional)
      - `topic` (text)
      - `message` (text, optional)
      - `consultation_date` (date)
      - `consultation_time` (time)
      - `status` (text, enum: pending, confirmed, cancelled, completed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Admin policies for full access
    - Public read access for available slots
    - Public insert access for consultations

  3. Performance
    - Indexes on date, time, status, email
    - Triggers for updated_at timestamps

  4. Sample Data
    - Pre-populate available slots for next 30 business days
*/

-- Create available_slots table
CREATE TABLE IF NOT EXISTS available_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, time)
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  topic text NOT NULL,
  message text,
  consultation_date date NOT NULL,
  consultation_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS available_slots_date_idx ON available_slots(date);
CREATE INDEX IF NOT EXISTS available_slots_date_time_idx ON available_slots(date, time);
CREATE INDEX IF NOT EXISTS consultations_date_idx ON consultations(consultation_date);
CREATE INDEX IF NOT EXISTS consultations_status_idx ON consultations(status);
CREATE INDEX IF NOT EXISTS consultations_email_idx ON consultations(email);

-- Admin policies for available_slots
CREATE POLICY "Admins can manage available slots"
  ON available_slots
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Public read policy for available slots (for booking form)
CREATE POLICY "Anyone can read available slots"
  ON available_slots
  FOR SELECT
  TO anon, authenticated
  USING (is_available = true AND date >= CURRENT_DATE);

-- Admin policies for consultations
CREATE POLICY "Admins can read all consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Public insert policy for consultations (for booking form)
CREATE POLICY "Anyone can book consultations"
  ON consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create trigger for updated_at on available_slots
CREATE TRIGGER update_available_slots_updated_at
  BEFORE UPDATE ON available_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for updated_at on consultations
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default available slots for the next 30 days (business hours only)
DO $$
DECLARE
    slot_date date := CURRENT_DATE + 1;
    end_date date := CURRENT_DATE + 30;
    time_slot time;
    time_slots time[] := ARRAY['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
BEGIN
    WHILE slot_date <= end_date LOOP
        -- Skip weekends (Saturday = 6, Sunday = 0)
        IF EXTRACT(DOW FROM slot_date) NOT IN (0, 6) THEN
            FOREACH time_slot IN ARRAY time_slots LOOP
                INSERT INTO available_slots (date, time, is_available)
                VALUES (slot_date, time_slot, true)
                ON CONFLICT (date, time) DO NOTHING;
            END LOOP;
        END IF;
        slot_date := slot_date + 1;
    END LOOP;
END $$;