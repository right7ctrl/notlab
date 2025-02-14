'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Search, Bell, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type LayoutContextType = {
    title: string
    setTitle: (title: string) => void
    notifications: Notification[]
    unreadCount: number
}

type Notification = {
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success'
    read: boolean
    createdAt: string
}

const LayoutContext = createContext<LayoutContextType>({
    title: '',
    setTitle: () => { },
    notifications: [],
    unreadCount: 0
})

export const useStudentLayout = () => useContext(LayoutContext)

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [title, setTitle] = useState('')
    const [profileData, setProfileData] = useState<any>(null)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const supabase = createClientComponentClient()
    const router = useRouter()

    const unreadCount = notifications.filter(n => !n.read).length

    // Mock notifications for demo
    useEffect(() => {
        setNotifications([
            {
                id: '1',
                title: 'Yeni Quiz Eklendi',
                message: 'Veri Yapıları dersine yeni quiz eklendi',
                type: 'info',
                read: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Ödev Teslim Tarihi',
                message: 'Algoritma Analizi ödevi için son 2 gün',
                type: 'warning',
                read: false,
                createdAt: new Date().toISOString()
            }
        ])
    }, [])

    const loadProfileData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData } = await supabase
            .from('profiles')
            .select(`
                *,
                grades (
                    number
                )
            `)
            .eq('id', user.id)
            .single()

        if (profileData) {
            setProfileData(profileData)
        }
    }

    useEffect(() => {
        loadProfileData()
    }, [])

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            localStorage.removeItem('session')
            window.location.href = '/auth/login'
        } catch (error) {
            console.error('Çıkış yapılırken hata oluştu:', error)
        }
    }

    return (
        <LayoutContext.Provider value={{ title, setTitle, notifications, unreadCount }}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center justify-between px-6 h-16">
                            {/* Sol Taraf - Logo ve Ana Menü */}
                            <div className="flex items-center gap-8">
                                <Link href="/student" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">N</span>
                                    </div>
                                    <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                                        NotLab
                                    </span>
                                </Link>

                                <nav className="flex items-center gap-1">
                                    <Link
                                        href="/student"
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        Ana Sayfa
                                    </Link>
                                    <Link
                                        href="/student/courses"
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        Derslerim
                                    </Link>
                                    <Link
                                        href="/student/assignments"
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        Ödevler
                                    </Link>
                                    <Link
                                        href="/student/exams"
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        Sınavlar
                                    </Link>
                                    <Link
                                        href="/student/materials"
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        Materyaller
                                    </Link>
                                    <Link
                                        href="/student/statistics"
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        İstatistikler
                                    </Link>
                                </nav>
                            </div>

                            {/* Sağ Taraf */}
                            <div className="flex items-center gap-6">
                                {/* Arama */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ders, ödev veya içerik ara..."
                                        className="w-72 pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>

                                {/* Bildirimler */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
                                    >
                                        <Bell className="h-5 w-5 text-gray-600" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Bildirim Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-900">Bildirimler</h3>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'warning' ? 'bg-yellow-500' :
                                                                notification.type === 'success' ? 'bg-green-500' :
                                                                    'bg-blue-500'
                                                                }`} />
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                                                <p className="text-sm text-gray-600">{notification.message}</p>
                                                                <span className="text-xs text-gray-400 mt-1">
                                                                    {new Date(notification.createdAt).toLocaleDateString('tr-TR')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                                    Tüm bildirimleri gör
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profil */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-all"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                            {profileData?.full_name?.charAt(0)}
                                        </div>
                                        <div className="text-sm text-left">
                                            <div className="font-medium text-gray-900">{profileData?.full_name}</div>
                                            <div className="text-gray-500 text-xs">{profileData?.grades?.number}. Sınıf</div>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </button>

                                    {/* Profil Menüsü */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <div className="font-medium text-gray-900">{profileData?.full_name}</div>
                                                <div className="text-sm text-gray-500">{profileData?.email}</div>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href="/student/profile"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profilim
                                                </Link>
                                                <Link
                                                    href="/student/settings"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Ayarlar
                                                </Link>
                                                <hr className="my-1 border-gray-100" />
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Çıkış Yap
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-[1600px] mx-auto p-8">
                    {children}
                </main>
            </div>
        </LayoutContext.Provider>
    )
}
