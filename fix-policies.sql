-- Fix infinite recursion in profiles policies
-- Run this in Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view school profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can view relevant parents" ON profiles;

-- Create a helper function to check admin status (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin_of_school(school_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND school_id = school_uuid
  );
$$;

-- Create a helper function to get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Create a helper function to get current user's school
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid();
$$;

-- Recreate admin policy using function
CREATE POLICY "Admins can view school profiles"
  ON profiles FOR SELECT
  USING (
    get_my_role() = 'admin' AND get_my_school_id() = profiles.school_id
  );

-- Recreate teachers policy using function
CREATE POLICY "Teachers can view relevant parents"
  ON profiles FOR SELECT
  USING (
    profiles.role = 'parent'
    AND get_my_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM classroom_teachers ct
      JOIN children c ON c.classroom_id = ct.classroom_id
      JOIN parent_children pc ON pc.child_id = c.id
      WHERE ct.teacher_id = auth.uid()
      AND pc.parent_id = profiles.id
    )
  );

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION is_admin_of_school(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_school_id() TO authenticated;
