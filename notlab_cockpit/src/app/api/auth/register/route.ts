import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const formData = await request.json()
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

        // Auth ile kullanıcı oluştur
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                }
            }
        })

        if (signUpError) throw signUpError

        if (authData.user) {
            // Profil bilgilerini insert et
            const { data: gradeData, error: gradeError } = await supabase
                .from('grades')
                .select('id')
                .eq('grade_number', formData.grade)
                .single();

            if (gradeError) {
                return NextResponse.json(
                    { error: 'Sınıf seviyesi bulunamadı' },
                    { status: 400 }
                );
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                    user_id: authData.user.id,
                    full_name: formData.fullName,
                    grade: gradeData.id,
                    school_number: formData.schoolNumber,
                    role: 'student'
                })
                .select()
                .single();

            if (profileError) {
                console.error('Profile error:', profileError)
                // Profil oluşturulamazsa auth user'ı da sil
                await supabase.auth.admin.deleteUser(authData.user.id)
                throw profileError
            }
        }

        return NextResponse.json({
            message: 'Kayıt başarılı',
            redirectUrl: '/login'
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : 'Kayıt işlemi başarısız'
            },
            { status: 400 }
        )
    }
} 