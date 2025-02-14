'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronRight, Book, Video, FileText } from 'lucide-react'
import Link from 'next/link'

type Unit = {
    id: string
    name: string
    subject_id: string
    order_number: number
    _count?: {
        topics: number
        quizzes: number
    }
}

type Subject = {
    id: string
    name: string
    grade_id: string
}

export default function SubjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [subject, setSubject] = useState<Subject | null>(null)
    const [units, setUnits] = useState<Unit[]>([])
    const [stats, setStats] = useState({
        unitCount: 0,
        videoCount: 0,
        questionCount: 0
    })

    const supabase = createClientComponentClient()

    useEffect(() => {
        loadSubjectAndUnits()
    }, [resolvedParams.id])

    const loadSubjectAndUnits = async () => {
        // Dersi yükle
        const { data: subjectData } = await supabase
            .from('subjects')
            .select('*')
            .eq('id', resolvedParams.id)
            .single()

        if (subjectData) {
            setSubject(subjectData)
        }

        // Üniteleri, konuları ve quizleri yükle
        const { data: unitsData } = await supabase
            .from('units')
            .select(`
                *,
                topics!unit_id (
                    id
                ),
                quizzes!unit_id (
                    id
                )
            `)
            .eq('subject_id', resolvedParams.id)
            .order('order_number', { ascending: true })

        if (unitsData) {
            // Her ünitenin konu ve quiz sayısını hesapla
            const unitsWithCounts = unitsData.map(unit => ({
                ...unit,
                _count: {
                    topics: unit.topics?.length || 0,
                    quizzes: unit.quizzes?.length || 0
                }
            }))
            setUnits(unitsWithCounts)

            // Toplam istatistikleri hesapla
            const totalTopics = unitsWithCounts.reduce((acc, unit) =>
                acc + (unit._count?.topics || 0), 0)

            setStats({
                unitCount: unitsWithCounts.length,
                videoCount: totalTopics * 2, // Her konu için ortalama 2 video varsayalım
                questionCount: totalTopics * 15 // Her konu için ortalama 15 soru varsayalım
            })
        }
    }

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-12 bg-gray-50 min-h-screen pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 py-4 text-sm">
                <Link href="/student" className="text-gray-500 hover:text-gray-900">
                    Anasayfa
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 font-medium">{subject?.name}</span>
            </nav>

            {/* Ders Detay Kartı */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Sol Taraf - Ders Bilgileri */}
                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold text-gray-900">{subject?.name}</h1>
                        <p className="text-gray-600 max-w-2xl">
                            Kesirlerde İşlemler ve Açılar'dan başlayarak tüm 6. Sınıf Matematik müfredatını detaylıca ele
                            almaya ne dersin? Kunduz'la Matematik dersinde eksik bir konun kalmasın.
                        </p>
                    </div>

                    {/* Sağ Taraf - İstatistikler */}
                    <div className="flex items-center gap-8">
                        {/* Üniteler */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Book className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gray-900">{stats.unitCount}</div>
                                <div className="text-sm text-gray-500">Ünite</div>
                            </div>
                        </div>

                        {/* Videolar */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Video className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gray-900">{stats.videoCount}</div>
                                <div className="text-sm text-gray-500">Video</div>
                            </div>
                        </div>

                        {/* Sorular */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gray-900">{stats.questionCount}</div>
                                <div className="text-sm text-gray-500">Soru</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Üniteler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map((unit) => (
                    <Link key={unit.id} href={`/student/units/${unit.id}`}>
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">{unit.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Araştırmacı Kunduz seni bu üniteyi keşfetmeye çağırıyor.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg">
                                        <Book className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-medium text-blue-600">
                                            {unit._count?.topics || 0} Konu
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-lg">
                                        <FileText className="w-4 h-4 text-purple-600" />
                                        <span className="text-xs font-medium text-purple-600">
                                            {unit._count?.quizzes || 0} Quiz
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
} 