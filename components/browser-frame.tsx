import type { ReactNode } from "react";

interface BrowserFrameProps {
    url: string;
    children?: ReactNode;
    className?: string;
}

export default function BrowserFrame({
    url,
    children,
    className,
}: BrowserFrameProps) {
    return (
        <div
            className={[
                "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2">
                <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1">
                    <input
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-inner"
                        value={url}
                        readOnly
                        aria-label="Address bar"
                    />
                </div>
            </div>
            <div className="bg-white p-4">{children}</div>
        </div>
    );
}
