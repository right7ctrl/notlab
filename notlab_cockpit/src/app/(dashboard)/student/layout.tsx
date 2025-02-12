'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Search, Bell, ChevronDown } from 'lucide-react'
import Image from 'next/image'

type LayoutContextType = {
    title: string
    setTitle: (title: string) => void
}

const LayoutContext = createContext<LayoutContextType>({
    title: '',
    setTitle: () => { }
})

export const useStudentLayout = () => useContext(LayoutContext)

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [title, setTitle] = useState('')
    const [profileData, setProfileData] = useState<any>(null)
    const supabase = createClientComponentClient()

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

    return (
        <LayoutContext.Provider value={{ title, setTitle }}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white shadow-sm">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center justify-between px-6 h-16">
                            {/* Logo ve Sol Menü */}
                            <div className="flex items-center gap-12">
                                {/* Logo */}
                                <Link href="/student" className="flex items-center gap-2">

                                    <span className="font-semibold text-xl text-gray-900">
                                        NotLab
                                    </span>
                                </Link>

                                {/* Ana Menü */}
                                <nav className="flex items-center gap-1">
                                    <Link
                                        href="/student"
                                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                                    >
                                        Ana Sayfa
                                    </Link>
                                    <Link
                                        href="/student/learning"
                                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    >
                                        Öğrenimlerim
                                    </Link>
                                    <Link
                                        href="/student/catalog"
                                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    >
                                        Katalog
                                    </Link>
                                    <Link
                                        href="/student/favorites"
                                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    >
                                        Favoriler
                                    </Link>
                                </nav>
                            </div>

                            {/* Sağ Taraf: Arama, Bildirimler ve Profil */}
                            <div className="flex items-center gap-6">
                                {/* Arama */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Ders veya içerik ara..."
                                        className="w-72 pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-gray-300 transition-colors group-hover:bg-gray-50"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                </div>

                                {/* Bildirimler */}
                                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                </button>

                                {/* Profil */}
                                <div className="flex items-center gap-3 pl-6 border-l">
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                            {profileData?.full_name?.charAt(0)}
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{profileData?.full_name}</div>
                                            <div className="text-gray-500">{profileData?.grades?.number}. Sınıf</div>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </LayoutContext.Provider>
    )
}
