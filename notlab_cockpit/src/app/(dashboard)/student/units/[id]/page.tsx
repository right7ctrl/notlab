'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

type Topic = {
    id: string
    name: string
    unit_id: string
    order_number: number
    progress?: {
        is_read: boolean
        is_completed: boolean
        completed_quizzes?: string[]
        total_quizzes?: number
        progressPercentage: number
    }
}

type Unit = {
    id: string
    name: string
    subject_id: string
    subjects?: {
        id: string
        name: string
        grade_id: string
    }
}

export default function UnitDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [unit, setUnit] = useState<Unit | null>(null)
    const [topics, setTopics] = useState<Topic[]>([])
    const [activeTab, setActiveTab] = useState('ogren') // ogren, olc, degerlendir
    const [progress, setProgress] = useState(0)
    const [success, setSuccess] = useState(0)
    const supabase = createClientComponentClient()

    useEffect(() => {
        loadUnitAndTopics()
        loadUnitAndProgress()
    }, [resolvedParams.id])

    const loadUnitAndTopics = async () => {
        // Üniteyi ve bağlı olduğu dersi yükle
        const { data: unitData } = await supabase
            .from('units')
            .select(`
                *,
                subjects (
                    id,
                    name,
                    grade_id
                )
            `)
            .eq('id', resolvedParams.id)
            .single()

        if (unitData) {
            setUnit(unitData)
        }

        // Konuları yükle
        const { data: topicsData } = await supabase
            .from('topics')
            .select('*')
            .eq('unit_id', resolvedParams.id)
            .order('order_number', { ascending: true })

        if (topicsData) {
            setTopics(topicsData)
        }
    }

    const loadUnitAndProgress = async () => {
        const session = JSON.parse(localStorage.getItem('session') || '{}')
        const user = session?.user

        if (!user?.id) return;

        // Ünite bilgilerini al
        const { data: unitData } = await supabase
            .from('units')
            .select(`
                *,
                subjects (
                    id,
                    name
                )
            `)
            .eq('id', resolvedParams.id)
            .single()

        if (unitData) {
            setUnit(unitData)

            // Progress bilgisini al
            const { data: profile } = await supabase
                .from('profiles')
                .select('progress')
                .eq('id', user.id)
                .single()

            // Konuları ve quizleri yükle
            const { data: topicsData } = await supabase
                .from('topics')
                .select(`
                    *,
                    quizzes (
                        id,
                        title
                    )
                `)
                .eq('unit_id', resolvedParams.id)
                .order('order_number', { ascending: true })

            if (topicsData) {
                // Ünite progress bilgilerini hesapla
                const unitProgress = profile?.progress?.subjects?.[unitData.subject_id]?.units?.[unitData.id]
                const topicsProgress = unitProgress?.topics || {}

                // Konuların progress bilgilerini ekle
                const topicsWithProgress = topicsData.map(topic => {
                    const topicProgress = topicsProgress[topic.id] || {
                        is_read: false,
                        is_completed: false,
                        completed_quizzes: []
                    };

                    // Konunun quiz sayısını hesapla
                    const totalQuizzes = topic.quizzes?.length || 0;
                    const completedQuizzes = topicProgress.completed_quizzes?.length || 0;

                    // Debug için
                    console.log(`Topic ${topic.name}:`, {
                        totalQuizzes,
                        completedQuizzes,
                        isRead: topicProgress.is_read,
                        isCompleted: topicProgress.is_completed
                    });

                    // Progress yüzdesini hesapla
                    let progressPercentage = 0;
                    if (topicProgress.is_completed) {
                        progressPercentage = 100;
                    } else if (topicProgress.is_read) {
                        if (totalQuizzes > 0) {
                            // Quiz varsa okuma %50, her quiz %50'yi eşit böler
                            progressPercentage = 50 + (completedQuizzes / totalQuizzes) * 50;
                        } else {
                            // Quiz yoksa sadece okuma %100
                            progressPercentage = 100;
                        }
                    }

                    // Debug için
                    console.log(`Progress for ${topic.name}:`, progressPercentage);

                    return {
                        ...topic,
                        progress: {
                            ...topicProgress,
                            progressPercentage: Math.round(progressPercentage)
                        }
                    };
                });

                setTopics(topicsWithProgress)

                // Ünitenin toplam progress'ini hesapla
                const totalProgress = Math.round(
                    topicsWithProgress.reduce((sum, topic) => sum + (topic.progress?.progressPercentage || 0), 0) /
                    topicsWithProgress.length
                );
                setProgress(totalProgress);
            }
        }
    }

    const tabs = [
        { id: 'ogren', name: 'Öğren' },
        { id: 'olc', name: 'Ölç' },
        { id: 'degerlendir', name: 'Değerlendir' }
    ]

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-12 bg-gray-50 min-h-screen pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 py-4 text-sm">
                <Link href="/student" className="text-gray-500 hover:text-gray-900">
                    Anasayfa
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <Link href="/student" className="text-gray-500 hover:text-gray-900">
                    6.Sınıf
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <Link
                    href={`/student/subjects/${unit?.subject_id}`}
                    className="text-gray-500 hover:text-gray-900"
                >
                    {unit?.subjects?.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 font-medium">{unit?.name}</span>
            </nav>

            {/* Başlık ve İlerleme */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">{unit?.name}</h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                        <span className="text-gray-500">%{progress} Tamamlandı</span>
                    </div>

                </div>
            </div>

            {/* Tablar */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            )}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Konular */}
            {activeTab === 'ogren' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">Konular</h2>
                    <div className="space-y-3">
                        {topics.map((topic, index) => (
                            <div
                                key={topic.id}
                                className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4"
                            >
                                <div className="flex-shrink-0 relative">
                                    {/* Dairesel Progress Bar */}
                                    <svg className="w-8 h-8">
                                        <circle
                                            className="text-gray-200"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15"
                                            cx="16"
                                            cy="16"
                                        />
                                        {topic.progress?.is_completed && (
                                            <circle
                                                className="text-green-500"
                                                strokeWidth="2"
                                                strokeDasharray={15 * 2 * Math.PI}
                                                strokeDashoffset="0"
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="15"
                                                cx="16"
                                                cy="16"
                                            />
                                        )}
                                        {!topic.progress?.is_completed && topic.progress?.is_read && (
                                            <circle
                                                className="text-blue-500"
                                                strokeWidth="2"
                                                strokeDasharray={15 * 2 * Math.PI}
                                                strokeDashoffset={15 * Math.PI} // Yarım daire
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="15"
                                                cx="16"
                                                cy="16"
                                            />
                                        )}
                                    </svg>
                                    {/* Numara */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-xs font-medium ${topic.progress?.is_completed
                                            ? 'text-green-600'
                                            : topic.progress?.is_read
                                                ? 'text-blue-600'
                                                : 'text-gray-600'
                                            }`}
                                        >
                                            {topic.progress?.progressPercentage}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-medium text-gray-900">{topic.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        6. sınıf Matematik dersi ilk konusu olan Üslü Sayılar ile yeni okul yılına merhaba!
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link href={`/student/topics/${topic.id}`}>
                                        <button className={`
                                            px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                            ${topic.progress?.is_completed
                                                ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                                : topic.progress?.is_read
                                                    ? 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                            }
                                        `}>
                                            {topic.progress?.is_completed ? 'Tekrar Et' : 'Başla'}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
} 