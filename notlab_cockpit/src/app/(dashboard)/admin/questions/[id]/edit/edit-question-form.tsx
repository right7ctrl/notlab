'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Option } from '@/components/ui/option'
import { useAdminLayout } from '../../../layout'

type Props = {
    questionId: string
}

type Grade = { id: string; name: string }
type Subject = { id: string; name: string; grade_id: string }
type Unit = { id: string; name: string }
type Topic = { id: string; name: string }
type QuestionOption = {
    label: string
    content: string
    is_correct: boolean
}

type FormData = {
    title: string
    content: string
    grade_id: string
    subject_id: string
    unit_id: string
    topic_id: string
    options: QuestionOption[]
}

export default function EditQuestionForm({ questionId }: Props) {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [grades, setGrades] = useState<Grade[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [units, setUnits] = useState<Unit[]>([])
    const [topics, setTopics] = useState<Topic[]>([])

    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        grade_id: '',
        subject_id: '',
        unit_id: '',
        topic_id: '',
        options: []
    })

    useEffect(() => {
        setTitle('Soru Düzenle')
        loadGrades()
        loadQuestion()
    }, [])

    const loadQuestion = async () => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select(`
                    *,
                    subjects(id, name, grade_id),
                    units(id, name),
                    topics(id, name)
                `)
                .eq('id', questionId)
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    title: data.title,
                    content: data.content,
                    grade_id: data.subjects?.grade_id || '',
                    subject_id: data.subject_id,
                    unit_id: data.unit_id,
                    topic_id: data.topic_id,
                    options: data.options || []
                })

                // Sınıf seçildiğinde dersleri yükle
                if (data.subjects?.grade_id) {
                    loadSubjects(data.subjects.grade_id)
                }

                // Ders seçildiğinde üniteleri yükle
                if (data.subject_id) {
                    loadUnits(data.subject_id)
                }

                // Ünite seçildiğinde konuları yükle
                if (data.unit_id) {
                    loadTopics(data.unit_id)
                }
            }
        } catch (error) {
            console.error('Error loading question:', error)
            router.push('/admin/questions')
        } finally {
            setLoading(false)
        }
    }

    const loadGrades = async () => {
        const { data } = await supabase
            .from('grades')
            .select('*')
            .order('number')

        if (data) setGrades(data)
    }

    const loadSubjects = async (gradeId: string) => {
        const { data } = await supabase
            .from('subjects')
            .select('*')
            .eq('grade_id', gradeId)
            .order('name')

        if (data) setSubjects(data)
    }

    const loadUnits = async (subjectId: string) => {
        const { data } = await supabase
            .from('units')
            .select('*')
            .eq('subject_id', subjectId)
            .order('name')

        if (data) setUnits(data)
    }

    const loadTopics = async (unitId: string) => {
        const { data } = await supabase
            .from('topics')
            .select('*')
            .eq('unit_id', unitId)
            .order('name')

        if (data) setTopics(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from('questions')
                .update({
                    title: formData.title,
                    content: formData.content,
                    subject_id: formData.subject_id,
                    unit_id: formData.unit_id,
                    topic_id: formData.topic_id,
                    options: formData.options
                })
                .eq('id', questionId)

            if (error) throw error

            router.push('/admin/questions')
        } catch (error) {
            console.error('Error updating question:', error)
            alert('Soru güncellenirken bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Geri</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-8">
                    {/* Sol Panel - Soru Detayları */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-lg border p-6 space-y-6">
                            <Select
                                label="Sınıf"
                                value={formData.grade_id}
                                onChange={(e) => {
                                    const gradeId = e.target.value
                                    setFormData({
                                        ...formData,
                                        grade_id: gradeId,
                                        subject_id: '',
                                        unit_id: '',
                                        topic_id: ''
                                    })
                                    loadSubjects(gradeId)
                                    setUnits([])
                                    setTopics([])
                                }}
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
                                onChange={(e) => {
                                    const subjectId = e.target.value
                                    setFormData({
                                        ...formData,
                                        subject_id: subjectId,
                                        unit_id: '',
                                        topic_id: ''
                                    })
                                    loadUnits(subjectId)
                                    setTopics([])
                                }}
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
                                onChange={(e) => {
                                    const unitId = e.target.value
                                    setFormData({
                                        ...formData,
                                        unit_id: unitId,
                                        topic_id: ''
                                    })
                                    loadTopics(unitId)
                                }}
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
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        topic_id: e.target.value
                                    })
                                }}
                                options={[
                                    { value: '', label: 'Konu Seçin' },
                                    ...topics.map(t => ({
                                        value: t.id,
                                        label: t.name
                                    }))
                                ]}
                                disabled={!formData.unit_id}
                                required
                            />
                        </div>
                    </div>

                    {/* Sağ Panel - Soru İçeriği ve Şıklar */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white rounded-lg border p-6 space-y-6">
                            <Input
                                label="Soru Başlığı"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <Textarea
                                label="Soru İçeriği"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="bg-white rounded-lg border p-6">
                            <div className="space-y-4">
                                {formData.options.map((option, index) => (
                                    <Option
                                        key={option.label}
                                        label={option.label}
                                        value={option.content}
                                        onChange={(value) => {
                                            const newOptions = [...formData.options]
                                            newOptions[index].content = value
                                            setFormData({ ...formData, options: newOptions })
                                        }}
                                        isCorrect={option.is_correct}
                                        onCorrectChange={(isCorrect) => {
                                            const newOptions = formData.options.map((opt, i) => ({
                                                ...opt,
                                                is_correct: i === index ? isCorrect : false
                                            }))
                                            setFormData({ ...formData, options: newOptions })
                                        }}
                                        canDelete={index > 2}
                                        onDelete={() => {
                                            const newOptions = formData.options.filter((_, i) => i !== index)
                                            setFormData({ ...formData, options: newOptions })
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
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
                        disabled={saving}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    )
} 