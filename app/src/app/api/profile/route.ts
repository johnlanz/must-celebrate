// app/api/delete-account/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const supabaseAdmin = createServiceClient();
    const { uid } = await req.json();

    if (!uid) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single()

    console.log('profileData: ', profileData)

    if (profileError) {
        console.error(profileError)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

  return NextResponse.json({ profileData }, { status: 200 });
}