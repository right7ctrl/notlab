import { Book, FileQuestion, ClipboardList } from 'lucide-react'
import Image from 'next/image'

type MaterialCardProps = {
    id: string
    type: 'quiz' | 'page' | 'path' | 'course'
    title: string
    itemCount: number
    itemType: string
    tags: string[]
    progress?: number
    status?: 'not_started' | 'in_progress' | 'completed'
    illustration?: string
    icon?: React.ReactNode
    iconBgColor?: string
    iconColor?: string
    subjectName?: string
    onClick?: () => void
}

export function MaterialCard({
    id,
    type,
    title,
    itemCount,
    itemType,
    tags,
    status,
    illustration,
    iconBgColor = 'bg-blue-100',
    iconColor = 'text-blue-600',
    subjectName,
    onClick
}: MaterialCardProps) {

    // Konu kartı için özel render fonksiyonu
    const renderTopicCard = () => (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 cursor-pointer" onClick={onClick}>
            <div className="flex flex-col">
                {/* Ders ve Ünite Bilgisi */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-blue-100 flex items-center justify-center rounded">
                            <Book className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-600">Konu</span>
                    </div>
                </div>

                {/* Konu Başlığı */}
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                    {title}
                </h3>

                {/* Ders ve Ünite Etiketleri */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${index === 0
                                    ? 'bg-blue-50 text-blue-600' // Ders etiketi
                                    : 'bg-gray-100 text-gray-600' // Ünite etiketi
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Alt Bilgiler */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500">
                        {status === 'not_started' ? 'Başlanmadı' :
                            status === 'completed' ? 'Tamamlandı' :
                                'Devam Ediyor'}
                    </span>
                    <button className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                        Konuya Git →
                    </button>
                </div>
            </div>
        </div>
    )

    // Konu kartı için özel render kullanıyoruz
    return renderTopicCard()
} 