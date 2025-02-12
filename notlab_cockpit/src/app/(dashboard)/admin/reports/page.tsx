'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Filter, Search, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAdminLayout } from '../layout'
import { Badge } from '@/components/ui/badge'

type Report = {
    id: string
    type: 'wrong_answer' | 'wrong_question' | 'technical_issue' | 'inappropriate_content' | 'suggestion' | 'other'
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected'
    title: string
    description: string
    reported_by: string
    assigned_to?: string
    related_question_id?: string
    related_answer_id?: string
    created_at: string
    reporter?: {
        email: string
        user_metadata: {
            name: string
            surname: string
        }
    }
}

const reportTypes = {
    wrong_answer: { label: 'Yanlış Cevap', color: 'yellow' },
    wrong_question: { label: 'Soru Hatası', color: 'red' },
    technical_issue: { label: 'Teknik Sorun', color: 'purple' },
    inappropriate_content: { label: 'Uygunsuz İçerik', color: 'orange' },
    suggestion: { label: 'Öneri', color: 'blue' },
    other: { label: 'Diğer', color: 'gray' }
} as const

const statusTypes = {
    pending: { label: 'Bekliyor', icon: Clock, color: 'yellow' },
    in_progress: { label: 'İnceleniyor', icon: AlertCircle, color: 'blue' },
    resolved: { label: 'Çözüldü', icon: CheckCircle, color: 'green' },
    rejected: { label: 'Reddedildi', icon: XCircle, color: 'red' }
} as const

export default function ReportsPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('')

    useEffect(() => {
        setTitle('Raporlar')
        loadReports()
    }, [])

    const loadReports = async () => {
        const { data, error } = await supabase
            .from('reports')
            .select(`
                *,
                reporter:reported_by(
                    email,
                    user_metadata
                )
            `)
            .order('created_at', { ascending: false })

        if (data) setReports(data)
        setLoading(false)
    }

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = !selectedType || report.type === selectedType
        return matchesSearch && matchesType
    })

    const formatDate = (date: string) => {
        const d = new Date(date)
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(d)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        )
    }

    const StatusIcon = ({ status }: { status: keyof typeof statusTypes }) => {
        const IconComponent = statusTypes[status].icon
        return <IconComponent className="h-3.5 w-3.5 mr-1" />
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Input
                            type="text"
                            placeholder="Rapor ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full sm:w-48"
                        options={[
                            { value: '', label: 'Tüm Tipler' },
                            ...Object.entries(reportTypes).map(([value, { label }]) => ({
                                value,
                                label
                            }))
                        ]}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {filteredReports.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Rapor bulunamadı
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {formatDate(report.created_at)}
                                            </span>
                                            <h3 className="text-base font-medium text-gray-900">
                                                {report.title}
                                            </h3>
                                            <Badge variant={reportTypes[report.type].color}>
                                                {reportTypes[report.type].label}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                            {report.description}
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            Bildiren: {report.reporter?.user_metadata.name} {report.reporter?.user_metadata.surname}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => router.push(`/admin/reports/${report.id}`)}
                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                            title="Detayları Görüntüle"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 