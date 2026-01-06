import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTeacherClassrooms() {
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    async function loadClassrooms() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        // Get classrooms where user is a teacher
        const { data, error } = await supabase
          .from('classroom_teachers')
          .select(`
            is_lead,
            classroom:classrooms(
              id,
              name,
              school:schools(name)
            )
          `)
          .eq('teacher_id', user.id)

        if (error) throw error

        setClassrooms(data.map(d => ({
          ...d.classroom,
          isLead: d.is_lead
        })))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadClassrooms()
  }, [])

  return { classrooms, loading, error }
}
