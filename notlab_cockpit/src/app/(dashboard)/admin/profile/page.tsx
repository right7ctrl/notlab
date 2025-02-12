'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAdminLayout } from '../layout'

type Profile = {
    first_name: string | null
    last_name: string | null
    email: string
}

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { setTitle } = useAdminLayout()
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        setTitle('Profil')
        loadProfile()
    }, [])

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('first_name, last_name, email')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
                setFormData(prev => ({
                    ...prev,
                    first_name: data.first_name || '',
                    last_name: data.last_name || ''
                }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Kullanıcı bulunamadı')

            // Profil bilgilerini güncelle
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            // Şifre değişikliği varsa
            if (formData.currentPassword && formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Yeni şifreler eşleşmiyor')
                }

                const { error: passwordError } = await supabase.auth.updateUser({
                    password: formData.newPassword
                })

                if (passwordError) throw passwordError
            }

            alert('Profil başarıyla güncellendi')
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert(error instanceof Error ? error.message : 'Profil güncellenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">


            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Profil Bilgileri</h3>
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
                        {profile && (
                            <Input
                                label="E-posta"
                                value={profile.email}
                                disabled
                            />
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Şifre Değiştir</h3>
                        <Input
                            type="password"
                            label="Mevcut Şifre"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        />
                        <Input
                            type="password"
                            label="Yeni Şifre"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            minLength={6}
                        />
                        <Input
                            type="password"
                            label="Yeni Şifre (Tekrar)"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            minLength={6}
                        />
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
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Güncelleniyor...' : 'Güncelle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 