'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, Plus, Shield, Mail, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAdminLayout } from '../layout'
import { Badge } from '@/components/ui/badge'

type Admin = {
    id: string
    first_name: string | null
    last_name: string | null
    email: string
    role: string
    created_at: string
    updated_at: string
    last_sign_in_at: string | null
}

export default function AdminsPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        setTitle('Yöneticiler')
        loadAdmins()
    }, [])

    const loadAdmins = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'admin')
            .order('created_at', { ascending: false })

        if (data) setAdmins(data)
        setLoading(false)
    }

    const filteredAdmins = admins.filter(admin =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (admin.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (admin.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
                <div className="relative flex-1 max-w-md">
                    <Input
                        type="text"
                        placeholder="Yönetici ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                    onClick={() => router.push('/admin/admins/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="h-5 w-5" />
                    Yeni Yönetici
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {filteredAdmins.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Yönetici bulunamadı
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Ad Soyad</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">E-posta</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Kayıt Tarihi</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Son Giriş</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <Shield className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    {admin.first_name || 'İsimsiz'} {admin.last_name || ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Mail className="h-4 w-4" />
                                                {admin.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(admin.created_at)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {admin.last_sign_in_at ? formatDate(admin.last_sign_in_at) : '-'}
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={admin.last_sign_in_at ? 'green' : 'gray'}>
                                                {admin.last_sign_in_at ? 'Aktif' : 'Pasif'}
                                            </Badge>
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