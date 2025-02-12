'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Book, FileQuestion, ClipboardList, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useStudentLayout } from './layout'
import Image from 'next/image'

type Subject = {
    id: string
    name: string
    grade_id: number
}

export default function StudentDashboard() {
    const supabase = createClientComponentClient()
    const { setTitle } = useStudentLayout()
    const [loading, setLoading] = useState(true)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [profileData, setProfileData] = useState<any>(null)

    useEffect(() => {
        setTitle('Derslerim')
        loadSubjects()
        loadProfileData()
    }, [])

    const loadSubjects = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Önce kullanıcının grade bilgisini alalım
        const { data: profile } = await supabase
            .from('profiles')
            .select('grade')
            .eq('id', user.id)
            .single()

        console.log('Profile grade:', profile?.grade) // Debug için

        if (!profile?.grade) return

        // Bu grade'e ait dersleri listeleyelim
        const { data: subjectsData, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('grade_id', profile.grade)

        console.log('Subjects:', subjectsData, 'Error:', error) // Debug için

        if (subjectsData) {
            setSubjects(subjectsData)
        }

        setLoading(false)
    }

    const loadProfileData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData } = await supabase
            .from('profiles')
            .select(`
                *,
                grades (
                    number
                )
            `)
            .eq('id', user.id)
            .single()

        if (profileData) {
            setProfileData(profileData)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                    <Link
                        key={subject.id}
                        href={`/student/subjects/${subject.id}`}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Book className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                <Trophy className="h-4 w-4" />
                                <span>{Math.round((subject.completed_quiz_count / subject.quiz_count) * 100)}%</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {subject.name}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FileQuestion className="h-4 w-4" />
                                <span>{subject.question_count} Soru</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ClipboardList className="h-4 w-4" />
                                <span>{subject.quiz_count} Quiz</span>
                            </div>
                        </div>

                        <div className="mt-4 bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{
                                    width: `${Math.round((subject.completed_quiz_count / subject.quiz_count) * 100)}%`
                                }}
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
} 