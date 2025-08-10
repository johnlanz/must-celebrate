// helpers/UserAuth.ts
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

/**
 * Check if there's a logged-in user.
 */
export async function IsLogin(): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('IsLogin error:', error)
    return false
  }
  return !!data.user
}

/**
 * Get current user and profile (if you have a profiles table).
 * Returns object with user and optional profile data.
 */
export async function UserAuth(): Promise<{
  user: User | null
  profile?: { role?: string } | null
}> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('UserAuth.getUser error:', error)
    return { user: null, profile: null }
  }
  const user = data.user
  if (!user) return { user: null, profile: null }

  // If you store additional profile info (e.g. role) in a "profiles" table:
  try {
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')    // adjust column name(s) as needed
      .eq('id', user.id)
      .single()
    console.log('UserAuth.profile:', profileData)   
    if (profileErr) {
      console.warn('Could not fetch profile:', profileErr)
      return { user, profile: null }
    }
    return { user, profile: profileData }
  } catch (e) {
    console.error('UserAuth.profile fetch exception:', e)
    return { user, profile: null }
  }
}

/**
 * Check if the user (with given role) has access.
 * @param access - string or array of allowed roles, e.g. ['admin','editor'] or 'admin'
 * @param currentUser - the object returned by UserAuth (user + profile)
 */
export function HasAccess(
  access: string | string[],
  currentUser: { user: User | null; profile?: { role?: string } | null }
): boolean {
  if (!currentUser.user) return false

  // If you rely on user.user_metadata for role (instead of a profiles table), adjust accordingly:
  const role =
    currentUser.profile?.role ||
    // fallback to user_metadata.role if you stored it there
    (currentUser.user.user_metadata as any)?.role

  if (!role) return false

  if (Array.isArray(access)) {
    return access.includes(role)
  }
  return role === access
}