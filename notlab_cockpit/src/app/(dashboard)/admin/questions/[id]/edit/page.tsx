'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Option } from '@/components/ui/option'
import { useAdminLayout } from '../../../layout'

type Grade = { id: string; name: string }
type Subject = { id: string; name: string }
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

export default function EditQuestionPage({ params }: { params: { id: string } }) {
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
    }, [setTitle])

    // Soruyu yükle
    useEffect(() => {
        const loadQuestion = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select(`
                    *,
                    subjects(id, name, grade_id),
                    units(id, name),
                    topics(id, name)
                `)
                .eq('id', params.id)
                .single()

            if (error) {
                console.error('Error loading question:', error)
                router.push('/admin/questions')
                return
            }

            setFormData({
                title: data.title,
                content: data.content,
                grade_id: data.subjects?.grade_id || '',
                subject_id: data.subject_id,
                unit_id: data.unit_id,
                topic_id: data.topic_id,
                options: data.options || []
            })

            // Sınıfları yükle
            const { data: gradesData } = await supabase
                .from('grades')
                .select('*')
                .order('number')

            if (gradesData) {
                setGrades(gradesData)

                // Dersleri yükle
                if (data.subjects?.grade_id) {
                    const { data: subjectsData } = await supabase
                        .from('subjects')
                        .select('*')
                        .eq('grade_id', data.subjects.grade_id)
                        .order('order_number')

                    if (subjectsData) setSubjects(subjectsData)
                }

                // Üniteleri yükle
                if (data.subject_id) {
                    const { data: unitsData } = await supabase
                        .from('units')
                        .select('*')
                        .eq('subject_id', data.subject_id)
                        .order('order_number')

                    if (unitsData) setUnits(unitsData)
                }

                // Konuları yükle
                if (data.unit_id) {
                    const { data: topicsData } = await supabase
                        .from('topics')
                        .select('*')
                        .eq('unit_id', data.unit_id)
                        .order('order_number')

                    if (topicsData) setTopics(topicsData)
                }
            }

            setLoading(false)
        }

        loadQuestion()
    }, [params.id])

    // Sınıf değiştiğinde dersleri yükle
    useEffect(() => {
        const loadSubjects = async () => {
            if (!formData.grade_id) {
                setSubjects([])
                return
            }

            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', formData.grade_id)
                .order('order_number')

            if (data) setSubjects(data)
        }
        loadSubjects()
    }, [formData.grade_id])

    // Ders değiştiğinde üniteleri yükle
    useEffect(() => {
        const loadUnits = async () => {
            if (!formData.subject_id) {
                setUnits([])
                return
            }

            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', formData.subject_id)
                .order('order_number')

            if (data) setUnits(data)
        }
        loadUnits()
    }, [formData.subject_id])

    // Ünite değiştiğinde konuları yükle
    useEffect(() => {
        const loadTopics = async () => {
            if (!formData.unit_id) {
                setTopics([])
                return
            }

            const { data } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', formData.unit_id)
                .order('order_number')

            if (data) setTopics(data)
        }
        loadTopics()
    }, [formData.unit_id])

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
                .eq('id', params.id)

            if (error) throw error

            router.push('/admin/questions')
        } catch (error: any) {
            console.error('Error updating question:', error)
            alert(error.message || 'Soru güncellenirken bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    const handleOptionChange = (index: number, content: string) => {
        const newOptions = formData.options.map((option, i) => ({
            ...option,
            content: i === index ? content : option.content
        }))
        setFormData({ ...formData, options: newOptions })
    }

    const handleCorrectAnswerChange = (label: string) => {
        const newOptions = formData.options.map(option => ({
            ...option,
            is_correct: option.label === label
        }))
        setFormData({ ...formData, options: newOptions })
    }

    if (loading) {
        return <div className="flex items-center justify-center h-full">Yükleniyor...</div>
    }

    return (
        <div className="p-4">
            <div className="flex items-end justify-end mb-6">

                <button
                    type="submit"
                    form="question-form"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <form id="question-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-8">
                    {/* Sol Panel - Soru Detayları */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-lg border p-6 space-y-6">
                            <h2 className="font-medium text-gray-900 flex items-center gap-2">
                                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">1</span>
                                Soru Detayları
                            </h2>
                            <Select
                                label="Sınıf"
                                value={formData.grade_id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        grade_id: e.target.value,
                                        subject_id: '',
                                        unit_id: '',
                                        topic_id: '',
                                    })
                                }}
                                options={[
                                    { value: '', label: 'Sınıf Seçin' },
                                    ...grades.map(grade => ({
                                        value: grade.id,
                                        label: grade.name
                                    }))
                                ]}
                                required
                            />

                            <Select
                                label="Ders"
                                value={formData.subject_id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        subject_id: e.target.value,
                                        unit_id: '',
                                        topic_id: '',
                                    })
                                }}
                                options={[
                                    { value: '', label: 'Ders Seçin' },
                                    ...subjects.map(subject => ({
                                        value: subject.id,
                                        label: subject.name
                                    }))
                                ]}
                                disabled={!formData.grade_id}
                                required
                            />

                            <Select
                                label="Ünite"
                                value={formData.unit_id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        unit_id: e.target.value,
                                        topic_id: '',
                                    })
                                }}
                                options={[
                                    { value: '', label: 'Ünite Seçin' },
                                    ...units.map(unit => ({
                                        value: unit.id,
                                        label: unit.name
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
                                    { value: '', label: 'Konu Seçin' },
                                    ...topics.map(topic => ({
                                        value: topic.id,
                                        label: topic.name
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
                            <h2 className="font-medium text-gray-900 flex items-center gap-2">
                                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">2</span>
                                Soru İçeriği
                            </h2>
                            <Input
                                label="Soru Başlığı"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Sorunun kısa başlığını yazın..."
                                required
                            />
                            <Textarea
                                label="Soru İçeriği"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Soru metnini buraya yazın..."
                                rows={5}
                                required
                            />
                        </div>

                        <div className="bg-white rounded-lg border p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Şıklar</h3>
                                    {formData.options.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextLabel = String.fromCharCode(65 + formData.options.length)
                                                setFormData({
                                                    ...formData,
                                                    options: [
                                                        ...formData.options,
                                                        { label: nextLabel, content: '', is_correct: false }
                                                    ]
                                                })
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Şık Ekle
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-4">
                                    {formData.options.map((option, index) => (
                                        <div key={option.label} className="flex gap-4">
                                            <div className="flex-1">
                                                <Option
                                                    label={option.label}
                                                    value={option.content}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    canDelete={index > 2}
                                                    onDelete={() => {
                                                        const newOptions = formData.options.filter((_, i) => i !== index)
                                                        setFormData({ ...formData, options: newOptions })
                                                    }}
                                                    placeholder={`${option.label} şıkkının içeriğini yazın...`}
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="correct_answer"
                                                        value={option.label}
                                                        checked={option.is_correct}
                                                        onChange={() => handleCorrectAnswerChange(option.label)}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">Doğru Cevap</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
} 