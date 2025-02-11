import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string
    label?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <select
                    className={cn(
                        "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select } 