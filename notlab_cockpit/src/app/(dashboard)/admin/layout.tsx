'use client'

import { AdminSidebar } from '@/components/admin/sidebar'
import { createContext, useContext, useState } from 'react'

type AdminLayoutContextType = {
    setTitle: (title: string) => void
    title: string
}

export const AdminLayoutContext = createContext<AdminLayoutContextType>({
    setTitle: () => { },
    title: ''
})

export function useAdminLayout() {
    return useContext(AdminLayoutContext)
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [title, setTitle] = useState('')

    return (
        <AdminLayoutContext.Provider value={{ title, setTitle }}>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                <div className="flex-1">
                    <div className="h-14 bg-white border-b px-6 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </AdminLayoutContext.Provider>
    )
} 