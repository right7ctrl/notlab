'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Plus, Pencil, Trash2, ChevronRight, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAdminLayout } from '../layout'

type Grade = {
    id: string
    number: number
    name: string
}

type Subject = {
    id: string
    name: string
    grade_id: string
    order_number: number
}

type Unit = {
    id: string
    name: string
    subject_id: string
    order_number: number
}

type Topic = {
    id: string
    name: string
    unit_id: string
    order_number: number
    content?: string
}

type SubjectFormData = {
    name: string
    grade_id: string
}

type UnitFormData = {
    name: string
    subject_id: string
    order_number: number
}

type TopicFormData = {
    name: string
    unit_id: string
    order_number: number
    content: string
}

// SortableUnit komponenti
function SortableUnit({
    unit,
    onShowTopics,
    isSelected
}: {
    unit: Unit,
    onShowTopics: () => void,
    isSelected: boolean
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: unit.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all bg-white cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
            onClick={onShowTopics}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <h3 className="font-medium text-gray-900">
                        {unit.order_number}. {unit.name}
                    </h3>
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            /* Düzenleme modalını aç */
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            /* Silme modalını aç */
                        }}
                        className="p-1 text-gray-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// SortableSubject komponenti ekle
function SortableSubject({ subject, onShowUnits }: { subject: Subject, onShowUnits: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: subject.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 rounded-lg border hover:shadow-md transition-all bg-white`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <h3 className="font-medium text-gray-900">
                        {subject.order_number}. {subject.name}
                    </h3>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {/* Düzenleme modalını aç */ }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => {/* Silme modalını aç */ }}
                        className="p-1 text-gray-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <button
                onClick={onShowUnits}
                className="mt-4 w-full px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
                Üniteleri Göster
            </button>
        </div>
    )
}

// SortableTopic komponenti
function SortableTopic({ topic, onEdit, onDelete }: {
    topic: Topic,
    onEdit: (topic: Topic) => void,
    onDelete: (topic: Topic) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: topic.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all bg-white"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <span className="font-medium text-gray-900">
                        {topic.order_number}. {topic.name}
                    </span>
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onEdit(topic)}
                        className="p-1 text-gray-500 hover:text-blue-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Bu konuyu silmek istediğinize emin misiniz?')) {
                                onDelete(topic)
                            }
                        }}
                        className="p-1 text-gray-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CurriculumManagement() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [grades, setGrades] = useState<Grade[]>([])
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
    const [units, setUnits] = useState<Unit[]>([])
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)
    const [showSubjectModal, setShowSubjectModal] = useState(false)
    const [newSubject, setNewSubject] = useState<SubjectFormData>({
        name: '',
        grade_id: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showUnitModal, setShowUnitModal] = useState(false)
    const [newUnit, setNewUnit] = useState<UnitFormData>({
        name: '',
        subject_id: '',
        order_number: 1
    })
    const [showTopicModal, setShowTopicModal] = useState(false)
    const [newTopic, setNewTopic] = useState<TopicFormData>({
        name: '',
        unit_id: '',
        order_number: 1,
        content: ''
    })
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        setTitle('Müfredat Yönetimi')
    }, [setTitle])

    useEffect(() => {
        const loadGrades = async () => {
            const { data } = await supabase
                .from('grades')
                .select('*')
                .order('number')

            if (data) setGrades(data)
            setLoading(false)
        }

        loadGrades()
    }, [supabase])

    useEffect(() => {
        const loadSubjects = async () => {
            if (!selectedGrade) return

            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', selectedGrade.id)
                .order('order_number')

            if (data) setSubjects(data)
        }

        loadSubjects()
    }, [selectedGrade, supabase])

    useEffect(() => {
        const loadUnits = async () => {
            if (!selectedSubject) return

            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', selectedSubject.id)
                .order('order_number')

            if (data) setUnits(data)
        }

        loadUnits()
    }, [selectedSubject, supabase])

    useEffect(() => {
        const loadTopics = async () => {
            if (!selectedUnit) return

            const { data } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', selectedUnit.id)
                .order('order_number')

            if (data) setTopics(data)
        }

        loadTopics()
    }, [selectedUnit, supabase])

    const handleAddSubject = async () => {
        try {
            setIsSubmitting(true)

            const { error } = await supabase
                .from('subjects')
                .insert([{
                    name: newSubject.name,
                    grade_id: selectedGrade?.id
                }])

            if (error) throw error

            // Dersleri yeniden yükle
            const { data: updatedSubjects } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', selectedGrade?.id)
                .order('order_number')

            if (updatedSubjects) setSubjects(updatedSubjects)

            // Modalı kapat ve formu temizle
            setShowSubjectModal(false)
            setNewSubject({ name: '', grade_id: '' })
        } catch (error) {
            console.error('Ders eklenirken hata:', error)
            alert('Ders eklenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddUnit = async () => {
        try {
            setIsSubmitting(true)

            const { error } = await supabase
                .from('units')
                .insert([{
                    name: newUnit.name,
                    subject_id: selectedSubject?.id,
                    order_number: newUnit.order_number
                }])

            if (error) throw error

            // Üniteleri yeniden yükle
            const { data: updatedUnits } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', selectedSubject?.id)
                .order('order_number')

            if (updatedUnits) setUnits(updatedUnits)

            // Modalı kapat ve formu temizle
            setShowUnitModal(false)
            setNewUnit({ name: '', subject_id: '', order_number: 1 })
        } catch (error) {
            console.error('Ünite eklenirken hata:', error)
            alert('Ünite eklenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubjectDragEnd = async (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setSubjects((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                const newItems = arrayMove(items, oldIndex, newIndex)

                // Sıra numaralarını güncelle
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    order_number: index + 1
                }))

                // Veritabanını güncelle
                updateSubjectsOrder(updatedItems)

                return updatedItems
            })
        }
    }

    const updateSubjectsOrder = async (updatedSubjects: Subject[]) => {
        try {
            for (const subject of updatedSubjects) {
                const { error } = await supabase
                    .from('subjects')
                    .update({ order_number: subject.order_number })
                    .eq('id', subject.id)

                if (error) throw error
            }
        } catch (error) {
            console.error('Ders sırası güncellenirken hata:', error)
            alert('Sıralama güncellenirken bir hata oluştu')

            // Hata durumunda dersleri tekrar yükle
            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', selectedGrade?.id)
                .order('order_number')

            if (data) setSubjects(data)
        }
    }

    const handleUnitDragEnd = async (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setUnits((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                const newItems = arrayMove(items, oldIndex, newIndex)

                // Sıra numaralarını güncelle
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    order_number: index + 1
                }))

                // Veritabanını güncelle
                updateUnitsOrder(updatedItems)

                return updatedItems
            })
        }
    }

    const updateUnitsOrder = async (updatedUnits: Unit[]) => {
        try {
            for (const unit of updatedUnits) {
                const { error } = await supabase
                    .from('units')
                    .update({ order_number: unit.order_number })
                    .eq('id', unit.id)

                if (error) throw error
            }
        } catch (error) {
            console.error('Ünite sırası güncellenirken hata:', error)
            alert('Sıralama güncellenirken bir hata oluştu')

            // Hata durumunda üniteleri tekrar yükle
            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', selectedSubject?.id)
                .order('order_number')

            if (data) setUnits(data)
        }
    }

    const handleTopicDragEnd = async (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setTopics((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                const newItems = arrayMove(items, oldIndex, newIndex)

                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    order_number: index + 1
                }))

                updateTopicsOrder(updatedItems)

                return updatedItems
            })
        }
    }

    const updateTopicsOrder = async (updatedTopics: Topic[]) => {
        try {
            for (const topic of updatedTopics) {
                const { error } = await supabase
                    .from('topics')
                    .update({ order_number: topic.order_number })
                    .eq('id', topic.id)

                if (error) throw error
            }
        } catch (error) {
            console.error('Konu sırası güncellenirken hata:', error)
            alert('Sıralama güncellenirken bir hata oluştu')

            const { data } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', selectedUnit?.id)
                .order('order_number')

            if (data) setTopics(data)
        }
    }

    const handleAddTopic = async (name: string, content: string) => {
        try {
            setIsSubmitting(true)

            const { error } = await supabase
                .from('topics')
                .insert([{
                    name: name.trim(),
                    unit_id: selectedUnit?.id,
                    order_number: topics.length + 1,
                    content: content || ''
                }])

            if (error) throw error

            // Konuları yeniden yükle
            const { data: updatedTopics } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', selectedUnit?.id)
                .order('order_number')

            if (updatedTopics) setTopics(updatedTopics)

            // Modalı kapat ve formu temizle
            setShowTopicModal(false)
            setNewTopic({ name: '', unit_id: '', order_number: 1, content: '' })
        } catch (error) {
            console.error('Konu eklenirken hata:', error)
            alert('Konu eklenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateGrade = async (name: string) => {
        try {
            setIsSubmitting(true)
            const { error } = await supabase
                .from('grades')
                .update({ name })
                .eq('id', editingGrade?.id)

            if (error) throw error

            // Sınıfları yeniden yükle
            const { data } = await supabase
                .from('grades')
                .select('*')
                .order('number')

            if (data) setGrades(data)
            setEditingGrade(null)
        } catch (error) {
            console.error('Sınıf güncellenirken hata:', error)
            alert('Sınıf güncellenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateSubject = async (name: string) => {
        try {
            setIsSubmitting(true)
            const { error } = await supabase
                .from('subjects')
                .update({ name })
                .eq('id', editingSubject?.id)

            if (error) throw error

            // Dersleri yeniden yükle
            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('grade_id', selectedGrade?.id)
                .order('order_number')

            if (data) setSubjects(data)
            setEditingSubject(null)
        } catch (error) {
            console.error('Ders güncellenirken hata:', error)
            alert('Ders güncellenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateUnit = async (name: string) => {
        try {
            setIsSubmitting(true)
            const { error } = await supabase
                .from('units')
                .update({ name })
                .eq('id', editingUnit?.id)

            if (error) throw error

            // Üniteleri yeniden yükle
            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', selectedSubject?.id)
                .order('order_number')

            if (data) setUnits(data)
            setEditingUnit(null)
        } catch (error) {
            console.error('Ünite güncellenirken hata:', error)
            alert('Ünite güncellenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateTopic = async (name: string, content: string) => {
        try {
            setIsSubmitting(true)
            const { error } = await supabase
                .from('topics')
                .update({ name, content })
                .eq('id', editingTopic?.id)

            if (error) throw error

            // Konuları yeniden yükle
            const { data } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', selectedUnit?.id)
                .order('order_number')

            if (data) setTopics(data)
            setEditingTopic(null)
        } catch (error) {
            console.error('Konu güncellenirken hata:', error)
            alert('Konu güncellenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteTopic = async (topic: Topic) => {
        try {
            const { error } = await supabase
                .from('topics')
                .delete()
                .eq('id', topic.id)

            if (error) throw error

            // Konuları yeniden yükle ve sıra numaralarını güncelle
            const { data: remainingTopics } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', selectedUnit?.id)
                .order('order_number')

            if (remainingTopics) {
                // Sıra numaralarını güncelle
                const updatedTopics = remainingTopics.map((topic, index) => ({
                    ...topic,
                    order_number: index + 1
                }))

                setTopics(updatedTopics)
                // Sıra numaralarını veritabanında güncelle
                updateTopicsOrder(updatedTopics)
            }
        } catch (error) {
            console.error('Konu silinirken hata:', error)
            alert('Konu silinirken bir hata oluştu')
        }
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-12 gap-4">
                {/* Sol Panel - Sınıflar */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold text-gray-900">Sınıflar</h2>
                        </div>
                        <div className="p-2">
                            {grades.map((grade) => (
                                <button
                                    key={grade.id}
                                    onClick={() => {
                                        setSelectedGrade(grade)
                                        setSelectedSubject(null)
                                        setSelectedUnit(null)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md ${selectedGrade?.id === grade.id
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {grade.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orta Panel - Dersler */}
                <div className="col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Dersler</h2>
                            {selectedGrade && (
                                <button
                                    onClick={() => setShowSubjectModal(true)}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        <div className="p-2">
                            {selectedGrade ? (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleSubjectDragEnd}
                                >
                                    <SortableContext
                                        items={subjects.map(subject => subject.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-2">
                                            {subjects.map((subject) => (
                                                <div
                                                    key={subject.id}
                                                    onClick={() => {
                                                        setSelectedSubject(subject)
                                                        setSelectedUnit(null)
                                                    }}
                                                    className={`p-3 rounded-md border transition-all cursor-pointer ${selectedSubject?.id === subject.id
                                                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                                                        : 'border-gray-200 hover:border-blue-200 text-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">
                                                            {subject.order_number}. {subject.name}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <button className="p-1 text-gray-500 hover:text-gray-700">
                                                                <GripVertical className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="text-center text-gray-600 py-8">
                                    Lütfen sol panelden bir sınıf seçin
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sağ Panel - Üniteler ve Konular */}
                <div className="col-span-7">
                    {selectedSubject ? (
                        <div className="space-y-6">
                            {/* Üniteler */}
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-900">
                                        {selectedSubject.name} Üniteleri
                                    </h2>
                                    <button
                                        onClick={() => setShowUnitModal(true)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        {units.map((unit) => (
                                            <div
                                                key={unit.id}
                                                className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedUnit?.id === unit.id
                                                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                                                    : 'border-gray-200 hover:border-blue-200 text-gray-700'
                                                    }`}
                                                onClick={() => setSelectedUnit(unit)}
                                            >
                                                <h3 className="font-medium">
                                                    {unit.order_number}. {unit.name}
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Konular */}
                            {selectedUnit && (
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h2 className="font-semibold text-gray-900">
                                            {selectedUnit.name} Konuları
                                        </h2>
                                        <button
                                            onClick={() => setShowTopicModal(true)}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleTopicDragEnd}
                                        >
                                            <SortableContext
                                                items={topics.map(topic => topic.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {topics.map((topic) => (
                                                        <SortableTopic
                                                            key={topic.id}
                                                            topic={topic}
                                                            onEdit={(topic) => {
                                                                setEditingTopic(topic)
                                                                setShowTopicModal(true)
                                                            }}
                                                            onDelete={handleDeleteTopic}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                            Lütfen sol panelden bir ders seçin
                        </div>
                    )}
                </div>
            </div>

            {/* Ders Ekleme Modalı */}
            {showSubjectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Yeni Ders Ekle
                            </h3>
                            <button
                                onClick={() => setShowSubjectModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700">
                                    Ders Adı
                                </label>
                                <input
                                    type="text"
                                    id="subject-name"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    placeholder="Örn: Matematik"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSubjectModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddSubject}
                                    disabled={!newSubject.name || isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ünite Ekleme Modalı */}
            {showUnitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Yeni Ünite Ekle
                            </h3>
                            <button
                                onClick={() => setShowUnitModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="unit-name" className="block text-sm font-medium text-gray-700">
                                    Ünite Adı
                                </label>
                                <input
                                    type="text"
                                    id="unit-name"
                                    value={newUnit.name}
                                    onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    placeholder="Örn: Fonksiyonlar"
                                />
                            </div>
                            <div>
                                <label htmlFor="unit-order" className="block text-sm font-medium text-gray-700">
                                    Sıra Numarası
                                </label>
                                <input
                                    type="number"
                                    id="unit-order"
                                    min="1"
                                    value={newUnit.order_number}
                                    onChange={(e) => setNewUnit(prev => ({ ...prev, order_number: parseInt(e.target.value) || 1 }))}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUnitModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddUnit}
                                    disabled={!newUnit.name || isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Konu Ekleme/Düzenleme Modalı */}
            {showTopicModal && (
                <TopicModal
                    topic={editingTopic}
                    onClose={() => {
                        setShowTopicModal(false)
                        setEditingTopic(null)
                    }}
                    onSave={editingTopic ? handleUpdateTopic : handleAddTopic}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    )
}

// Konu Düzenleme/Ekleme Modalı
const TopicModal = ({
    topic,
    onClose,
    onSave,
    isSubmitting = false
}: {
    topic?: Topic
    onClose: () => void
    onSave: (name: string, content: string) => void
    isSubmitting?: boolean
}) => {
    const [name, setName] = useState(topic?.name || '')
    const [content, setContent] = useState(topic?.content || '')

    const handleSave = () => {
        if (!name.trim()) {
            alert('Konu adı boş olamaz')
            return
        }
        onSave(name, content)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {topic ? 'Konu Düzenle' : 'Yeni Konu Ekle'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konu Adı</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                            placeholder="Konu adını girin..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 resize-none text-gray-900"
                            placeholder="Konu içeriğini buraya yazın..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!name.trim() || isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 