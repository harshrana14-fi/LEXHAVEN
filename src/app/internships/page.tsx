// app/internships/page.tsx
import { createClientServer } from '@/lib/supabase'
import Link from 'next/link'
import ClientRealtime from './realtime'

export const revalidate = 0 // always dynamic

async function getInitial() {
  const supabase = createClientServer()
  const { data, error } = await supabase
    .from('internships')
    .select(`
      id, slug, title, locations, stipend_min, stipend_max, currency,
      work_mode, employment_type, created_at,
      organizations ( name, slug )
    `)
    .eq('status','published')
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data
}

export default async function Page() {
  const initial = await getInitial()
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Latest Internships</h1>
      <ClientRealtime initial={initial} />
    </main>
  )
}
