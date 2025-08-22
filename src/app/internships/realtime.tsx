'use client'
import { useEffect, useState } from 'react'
import { createClientBrowser } from '@/lib/supabase'
import Link from 'next/link'

type Row = {
  id: string
  slug: string
  title: string
  locations: string[] | null
  stipend_min: number | null
  stipend_max: number | null
  currency: string | null
  work_mode: 'onsite'|'remote'|'hybrid'
  employment_type: string
  created_at: string
  organizations?: { name: string; slug: string } | null
}

export default function ClientRealtime({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial)
  useEffect(() => {
    const supabase = createClientBrowser()
    const ch = supabase.channel('internships-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'internships', filter: 'status=eq.published' },
        (payload: any) => setRows((r) => [payload.new as Row, ...r])
      )
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rows.map((it) => (
        <li key={it.id} className="border rounded-lg p-4 hover:shadow-sm transition">
          <Link href={`/internships/${it.slug}`}>
            <h3 className="font-medium text-lg">{it.title}</h3>
            <p className="text-sm opacity-80 mt-1">
              {(it.organizations?.name) ?? '—'} • {it.work_mode} • {it.locations?.join(' / ') ?? '—'}
            </p>
            <p className="text-sm mt-1">
              {it.stipend_min
                ? `Stipend: ${it.currency ?? ''} ${it.stipend_min}${it.stipend_max ? '–' + it.stipend_max : ''}`
                : 'Stipend: Not disclosed'}
            </p>
            <p className="text-xs opacity-60 mt-1">Posted {new Date(it.created_at).toLocaleString()}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
