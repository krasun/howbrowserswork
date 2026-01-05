"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "../button";
import { useTranslations } from "next-intl";

const getHtmlLines = (title: string, description: string, linkText: string) => [
    "<!doctype html>",
    "<html>",
    "  <head>",
    `    <title>${title}</title>`,
    "  </head>",
    "  <body>",
    "    <main>",
    `      <h1 style="color: red;">${title}</h1>`,
    `      <p>${description}</p>`,
    `      <p>
             <a href="https://example.com">${linkText}</a>
           </p>`,
    "    </main>",
    "  </body>",
    "</html>",
];

const getDomLines = (title: string, description: string, linkText: string) => [
    "Document",
    "|- <!doctype html>",
    "`- html",
    "   |- head",
    "   |  `- title",
    `   |     \`- "${title}"`,
    "   `- body",
    "      `- main",
    "         |- h1 (style: color: red)",
    `         |  \`- "${title}"`,
    "         |- p",
    `         |  \`- "${description}"`,
    "         `- p",
    `            \`- a (href="https://example.com")`,
    `               \`- "${linkText}"`,
];

const domLineProgress = [2, 3, 4, 6, 6, 7, 8, 10, 12, 15, 15, 15, 15];
const stepDurationMs = 900;

export default function ParsingHtmlIntoDomTreeExample() {
    const t = useTranslations("examples.parsingHtml");
    
    const htmlLines = useMemo(
        () => getHtmlLines(t("exampleTitle"), t("exampleDescription"), t("exampleLink")),
        [t]
    );
    
    const domLines = useMemo(
        () => getDomLines(t("exampleTitle"), t("exampleDescription"), t("exampleLink")),
        [t]
    );
    
    const [activeLineIndex, setActiveLineIndex] = useState(-1);
    const [isParsing, setIsParsing] = useState(false);

    useEffect(() => {
        if (!isParsing || activeLineIndex < 0) {
            return;
        }

        if (activeLineIndex >= htmlLines.length - 1) {
            setIsParsing(false);
            return;
        }

        const timeout = window.setTimeout(() => {
            setActiveLineIndex((current) =>
                Math.min(current + 1, htmlLines.length - 1)
            );
        }, stepDurationMs);

        return () => window.clearTimeout(timeout);
    }, [activeLineIndex, isParsing, htmlLines]);

    const visibleDomLines =
        activeLineIndex >= 0 ? domLineProgress[activeLineIndex] ?? 0 : 0;

    const handleParse = () => {
        setActiveLineIndex(0);
        setIsParsing(true);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold tracking-wide text-slate-400">
                        <span>{t("htmlStream")}</span>
                        <Button
                            className="bg-slate-900 text-white"
                            onClick={handleParse}
                            disabled={isParsing}
                        >
                            {isParsing ? t("parsing") : t("parse")}
                        </Button>
                    </div>
                    <pre className="w-full whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-2 text-left font-mono text-xs text-slate-700">
                        <code>
                            {htmlLines.map((line, index) => {
                                const isActive =
                                    isParsing && index === activeLineIndex;
                                const isRead =
                                    activeLineIndex >= 0 &&
                                    index <= activeLineIndex;
                                return (
                                    <span
                                        key={`${line}-${index}`}
                                        className={`block rounded px-2 py-0.5 transition-colors duration-300 ${
                                            isActive
                                                ? "bg-slate-200 text-slate-900"
                                                : isRead
                                                ? "text-slate-500"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {line}
                                    </span>
                                );
                            })}
                        </code>
                    </pre>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="mb-2 text-xs font-semibold tracking-wide text-slate-400">
                        The DOM tree
                    </div>
                    <pre className="w-full whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-2 text-left font-mono text-xs text-slate-700">
                        <code>
                            {domLines.map((line, index) => {
                                const isVisible = index < visibleDomLines;
                                return (
                                    <span
                                        key={`${line}-${index}`}
                                        className={`block overflow-hidden transition-all duration-500 ${
                                            isVisible
                                                ? "max-h-24 opacity-100 translate-x-0"
                                                : "max-h-0 opacity-0 -translate-x-2"
                                        }`}
                                    >
                                        {line}
                                    </span>
                                );
                            })}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
