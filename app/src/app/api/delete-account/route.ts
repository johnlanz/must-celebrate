// app/api/delete-account/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const supabaseAdmin = createServiceClient();
    const { uid } = await req.json();

    if (!uid) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        uid
    )

    if (authError) {
        console.error(authError)
        return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // 2. delete profile row *only if you don’t have ON DELETE CASCADE*
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', uid)

    if (profileError) {
        console.error(profileError)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

  return NextResponse.json({ message: 'Account deleted.' })
}