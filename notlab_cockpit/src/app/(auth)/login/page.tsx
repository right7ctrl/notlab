'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
    email: z.string().email('Geçerli bir email adresi giriniz'),
    password: z.string().min(1, 'Şifre gereklidir')
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        try {
            // Supabase giriş işlemi burada yapılacak
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
                    <h2 className="text-center text-3xl font-bold">Giriş Yap</h2>
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
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    )
} 