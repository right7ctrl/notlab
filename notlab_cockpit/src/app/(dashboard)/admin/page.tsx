'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Users, BookOpen, FileQuestion, GraduationCap, Book, Layout, ChevronUp } from 'lucide-react'
import { useAdminLayout } from './layout'

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
    const { setTitle } = useAdminLayout()

    useEffect(() => {
        setTitle('Dashboard')
    }, [setTitle])

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

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Öğrenci</p>
                            <div className="flex items-baseline">
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {stats.totalStudents}
                                </h3>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-50">
                            <GraduationCap className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Öğretmen</p>
                            <div className="flex items-baseline">
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {stats.totalTeachers}
                                </h3>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50">
                            <FileQuestion className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Soru</p>
                            <div className="flex items-baseline">
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {stats.totalQuestions}
                                </h3>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-orange-50">
                            <Book className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Konu</p>
                            <div className="flex items-baseline">
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {stats.totalTopics}
                                </h3>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Müfredat İstatistikleri</h2>
                                <p className="mt-1 text-sm text-gray-500">Toplam içerik dağılımı</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4">
                        <div className="relative pt-1">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                                        Sınıf
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                        {stats.totalGrades}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                                <div className="w-full bg-blue-500"></div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100">
                                        Ders
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-purple-600">
                                        {stats.totalSubjects}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-100">
                                <div style={{ width: `${(stats.totalSubjects / (stats.totalGrades * 5)) * 100}%` }} className="bg-purple-500"></div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                                        Ünite
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-green-600">
                                        {stats.totalUnits}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                                <div style={{ width: `${(stats.totalUnits / (stats.totalSubjects * 8)) * 100}%` }} className="bg-green-500"></div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-100">
                                        Konu
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-orange-600">
                                        {stats.totalTopics}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-100">
                                <div style={{ width: `${(stats.totalTopics / (stats.totalUnits * 10)) * 100}%` }} className="bg-orange-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Kullanıcı İstatistikleri</h2>
                                <p className="mt-1 text-sm text-gray-500">Kullanıcı dağılımı</p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="relative">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-48 h-48 rounded-full border-8 border-purple-100 relative">
                                    <div
                                        className="absolute inset-0 rounded-full border-8"
                                        style={{
                                            borderColor: 'transparent transparent transparent #9333ea',
                                            transform: `rotate(${(stats.totalStudents / stats.totalUsers) * 360}deg)`,
                                            transition: 'transform 1s ease-in-out'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                                        <span className="text-sm font-medium text-gray-700">Öğrenci</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-semibold text-gray-900">{stats.totalStudents}</span>
                                        <span className="text-xs text-gray-500">
                                            ({Math.round((stats.totalStudents / stats.totalUsers) * 100)}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                                        <span className="text-sm font-medium text-gray-700">Öğretmen</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-semibold text-gray-900">{stats.totalTeachers}</span>
                                        <span className="text-xs text-gray-500">
                                            ({Math.round((stats.totalTeachers / stats.totalUsers) * 100)}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 