// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabaseAdmin = createServiceClient()

  // 1) pull fields from the request
  const { firstName, lastName, email, phone, password, role } = await req.json()
  console.log({ firstName, lastName, email, phone, password, role })
  if (!firstName || !lastName || !email || !phone || !password || !role) {
    return NextResponse.json(
      { error: 'Missing one or more required fields' },
      { status: 400 }
    )
  }

  // 2) sign up (this will trigger Supabase’s confirmation email)
  const { data: signData, error: signError } = await supabaseAdmin.auth.signUp({
    email,
    password,
  })
  if (signError || !signData.user) {
    console.error('Auth signUp error:', signError)
    return NextResponse.json(
      { error: signError?.message ?? 'Error creating user' },
      { status: 500 }
    )
  }

  // 3) insert into profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: signData.user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      role: role,
    })

  if (profileError) {
    console.error('Profile insert error:', profileError)

    // 4) rollback the auth user so you don’t leave a stray account
    await supabaseAdmin.auth.admin.deleteUser(signData.user.id)

    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    )
  }

  // 5) all done!
  return NextResponse.json(
    { user: signData.user, message: `Confirmation email sent to ${email}` },
    { status: 200 }
  )
}
