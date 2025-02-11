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

type Grade = {
    id: string
    name: string
}

type Subject = {
    id: string
    name: string
    grade_id: string
}

export default function QuestionsPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGrade, setSelectedGrade] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')

    const [grades, setGrades] = useState<Grade[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])

    const { setTitle } = useAdminLayout()

    useEffect(() => {
        setTitle('Soru Bankası')
    }, [setTitle])

    // Sınıfları yükle
    useEffect(() => {
        const loadGrades = async () => {
            const { data } = await supabase
                .from('grades')
                .select('*')
                .order('number')

            if (data) setGrades(data)
        }
        loadGrades()
    }, [])

    // Seçili sınıfa göre dersleri yükle
    useEffect(() => {
        const loadSubjects = async () => {
            if (!selectedGrade) {
                setSubjects([])
                return
            }

            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', selectedGrade)
                .order('order_number')

            if (data) setSubjects(data)
        }
        loadSubjects()
    }, [selectedGrade])

    const loadQuestions = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('questions')
                .select(`
                    *,
                    subjects(name, grade_id),
                    units(name),
                    topics(name)
                `)
                .order('created_at', { ascending: false })

            if (selectedGrade) {
                query = query.eq('subjects.grade_id', selectedGrade)
            }

            if (selectedSubject) {
                query = query.eq('subject_id', selectedSubject)
            }

            if (searchTerm) {
                query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
            }

            const { data, error } = await query

            if (error) throw error

            const formattedQuestions = data.map(q => ({
                ...q,
                subject_name: q.subjects?.name,
                unit_name: q.units?.name,
                topic_name: q.topics?.name
            }))

            setQuestions(formattedQuestions)
        } catch (error) {
            console.error('Error loading questions:', error)
        } finally {
            setLoading(false)
        }
    }

    // Arama işlemi için debounce fonksiyonu
    const handleSearch = () => {
        loadQuestions()
    }

    const handleDelete = async (questionId: string) => {
        if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return

        try {
            const { error } = await supabase
                .from('questions')
                .delete()
                .eq('id', questionId)

            if (error) throw error

            // Soruları yeniden yükle
            loadQuestions()
        } catch (error) {
            console.error('Error deleting question:', error)
            alert('Soru silinirken bir hata oluştu')
        }
    }

    return (
        <div className="p-4">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            icon={Search}
                            placeholder="Soru ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select
                        label="Sınıf"
                        value={selectedGrade}
                        onChange={(e) => {
                            setSelectedGrade(e.target.value)
                            setSelectedSubject('')
                        }}
                        options={[
                            { value: '', label: 'Tüm Sınıflar' },
                            ...grades.map(grade => ({
                                value: grade.id,
                                label: grade.name
                            }))
                        ]}
                    />

                    <Select
                        label="Ders"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        options={[
                            { value: '', label: 'Tüm Dersler' },
                            ...subjects.map(subject => ({
                                value: subject.id,
                                label: subject.name
                            }))
                        ]}
                        disabled={!selectedGrade}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Ara
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="font-medium text-gray-700">Sorular</h2>
                </div>

                <div className="divide-y">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">Sorular yükleniyor...</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-2">Henüz soru bulunamadı</p>
                            <p className="text-sm text-gray-400">
                                Yukarıdaki filtreleri kullanarak arama yapabilirsiniz
                            </p>
                        </div>
                    ) : (
                        questions.map((question) => (
                            <div
                                key={question.id}
                                className="group hover:bg-gray-50 transition-colors"
                            >
                                <div className="px-6 py-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {question.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <span>{question.subject_name}</span>
                                                    <ChevronRight className="h-3 w-3" />
                                                    <span>{question.unit_name}</span>
                                                    <ChevronRight className="h-3 w-3" />
                                                    <span>{question.topic_name}</span>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                {question.content}
                                            </p>
                                        </div>

                                        <div className="ml-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => router.push(`/admin/questions/${question.id}`)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                                title="Görüntüle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                                                className="p-1 text-gray-400 hover:text-blue-600"
                                                title="Düzenle"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(question.id)}
                                                className="p-1 text-gray-400 hover:text-red-600"
                                                title="Sil"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                            {question.options?.length || 0} Şık
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(question.created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
} 