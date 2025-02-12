'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Search, Edit, Eye, Trash2, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAdminLayout } from '../layout'

type Question = {
    id: string
    title: string
    content: string
    subject_id: string
    unit_id: string
    topic_id: string
    created_at: string
    subject_name?: string
    unit_name?: string
    topic_name?: string
}

export default function QuestionsPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGrade, setSelectedGrade] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [grades, setGrades] = useState<{ id: string, name: string }[]>([])
    const [subjects, setSubjects] = useState<{ id: string, name: string, grade_id: string }[]>([])
    const [hasFilters, setHasFilters] = useState(false)

    useEffect(() => {
        setTitle('Sorular')
        loadGrades()
        loadQuestions()
    }, [])

    const loadGrades = async () => {
        const { data } = await supabase
            .from('grades')
            .select('id, name')
            .order('number')

        if (data) setGrades(data)
    }

    useEffect(() => {
        const loadSubjects = async () => {
            if (!selectedGrade) {
                setSubjects([])
                setSelectedSubject('')
                return
            }

            const { data } = await supabase
                .from('subjects')
                .select('id, name, grade_id')
                .eq('grade_id', selectedGrade)
                .order('name')

            if (data) setSubjects(data)
        }

        loadSubjects()
    }, [selectedGrade])

    const loadQuestions = async () => {
        const { data, error } = await supabase
            .from('questions')
            .select(`
                *,
                subjects (name),
                units (name),
                topics (name)
            `)
            .order('created_at', { ascending: false })

        if (data) {
            setQuestions(data.map(q => ({
                ...q,
                subject_name: q.subjects?.name,
                unit_name: q.units?.name,
                topic_name: q.topics?.name
            })))
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return

        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', id)

        if (!error) {
            setQuestions(questions.filter(q => q.id !== id))
        }
    }

    const filteredQuestions = questions.filter(q => {
        if (searchTerm || selectedSubject) {
            const matchesSearch = searchTerm ?
                (q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.content.toLowerCase().includes(searchTerm.toLowerCase())) : true
            const matchesSubject = selectedSubject ? q.subject_id === selectedSubject : true
            return matchesSearch && matchesSubject
        }
        return false
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Üst Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Input
                            type="text"
                            placeholder="Soru ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <Select
                        value={selectedGrade}
                        onChange={(e) => {
                            setSelectedGrade(e.target.value)
                            setSelectedSubject('')
                        }}
                        className="w-full sm:w-48"
                        options={[
                            { value: '', label: 'Sınıf Seçin' },
                            ...grades.map(g => ({ value: g.id, label: g.name }))
                        ]}
                    />
                    <Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full sm:w-48"
                        options={[
                            { value: '', label: 'Ders Seçin' },
                            ...subjects.map(s => ({ value: s.id, label: s.name }))
                        ]}
                        disabled={!selectedGrade}
                    />
                </div>
                <button
                    onClick={() => router.push('/admin/questions/new')}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Yeni Soru</span>
                </button>
            </div>

            {/* Soru Listesi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {!searchTerm && !selectedSubject ? (
                    <div className="p-8 text-center">
                        <div className="mb-4">
                            <Search className="h-12 w-12 text-gray-300 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Soruları Görüntülemek İçin
                        </h3>
                        <p className="text-gray-500">
                            Lütfen önce bir sınıf, sonra ders seçin veya arama yapın
                        </p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p className="mb-2">Sonuç bulunamadı</p>
                        <p className="text-sm">Farklı bir arama yapmayı deneyin</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredQuestions.map((question) => (
                            <div key={question.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-base font-medium text-gray-900 truncate">
                                                {question.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <ChevronRight className="h-4 w-4" />
                                                <span>{question.subject_name}</span>
                                                <ChevronRight className="h-4 w-4" />
                                                <span>{question.unit_name}</span>
                                                <ChevronRight className="h-4 w-4" />
                                                <span>{question.topic_name}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {question.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => router.push(`/admin/questions/${question.id}`)}
                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                            title="Görüntüle"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                                            className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                                            title="Düzenle"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(question.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                            title="Sil"
                                        >
                                            <Trash2 className="h-5 w-5" />
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