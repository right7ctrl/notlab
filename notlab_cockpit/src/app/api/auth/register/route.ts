import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, role = 'admin', grade } = await req.json()

    const supabase = createRouteHandlerClient({ cookies })

    // Önce admin kontrolü yap
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (role !== 'student') {
      // Eğer öğretmen veya admin oluşturuluyorsa, isteği yapan kişinin admin olduğundan emin ol
      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session?.user.id)
        .single()

      if (!adminCheck || adminCheck.role !== 'admin') {
        return NextResponse.json(
          { message: 'Bu işlem için admin yetkisi gereklidir' },
          { status: 403 }
        )
      }
    }

    // Email ile kayıt
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
          grade: grade,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` // Email doğrulama için redirect URL'i
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { message: 'Kayıt sırasında bir hata oluştu: ' + authError.message },
        { status: 400 }
      )
    }

    // Kullanıcı profili oluştur
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user?.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: role,
          grade: grade,
        },
      ])

    if (profileError) {
      console.error('Profile error:', profileError)
      // Profil oluşturulamadıysa kullanıcıyı sil
      if (authData.user?.id) {
        await supabase.auth.admin.deleteUser(authData.user.id)
      }
      return NextResponse.json(
        { message: 'Profil oluşturulurken bir hata oluştu: ' + profileError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Kayıt başarılı! Email adresinize gönderilen doğrulama linkine tıklayarak hesabınızı aktifleştirebilirsiniz.',
        user: authData.user 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
} 