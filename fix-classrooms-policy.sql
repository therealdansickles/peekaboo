-- Fix classrooms recursion
-- Run this in Supabase SQL Editor

-- Drop ALL classroom policies
DROP POLICY IF EXISTS "Users can view school classrooms" ON classrooms;
DROP POLICY IF EXISTS "Admins can manage classrooms" ON classrooms;

-- Recreate with fixed versions
CREATE POLICY "Users can view school classrooms"
  ON classrooms FOR SELECT
  USING (school_id = get_my_school_id());

CREATE POLICY "Admins can manage classrooms"
  ON classrooms FOR ALL
  USING (
    get_my_role() = 'admin'
    AND school_id = get_my_school_id()
  );

-- Also fix classroom_teachers if needed
DROP POLICY IF EXISTS "Teachers can view their assignments" ON classroom_teachers;

CREATE POLICY "Teachers can view their assignments"
  ON classroom_teachers FOR SELECT
  USING (teacher_id = auth.uid());

CREATE POLICY "View classroom teachers"
  ON classroom_teachers FOR SELECT
  USING (is_teacher_of_classroom(classroom_id) OR get_my_role() = 'admin');
