export default function ExampleContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="py-4">{children}</div>;
}
