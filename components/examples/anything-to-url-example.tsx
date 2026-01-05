"use client";

import { useEffect, useState } from "react";
import AddressBar from "../address-bar";
import Highlight from "../highlight";
import { useTranslations } from "next-intl";

type TransformKind = "search" | "url" | "direct";

const buildUrl = (value: string): { url: string; kind: TransformKind } => {
    const trimmed = value.trim();
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const hasSpace = /\s/.test(trimmed);
    const looksLikeDomain = trimmed.includes(".") && !hasSpace;

    if (hasProtocol) {
        return { url: trimmed, kind: "direct" };
    }

    if (looksLikeDomain) {
        return { url: `https://${trimmed}`, kind: "url" };
    }

    return {
        url: `https://google.com/search?q=${encodeURIComponent(trimmed)}`,
        kind: "search",
    };
};

export default function AnythingToUrlExample() {
    const t = useTranslations("examples.anythingToUrl");
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");
    const [transformKind, setTransformKind] = useState<TransformKind>("search");
    const [animateResult, setAnimateResult] = useState(false);

    const handleSubmit = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            setInputValue("");
            setOutputValue("");
            return;
        }

        const next = buildUrl(trimmed);
        setInputValue(trimmed);
        setOutputValue(next.url);
        setTransformKind(next.kind);
    };

    useEffect(() => {
        if (!outputValue) return;
        setAnimateResult(false);
        const id = window.setTimeout(() => setAnimateResult(true), 30);
        return () => window.clearTimeout(id);
    }, [outputValue]);

    const isSubmitDisabled = inputValue.trim().length === 0;

    return (
        <div className="space-y-4">
            <AddressBar
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                isSubmitDisabled={isSubmitDisabled}
            />
            {outputValue ? (
                <div
                    className={[
                        "flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 transition-all duration-500",
                        animateResult
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-0",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <div className="tracking-wide text-slate-400 break-words">
                        {transformKind === "direct"
                            ? t("sendsAsIs")
                            : t("transforms")}{" "}
                        {outputValue}
                    </div>
                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                        <Highlight variant="slate">
                            &quot;{inputValue}&quot;
                        </Highlight>
                        <span className="text-slate-400 sm:hidden">↓</span>
                        <span className="hidden text-slate-400 sm:inline">
                            →
                        </span>
                        <Highlight variant="blue">{outputValue}</Highlight>
                    </div>
                    <div className="text-slate-400 break-words">
                        {transformKind === "search"
                            ? t("searchQuery")
                            : transformKind === "url"
                            ? t("directUrl")
                            : t("noTransform")}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-slate-400">
                    {t("placeholder")}
                </div>
            )}
        </div>
    );
}
