'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useAdminLayout } from '../../layout'

type Question = {
    id: string
    title: string
    content: string
    subject_id: string
    unit_id: string
    topic_id: string
    unit?: {
        name: string
    }
    topic?: {
        name: string
    }
}

export default function NewQuizPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
    const [grades, setGrades] = useState<{ id: string, name: string }[]>([])
    const [subjects, setSubjects] = useState<{ id: string, name: string, grade_id: string }[]>([])
    const [units, setUnits] = useState<{ id: string, name: string }[]>([])
    const [topics, setTopics] = useState<{ id: string, name: string }[]>([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        grade_id: '',
        subject_id: '',
        unit_id: '',
        topic_id: ''
    })

    useEffect(() => {
        setTitle('Yeni Quiz')
        loadGrades()
    }, [])

    const loadGrades = async () => {
        const { data } = await supabase
            .from('grades')
            .select('*')
            .order('number')

        if (data) setGrades(data)
    }

    useEffect(() => {
        const loadSubjects = async () => {
            if (!formData.grade_id) {
                setSubjects([])
                setFormData(prev => ({ ...prev, subject_id: '', unit_id: '', topic_id: '' }))
                return
            }

            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', formData.grade_id)
                .order('name')

            if (data) setSubjects(data)
        }

        loadSubjects()
    }, [formData.grade_id])

    useEffect(() => {
        const loadUnits = async () => {
            if (!formData.subject_id) {
                setUnits([])
                setFormData(prev => ({ ...prev, unit_id: '', topic_id: '' }))
                return
            }

            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', formData.subject_id)
                .order('name')

            if (data) setUnits(data)
        }

        loadUnits()
    }, [formData.subject_id])

    useEffect(() => {
        const loadTopics = async () => {
            if (!formData.unit_id) {
                setTopics([])
                setFormData(prev => ({ ...prev, topic_id: '' }))
                return
            }

            const { data } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', formData.unit_id)
                .order('name')

            if (data) setTopics(data)
        }

        loadTopics()
    }, [formData.unit_id])

    useEffect(() => {
        const loadQuestions = async () => {
            if (!formData.subject_id || !formData.unit_id) {
                setQuestions([])
                return
            }

            let query = supabase
                .from('questions')
                .select(`
                    *,
                    unit:unit_id (name),
                    topic:topic_id (name)
                `)
                .eq('subject_id', formData.subject_id)
                .eq('unit_id', formData.unit_id)

            if (formData.topic_id) {
                query = query.eq('topic_id', formData.topic_id)
            }

            const { data } = await query.order('created_at', { ascending: false })

            if (data) setQuestions(data)
        }

        loadQuestions()
    }, [formData.subject_id, formData.unit_id, formData.topic_id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedQuestions.length === 0) {
            alert('En az bir soru seçmelisiniz')
            return
        }

        setLoading(true)
        try {
            // 1. Önce quiz'i oluştur
            const { data: quiz, error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    grade_id: formData.grade_id,
                    subject_id: formData.subject_id,
                    unit_id: formData.unit_id,
                    topic_id: formData.topic_id || null // topic_id opsiyonel
                })
                .select()
                .single()

            if (quizError) throw quizError

            // 2. Seçili soruları quiz_questions tablosuna ekle
            const questionInserts = selectedQuestions.map((questionId, index) => ({
                quiz_id: quiz.id,
                question_id: questionId,
                order_index: index
            }))

            const { error: questionsError } = await supabase
                .from('quiz_questions')
                .insert(questionInserts)

            if (questionsError) throw questionsError

            router.push('/admin/quizzes')
        } catch (error) {
            console.error('Error creating quiz:', error)
            alert('Quiz oluşturulurken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Geri
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg border p-6 space-y-6">
                            <Input
                                label="Quiz Başlığı"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <Textarea
                                label="Açıklama"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                required
                            />

                            <Select
                                label="Sınıf"
                                value={formData.grade_id}
                                onChange={(e) => setFormData({ ...formData, grade_id: e.target.value, subject_id: '', unit_id: '', topic_id: '' })}
                                options={[
                                    { value: '', label: 'Sınıf Seçin' },
                                    ...grades.map(g => ({
                                        value: g.id,
                                        label: g.name
                                    }))
                                ]}
                                required
                            />

                            <Select
                                label="Ders"
                                value={formData.subject_id}
                                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value, unit_id: '', topic_id: '' })}
                                options={[
                                    { value: '', label: 'Ders Seçin' },
                                    ...subjects.map(s => ({
                                        value: s.id,
                                        label: s.name
                                    }))
                                ]}
                                disabled={!formData.grade_id}
                                required
                            />

                            <Select
                                label="Ünite"
                                value={formData.unit_id}
                                onChange={(e) => setFormData({ ...formData, unit_id: e.target.value, topic_id: '' })}
                                options={[
                                    { value: '', label: 'Ünite Seçin' },
                                    ...units.map(u => ({
                                        value: u.id,
                                        label: u.name
                                    }))
                                ]}
                                disabled={!formData.subject_id}
                                required
                            />

                            <Select
                                label="Konu"
                                value={formData.topic_id}
                                onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                                options={[
                                    { value: '', label: 'Konu Seçin (Opsiyonel)' },
                                    ...topics.map(t => ({
                                        value: t.id,
                                        label: t.name
                                    }))
                                ]}
                                disabled={!formData.unit_id}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {!formData.unit_id ? (
                            <div className="bg-white rounded-lg border p-8 text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Soruları Görüntülemek İçin
                                </h3>
                                <p className="text-gray-500">
                                    Lütfen sınıf, ders ve ünite seçin
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Sorular ({selectedQuestions.length} seçili)
                                </h3>
                                <div className="space-y-4">
                                    {questions.map((question) => (
                                        <div
                                            key={question.id}
                                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedQuestions.includes(question.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => {
                                                setSelectedQuestions(prev =>
                                                    prev.includes(question.id)
                                                        ? prev.filter(id => id !== question.id)
                                                        : [...prev, question.id]
                                                )
                                            }}
                                        >
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {question.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <span>{question.unit?.name}</span>
                                                {question.topic && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{question.topic.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                {question.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading || selectedQuestions.length === 0}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Oluşturuluyor...' : 'Quiz Oluştur'}
                    </button>
                </div>
            </form>
        </div>
    )
} 