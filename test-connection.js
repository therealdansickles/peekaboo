// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://weuhristvbhcehfwymsz.supabase.co'
const supabaseKey = 'sb_publishable_E4-PM8VQ55zLy133KfXTqg_lw8McoSb'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Testing Supabase connection...\n')

  // Test 1: List all tables by querying classrooms (no policy issues)
  try {
    const { data, error } = await supabase.from('classrooms').select('id').limit(1)
    if (error) {
      console.log('❌ Classrooms query error:', error.message)
    } else {
      console.log('✅ Database connection works!')
      console.log('   Classrooms table accessible, found', data.length, 'rows')
    }
  } catch (e) {
    console.log('❌ Connection error:', e.message)
  }

  // Test 2: Try schools table
  try {
    const { data, error } = await supabase.from('schools').select('id, name').limit(5)
    if (error) {
      console.log('❌ Schools query error:', error.message)
    } else {
      console.log('✅ Schools table accessible, found', data.length, 'rows')
      if (data.length > 0) {
        console.log('   Schools:', data.map(s => s.name).join(', '))
      }
    }
  } catch (e) {
    console.log('❌ Schools error:', e.message)
  }

  // Test 3: Check storage bucket
  try {
    const { data, error } = await supabase.storage.listBuckets()
    if (error) {
      console.log('❌ Storage error:', error.message)
    } else {
      console.log('✅ Storage accessible')
      if (data.length === 0) {
        console.log('   No buckets found (this is OK - bucket might need RLS policy)')
      } else {
        console.log('   Buckets:', data.map(b => b.name).join(', '))
      }
    }
  } catch (e) {
    console.log('❌ Storage error:', e.message)
  }

  // Test 4: Try to list files in photos bucket directly
  try {
    const { data, error } = await supabase.storage.from('photos').list()
    if (error) {
      if (error.message.includes('not found')) {
        console.log('⚠️  Photos bucket not found - please create it in Supabase Storage')
      } else {
        console.log('❌ Photos bucket error:', error.message)
      }
    } else {
      console.log('✅ Photos bucket exists and accessible!')
    }
  } catch (e) {
    console.log('❌ Photos bucket error:', e.message)
  }

  console.log('\n--- Summary ---')
  console.log('If you see database connection works, the app should function!')
  console.log('The profiles recursion error only affects admin/teacher views of other users.')
}

test()
