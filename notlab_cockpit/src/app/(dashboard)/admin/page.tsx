'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { BookOpen, Users, GraduationCap, FileQuestion, Layout } from 'lucide-react'

type DashboardStats = {
    totalGrades: number
    totalSubjects: number
    totalUnits: number
    totalTopics: number
    totalQuestions: number
    totalUsers: number
    totalStudents: number
    totalTeachers: number
}

export default function AdminDashboard() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [stats, setStats] = useState<DashboardStats>({
        totalGrades: 0,
        totalSubjects: 0,
        totalUnits: 0,
        totalTopics: 0,
        totalQuestions: 0,
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/login')
                return
            }

            // İstatistikleri yükle
            const [
                { count: gradesCount },
                { count: subjectsCount },
                { count: unitsCount },
                { count: topicsCount },
                { count: questionsCount },
                { data: usersData }
            ] = await Promise.all([
                supabase.from('grades').select('*', { count: 'exact' }),
                supabase.from('subjects').select('*', { count: 'exact' }),
                supabase.from('units').select('*', { count: 'exact' }),
                supabase.from('topics').select('*', { count: 'exact' }),
                supabase.from('questions').select('*', { count: 'exact' }),
                supabase.from('profiles').select('role')
            ])

            const students = usersData?.filter(u => u.role === 'student').length || 0
            const teachers = usersData?.filter(u => u.role === 'teacher').length || 0

            setStats({
                totalGrades: gradesCount || 0,
                totalSubjects: subjectsCount || 0,
                totalUnits: unitsCount || 0,
                totalTopics: topicsCount || 0,
                totalQuestions: questionsCount || 0,
                totalUsers: (usersData?.length || 0),
                totalStudents: students,
                totalTeachers: teachers
            })

            setLoading(false)
        }

        loadStats()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const menuItems = [
        {
            title: 'Müfredat Yönetimi',
            description: 'Sınıf, ders, ünite ve konu yönetimi',
            icon: BookOpen,
            href: '/admin/curriculum',
            stats: [
                { label: 'Toplam Sınıf', value: stats.totalGrades },
                { label: 'Toplam Ders', value: stats.totalSubjects },
                { label: 'Toplam Ünite', value: stats.totalUnits },
                { label: 'Toplam Konu', value: stats.totalTopics }
            ]
        },
        {
            title: 'Kullanıcı Yönetimi',
            description: 'Öğrenci, öğretmen ve admin yönetimi',
            icon: Users,
            href: '/admin/users',
            stats: [
                { label: 'Toplam Kullanıcı', value: stats.totalUsers },
                { label: 'Öğrenci', value: stats.totalStudents },
                { label: 'Öğretmen', value: stats.totalTeachers }
            ]
        },
        {
            title: 'Soru Bankası',
            description: 'Soru ve test yönetimi',
            icon: FileQuestion,
            href: '/admin/questions',
            stats: [
                { label: 'Toplam Soru', value: stats.totalQuestions }
            ]
        }
    ]

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Layout className="h-8 w-8 text-blue-600" />
                            <h1 className="ml-3 text-2xl font-bold text-gray-900">Admin Paneli</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <item.icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {item.stats.map((stat) => (
                                            <div key={stat.label} className="bg-gray-50 px-4 py-3 rounded-lg">
                                                <p className="text-sm font-medium text-gray-500">
                                                    {stat.label}
                                                </p>
                                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                                    {stat.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => router.push(item.href)}
                                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Yönet
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 