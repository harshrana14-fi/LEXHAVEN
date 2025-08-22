'use client'

export default function AcceptForm({ action, token }: { action: (fd: FormData)=>Promise<any>, token: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <button className="border p-2 rounded">Confirm & Join Organization</button>
    </form>
  )
}
