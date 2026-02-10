import Link from "next/link";

interface LogoProps {
    href?: string;
    className?: string;
    iconSize?: string;
    textSize?: string;
}

export default function Logo({
    href = "/",
    className = "",
    iconSize = "text-xl",
    textSize = "text-xl",
}: LogoProps) {
    const content = (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                <span className={`material-icons text-white ${iconSize}`}>cloud_queue</span>
            </div>
            <span className={`font-bold tracking-tight ${textSize}`}>CloudNote</span>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}
