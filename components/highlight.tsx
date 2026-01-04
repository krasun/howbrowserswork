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
                "whitespace-normal break-all px-2 py-1 text-sm rounded-md font-mono sm:whitespace-nowrap sm:break-keep " +
                (variants[variant] || "")
            }
        >
            {children}
        </span>
    );
}
