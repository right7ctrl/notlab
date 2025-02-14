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
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                        <span className="text-gray-500">%{success} Başarı</span>
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
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">{index + 1}</span>
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
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                            Başla
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