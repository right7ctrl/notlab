'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Form şeması
const registerSchema = z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir email adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    confirmPassword: z.string(),
    grade: z.number().min(9, 'Lütfen sınıf seçiniz').max(12, 'Lütfen sınıf seçiniz'),
    terms: z.boolean().refine(val => val === true, 'Kullanım şartlarını kabul etmelisiniz')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

type Grade = {
    id: string
    name: string
}

export default function RegisterPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [grades, setGrades] = useState<Grade[]>([])
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        grade_id: '',
        role: 'student' as 'student' | 'teacher'
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    })

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

    const onSubmit = async (data: RegisterForm) => {
        try {
            setIsLoading(true)
            setError(null)
            setSuccess(null)

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message)
            }

            setSuccess(result.message)
            // Role göre yönlendirme
            setTimeout(() => {
                router.push('/student') // Yeni kayıtlar varsayılan olarak öğrenci olacak
            }, 3000)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white relative flex">
            {/* Sol Taraf - Kayıt Formu */}
            <div className="w-full lg:w-1/2 p-4 flex items-center justify-center relative">
                {/* Geri dön butonu */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-8 left-8"
                >
                    <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-blue-600"
                        asChild
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Ana Sayfaya Dön
                        </Link>
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8"
                >
                    {/* Logo ve Başlık */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* ... SVG paths aynı ... */}
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">NotLab'e Hoş Geldiniz</h1>
                        <p className="text-gray-600 mt-2">Yeni bir hesap oluşturun</p>
                    </div>

                    {/* Kayıt Formu */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                {...register('firstName')}
                                label="Ad"
                                placeholder="Adınız"
                                error={errors.firstName?.message}
                            />
                            <Input
                                {...register('lastName')}
                                label="Soyad"
                                placeholder="Soyadınız"
                                error={errors.lastName?.message}
                            />
                        </div>

                        <Input
                            {...register('email')}
                            type="email"
                            label="E-posta Adresi"
                            placeholder="ornek@email.com"
                            error={errors.email?.message}
                        />

                        <Input
                            {...register('password')}
                            type="password"
                            label="Şifre"
                            placeholder="••••••••"
                            error={errors.password?.message}
                        />

                        <Input
                            {...register('confirmPassword')}
                            type="password"
                            label="Şifre Tekrar"
                            placeholder="••••••••"
                            error={errors.confirmPassword?.message}
                        />

                        <Select
                            {...register('grade', { valueAsNumber: true })}
                            label="Sınıf"
                            error={errors.grade?.message}
                            options={[
                                { value: '', label: 'Sınıfınızı seçin' },
                                { value: '4c9b19a8-38cf-421c-b51f-4b423aac8399', label: '9. Sınıf' },
                                { value: '41f93dd0-d7dc-438f-9aea-2eaf68e20d3d', label: '10. Sınıf' },
                                { value: 'd29b6c97-1fce-44cd-8ce2-10c39e87ab4b', label: '11. Sınıf' },
                                { value: '81c53498-21a5-4329-8bd6-1dce49e74ab2', label: '12. Sınıf' }
                            ]}
                        />

                        <div className="flex items-center">
                            <input
                                {...register('terms')}
                                type="checkbox"
                                id="terms"
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                <span>Kullanım şartlarını ve </span>
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                                    gizlilik politikasını
                                </Link>
                                <span> kabul ediyorum</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Kaydediliyor...
                                </div>
                            ) : (
                                'Hesap Oluştur'
                            )}
                        </Button>
                    </form>

                    {/* Giriş Linki */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Zaten hesabınız var mı?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Giriş yapın
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Sağ Taraf - Dekoratif Bölüm */}
            <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Dekoratif şekiller */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 -right-10 w-[500px] h-[500px] bg-blue-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                    <div className="absolute -bottom-8 -left-10 w-[500px] h-[500px] bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* İçerik */}
                <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-12 h-12 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2L2 7L12 12L22 7L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M2 17L12 22L22 17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M2 12L12 17L22 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Öğrenme Yolculuğunuz Başlıyor
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-md">
                            NotLab'e katılarak geleceğin eğitim teknolojilerine şimdiden erişin ve öğrenme deneyiminizi dönüştürün.
                        </p>
                    </motion.div>

                    {/* Özellik listesi */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4 text-left"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-600">{feature}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Bonus Bilgi */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100/50"
                    >
                        <p className="text-gray-600 text-sm">
                            <span className="font-semibold text-blue-600">Bonus: </span>
                            Hemen üye olun, ilk ayınızı ücretsiz kullanın ve premium özelliklere erişin!
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

const features = [
    "Kişiselleştirilmiş öğrenme deneyimi",
    "Yapay zeka destekli eğitim asistanı",
    "7/24 canlı destek",
    "500+ interaktif ders içeriği",
    "Başarı takip sistemi"
] 