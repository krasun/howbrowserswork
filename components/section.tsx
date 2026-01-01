export default function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col space-y-4">
            <h2 className="font-serif text-2xl font-semibold leading-10 tracking-tight text-black">
                {title}
            </h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
