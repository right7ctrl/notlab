'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SubjectStatistics = {
    subject_id: string
    subject_name: string
    total_topics: number
    completed_topics: number
    success_rate: number
    last_activity: string
}

export default function SubjectStatisticsPage() {
    const [statistics, setStatistics] = useState<SubjectStatistics[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    const loadStatistics = async () => {
        const session = JSON.parse(localStorage.getItem('session') || '{}')
        const user = session?.user

        if (!user?.id) return;

        // Kullanıcının progress bilgisini al
        const { data: profile } = await supabase
            .from('profiles')
            .select(`
                progress,
                grade
            `)
            .eq('id', user.id)
            .single();

        if (!profile) return;

        // Sınıftaki tüm dersleri al
        const { data: subjects } = await supabase
            .from('subjects')
            .select('*')
            .eq('grade_id', profile.grade);

        if (!subjects) return;

        // İstatistikleri hesapla
        const stats = subjects.map(subject => {
            const subjectProgress = profile.progress?.subjects?.[subject.id];
            const totalTopics = Object.values(subjectProgress?.units || {})
                .reduce((sum, unit) => sum + Object.keys(unit.topics || {}).length, 0);
            const completedTopics = Object.values(subjectProgress?.units || {})
                .reduce((sum, unit) => sum + Object.values(unit.topics || {})
                    .filter(topic => topic.is_completed).length, 0);

            return {
                subject_id: subject.id,
                subject_name: subject.name,
                total_topics: totalTopics,
                completed_topics: completedTopics,
                success_rate: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
                last_activity: subjectProgress?.last_activity || '-'
            };
        });

        setStatistics(stats);
    }

    useEffect(() => {
        loadStatistics()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
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
                        {statistics.reduce((acc, stat) => acc + stat.completed_topics, 0)}
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
                                    Tamamlanan / Toplam Konu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Başarı Oranı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Son Aktivite
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
                                        {stat.completed_topics} / {stat.total_topics}
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
                                        {stat.last_activity !== '-'
                                            ? new Date(stat.last_activity).toLocaleDateString('tr-TR')
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