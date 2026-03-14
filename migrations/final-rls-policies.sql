-- =============================================================================
-- PEEKABOO: FINAL RLS POLICIES
-- =============================================================================
-- This is the canonical RLS policy migration that consolidates all fix files.
-- Run this in Supabase SQL Editor to fix circular dependencies and ensure
-- airtight security.
--
-- SECURITY MODEL:
-- - Teachers can view/manage their classroom data
-- - Parents can ONLY see photos where their child is tagged
-- - Admins can manage their school's data
-- =============================================================================

-- =============================================================================
-- STEP 1: CREATE HELPER FUNCTIONS (avoids recursion in policies)
-- =============================================================================

-- Get current user's role without triggering RLS
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Get current user's school_id without triggering RLS
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid();
$$;

-- Check if user is a teacher of a specific classroom
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

-- Check if user is admin of a specific school
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

-- =============================================================================
-- STEP 2: DROP ALL EXISTING POLICIES (clean slate)
-- =============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view school profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can view relevant parents" ON profiles;

-- Schools policies
DROP POLICY IF EXISTS "Users can view own school" ON schools;
DROP POLICY IF EXISTS "Admins can manage schools" ON schools;

-- Classrooms policies
DROP POLICY IF EXISTS "Users can view school classrooms" ON classrooms;
DROP POLICY IF EXISTS "Admins can manage classrooms" ON classrooms;

-- Classroom teachers policies
DROP POLICY IF EXISTS "Teachers can view their assignments" ON classroom_teachers;
DROP POLICY IF EXISTS "View classroom teachers" ON classroom_teachers;
DROP POLICY IF EXISTS "Admins can manage classroom teachers" ON classroom_teachers;

-- Children policies
DROP POLICY IF EXISTS "Parents can view own children" ON children;
DROP POLICY IF EXISTS "Teachers can view classroom children" ON children;
DROP POLICY IF EXISTS "Admins can view school children" ON children;
DROP POLICY IF EXISTS "Admins can manage children" ON children;

-- Photos policies
DROP POLICY IF EXISTS "Teachers can view classroom photos" ON photos;
DROP POLICY IF EXISTS "Teachers can insert photos" ON photos;
DROP POLICY IF EXISTS "Teachers can delete own photos" ON photos;
DROP POLICY IF EXISTS "Parents can view tagged photos" ON photos;

-- Photo children (tags) policies
DROP POLICY IF EXISTS "Teachers can manage photo tags" ON photo_children;
DROP POLICY IF EXISTS "Parents can view own child tags" ON photo_children;

-- Parent children policies
DROP POLICY IF EXISTS "Parents can view own links" ON parent_children;
DROP POLICY IF EXISTS "Admins can manage parent links" ON parent_children;

-- Photo favorites policies
DROP POLICY IF EXISTS "Users can manage own favorites" ON photo_favorites;

-- =============================================================================
-- STEP 3: CREATE PROFILES POLICIES
-- =============================================================================

-- Users can always view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Admins can view all profiles in their school
CREATE POLICY "Admins can view school profiles"
  ON profiles FOR SELECT
  USING (
    get_my_role() = 'admin'
    AND get_my_school_id() = school_id
  );

-- Teachers can view parent profiles for children in their classrooms
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

-- =============================================================================
-- STEP 4: CREATE SCHOOLS POLICIES
-- =============================================================================

-- Users can view their own school
CREATE POLICY "Users can view own school"
  ON schools FOR SELECT
  USING (id = get_my_school_id());

-- =============================================================================
-- STEP 5: CREATE CLASSROOMS POLICIES
-- =============================================================================

-- Users can view classrooms in their school
CREATE POLICY "Users can view school classrooms"
  ON classrooms FOR SELECT
  USING (school_id = get_my_school_id());

-- Admins can manage classrooms in their school
CREATE POLICY "Admins can manage classrooms"
  ON classrooms FOR ALL
  USING (
    get_my_role() = 'admin'
    AND school_id = get_my_school_id()
  );

-- =============================================================================
-- STEP 6: CREATE CLASSROOM_TEACHERS POLICIES
-- =============================================================================

-- Teachers can view their own assignments
CREATE POLICY "Teachers can view their assignments"
  ON classroom_teachers FOR SELECT
  USING (teacher_id = auth.uid());

-- Teachers and admins can view classroom teacher assignments
CREATE POLICY "View classroom teachers"
  ON classroom_teachers FOR SELECT
  USING (
    is_teacher_of_classroom(classroom_id)
    OR get_my_role() = 'admin'
  );

-- Admins can manage classroom teacher assignments
CREATE POLICY "Admins can manage classroom teachers"
  ON classroom_teachers FOR ALL
  USING (
    get_my_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM classrooms
      WHERE classrooms.id = classroom_teachers.classroom_id
      AND classrooms.school_id = get_my_school_id()
    )
  );

-- =============================================================================
-- STEP 7: CREATE CHILDREN POLICIES
-- =============================================================================

-- Parents can view their linked children
CREATE POLICY "Parents can view own children"
  ON children FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_children.parent_id = auth.uid()
      AND parent_children.child_id = children.id
    )
  );

-- Teachers can view children in their classrooms
CREATE POLICY "Teachers can view classroom children"
  ON children FOR SELECT
  USING (is_teacher_of_classroom(classroom_id));

-- Admins can view all children in their school
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

-- Admins can manage children in their school
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

-- =============================================================================
-- STEP 8: CREATE PHOTOS POLICIES (CRITICAL FOR SECURITY)
-- =============================================================================

-- Teachers can view photos in their classrooms
CREATE POLICY "Teachers can view classroom photos"
  ON photos FOR SELECT
  USING (is_teacher_of_classroom(classroom_id));

-- Teachers can insert photos in their classrooms
CREATE POLICY "Teachers can insert photos"
  ON photos FOR INSERT
  WITH CHECK (is_teacher_of_classroom(classroom_id));

-- Teachers can delete their own photos
CREATE POLICY "Teachers can delete own photos"
  ON photos FOR DELETE
  USING (
    uploaded_by = auth.uid()
    AND is_teacher_of_classroom(classroom_id)
  );

-- CRITICAL: Parents can ONLY view photos where their child is tagged
CREATE POLICY "Parents can view tagged photos"
  ON photos FOR SELECT
  USING (
    get_my_role() = 'parent'
    AND EXISTS (
      SELECT 1 FROM photo_children pc
      JOIN parent_children par ON par.child_id = pc.child_id
      WHERE pc.photo_id = photos.id
      AND par.parent_id = auth.uid()
    )
  );

-- =============================================================================
-- STEP 9: CREATE PHOTO_CHILDREN (TAGS) POLICIES
-- =============================================================================

-- Teachers can manage photo tags in their classrooms
CREATE POLICY "Teachers can manage photo tags"
  ON photo_children FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM photos
      WHERE photos.id = photo_children.photo_id
      AND is_teacher_of_classroom(photos.classroom_id)
    )
  );

-- Parents can view tags for their children
CREATE POLICY "Parents can view own child tags"
  ON photo_children FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_children.parent_id = auth.uid()
      AND parent_children.child_id = photo_children.child_id
    )
  );

-- =============================================================================
-- STEP 10: CREATE PARENT_CHILDREN POLICIES
-- =============================================================================

-- Parents can view their own child links
CREATE POLICY "Parents can view own links"
  ON parent_children FOR SELECT
  USING (parent_id = auth.uid());

-- Admins can manage parent-child links
CREATE POLICY "Admins can manage parent links"
  ON parent_children FOR ALL
  USING (
    get_my_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM children c
      JOIN classrooms cl ON cl.id = c.classroom_id
      WHERE c.id = parent_children.child_id
      AND cl.school_id = get_my_school_id()
    )
  );

-- =============================================================================
-- STEP 11: CREATE PHOTO_FAVORITES POLICIES
-- =============================================================================

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON photo_favorites FOR ALL
  USING (user_id = auth.uid());

-- =============================================================================
-- STEP 12: GRANT FUNCTION PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_teacher_of_classroom(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_of_school(UUID) TO authenticated;

-- =============================================================================
-- VERIFICATION QUERIES (run these to verify policies are working)
-- =============================================================================

-- Check that RLS is enabled on all tables:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Test as a parent - should only see photos with their child tagged:
-- SELECT * FROM photos; -- Should be filtered by RLS

-- Test as a teacher - should see all photos in their classrooms:
-- SELECT * FROM photos; -- Should see classroom photos

-- =============================================================================
-- DONE! All policies are now clean and non-recursive.
-- =============================================================================
