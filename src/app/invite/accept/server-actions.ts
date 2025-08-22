'use server'
import { createClientServer } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function acceptInvite(formData: FormData) {
  const supabase = await createClientServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const token = String(formData.get('token') || '')
  // 1) Read invite (RLS: must match user email)
  const { data: invite, error: invErr } = await supabase
    .from('org_invites')
    .select('id, org_id, role, accepted, organizations:org_id ( slug )')
    .eq('token', token)
    .single()
  if (invErr || !invite) throw new Error('Invalid invite')
  if (invite.accepted) redirect(`/org/${invite.organizations?.slug}/dashboard`)

  // 2) Insert membership (idempotent with unique(user_id, org_id))
  const { error: memErr } = await supabase
    .from('org_memberships')
    .insert({ org_id: invite.org_id, user_id: user.id, role: invite.role as any })
  if (memErr && !String(memErr.message).includes('duplicate key')) throw memErr

  // 3) Mark invite accepted
  const { error: updErr } = await supabase
    .from('org_invites')
    .update({ accepted: true })
    .eq('id', invite.id)
  if (updErr) throw updErr

  redirect(`/org/${invite.organizations?.slug}/dashboard`)
}
