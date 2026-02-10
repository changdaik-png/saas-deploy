import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    error?: string;
    helperText?: string;
}

export default function Input({
    label,
    leftIcon,
    rightIcon,
    error,
    helperText,
    className = "",
    type = "text",
    id,
    ...props
}: InputProps) {
    const baseStyles =
        "w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const paddingLeft = leftIcon ? "pl-10" : "pl-4";
    const paddingRight = rightIcon ? "pr-10" : "pr-4";

    const classes = `${baseStyles} ${paddingLeft} ${paddingRight} ${error ? "border-red-500 focus:ring-red-500" : ""
        } ${className}`;

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    className={classes}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1" id={`${id}-error`}>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-xs text-slate-500 mt-1" id={`${id}-helper`}>
                    {helperText}
                </p>
            )}
        </div>
    );
}
