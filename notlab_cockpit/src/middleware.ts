import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Auth sayfalarına gidiyorsa ve oturum açıksa, ana sayfaya yönlendir
    if (request.nextUrl.pathname.startsWith('/auth/') && session) {
        return NextResponse.redirect(new URL('/student', request.url))
    }

    // Korumalı sayfalara gidiyorsa ve oturum kapalıysa, login'e yönlendir
    if ((request.nextUrl.pathname.startsWith('/student') || 
         request.nextUrl.pathname.startsWith('/admin')) && 
        !session) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Kullanıcının rolünü kontrol et
    if (session) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        // Admin paneline erişim kontrolü
        if (request.nextUrl.pathname.startsWith('/admin')) {
            if (profile?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        // Öğrenci paneline erişim kontrolü
        if (request.nextUrl.pathname.startsWith('/student')) {
            if (profile?.role !== 'student') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    return res
}

// Middleware'in çalışacağı path'ler
export const config = {
    matcher: [
        '/auth/:path*',
        '/admin/:path*',
        '/student/:path*'
    ]
} 