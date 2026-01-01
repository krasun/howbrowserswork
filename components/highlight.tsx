const variants = {
    blue: "bg-blue-100 text-blue-600",
    slate: "bg-slate-100 text-slate-600 ",
};

interface HighlightProps {
    children: React.ReactNode;
    variant: keyof typeof variants;
}

export default function Highlight({ children, variant }: HighlightProps) {
    return (
        <span
            className={
                "whitespace-nowrap break-keep px-2 py-1 text-sm rounded-md font-mono " +
                (variants[variant] || "")
            }
        >
            {children}
        </span>
    );
}
