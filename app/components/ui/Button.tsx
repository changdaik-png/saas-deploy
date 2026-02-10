import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "secondary";
    size?: "sm" | "md" | "lg" | "icon";
    href?: string;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export default function Button({
    children,
    className = "",
    variant = "primary",
    size = "md",
    href,
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark active:scale-[0.98]";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
        secondary: "bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm border border-slate-200 dark:border-slate-600",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-base",
        icon: "p-2 w-10 h-10",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`;

    const content = (
        <>
            {isLoading && (
                <span className="material-icons animate-spin text-sm mr-2">sync</span>
            )}
            {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button className={classes} disabled={isLoading || props.disabled} {...props}>
            {content}
        </button>
    );
}
