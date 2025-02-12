'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAdminLayout } from '../../layout'

export default function NewAdminPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    })

    useEffect(() => {
        setTitle('Yeni Yönetici')
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Yeni kullanıcı oluştur
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            })

            if (authError) throw authError

            // 2. Profil bilgilerini güncelle
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    role: 'admin'
                })
                .eq('id', authData.user!.id)

            if (profileError) throw profileError

            router.push('/admin/admins')
        } catch (error) {
            console.error('Error creating admin:', error)
            alert('Yönetici oluşturulurken bir hata oluştu')
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

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <Input
                        label="Ad"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        required
                    />

                    <Input
                        label="Soyad"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        required
                    />

                    <Input
                        type="email"
                        label="E-posta"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Input
                        type="password"
                        label="Şifre"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                    />

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
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Oluşturuluyor...' : 'Yönetici Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 