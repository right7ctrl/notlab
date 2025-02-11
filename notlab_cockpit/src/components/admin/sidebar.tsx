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
    School
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin',
        description: 'Genel istatistikler ve özet bilgiler'
    },
    {
        title: 'Müfredat',
        icon: School,
        href: '/admin/curriculum',
        description: 'Sınıf, ders, ünite ve konu yönetimi'
    },
    {
        title: 'Soru Bankası',
        icon: FileQuestion,
        href: '/admin/questions',
        description: 'Soru havuzu ve sınav yönetimi',
        submenu: [
            {
                title: 'Tüm Sorular',
                href: '/admin/questions',
                description: 'Soru listesi ve arama'
            },
            {
                title: 'Yeni Soru',
                href: '/admin/questions/new',
                description: 'Yeni soru oluştur'
            }
        ]
    },
    {
        title: 'Kullanıcılar',
        icon: Users,
        href: '/admin/users',
        description: 'Öğrenci ve öğretmen yönetimi',
        submenu: [
            {
                title: 'Öğrenciler',
                href: '/admin/users/students',
                icon: GraduationCap,
                description: 'Öğrenci listesi ve işlemler'
            },
            {
                title: 'Öğretmenler',
                href: '/admin/users/teachers',
                icon: BookOpen,
                description: 'Öğretmen listesi ve işlemler'
            }
        ]
    },
    {
        title: 'Ayarlar',
        icon: Settings,
        href: '/admin/settings',
        description: 'Sistem ayarları ve yapılandırma'
    }
]

export function AdminSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClientComponentClient()
    const [openMenus, setOpenMenus] = useState<string[]>([])

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
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    NotLab Admin
                </span>
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
                                <button
                                    onClick={() => {
                                        if (item.submenu) {
                                            toggleSubmenu(item.title)
                                        } else {
                                            router.push(item.href)
                                        }
                                    }}
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
                                    {item.submenu && (
                                        <ChevronDown className={cn(
                                            "h-4 w-4 transition-transform",
                                            isOpen ? "transform rotate-180" : ""
                                        )} />
                                    )}
                                </button>

                                {/* Submenu */}
                                {item.submenu && isOpen && (
                                    <div className="pl-12 space-y-1">
                                        {item.submenu.map((subItem) => (
                                            <button
                                                key={subItem.href}
                                                onClick={() => router.push(subItem.href)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                                    pathname === subItem.href
                                                        ? "text-blue-700 bg-blue-50"
                                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                )}
                                            >
                                                {subItem.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t">
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