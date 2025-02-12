'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    FileQuestion,
    Settings,
    LogOut,
    ChevronDown,
    GraduationCap,
    School,
    Book,
    Layout,
    Flag,
    ClipboardList,
    Shield,
    UserCircle,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const menuItems = [
    {
        title: 'Genel Bakış',
        href: '/admin',
        icon: Layout
    },
    {
        title: 'Müfredat',
        href: '/admin/curriculum',
        icon: BookOpen
    },
    {
        title: 'Sorular',
        href: '/admin/questions',
        icon: FileQuestion
    },
    {
        title: 'Quizler',
        href: '/admin/quizzes',
        icon: ClipboardList
    },
    {
        title: 'Raporlar',
        href: '/admin/reports',
        icon: Flag,
        badge: {
            text: 'Yeni',
            color: 'red'
        }
    },
    {
        title: 'Kullanıcılar',
        href: '/admin/users',
        icon: Users
    },
    {
        title: 'Yöneticiler',
        href: '/admin/admins',
        icon: Shield
    },
    {
        title: 'Ayarlar',
        icon: Settings,
        href: '/admin/settings',
        description: 'Sistem ayarları ve yapılandırma'
    }
]

// Badge komponenti için tip tanımı
type BadgeProps = {
    text: string
    color?: 'red' | 'yellow' | 'green' | 'blue'
}

// Badge renk stilleri
const badgeColors = {
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700'
}

function MenuBadge({ text, color = 'blue' }: BadgeProps) {
    return (
        <span className={cn(
            "ml-auto px-2 py-0.5 text-xs font-medium rounded-full",
            badgeColors[color]
        )}>
            {text}
        </span>
    )
}

type Profile = {
    first_name: string | null
    last_name: string | null
    email: string
}

export function AdminSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClientComponentClient()
    const [openMenus, setOpenMenus] = useState<string[]>([])
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

    const toggleSubmenu = (title: string) => {
        setOpenMenus(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)
                : [...prev, title]
        )
    }

    return (
        <div className="w-64 bg-white border-r min-h-screen flex flex-col">
            {/* Logo */}
            <div className="h-16 border-b flex items-center px-6">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">NotLab</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.submenu && item.submenu.some(sub => pathname === sub.href))
                        const isOpen = openMenus.includes(item.title)

                        return (
                            <div key={item.href} className="space-y-1">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn(
                                            "h-5 w-5",
                                            isActive ? "text-blue-600" : "text-gray-400"
                                        )} />
                                        <span>{item.title}</span>
                                    </div>
                                    {item.badge && (
                                        <MenuBadge
                                            text={item.badge.text}
                                            color={item.badge.color}
                                        />
                                    )}
                                </Link>

                                {/* Submenu */}
                                {item.submenu && isOpen && (
                                    <div className="pl-12 space-y-1">
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                                    pathname === subItem.href
                                                        ? "text-blue-700 bg-blue-50"
                                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                )}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </nav>

            {/* Profile & Logout */}
            <div className="p-4 border-t space-y-2">
                {profile && (
                    <Link
                        href="/admin/profile"
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            pathname === '/admin/profile'
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