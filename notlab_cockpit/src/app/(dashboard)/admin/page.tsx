'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminDashboard() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (profile?.role !== 'admin') {
                router.push('/dashboard')
            }
        }

        checkUser()
    }, [router, supabase])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Paneli</h1>
            {/* Admin paneli içeriği */}
        </div>
    )
} 