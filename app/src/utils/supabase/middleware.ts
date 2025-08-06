import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  console.log('NEXT_PUBLIC_SUPABASE_URL: ', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY: ', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/socket.io') &&
    !request.nextUrl.pathname.startsWith('/users') &&
    !request.nextUrl.pathname.startsWith('/error') &&
    !request.nextUrl.pathname.startsWith('/shops') &&
    !request.nextUrl.pathname.startsWith('/no-access') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api/checkout') &&
    request.nextUrl.pathname !== '/' // ✅ allow landing page
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/users/login'
    console.log('Redirecting to login page:', url.toString(), request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}