-- SEED DATA FOR PEEKABOO
-- Run this in Supabase SQL Editor AFTER you've signed up with your email
-- Replace 'YOUR_EMAIL@example.com' with your actual email

-- ============================================
-- STEP 1: Create a school
-- ============================================
INSERT INTO schools (id, name, slug) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sunshine Preschool', 'sunshine-preschool')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create classrooms
-- ============================================
INSERT INTO classrooms (id, school_id, name) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Butterflies'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Ladybugs')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: Create children
-- ============================================
INSERT INTO children (id, classroom_id, first_name, last_initial, avatar_emoji) VALUES
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Emma', 'S', '👧'),
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Liam', 'W', '👦'),
  ('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'Olivia', 'M', '👧'),
  ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'Noah', 'B', '👦'),
  ('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'Ava', 'K', '👧')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 4: Make yourself a teacher
-- Run this AFTER you've signed up with magic link
-- Replace the email below with YOUR email
-- ============================================

-- First, find your user ID and update your profile to be a teacher
UPDATE profiles
SET
  role = 'teacher',
  school_id = '11111111-1111-1111-1111-111111111111'
WHERE email = 'dan@dansickles.com';

-- Then assign yourself as teacher to the Butterflies classroom
INSERT INTO classroom_teachers (classroom_id, teacher_id, is_lead)
SELECT
  '22222222-2222-2222-2222-222222222222',
  id,
  true
FROM profiles
WHERE email = 'dan@dansickles.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY: Check your setup
-- ============================================
-- Run this to verify everything is set up:
-- SELECT p.email, p.role, p.school_id, ct.classroom_id
-- FROM profiles p
-- LEFT JOIN classroom_teachers ct ON ct.teacher_id = p.id;
