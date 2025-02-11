import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Supabase client'ı doğru şekilde oluştur
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth kontrolleri
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Role bazlı kontroller
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Admin paneline sadece adminler erişebilir
    if (req.nextUrl.pathname.startsWith('/admin') && profile?.role !== 'admin') {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Öğretmen paneline sadece öğretmenler ve adminler erişebilir
    if (req.nextUrl.pathname.startsWith('/teacher') && 
        !['admin', 'teacher'].includes(profile?.role || '')) {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Giriş yapmış kullanıcılar login/register sayfalarına gidemez
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 