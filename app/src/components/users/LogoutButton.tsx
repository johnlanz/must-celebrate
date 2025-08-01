import { logout } from '@/app/users/actions'

export default function LogoutButton() {
  return (
    <form method="POST" action={logout}>
      <button
        type="submit"
        className="w-full px-2 py-2 text-sm text-black rounded-sm hover:bg-[#6849be] transition-colors"
      >
        Logout
      </button>
    </form>
  )
}