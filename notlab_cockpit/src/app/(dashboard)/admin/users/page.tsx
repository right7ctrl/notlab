'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, GraduationCap, School } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAdminLayout } from '../layout'
import { Badge } from '@/components/ui/badge'

type User = {
    id: string
    email: string
    role: 'student' | 'teacher'
    created_at: string
    user_metadata: {
        name: string
        surname: string
        grade_id?: string
    }
    grade?: {
        name: string
    }
}

const roleTypes = {
    student: { label: 'Öğrenci', icon: GraduationCap, color: 'blue' },
    teacher: { label: 'Öğretmen', icon: School, color: 'purple' }
} as const

const RoleIcon = ({ role }: { role: keyof typeof roleTypes }) => {
    const Icon = roleTypes[role].icon
    return <Icon className="w-3.5 h-3.5 mr-1" />
}

export default function UsersPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | ''>('student')

    useEffect(() => {
        setTitle('Kullanıcılar')
        loadUsers()
    }, [])

    const loadUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                grade:grade_id (
                    name
                )
            `)
            .order('created_at', { ascending: false })

        if (data) setUsers(data)
        setLoading(false)
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = (
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.user_metadata.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.user_metadata.surname?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        const matchesRole = !selectedRole || user.role === selectedRole
        return matchesSearch && matchesRole
    })

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
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
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Input
                            type="text"
                            placeholder="Kullanıcı ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedRole('student')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedRole === 'student'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4 inline-block mr-2" />
                            Öğrenciler
                        </button>
                        <button
                            onClick={() => setSelectedRole('teacher')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedRole === 'teacher'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <School className="w-4 h-4 inline-block mr-2" />
                            Öğretmenler
                        </button>

                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Kullanıcı bulunamadı
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Ad Soyad</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">E-posta</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Rol</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Sınıf</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Kayıt Tarihi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">
                                                {user.user_metadata.name} {user.user_metadata.surname}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500">{user.email}</td>
                                        <td className="p-4">
                                            <Badge variant={roleTypes[user.role].color}>
                                                <RoleIcon role={user.role} />
                                                {roleTypes[user.role].label}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {user.grade?.name || '-'}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {formatDate(user.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
} 