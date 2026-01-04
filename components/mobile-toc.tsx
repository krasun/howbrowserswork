"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useSectionsProgress } from "@/components/sections-progress";

type SectionSummary = {
    id: string;
    title: string;
};

export default function MobileToc({
    sections,
}: {
    sections: SectionSummary[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { activeSectionId } = useSectionsProgress();

    const activeTitle = useMemo(() => {
        return (
            sections.find((section) => section.id === activeSectionId)?.title ??
            "Contents"
        );
    }, [activeSectionId, sections]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    return (
        <div className="sticky top-0 z-40 -mx-6 lg:hidden sm:-mx-16">
            <div className="border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur sm:px-16">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                            Contents
                        </div>
                        <div className="truncate text-sm font-semibold text-slate-800">
                            {activeTitle}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                        aria-expanded={isOpen}
                        aria-controls="mobile-toc-panel"
                    >
                        {isOpen ? "Close" : "Menu"}
                        <span
                            aria-hidden="true"
                            className="relative h-3 w-4"
                        >
                            <span
                                className={[
                                    "absolute left-0 top-0 h-[2px] w-full rounded bg-slate-600 transition",
                                    isOpen
                                        ? "translate-y-[5px] rotate-45"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                            <span
                                className={[
                                    "absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded bg-slate-600 transition",
                                    isOpen ? "opacity-0" : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                            <span
                                className={[
                                    "absolute left-0 bottom-0 h-[2px] w-full rounded bg-slate-600 transition",
                                    isOpen
                                        ? "-translate-y-[5px] -rotate-45"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                        </span>
                    </button>
                </div>
            </div>
            <div
                id="mobile-toc-panel"
                aria-hidden={!isOpen}
                className={[
                    "overflow-hidden border-b border-slate-200 bg-white/95 px-6 backdrop-blur transition-[max-height,opacity] duration-300 sm:px-16",
                    isOpen
                        ? "max-h-[60vh] opacity-100"
                        : "max-h-0 opacity-0 pointer-events-none",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div className="max-h-[50vh] overflow-y-auto pb-4 pt-3 pr-2">
                    <Sidebar
                        sections={sections}
                        showTitle={false}
                        onNavigate={handleClose}
                    />
                </div>
            </div>
        </div>
    );
}
