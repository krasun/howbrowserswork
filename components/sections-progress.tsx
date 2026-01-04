"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SectionsProgressContextValue = {
    activeSectionId: string | null;
};

const SectionsProgressContext =
    createContext<SectionsProgressContextValue | null>(null);

export function SectionsProgressProvider({
    sectionIds,
    children,
}: {
    sectionIds: string[];
    children: React.ReactNode;
}) {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(
        sectionIds[0] ?? null
    );
    useEffect(() => {
        if (!sectionIds.length) return;
        let frame = 0;

        const updateActiveSection = () => {
            const offset = window.innerHeight * 0.25;
            let current: string | null = null;
            let lastAbove: string | null = null;
            let nextBelow: string | null = null;
            const atBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 4;

            if (atBottom) {
                setActiveSectionId(
                    sectionIds[sectionIds.length - 1] ?? null
                );
                return;
            }

            for (const id of sectionIds) {
                const element = document.querySelector<HTMLElement>(
                    `[data-section-id="${id}"]`
                );
                if (!element) continue;
                const rect = element.getBoundingClientRect();
                const top = rect.top - offset;
                const bottom = rect.bottom - offset;

                if (top <= 0) {
                    lastAbove = id;
                }
                if (top <= 0 && bottom > 0) {
                    current = id;
                    break;
                }
                if (top > 0 && !nextBelow) {
                    nextBelow = id;
                }
            }

            setActiveSectionId(
                current ?? nextBelow ?? lastAbove ?? sectionIds[0] ?? null
            );
        };

        const handleScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                updateActiveSection();
            });
        };

        updateActiveSection();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [sectionIds]);

    const value = useMemo(
        () => ({
            activeSectionId,
        }),
        [activeSectionId]
    );

    return (
        <SectionsProgressContext.Provider value={value}>
            {children}
        </SectionsProgressContext.Provider>
    );
}

export function useSectionsProgress() {
    const context = useContext(SectionsProgressContext);
    if (!context) {
        return {
            activeSectionId: null,
        };
    }
    return context;
}
