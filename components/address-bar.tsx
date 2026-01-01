"use client";

interface AddressBarProps {
    className?: string;
    onSubmit?: (value: string) => void;
}

export default function AddressBar({ className, onSubmit }: AddressBarProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const address = formData.get("address");

        onSubmit?.(address ? address?.toString() : "");
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1">
                            <input
                                name="address"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-inner"
                                placeholder="Search or type a URL..."
                            />
                        </div>
                        <button className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white font-bold">
                            Go
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
