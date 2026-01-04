"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../button";

const previewMarkup = `
  <div data-box style="border:1px solid #e2e8f0;border-radius:12px;padding:14px;background:#ffffff;">
    <div data-title style="font-weight:600;color:#0f172a;">DOM preview</div>
  </div>
`;

const initialCode = `const box = root.querySelector("[data-box]");
const title = root.querySelector("[data-title]");

if (box) {
  box.style.background = "#0f172a";
  box.style.borderColor = "#38bdf8";
}

if (title) {
  title.textContent = "Updated by JS";
  title.style.color = "#f8fafc";
}`;

type ErrorState = {
    type: "parse" | "runtime";
    message: string;
} | null;

export default function DomImportanceExample() {
    const [code, setCode] = useState(initialCode);
    const [error, setError] = useState<ErrorState>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const runCode = useCallback((source: string) => {
        setError(null);

        let compiled: (root: HTMLElement) => void;
        try {
            compiled = new Function("root", source) as (
                root: HTMLElement
            ) => void;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown parse error.";
            setError({ type: "parse", message });
            return;
        }

        const root = previewRef.current;
        if (!root) {
            return;
        }

        root.innerHTML = previewMarkup;

        try {
            compiled(root);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown runtime error.";
            setError({ type: "runtime", message });
        }
    }, []);

    useEffect(() => {
        runCode(initialCode);
    }, [runCode]);

    const handleRun = () => {
        runCode(code);
    };

    return (
        <div className="rounded-2xl border border-slate-900 bg-black p-5 text-white">
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-300">
                            Editable JavaScript
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={handleRun}
                                className="bg-white text-black"
                            >
                                Run
                            </Button>
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        spellCheck={false}
                        className="min-h-[220px] w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-xs text-white outline-none ring-0 transition focus:border-slate-500"
                    />
                    {error ? (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                            {error.type === "parse"
                                ? "Parse error: "
                                : "Runtime error: "}
                            {error.message}
                        </div>
                    ) : null}
                </div>
                <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-300">
                        Live DOM preview
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900">
                        <div ref={previewRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
