'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SubjectStatistics = {
    subject_id: string
    subject_name: string
    total_quizzes: number
    completed_quizzes: number
    total_attempts: number
    total_questions: number
    correct_answers: number
    success_rate: number
    last_attempt_at: string
}

export default function SubjectStatisticsPage() {
    const [statistics, setStatistics] = useState<SubjectStatistics[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        loadStatistics()
    }, [])

    const loadStatistics = async () => {
        try {
            const session = JSON.parse(localStorage.getItem('session') || '{}')
            const user = session?.user
            const grade_id = user?.user_metadata?.grade_id

            if (!user?.id) {
                throw new Error('Kullanıcı bulunamadı')
            }

            if (!grade_id) {
                throw new Error('Kullanıcının sınıf bilgisi bulunamadı')
            }

            console.log("User grade_id:", grade_id)

            // Önce kullanıcının sınıfındaki tüm dersleri al
            const { data: subjects, error: subjectsError } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', grade_id)

            console.log("Subjects:", subjects)
            console.log("Subjects Error:", subjectsError)

            if (!subjects) return

            // Her ders için istatistikleri hesapla
            const subjectStats = await Promise.all(subjects.map(async (subject) => {
                // Derse ait tüm quizleri al
                const { data: quizzes } = await supabase
                    .from('quizzes')
                    .select('id')
                    .eq('subject_id', subject.id)

                const quizIds = quizzes?.map(q => q.id) || []

                // Bu quizlere ait istatistikleri al
                const { data: quizStats } = await supabase
                    .from('user_quiz_statistics')
                    .select('*')
                    .eq('user_id', user.id)
                    .in('quiz_id', quizIds)

                console.log(`Subject ${subject.name} - Quiz Stats:`, quizStats)

                // İstatistikleri hesapla
                const stats = {
                    subject_id: subject.id,
                    subject_name: subject.name,
                    total_quizzes: quizzes?.length || 0,
                    completed_quizzes: quizStats?.length || 0,
                    total_attempts: quizStats?.reduce((sum, stat) => sum + stat.total_attempts, 0) || 0,
                    total_questions: quizStats?.reduce((sum, stat) => sum + (stat.total_attempts * stat.total_questions), 0) || 0,
                    correct_answers: quizStats?.reduce((sum, stat) => sum + stat.correct_answers, 0) || 0,
                    success_rate: 0,
                    last_attempt_at: quizStats?.sort((a, b) =>
                        new Date(b.last_attempt_at).getTime() - new Date(a.last_attempt_at).getTime()
                    )[0]?.last_attempt_at || '-'
                }

                // Başarı oranını hesapla
                if (stats.total_questions > 0) {
                    stats.success_rate = Math.round((stats.correct_answers / stats.total_questions) * 100)
                }

                return stats
            }))

            console.log("Final Stats:", subjectStats)
            setStatistics(subjectStats)
        } catch (error) {
            console.error('İstatistikler yüklenirken hata oluştu:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Toplam Ders</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">{statistics.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Ortalama Başarı</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                        {Math.round(statistics.reduce((acc, stat) => acc + stat.success_rate, 0) / statistics.length)}%
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Tamamlanan Quiz</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                        {statistics.reduce((acc, stat) => acc + stat.completed_quizzes, 0)}
                    </p>
                </div>
            </div>

            {/* Detaylı İstatistikler Tablosu */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ders
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tamamlanan / Toplam Quiz
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Başarı Oranı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Toplam Deneme
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Son Deneme
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {statistics.map((stat) => (
                                <tr key={stat.subject_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.subject_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.completed_quizzes} / {stat.total_quizzes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-900">{stat.success_rate}%</span>
                                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${stat.success_rate >= 70 ? 'bg-green-500' :
                                                        stat.success_rate >= 40 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}
                                                    style={{ width: `${stat.success_rate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.total_attempts}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.last_attempt_at !== '-'
                                            ? new Date(stat.last_attempt_at).toLocaleDateString('tr-TR')
                                            : '-'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 