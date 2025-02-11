'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const registerSchema = z.object({
    email: z.string().email('Geçerli bir email adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    surname: z.string().min(2, 'Soyisim en az 2 karakter olmalıdır'),
    grade: z.string().min(1, 'Sınıf bilgisi gereklidir')
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            surname: '',
            grade: ''
        }
    })

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true)
        try {
            // Supabase kayıt işlemi burada yapılacak
            console.log(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-bold">Kayıt Ol</h2>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                {...form.register('email')}
                                type="email"
                                className="mt-1 block w-full rounded-md border p-2"
                                placeholder="ornek@email.com"
                            />
                            {form.formState.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Şifre
                            </label>
                            <input
                                {...form.register('password')}
                                type="password"
                                className="mt-1 block w-full rounded-md border p-2"
                            />
                            {form.formState.errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                İsim
                            </label>
                            <input
                                {...form.register('name')}
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                            />
                            {form.formState.errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium">
                                Soyisim
                            </label>
                            <input
                                {...form.register('surname')}
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                            />
                            {form.formState.errors.surname && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.surname.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium">
                                Sınıf
                            </label>
                            <select
                                {...form.register('grade')}
                                className="mt-1 block w-full rounded-md border p-2"
                            >
                                <option value="">Sınıf Seçiniz</option>
                                <option value="9">9. Sınıf</option>
                                <option value="10">10. Sınıf</option>
                                <option value="11">11. Sınıf</option>
                                <option value="12">12. Sınıf</option>
                            </select>
                            {form.formState.errors.grade && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.grade.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                </form>
            </div>
        </div>
    )
} 