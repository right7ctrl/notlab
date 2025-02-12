'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
    Book,
    ClipboardList,
    LogOut,
    GraduationCap,
    UserCircle,
    ChevronRight,
    Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const menuItems = [
    {
        title: 'Derslerim',
        href: '/student',
        icon: Book
    },
    {
        title: 'Quizlerim',
        href: '/student/quizzes',
        icon: ClipboardList
    },
    {
        title: 'Başarılarım',
        href: '/student/achievements',
        icon: Trophy
    }
]

type Profile = {
    first_name: string | null
    last_name: string | null
    email: string
}

export function StudentSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClientComponentClient()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('first_name, last_name, email')
                .eq('id', user.id)
                .single()

            if (data) setProfile(data)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="w-64 bg-white border-r min-h-screen flex flex-col">
            {/* Logo */}
            <div className="h-16 border-b flex items-center px-6">
                <Link href="/student" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">NotLab</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                pathname === item.href
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 mr-3",
                                pathname === item.href ? "text-blue-600" : "text-gray-400"
                            )} />
                            {item.title}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Profile & Logout */}
            <div className="p-4 border-t space-y-2">
                {profile && (
                    <Link
                        href="/student/profile"
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            pathname === '/student/profile'
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {profile.first_name} {profile.last_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {profile.email}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    )
} 