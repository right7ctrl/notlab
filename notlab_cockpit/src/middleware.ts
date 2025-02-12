import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Kullanıcının rolünü kontrol et
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

    // Admin paneline erişim kontrolü
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (profile?.role !== 'admin') {
            // Admin değilse ana sayfaya yönlendir
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Öğrenci paneline erişim kontrolü
    if (request.nextUrl.pathname.startsWith('/student')) {
        if (profile?.role !== 'student') {
            // Öğrenci değilse ana sayfaya yönlendir
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return res
}

// Middleware'in çalışacağı path'ler
export const config = {
    matcher: [
        '/admin/:path*',
        '/student/:path*'
    ]
} 