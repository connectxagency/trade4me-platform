/*
  # Simple Admin System Setup

  1. Functions
    - Create is_admin() function to check admin status
    - Create admin policies for partners table

  2. Security
    - Enable admin access to read/update all partner data
    - Admin check based on email address

  3. Notes
    - Admin user must be created manually in Supabase Dashboard
    - Email: admin@connectx.com
    - Password: AdminConnect2025!
*/

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- Check if current user email is admin email
  RETURN COALESCE(auth.email(), '') = 'admin@connectx.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can read all partner data" ON partners;
DROP POLICY IF EXISTS "Admins can update all partner data" ON partners;

-- Create admin policies for partners table
CREATE POLICY "Admins can read all partner data"
  ON partners
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all partner data"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());