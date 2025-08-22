import { createClientServer } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import AcceptForm from './accept-form'
import { acceptInvite } from './server-actions'

export const revalidate = 0

export default async function AcceptInvite({
  searchParams
}: { searchParams: { token?: string } }) {
  const token = searchParams.token
  const supabase = createClientServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/invite/accept' + (token ? `?token=${token}` : ''))

  if (!token) {
    return <main className="p-6">Missing token.</main>
  }

  // Try to fetch invite to show info
  const { data: invite } = await supabase
    .from('org_invites')
    .select(`
      id, email, role, accepted, org_id,
      organizations:org_id ( name, slug )
    `)
    .eq('token', token)
    .single()

  if (!invite) {
    return <main className="p-6">Invalid or expired invite.</main>
  }

  if (invite.accepted) {
    return <main className="p-6">This invite was already accepted.</main>
  }

  // Enforce that logged-in email matches invite email
  // Note: RLS already limited select by auth.email() = email, so if we got here it's matched.
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-xl font-semibold">Accept invite</h1>
      <p>
        You are joining <strong>{invite.organizations?.name}</strong> as <strong>{invite.role}</strong> with{' '}
        <code className="text-sm">{invite.email}</code>.
      </p>
      <AcceptForm action={acceptInvite} token={token} />
    </main>
  )
}
