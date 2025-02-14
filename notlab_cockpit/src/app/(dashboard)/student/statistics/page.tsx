'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Statistics = {
    subject_name: string
    unit_name: string
    topic_name: string
    quiz_title: string
    success_rate: number
    total_attempts: number
    correct_answers: number
    total_questions: number
    last_attempt_at: string
}

export default function QuizStatisticsPage() {
    const [statistics, setStatistics] = useState<Statistics[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        loadStatistics()
    }, [])

    const loadStatistics = async () => {
        try {
            const session = JSON.parse(localStorage.getItem('session') || '{}')
            const user = session?.user

            if (!user?.id) {
                throw new Error('Kullanıcı bulunamadı')
            }

            const { data, error } = await supabase
                .from('user_quiz_statistics')
                .select(`
                    *,
                    quizzes (
                        title,
                        topics (
                            name,
                            units (
                                name,
                                subjects (
                                    name
                                )
                            )
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('last_attempt_at', { ascending: false })

            if (error) throw error

            const formattedStats = data.map(stat => ({
                subject_name: stat.quizzes.topics.units.subjects.name,
                unit_name: stat.quizzes.topics.units.name,
                topic_name: stat.quizzes.topics.name,
                quiz_title: stat.quizzes.title,
                success_rate: Math.round((stat.correct_answers / (stat.total_attempts * stat.total_questions)) * 100),
                total_attempts: stat.total_attempts,
                correct_answers: stat.correct_answers,
                total_questions: stat.total_questions,
                last_attempt_at: new Date(stat.last_attempt_at).toLocaleDateString('tr-TR')
            }))

            setStatistics(formattedStats)
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
                    <h3 className="text-sm font-medium text-gray-500">Toplam Quiz</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">{statistics.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Ortalama Başarı</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                        {Math.round(statistics.reduce((acc, stat) => acc + stat.success_rate, 0) / statistics.length)}%
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Toplam Deneme</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                        {statistics.reduce((acc, stat) => acc + stat.total_attempts, 0)}
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
                                    Ünite
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Konu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quiz
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Başarı Oranı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deneme Sayısı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Son Deneme
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {statistics.map((stat, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.subject_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.unit_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.topic_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.quiz_title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-900">{stat.success_rate}%</span>
                                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${stat.success_rate >= 70
                                                        ? 'bg-green-500'
                                                        : stat.success_rate >= 40
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
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
                                        {stat.last_attempt_at}
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