import { Book } from 'lucide-react'
import Link from 'next/link'

type SubjectCardProps = {
    id: string
    name: string
    unitCount: number // Ünite sayısı
    topicCount: number // Toplam konu sayısı
    progress?: number
    color?: string
}

export function SubjectCard({
    id,
    name,
    unitCount = 0,
    topicCount = 0,
    progress = 0,
    color = 'blue'
}: SubjectCardProps) {
    return (
        <Link href={`/student/subjects/${id}`}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 cursor-pointer group">
                <div className="flex flex-col h-full">
                    {/* Ders İkonu ve İsmi */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Book className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{unitCount} Ünite</span>
                                <span>•</span>
                                <span>{topicCount} Konu</span>
                            </div>
                        </div>
                    </div>

                    {/* İlerleme Çubuğu */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">İlerleme</span>
                            <span className="text-xs font-medium text-gray-900">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-xl overflow-hidden">
                            <div
                                className={`h-full bg-${color}-500 rounded-xl transition-all`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}