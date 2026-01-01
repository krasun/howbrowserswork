const variants = {
    "quoted-string":
        "bg-slate-100 text-slate-600 px-2 py-1 text-sm rounded-md font-mono",
    url: "bg-blue-100 text-blue-600 px-2 py-1 text-sm rounded-md font-mono",
};

interface HighlightProps {
    children: React.ReactNode;
    variant: keyof typeof variants;
}

export default function Highlight({ children, variant }: HighlightProps) {
    return <span className={variants[variant] ?? ""}>{children}</span>;
}
