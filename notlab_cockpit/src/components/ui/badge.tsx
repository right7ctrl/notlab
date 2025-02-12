import { cn } from "@/lib/utils"

type BadgeProps = {
    children: React.ReactNode
    variant?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange'
    className?: string
}

const variantStyles = {
    gray: 'bg-gray-100 text-gray-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700'
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
            variantStyles[variant],
            className
        )}>
            {children}
        </span>
    )
} 