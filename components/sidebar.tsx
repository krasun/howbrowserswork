"use client";

import { useSectionsProgress } from "@/components/sections-progress";

type SectionSummary = {
    id: string;
    title: string;
};

export default function Sidebar({
    sections,
    showTitle = true,
    onNavigate,
    className,
}: {
    sections: SectionSummary[];
    showTitle?: boolean;
    onNavigate?: () => void;
    className?: string;
}) {
    const { activeSectionId } = useSectionsProgress();

    return (
        <aside
            className={["w-full lg:w-80 lg:shrink-0", className]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="lg:sticky lg:top-16">
                {showTitle ? (
                    <p className=" text-slate-400 font-semibold font-serif">
                        Contents
                    </p>
                ) : null}
                <ul className="mt-4 space-y-2">
                    {sections.map((section) => {
                        const isActive = activeSectionId === section.id;
                        const linkClasses = ["block transition-colors"]
                            .filter(Boolean)
                            .join(" ");

                        return (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    className={linkClasses}
                                    aria-current={isActive ? "true" : undefined}
                                    onClick={onNavigate}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span
                                            className={[
                                                "leading-5",
                                                isActive
                                                    ? "text-slate-800"
                                                    : "text-slate-500",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            {section.title}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
