"use client";

import { useEffect, useMemo, useState } from "react";
import AddressBar from "../address-bar";

interface UrlToHttpExampleProps {
    onHostChange?: (host: string) => void;
}

const isValidHttpUrl = (value: string) => {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};

const formatHttpRequest = (url: URL) => {
    const path = `${url.pathname || "/"}${url.search}`;
    return [
        `GET ${path} HTTP/1.1`,
        `Host: ${url.host}`,
        "Accept: text/html",
    ].join("\n");
};

export default function UrlToHttpExample({ onHostChange }: UrlToHttpExampleProps) {
    const [inputValue, setInputValue] = useState("https://example.com");
    const [outputValue, setOutputValue] = useState("");
    const [animateResult, setAnimateResult] = useState(false);

    const trimmedValue = inputValue.trim();
    const isValid = useMemo(
        () => trimmedValue.length > 0 && isValidHttpUrl(trimmedValue),
        [trimmedValue]
    );
    const isInvalid = trimmedValue.length > 0 && !isValid;

    const handleSubmit = (value: string) => {
        const trimmed = value.trim();
        if (!isValidHttpUrl(trimmed)) {
            return;
        }

        const parsed = new URL(trimmed);
        setOutputValue(formatHttpRequest(parsed));
        onHostChange?.(parsed.host);
    };

    useEffect(() => {
        if (!outputValue) return;
        setAnimateResult(false);
        const id = window.setTimeout(() => setAnimateResult(true), 30);
        return () => window.clearTimeout(id);
    }, [outputValue]);

    return (
        <div className="space-y-4">
            <AddressBar
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                isInvalid={isInvalid}
                isSubmitDisabled={!isValid}
            />
            {outputValue ? (
                <div
                    className={[
                        "flex flex-col  gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 transition-all duration-500",
                        animateResult
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-0",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <div className="tracking-wide text-slate-400">
                        An HTTP request sent:
                    </div>
                    <pre className="w-full whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-2 text-left font-mono text-sm text-slate-700">
                        {outputValue}
                    </pre>
                </div>
            ) : (
                <div className="text-sm text-slate-400">
                    Enter a full URL like https://example.com.
                </div>
            )}
        </div>
    );
}
