'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Topic = {
    id: string
    name: string
    content: string
    unit_id: string
    order_number: number
    units?: {
        id: string
        name: string
        subject_id: string
        subjects?: {
            id: string
            name: string
        }
    }
}

export default function TopicDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [topic, setTopic] = useState<Topic | null>(null)
    const [unitTopics, setUnitTopics] = useState<Topic[]>([])
    const [nextTopic, setNextTopic] = useState<Topic | null>(null)
    const supabase = createClientComponentClient()
    const router = useRouter()

    useEffect(() => {
        loadTopicAndUnit()
    }, [resolvedParams.id])

    const loadTopicAndUnit = async () => {
        // Mevcut konuyu yükle
        const { data: topicData } = await supabase
            .from('topics')
            .select(`
                *,
                units (
                    id,
                    name,
                    subject_id,
                    subjects (
                        id,
                        name
                    )
                )
            `)
            .eq('id', resolvedParams.id)
            .single()

        if (topicData) {
            setTopic(topicData)

            // Ünitedeki tüm konuları yükle
            const { data: topicsData } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', topicData.unit_id)
                .order('order_number', { ascending: true })

            if (topicsData) {
                setUnitTopics(topicsData)

                // Sonraki konuyu bul
                const currentIndex = topicsData.findIndex(t => t.id === topicData.id)
                if (currentIndex < topicsData.length - 1) {
                    setNextTopic(topicsData[currentIndex + 1])
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="border-b bg-white">
                <div className="px-4 sm:px-6 lg:px-12">
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
                            href={`/student/subjects/${topic?.units?.subject_id}`}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            {topic?.units?.subjects?.name}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <Link
                            href={`/student/units/${topic?.unit_id}`}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            {topic?.units?.name}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900 font-medium">{topic?.name}</span>
                    </nav>
                </div>
            </div>

            {/* İki Kolonlu İçerik */}
            <div className="px-4 sm:px-6 lg:px-12 py-8">
                <div className="flex gap-8">
                    {/* Sol Kolon - Konular Listesi */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h2 className="font-medium text-gray-900 mb-4">Konular</h2>
                            <div className="space-y-2">
                                {unitTopics.map((t) => (
                                    <Link
                                        key={t.id}
                                        href={`/student/topics/${t.id}`}
                                    >
                                        <div className={`
                                            p-3 rounded-lg cursor-pointer
                                            ${t.id === topic?.id
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50 text-gray-600'
                                            }
                                        `}>
                                            <div className="text-sm font-medium">{t.name}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon - Konu İçeriği */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-6">{topic?.name}</h1>
                            <div
                                className="prose prose-blue max-w-none"
                                dangerouslySetInnerHTML={{ __html: topic?.content || '' }}
                            />

                            {/* Sonraki Konu Butonu */}
                            {nextTopic && (
                                <div className="mt-8 flex justify-end">
                                    <Link href={`/student/topics/${nextTopic.id}`}>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Sonraki Konu
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 