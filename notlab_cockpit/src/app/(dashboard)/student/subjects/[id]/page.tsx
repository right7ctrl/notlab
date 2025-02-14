'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { UnitCard } from '@/components/student/unit-card'

type Unit = {
    id: string
    name: string
    subject_id: string
    order_number: number
    _count?: {
        topics: number
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
    const [progress, setProgress] = useState(0)
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

        // Üniteleri yükle
        const { data: unitsData } = await supabase
            .from('units')
            .select(`
                *,
                topics:topics_count
            `)
            .eq('subject_id', resolvedParams.id)
            .order('order_number', { ascending: true })

        if (unitsData) {
            setUnits(unitsData)
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
                <Link href="/student" className="text-gray-500 hover:text-gray-900">
                    6.Sınıf
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 font-medium">{subject?.name}</span>
            </nav>

            {/* Başlık ve İlerleme */}
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{subject?.name}</h1>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                    <span className="text-gray-500">%{progress} Tamamlandı</span>
                </div>
            </div>

            {/* Üniteler */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Üniteler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {units.map((unit) => (
                        <UnitCard
                            key={unit.id}
                            id={unit.id}
                            name={unit.name}
                            topicCount={unit._count?.topics || 0}
                            progress={0}
                            description="Araştırmacı Kunduz seni bu üniteyi keşfetmeye çağırıyor."
                        />
                    ))}
                </div>
            </section>
        </div>
    )
} 