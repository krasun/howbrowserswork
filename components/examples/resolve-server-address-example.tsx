"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dnsFixtures } from "@/components/fixtures";

const normalizeHost = (value: string) => {
    const trimmed = value.trim();
    const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
    const hostOnly = withoutProtocol.split(/[/?#]/)[0] ?? "";
    return hostOnly.replace(/[^a-z0-9.-]/gi, "");
};

const isValidHost = (value: string) =>
    /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))*$/i.test(value);

export default function ResolveServerAddressExample() {
    const [host, setHost] = useState("example.com");
    const [isLoading, setIsLoading] = useState(false);
    const [ips, setIps] = useState<string[]>([]);
    const [error, setError] = useState("");
    const timeoutRef = useRef<number | null>(null);

    const normalizedHost = useMemo(() => normalizeHost(host), [host]);
    const isValid = normalizedHost.length > 0 && isValidHost(normalizedHost);

    const handleChange = (value: string) => {
        setHost(normalizeHost(value));
        setIps([]);
        setError("");
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValid) {
            setIps([]);
            setError("Invalid host name.");
            return;
        }

        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        setIsLoading(true);
        setError("");
        timeoutRef.current = window.setTimeout(() => {
            const records = dnsFixtures[normalizedHost] ?? [];
            setIps(records);
            if (records.length === 0) {
                setError("No A records found.");
            }
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-sm">
            <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">
                Terminal
            </div>
            <form
                className="flex items-center gap-2 font-mono"
                onSubmit={handleSubmit}
            >
                <span className="text-slate-400">$</span>
                <span>resolve</span>
                <input
                    value={normalizedHost}
                    onChange={(event) => handleChange(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    placeholder="example.com"
                    aria-label="Host name"
                />
            </form>
            <div className="mt-3 space-y-1 font-mono text-xs text-slate-300">
                {isLoading ? <div>;; resolving...</div> : null}
                {!isLoading && error ? (
                    <div className="text-red-300">{error}</div>
                ) : null}
                {!isLoading && !error && ips.length > 0
                    ? ips.map((ip) => (
                          <div key={ip}>
                              Name: {normalizedHost}{" "}
                              <span className="text-slate-500">&rarr;</span>{" "}
                              Address: {ip}
                          </div>
                      ))
                    : null}
            </div>
        </div>
    );
}
