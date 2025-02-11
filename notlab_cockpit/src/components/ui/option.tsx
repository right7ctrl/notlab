'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export interface OptionProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    onDelete?: () => void
    canDelete?: boolean
}

const Option = forwardRef<HTMLTextAreaElement, OptionProps>(
    ({ className, label, onDelete, canDelete = false, ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                        {label}. Şık
                    </label>
                    {canDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <textarea
                    className={cn(
                        "flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)

Option.displayName = 'Option'

export { Option } 