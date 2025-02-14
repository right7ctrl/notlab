'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartBar, Book, BookOpen, GraduationCap } from 'lucide-react'

const navigationItems = [
    {
        name: 'Quiz İstatistikleri',
        href: '/student/statistics',
        icon: ChartBar
    },
    {
        name: 'Ders İstatistikleri',
        href: '/student/statistics/subjects',
        icon: Book
    },
    {
        name: 'Ünite İstatistikleri',
        href: '/student/statistics/units',
        icon: BookOpen
    },
    {
        name: 'Konu İstatistikleri',
        href: '/student/statistics/topics',
        icon: GraduationCap
    }
]

export default function StatisticsLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Üst başlık */}
            <div className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-semibold text-gray-900">İstatistiklerim</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Tüm çalışmalarınızın detaylı istatistiklerini görüntüleyin
                        </p>
                    </div>
                </div>
            </div>

            {/* Ana içerik */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sol menü */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <nav className="flex flex-col">
                                {navigationItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 text-sm font-medium
                                                ${isActive
                                                    ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Sağ içerik */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
} 