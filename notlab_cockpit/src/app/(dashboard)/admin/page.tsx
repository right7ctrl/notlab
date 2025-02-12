'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FileQuestion, ClipboardList, BookOpen, GraduationCap, School, Flag, Shield } from 'lucide-react'
import { useAdminLayout } from './layout'

type Stats = {
    questions: number
    quizzes: number
    topics: number
    students: number
    teachers: number
    reports: number
    admins: number
}

const statCards = [
    {
        title: 'Toplam Soru',
        icon: FileQuestion,
        color: 'blue',
        href: '/admin/questions',
        key: 'questions' as const
    },
    {
        title: 'Toplam Quiz',
        icon: ClipboardList,
        color: 'purple',
        href: '/admin/quizzes',
        key: 'quizzes' as const
    },
    {
        title: 'Toplam Konu',
        icon: BookOpen,
        color: 'green',
        href: '/admin/curriculum',
        key: 'topics' as const
    },
    {
        title: 'Öğrenciler',
        icon: GraduationCap,
        color: 'yellow',
        href: '/admin/users?role=student',
        key: 'students' as const
    },
    {
        title: 'Öğretmenler',
        icon: School,
        color: 'orange',
        href: '/admin/users?role=teacher',
        key: 'teachers' as const
    },
    {
        title: 'Raporlar',
        icon: Flag,
        color: 'red',
        href: '/admin/reports',
        key: 'reports' as const
    },
    {
        title: 'Yöneticiler',
        icon: Shield,
        color: 'gray',
        href: '/admin/users?role=admin',
        key: 'admins' as const
    }
]

const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600'
}

export default function AdminDashboard() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Stats>({
        questions: 0,
        quizzes: 0,
        topics: 0,
        students: 0,
        teachers: 0,
        reports: 0,
        admins: 0
    })

    useEffect(() => {
        setTitle('Genel Bakış')
        loadStats()
    }, [])

    const loadStats = async () => {
        const [
            { count: questions },
            { count: quizzes },
            { count: topics },
            { count: students },
            { count: teachers },
            { count: reports },
            { count: admins }
        ] = await Promise.all([
            supabase.from('questions').select('*', { count: 'exact', head: true }),
            supabase.from('quizzes').select('*', { count: 'exact', head: true }),
            supabase.from('topics').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
            supabase.from('reports').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
        ])

        setStats({
            questions: questions || 0,
            quizzes: quizzes || 0,
            topics: topics || 0,
            students: students || 0,
            teachers: teachers || 0,
            reports: reports || 0,
            admins: admins || 0
        })
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {statCards.map((card) => (
                    <button
                        key={card.key}
                        onClick={() => router.push(card.href)}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${colors[card.color]}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500">
                                    {card.title}
                                </h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stats[card.key].toLocaleString('tr-TR')}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
} 