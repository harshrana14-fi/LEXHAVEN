import { NextRequest, NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const secret = process.env.INGEST_SECRET!
  const sig = req.headers.get('x-signature') || ''
  const body = await req.text()
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (sig !== hmac) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })

  const payload = JSON.parse(body)
  const supabase = createClientServer()

  // assumes payload contains org_id and fields compatible with table
  const { data, error } = await supabase.from('internships').insert({
    ...payload,
    status: 'published',
    published_at: new Date().toISOString(),
  }).select('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, id: data?.[0]?.id })
}
