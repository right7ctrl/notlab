'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Option } from '@/components/ui/option'
import { AdminSidebar } from '@/components/admin/sidebar'

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

export default function NewQuestionPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(false)

    // Seçenekler için state'ler
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
        options: [
            { label: 'A', content: '', is_correct: true },
            { label: 'B', content: '', is_correct: false },
            { label: 'C', content: '', is_correct: false }
        ]
    })

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

    // Sınıf seçildiğinde dersleri yükle
    useEffect(() => {
        if (!formData.grade_id) {
            setSubjects([])
            return
        }

        const loadSubjects = async () => {
            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', formData.grade_id)
                .order('order_number')

            if (data) setSubjects(data)
        }
        loadSubjects()
    }, [formData.grade_id])

    // Ders seçildiğinde üniteleri yükle
    useEffect(() => {
        if (!formData.subject_id) {
            setUnits([])
            return
        }

        const loadUnits = async () => {
            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', formData.subject_id)
                .order('order_number')

            if (data) setUnits(data)
        }
        loadUnits()
    }, [formData.subject_id])

    // Ünite seçildiğinde konuları yükle
    useEffect(() => {
        if (!formData.unit_id) {
            setTopics([])
            return
        }

        const loadTopics = async () => {
            const { data } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', formData.unit_id)
                .order('order_number')

            if (data) setTopics(data)
        }
        loadTopics()
    }, [formData.unit_id])

    const handleAddOption = () => {
        const nextLabel = String.fromCharCode(65 + formData.options.length) // A'dan başlayarak devam et
        if (formData.options.length < 5) { // Maksimum 5 şık (A,B,C,D,E)
            setFormData({
                ...formData,
                options: [...formData.options, { label: nextLabel, content: '', is_correct: false }]
            })
        }
    }

    const handleDeleteOption = (index: number) => {
        const newOptions = formData.options.filter((_, i) => i !== index)
        setFormData({ ...formData, options: newOptions })
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('questions')
                .insert([{
                    title: formData.title,
                    content: formData.content,
                    subject_id: formData.subject_id,
                    unit_id: formData.unit_id,
                    topic_id: formData.topic_id,
                    options: formData.options // Şıkları JSON olarak kaydet
                }])

            if (error) throw error

            router.push('/admin/questions')
        } catch (error: any) {
            console.error('Error creating question:', error)
            alert(error.message || 'Soru eklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1">
                <div className="h-16 bg-white border-b px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Yeni Soru Ekle</h1>
                    </div>
                    <button
                        type="submit"
                        form="question-form"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>

                <div className="p-8">
                    <form id="question-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-3 gap-8">
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
                                                    onClick={handleAddOption}
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
                                                            onDelete={() => handleDeleteOption(index)}
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
            </div>
        </div>
    )
} 