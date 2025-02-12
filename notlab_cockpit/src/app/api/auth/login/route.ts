import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const formData = await request.json()
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (signInError) throw signInError

        // Kullanıcının rolünü kontrol et
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('email', formData.email)
            .single()

        // Role göre yönlendirme URL'i belirle
        let redirectUrl = '/'
        if (profile) {
            switch (profile.role) {
                case 'admin':
                    redirectUrl = '/admin'
                    break
                case 'student':
                    redirectUrl = '/student'
                    break
                case 'teacher':
                    redirectUrl = '/teacher'
                    break
            }
        }

        return NextResponse.json({
            message: 'Giriş başarılı',
            redirectUrl
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : 'Giriş yapılamadı'
            },
            { status: 400 }
        )
    }
} 