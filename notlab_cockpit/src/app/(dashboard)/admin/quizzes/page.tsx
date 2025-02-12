'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, Plus, Book, GraduationCap, Eye, Edit, Trash2, BookOpen, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAdminLayout } from '../layout'
import { Badge } from '@/components/ui/badge'

type Quiz = {
    id: string
    title: string
    description: string
    grade_id: string
    subject_id: string
    unit_id: string
    topic_id: string
    created_at: string
    question_count: number
    grade?: {
        name: string
    }
    subject?: {
        name: string
    }
    unit?: {
        name: string
    }
    topic?: {
        name: string
    }
}

export default function QuizzesPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGrade, setSelectedGrade] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [grades, setGrades] = useState<{ id: string, name: string }[]>([])
    const [subjects, setSubjects] = useState<{ id: string, name: string, grade_id: string }[]>([])

    useEffect(() => {
        setTitle('Quizler')
        loadGrades()
    }, [])

    // Sınıfları yükle
    const loadGrades = async () => {
        const { data } = await supabase
            .from('grades')
            .select('*')
            .order('number')

        if (data) setGrades(data)
    }

    // Seçili sınıfa göre dersleri yükle
    useEffect(() => {
        const loadSubjects = async () => {
            if (!selectedGrade) {
                setSubjects([])
                setSelectedSubject('')
                return
            }

            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', selectedGrade)
                .order('name')

            if (data) setSubjects(data)
        }

        loadSubjects()
    }, [selectedGrade])

    // Seçili sınıf ve derse göre quizleri yükle
    useEffect(() => {
        const loadQuizzes = async () => {
            if (!selectedGrade || !selectedSubject) {
                setQuizzes([])
                return
            }

            const { data } = await supabase
                .from('quizzes')
                .select(`
                    *,
                    grade:grade_id (name),
                    subject:subject_id (name),
                    unit:unit_id (name),
                    topic:topic_id (name),
                    quiz_questions(count)
                `)
                .eq('grade_id', selectedGrade)
                .eq('subject_id', selectedSubject)
                .order('created_at', { ascending: false })

            if (data) {
                const quizzesWithCount = data.map(quiz => ({
                    ...quiz,
                    question_count: quiz.quiz_questions[0].count
                }))
                setQuizzes(quizzesWithCount)
            }
            setLoading(false)
        }

        loadQuizzes()
    }, [selectedGrade, selectedSubject])

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
    }

    if (loading && selectedGrade && selectedSubject) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="flex items-center gap-4 w-full">
                    <Select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="w-48"
                        options={[
                            { value: '', label: 'Sınıf Seçin' },
                            ...grades.map(g => ({
                                value: g.id,
                                label: g.name
                            }))
                        ]}
                    />
                    <Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-48"
                        options={[
                            { value: '', label: 'Ders Seçin' },
                            ...subjects.map(s => ({
                                value: s.id,
                                label: s.name
                            }))
                        ]}
                        disabled={!selectedGrade}
                    />
                    {selectedGrade && selectedSubject && (
                        <div className="relative flex-1 max-w-xs">
                            <Input
                                type="text"
                                placeholder="Quiz ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    )}
                </div>
                <button
                    onClick={() => router.push('/admin/quizzes/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="h-5 w-5" />
                    Yeni Quiz
                </button>
            </div>

            {!selectedGrade || !selectedSubject ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="mb-4">
                        <Book className="h-12 w-12 text-gray-300 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Quizleri Görüntülemek İçin
                    </h3>
                    <p className="text-gray-500">
                        Lütfen bir sınıf ve ders seçin
                    </p>
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                    Quiz bulunamadı
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        {quiz.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            {quiz.grade?.name}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Book className="h-4 w-4" />
                                            {quiz.subject?.name}
                                        </div>
                                        {quiz.unit && (
                                            <>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-4 w-4" />
                                                    {quiz.unit.name}
                                                </div>
                                            </>
                                        )}
                                        {quiz.topic && (
                                            <>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <FileText className="h-4 w-4" />
                                                    {quiz.topic.name}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="blue">
                                    {quiz.question_count} Soru
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {quiz.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    {formatDate(quiz.created_at)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/quizzes/${quiz.id}`)}
                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                        title="Görüntüle"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/admin/quizzes/${quiz.id}/edit`)}
                                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                                        title="Düzenle"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => {/* Silme işlemi */ }}
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
    )
} 