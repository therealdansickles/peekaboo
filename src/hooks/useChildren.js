import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useChildren(classroomId) {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!classroomId || !supabase) {
      setLoading(false)
      return
    }

    async function loadChildren() {
      try {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('classroom_id', classroomId)
          .eq('is_active', true)
          .order('first_name')

        if (error) throw error
        setChildren(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadChildren()
  }, [classroomId])

  return { children, loading, error }
}

// For parents - get their linked children
export function useMyChildren() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    async function loadMyChildren() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('parent_children')
        .select(`
          child:children(
            *,
            classroom:classrooms(name)
          )
        `)
        .eq('parent_id', user.id)

      if (!error) {
        setChildren(data.map(d => d.child))
      }
      setLoading(false)
    }

    loadMyChildren()
  }, [])

  return { children, loading }
}
