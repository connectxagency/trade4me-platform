/*
  # Admin policies for partner management

  1. Security
    - Create admin policies for managing partners
    - Allow admin users to read and update all partner data
    - Admin access is controlled by email check

  2. Admin Functions
    - Create function to check if user is admin
    - Add policies for admin access to partners table
*/

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user's email is in the admin list
  -- You can modify this list to include your admin emails
  RETURN (
    SELECT email FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('admin@connectx.com', 'your-admin-email@domain.com')
  ) IS NOT NULL;
END;
$$;

-- Create admin policy for reading all partners
CREATE POLICY "Admins can read all partner data"
  ON partners
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Create admin policy for updating all partners
CREATE POLICY "Admins can update all partner data"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Grant admin users access to auth.users table (for getting user emails)
-- Note: This requires RLS to be disabled on auth.users or specific policies
-- The admin dashboard will use the auth.admin.getUserById function instead