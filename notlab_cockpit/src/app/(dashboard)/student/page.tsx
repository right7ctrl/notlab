'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Book, FileQuestion, ClipboardList, Trophy, Clock, Target, Search, ArrowRight, Calendar, ChevronRight, Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'
import { useStudentLayout } from './layout'
import Image from 'next/image'
import { MaterialCard } from '@/components/student/material-card'
import { SubjectCard } from '@/components/student/subject-card'

type Subject = {
    id: string
    name: string
    grade_id: string
    order_number: number
    created_at: string
    _count?: {
        units: number // Ünite sayısı
    }
    units?: {
        id: string
        name: string
        _count?: {
            topics: number // Her ünitenin konu sayısı
        }
    }[]
}

// Materyal tipi için enum ekleyelim
const MaterialType = {
    QUIZ: 'quiz',
    PAGE: 'page',
    PATH: 'path',
    COURSE: 'course',
    ASSIGNMENT: 'assignment'
} as const

// Materyal durumu için enum
const MaterialStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
} as const

type Topic = {
    id: string
    name: string
    unit_id: string
    order_number: number
    content?: string
    created_at: string
    units?: {
        id: string
        name: string
        subject_id: string
        order_number: number
        created_at: string
        subjects?: {
            id: string
            name: string
            grade_id: string
            created_at: string
            order_number: number
        }
    }
}

export default function StudentDashboard() {
    const supabase = createClientComponentClient()
    const { setTitle } = useStudentLayout()
    const [loading, setLoading] = useState(true)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [profileData, setProfileData] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [upcomingEvents, setUpcomingEvents] = useState([
        {
            id: 1,
            title: 'Veri Yapıları Quiz',
            date: '2024-03-20T10:00:00',
            type: 'quiz',
            subject: 'Veri Yapıları'
        },
        {
            id: 2,
            title: 'Algoritma Analizi Ödev Teslimi',
            date: '2024-03-22T23:59:59',
            type: 'homework',
            subject: 'Algoritma Analizi'
        },
        {
            id: 3,
            title: 'Yapay Zeka Final Sınavı',
            date: '2024-03-25T14:00:00',
            type: 'exam',
            subject: 'Yapay Zeka'
        }
    ])
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: 'quiz_completed',
            subject: 'Veri Yapıları',
            score: 85,
            date: '2024-03-18T15:30:00'
        },
        {
            id: 2,
            type: 'homework_submitted',
            subject: 'Algoritma Analizi',
            date: '2024-03-17T22:45:00'
        },
        {
            id: 3,
            type: 'material_viewed',
            subject: 'Yapay Zeka',
            materialName: 'Derin Öğrenme Temelleri',
            date: '2024-03-17T14:20:00'
        }
    ])
    const [learningProgress, setLearningProgress] = useState({
        weeklyGoal: 5,
        completedHours: 3.5,
        streakDays: 7,
        totalPoints: 1250
    })
    const [achievements, setAchievements] = useState([
        {
            id: 1,
            title: 'Hızlı Başlangıç',
            description: '7 gün streak yaparak kazanıldı',
            icon: '🚀',
            date: '2024-03-15'
        },
        {
            id: 2,
            title: 'Quiz Ustası',
            description: '10 quiz\'i %90 üzeri tamamladın',
            icon: '🎯',
            date: '2024-03-10'
        },
        {
            id: 3,
            title: 'Erken Kuş',
            description: 'Sabah 6\'da ders çalıştın',
            icon: '🌅',
            date: '2024-03-18'
        }
    ])
    const [studyTips] = useState([
        {
            id: 1,
            tip: 'Pomodoro tekniğini dene! 25 dakika çalış, 5 dakika dinlen 🍅',
            category: 'productivity'
        },
        {
            id: 2,
            tip: 'Bugün öğrendiklerini arkadaşlarınla paylaş 🤝',
            category: 'social'
        },
        {
            id: 3,
            tip: 'Düzenli su içmeyi unutma! Beynin için önemli 💧',
            category: 'health'
        }
    ])
    const [dailyChallenge] = useState({
        title: 'Günün Görevi',
        description: '3 farklı dersten quiz çöz',
        reward: '250 XP',
        progress: 1,
        total: 3,
        expires: '2024-03-19T23:59:59'
    })

    // Mock materyal verisi
    const [materials] = useState([
        {
            id: 1,
            type: MaterialType.QUIZ,
            title: '5 Steps Optimizing User Experience',
            itemCount: 20,
            itemType: 'Question',
            tags: ['UI/UX Design'],
            urgency: 'Urgent',
            status: MaterialStatus.NOT_STARTED,
            points: 20,
            progress: 0,
            certified: true
        },
        {
            id: 2,
            type: MaterialType.PAGE,
            title: 'Heuristics: 10 Usability Principles To improve UI Design',
            itemCount: 12,
            itemType: 'Chapters',
            tags: ['Learning Design'],
            urgency: 'Not Urgent',
            status: MaterialStatus.IN_PROGRESS,
            progress: 40
        },
        {
            id: 3,
            type: MaterialType.PATH,
            title: 'General Knowledge & Methodology - Layout & Spacing',
            itemCount: 20,
            itemType: 'Path',
            tags: ['Consistancy'],
            urgency: 'Not Urgent',
            status: MaterialStatus.NOT_STARTED,
            progress: 0
        },
        {
            id: 4,
            type: MaterialType.COURSE,
            title: 'Mastering UI Design for Impactful Solutions',
            itemCount: 12,
            itemType: 'Materials',
            tags: ['UI/UX Design'],
            urgency: 'Not Urgent',
            status: MaterialStatus.IN_PROGRESS,
            progress: 50
        }
    ])

    const [topics, setTopics] = useState<Topic[]>([])

    useEffect(() => {
        setTitle('Ana Sayfa')
        loadSubjects()
        loadProfileData()
        loadTopics()
    }, [])

    const loadSubjects = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
            .from('profiles')
            .select('grade')
            .eq('id', user.id)
            .single()

        if (!profile?.grade) return

        // Dersleri ve ilişkili verileri çekelim
        const { data: subjectsData, error } = await supabase
            .from('subjects')
            .select(`
                *,
                units!subject_id (
                    id,
                    name,
                    topics!unit_id (
                        id
                    )
                )
            `)
            .eq('grade_id', profile.grade)
            .order('order_number', { ascending: true })

        if (error) {
            console.error('Error loading subjects:', error)
            return
        }

        if (subjectsData) {
            // Her dersin ünite ve konu sayılarını hesaplayalım
            const subjectsWithCounts = subjectsData.map(subject => ({
                ...subject,
                _count: {
                    units: subject.units?.length || 0
                },
                units: subject.units?.map(unit => ({
                    ...unit,
                    _count: {
                        topics: unit.topics?.length || 0
                    }
                }))
            }))
            setSubjects(subjectsWithCounts)
        }

        setLoading(false)
    }

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

    const loadTopics = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Önce kullanıcının sınıf bilgisini alalım
        const { data: profile } = await supabase
            .from('profiles')
            .select('grade')
            .eq('id', user.id)
            .single()

        if (!profile?.grade) return

        // Konuları ve ilişkili tüm verileri çekelim
        const { data: topicsData, error } = await supabase
            .from('topics')
            .select(`
                *,
                units (
                    *,
                    subjects (
                        *
                    )
                )
            `)
            .eq('units.subjects.grade_id', profile.grade)
            .order('order_number', { ascending: true })

        if (error) {
            console.error('Error loading topics:', error)
            return
        }

        if (topicsData) {
            setTopics(topicsData)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-12 bg-gray-50">
            {/* Hoşgeldin Kartı */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200">
                {/* Sol Taraf - Karşılama Mesajı */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Good morning, {profileData?.first_name || 'User'} 👋
                    </h1>
                    <p className="text-gray-600">
                        Welcome to Trenning, check your priority learning.
                    </p>
                </div>

                {/* Sağ Taraf - İstatistikler */}
                <div className="flex items-center gap-4">
                    {/* Puan */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100">
                            <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xl font-semibold text-gray-900">100</div>
                            <div className="text-sm text-gray-500">Point</div>
                        </div>
                    </div>

                    {/* Rozetler */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100">
                            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17,10.43V2H7V10.43C7,10.79 7.18,11.12 7.49,11.3L11.67,13.8L9.9,16.09L6.07,17.35L7.33,13.5L5.24,12.09L4.93,11.87C4.36,11.5 4,10.87 4,10.19V2H2V10.19C2,11.54 2.72,12.75 3.87,13.43L6,14.87L4.22,20.22L12,17.74L19.78,20.22L18,14.87L20.13,13.43C21.28,12.75 22,11.54 22,10.19V2H20V10.19C20,10.87 19.64,11.5 19.07,11.87L18.76,12.09L16.67,13.5L17.93,17.35L14.1,16.09L12.33,13.8L16.51,11.3C16.82,11.12 17,10.79 17,10.43M9,4H15V10L12,12L9,10V4Z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xl font-semibold text-gray-900">32</div>
                            <div className="text-sm text-gray-500">Badges</div>
                        </div>
                    </div>

                    {/* Sertifikalar */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100">
                            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4,3C2.89,3 2,3.89 2,5V15A2,2 0 0,0 4,17H12V22L15,19L18,22V17H20A2,2 0 0,0 22,15V8L22,6V5A2,2 0 0,0 20,3H16V3H4M12,5L15,7L18,5V8.5L21,10L18,11.5V15L15,13L12,15V11.5L9,10L12,8.5V5M4,5H9V7H4V5M4,9H7V11H4V9M4,13H9V15H4V13Z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xl font-semibold text-gray-900">12</div>
                            <div className="text-sm text-gray-500">Certificates</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Ana Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                {/* Sol Sütun - Mevcut İçerik */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Continue Learning */}
                    <h2 className="text-xl font-semibold text-gray-900">Öğrenmeye Devam Et</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <div className="flex gap-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-[150px] aspect-square bg-blue-100 p-3 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
                                    <div className="relative flex flex-col items-center">
                                        <div className="text-2xl mb-2">👋</div>
                                        <div className="w-12 h-12 bg-white rounded-lg" />
                                        <div className="w-16 h-2 bg-blue-200 rounded mt-2" />
                                        <div className="w-10 h-2 bg-blue-200 rounded mt-1" />
                                    </div>
                                </div>
                                <div className="flex-1 p-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            12 Materials
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Course
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Creating Engaging Learning Journeys: UI/UX Best Practices</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Progress:</span>
                                            <span className="font-medium text-gray-900">80%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                    <button className="mt-3 px-4 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 px-1">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100">
                                    <span className="text-xs font-medium text-blue-600">N</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    Advance your learning with{' '}
                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                        Mastering UI Design for Impactful Solutions →
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* İkinci kart için aynı yapı (farklı içerik ve renk) */}
                        <div className="group">
                            <div className="flex gap-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-[150px] aspect-square bg-purple-100 p-3 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-16 h-16 bg-white rounded-lg mb-2" />
                                        <div className="w-8 h-8 bg-orange-400 rounded-full -mt-4 ml-8" />
                                        <div className="w-16 h-2 bg-purple-200 rounded mt-2" />
                                        <div className="w-10 h-2 bg-purple-200 rounded mt-1" />
                                    </div>
                                </div>
                                <div className="flex-1 p-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            12 Materials
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Course
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-3">The Art of Blending Aesthetics and Functionality in UI/UX Design</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Progress:</span>
                                            <span className="font-medium text-gray-900">30%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }} />
                                        </div>
                                    </div>
                                    <button className="mt-3 px-4 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 px-1">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100">
                                    <span className="text-xs font-medium text-blue-600">N</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    Next, you can dive into{' '}
                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                        Advanced techniques commonly used in UI/UX Design →
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* All Materials */}
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-900">Tüm Materyaller</h2>
                                <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                    {topics.length}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ara..."
                                        className="w-full sm:w-64 pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300"
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <Filter className="w-4 h-4" />
                                        Filtrele
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <ArrowUpDown className="w-4 h-4" />
                                        Sırala
                                    </button>
                                    <div className="hidden sm:flex gap-1">
                                        <button className="p-1.5 text-gray-700 bg-gray-100 rounded-lg">
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                            {topics.map((topic) => (
                                <MaterialCard
                                    key={topic.id}
                                    id={topic.id}
                                    type="topic"
                                    title={topic.name}
                                    itemCount={1}
                                    itemType="Konu"
                                    tags={[
                                        topic.units?.subjects?.name || '',
                                        topic.units?.name || ''
                                    ].filter(Boolean)}
                                    status="not_started"
                                    onClick={() => {
                                        // Konuya tıklandığında yapılacak işlemler
                                        console.log('Topic clicked:', topic)
                                    }}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Dersler Bölümü */}
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-900">Dersler</h2>
                                <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                    {subjects.length}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ara..."
                                        className="w-full sm:w-64 pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300"
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <Filter className="w-4 h-4" />
                                        Filtrele
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <ArrowUpDown className="w-4 h-4" />
                                        Sırala
                                    </button>
                                    <div className="hidden sm:flex gap-1">
                                        <button className="p-1.5 text-gray-700 bg-gray-100 rounded-lg">
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                            {subjects.map((subject, index) => (
                                <SubjectCard
                                    key={subject.id}
                                    id={subject.id}
                                    name={subject.name}
                                    unitCount={subject._count?.units || 0}
                                    topicCount={subject.units?.reduce((acc, unit) =>
                                        acc + (unit._count?.topics || 0), 0) || 0}
                                    progress={0}
                                    color={['blue', 'green', 'purple', 'amber', 'rose'][index % 5]}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sağ Sütun - İstatistikler */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    {/* Learning Stats - Mobilde yan yana */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Content Stats */}
                            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-gray-900">120</div>
                                    <div className="text-sm text-gray-500">Öğrenme İçeriği</div>
                                </div>
                            </div>

                            {/* Time Stats */}
                            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-gray-900">44</div>
                                    <div className="text-sm text-gray-500">Öğrenme Süresi</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goals - Mobilde tek başına */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sm:col-span-1 lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Hedefler</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Bu Ay</span>
                                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col items-center py-6 bg-gradient-to-b from-green-50/50">
                            <div className="relative w-28 h-28 mb-4">
                                <div className="absolute inset-0 rounded-full border-[6px] border-gray-100"></div>
                                <div className="absolute inset-0 rounded-full border-[6px] border-green-500 border-l-transparent" style={{ transform: 'rotate(45deg)' }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">6/30</div>
                                        <div className="text-xs text-gray-500">Tamamlandı</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="text-sm font-medium text-gray-900">Günlük Hedef: 6/30 öğrenme</div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 1Z" />
                                    </svg>
                                    En uzun serinin: 1 Gün
                                </div>
                                <div className="text-xs text-gray-400">(28 Eyl 23 - 4 Eki 23)</div>
                            </div>
                        </div>
                        <button className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1">
                            Detayları Gör
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Leaderboard - Mobilde tam genişlik */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sm:col-span-3 lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Liderlik Tablosu</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Haftalık</span>
                                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Öğrenci Listesi */}
                        <div className="space-y-2">
                            {/* Top 3 */}
                            <div className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-medium">
                                    1
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Ahmet Yılmaz</div>
                                            <div className="text-xs text-gray-500">12. Sınıf</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-sm font-medium text-gray-900">2,850</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                                    2
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Ayşe Demir</div>
                                            <div className="text-xs text-gray-500">11. Sınıf</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">2,540</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium">
                                    3
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Mehmet Kaya</div>
                                            <div className="text-xs text-gray-500">12. Sınıf</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-sm font-medium text-gray-900">2,300</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Diğer Öğrenciler */}
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                    4
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Zeynep Şahin</div>
                                            <div className="text-xs text-gray-500">11. Sınıf</div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">2,100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                    5
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Ali Öztürk</div>
                                            <div className="text-xs text-gray-500">12. Sınıf</div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">1,950</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 py-2 border-t">
                            Tüm Sıralamayı Gör
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 