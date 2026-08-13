import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const ALLOWED_EMAILS = [
  'dr.vivek@avirahospital.com',
  'dr.preeti@avirahospital.com',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return json({ error: 'Not authenticated' }, 401)

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )

    const { data: userData, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userData?.user) return json({ error: 'Not authenticated' }, 401)

    const { data: isAdmin, error: roleErr } = await admin.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    })
    if (roleErr || !isAdmin) return json({ error: 'Admins only' }, 403)

    const body = await req.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!ALLOWED_EMAILS.includes(email)) {
      return json({ error: 'This account cannot be managed here' }, 400)
    }
    if (password.length < 8 || password.length > 72) {
      return json({ error: 'Password must be between 8 and 72 characters' }, 400)
    }

    // Find the target user by email
    let targetId: string | null = null
    for (let page = 1; page <= 10 && !targetId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
      if (error) return json({ error: error.message }, 500)
      const found = data.users.find((u) => (u.email ?? '').toLowerCase() === email)
      if (found) targetId = found.id
      if (data.users.length < 200) break
    }

    if (!targetId) return json({ error: 'Doctor account not found' }, 404)

    const { error: updErr } = await admin.auth.admin.updateUserById(targetId, { password })
    if (updErr) return json({ error: updErr.message }, 400)

    return json({ success: true })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unexpected error' }, 500)
  }
})
