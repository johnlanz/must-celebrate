'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/Topbar'
import { createClient } from '@/utils/supabase/client' // ✅ Using your custom client
import { toast } from 'sonner'

const LOCAL_STORAGE_KEY = 'userSettings'

export default function SettingsPage() {
    const supabase = createClient() // ✅ Use your working client instance

    const [userId, setUserId] = useState('')
    const [twoFactorSMS, setTwoFactorSMS] = useState(false)
    const [twoFactorApp, setTwoFactorApp] = useState(false)
    const [highContrast, setHighContrast] = useState(false)
    const [language, setLanguage] = useState('English')
    const [timezone, setTimezone] = useState('Asia/Manila')
    const [themeColor, setThemeColor] = useState('purple')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                setFullName(user.user_metadata?.full_name || '')
                setEmail(user.email || '')
            }
        }
        getUserData()
    }, [])

    const handleSave = async () => {
        const { error } = await supabase.auth.updateUser({
            email,
            password: password || undefined,
            data: {
                full_name: fullName,
                twoFactorSMS,
                twoFactorApp,
                highContrast,
                language,
                timezone,
                themeColor,
            }
        })

        if (error) {
            toast.error('Failed to save settings: ' + error.message)
        } else {
            toast.success('Settings updated successfully')
            setPassword('')
        }
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('Are you sure you want to delete your account? This is permanent.')
        if (!confirmed) return

        const { error } = await supabase.auth.signOut()

        if (error) {
            toast.error('Sign out failed: ' + error.message)
        } else {
            toast('Signed out. Ask admin to delete your account.', {
                description: 'User deletion must be performed from the admin panel.',
            })
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar user={{ name: 'John Doe', profileImage: undefined }} />
                <div className="w-full flex justify-start overflow-y-auto px-8 py-10">
                    <div className="w-full max-w-4xl space-y-8">
                        <h1 className="text-2xl font-semibold mb-6">My Settings</h1>

                        <section className="bg-white p-6 rounded-xl border shadow-sm">
                            <h2 className="text-lg font-semibold">Profile</h2>
                            <p className="text-xs text-gray-400 mb-4">Your personal information and account security settings.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <Label>Enter New Password</Label>
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-xl border shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Two-factor authentication (2FA)</h2>
                            <p className="text-xs text-gray-400 mb-4">Keep your account secure by enabling 2FA using a <br></br>temporary one-time passcode (TOTP) from an authenticator app.</p>

                            <div className="flex items-center justify-between">
                                <span>Authenticator App (TOTP)</span>
                                <Switch checked={twoFactorApp} onCheckedChange={setTwoFactorApp} />
                            </div>
                        </section>

                        <div className="flex justify-end space-x-4">
                            <Button onClick={handleSave} className="bg-[#3B3C4E] hover:bg-[#67a626]">
                                Save Changes
                            </Button>
                            <Button variant="destructive" className="bg-[#67a626] hover:bg-[#3B3C4E]" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function createClientComponentClient() {
    throw new Error('Function not implemented.')
}

