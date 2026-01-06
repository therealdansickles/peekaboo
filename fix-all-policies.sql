-- COMPLETE FIX for RLS policy recursion
-- Run this in Supabase SQL Editor
-- This fixes the circular dependency in profiles policies

-- ============================================
-- STEP 1: Create helper functions FIRST
-- ============================================

-- Get current user's role (used by other policies)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Get current user's school_id
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid();
$$;

-- Check if user is teacher in a classroom
CREATE OR REPLACE FUNCTION is_teacher_of_classroom(classroom_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classroom_teachers
    WHERE teacher_id = auth.uid()
    AND classroom_id = classroom_uuid
  );
$$;

-- ============================================
-- STEP 2: Drop ALL problematic policies
-- ============================================

DROP POLICY IF EXISTS "Admins can view school profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can view relevant parents" ON profiles;
DROP POLICY IF EXISTS "Users can view school classrooms" ON classrooms;
DROP POLICY IF EXISTS "Users can view own school" ON schools;

-- ============================================
-- STEP 3: Recreate policies using functions
-- ============================================

-- Profiles: Admins can view school profiles
CREATE POLICY "Admins can view school profiles"
  ON profiles FOR SELECT
  USING (
    get_my_role() = 'admin'
    AND get_my_school_id() = school_id
  );

-- Profiles: Teachers can view relevant parents
CREATE POLICY "Teachers can view relevant parents"
  ON profiles FOR SELECT
  USING (
    role = 'parent'
    AND get_my_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM classroom_teachers ct
      JOIN children c ON c.classroom_id = ct.classroom_id
      JOIN parent_children pc ON pc.child_id = c.id
      WHERE ct.teacher_id = auth.uid()
      AND pc.parent_id = profiles.id
    )
  );

-- Schools: Users can view own school
CREATE POLICY "Users can view own school"
  ON schools FOR SELECT
  USING (id = get_my_school_id());

-- Classrooms: Users can view school classrooms
CREATE POLICY "Users can view school classrooms"
  ON classrooms FOR SELECT
  USING (school_id = get_my_school_id());

-- ============================================
-- STEP 4: Grant function permissions
-- ============================================

GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_teacher_of_classroom(UUID) TO authenticated;

-- ============================================
-- DONE! Policies should now work without recursion
-- ============================================
