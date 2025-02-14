import { Book } from 'lucide-react'
import Link from 'next/link'

type UnitCardProps = {
    id: string
    name: string
    topicCount: number
    progress: number
    description: string
}

export function UnitCard({
    id,
    name,
    topicCount,
    progress,
    description
}: UnitCardProps) {
    return (
        <Link href={`/student/units/${id}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg">
                            <Book className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">{topicCount} Konu</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">İlerleme</span>
                            <span className="text-xs font-medium text-gray-900">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-xl overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-xl transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
} 