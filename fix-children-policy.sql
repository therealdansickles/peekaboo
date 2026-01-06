-- Fix remaining recursion in children policies
-- Run this in Supabase SQL Editor

-- Drop the problematic children policies that reference profiles
DROP POLICY IF EXISTS "Parents can view own children" ON children;
DROP POLICY IF EXISTS "Teachers can view classroom children" ON children;
DROP POLICY IF EXISTS "Admins can view school children" ON children;
DROP POLICY IF EXISTS "Admins can manage children" ON children;

-- Recreate using functions
CREATE POLICY "Parents can view own children"
  ON children FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_children.parent_id = auth.uid()
      AND parent_children.child_id = children.id
    )
  );

CREATE POLICY "Teachers can view classroom children"
  ON children FOR SELECT
  USING (is_teacher_of_classroom(classroom_id));

CREATE POLICY "Admins can view school children"
  ON children FOR SELECT
  USING (
    get_my_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM classrooms
      WHERE classrooms.id = children.classroom_id
      AND classrooms.school_id = get_my_school_id()
    )
  );

CREATE POLICY "Admins can manage children"
  ON children FOR ALL
  USING (
    get_my_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM classrooms
      WHERE classrooms.id = children.classroom_id
      AND classrooms.school_id = get_my_school_id()
    )
  );
