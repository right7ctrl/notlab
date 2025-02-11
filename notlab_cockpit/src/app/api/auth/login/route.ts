import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        const supabase = createRouteHandlerClient({ cookies })

        const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (authError) throw authError

        // Kullanıcı rolünü kontrol et
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session?.user.id)
            .single()

        // Role göre yönlendirme URL'i
        let redirectUrl = '/dashboard'
        if (profile?.role === 'admin') {
            redirectUrl = '/admin'
        } else if (profile?.role === 'teacher') {
            redirectUrl = '/teacher'
        } else if (profile?.role === 'student') {
            redirectUrl = '/student'
        }

        return NextResponse.json({ redirectUrl })
    } catch (error) {
        return NextResponse.json(
            { message: 'Giriş yapılamadı' },
            { status: 401 }
        )
    }
} 