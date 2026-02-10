import { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success" | "warning" | "info";
    className?: string;
}

export default function Badge({
    children,
    variant = "primary",
    className = "",
}: BadgeProps) {
    const baseStyles = "inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset uppercase tracking-wider";

    const variants = {
        primary: "bg-primary/10 text-primary ring-primary/20",
        secondary: "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
        outline: "bg-transparent text-slate-600 ring-slate-500/20 dark:text-slate-400 dark:ring-slate-700",
        ghost: "bg-transparent text-slate-600 dark:text-slate-400 ring-0",
        success: "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/20",
        warning: "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-500 dark:ring-yellow-500/20",
        destructive: "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/20",
        info: "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-500/20",
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
