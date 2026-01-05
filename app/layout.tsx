// This root layout is required by Next.js but is mostly empty
// The actual layout is in app/[locale]/layout.tsx
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
