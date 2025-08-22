// app/internships/[slug]/page.tsx
import { createClientServer } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 0

async function getData(slug: string) {
  const supabase = createClientServer()
  const { data, error } = await supabase
    .from('internships')
    .select(`
      id, title, description, locations, skills, stipend_min, stipend_max, currency,
      work_mode, employment_type, start_date, end_date, apply_url, created_at,
      organizations ( name, website, slug )
    `)
    .eq('slug', slug)
    .eq('status','published')
    .single()
  if (error) throw error
  return data
}

export default async function Page({ params }: { params: { slug: string } }) {
  let data
  try { data = await getData(params.slug) } catch { return notFound() }
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p className="opacity-80 mt-1">
        {data.organizations?.name} • {data.work_mode} • {data.locations?.join(', ') ?? '—'}
      </p>

      <section className="prose mt-6 whitespace-pre-wrap">{data.description}</section>

      <div className="mt-6 grid gap-2">
        <div><strong>Skills:</strong> {data.skills?.join(', ') ?? '—'}</div>
        <div><strong>Stipend:</strong> {data.stipend_min
          ? `${data.currency ?? ''} ${data.stipend_min}${data.stipend_max ? '–' + data.stipend_max : ''}`
          : 'Not disclosed'}
        </div>
        <div><strong>Duration:</strong> {data.start_date ?? '—'} → {data.end_date ?? '—'}</div>
        {data.apply_url && (
          <a href={data.apply_url} target="_blank" className="inline-block mt-4 px-4 py-2 border rounded">
            Apply on company site
          </a>
        )}
      </div>
    </main>
  )
}
