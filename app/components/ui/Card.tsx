import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
}

export default function Card({
    children,
    className = "",
    onClick,
    hoverEffect = false,
}: CardProps) {
    const baseStyles =
        "bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm p-4";
    const hoverStyles = hoverEffect
        ? "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer hover:border-primary/50"
        : "";

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
}
