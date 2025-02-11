'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"

// Form şeması
const loginSchema = z.object({
    email: z.string().email('Geçerli bir email adresi giriniz'),
    password: z.string().min(1, 'Şifre gereklidir'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message)
            }

            // Role göre yönlendirme
            router.push(result.redirectUrl)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Giriş yapılamadı')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white relative flex">
            {/* Sol Taraf - Giriş Formu */}
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
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">NotLab'e Hoş Geldiniz</h1>
                        <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
                    </div>

                    {/* Giriş Formu */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                    Beni hatırla
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                                Şifremi unuttum
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </Button>
                    </form>

                    {/* Kayıt Linki */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Hesabınız yok mu?{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Hemen kaydolun
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
                            Eğitimde Dijital Dönüşüm
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-md">
                            NotLab ile öğrenme deneyiminizi kişiselleştirin ve geleceğin eğitim teknolojileriyle tanışın.
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