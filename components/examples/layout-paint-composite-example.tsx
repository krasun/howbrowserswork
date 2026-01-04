"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/button";

type Stage = "layout" | "paint" | "composite";

type StageConfig = {
    id: Stage;
    title: string;
    description: string;
};

const stages: StageConfig[] = [
    {
        id: "layout",
        title: "Layout",
        description: "Reflow sizes + positions",
    },
    {
        id: "paint",
        title: "Paint",
        description: "Fill pixels into layers",
    },
    {
        id: "composite",
        title: "Composite",
        description: "Stitch layers on the GPU",
    },
];

const colors = ["#e2e8f0", "#38bdf8", "#fb923c"];
const widths = [200, 260, 320];

export default function LayoutPaintCompositeExample() {
    const [colorIndex, setColorIndex] = useState(0);
    const [widthIndex, setWidthIndex] = useState(0);
    const [activeStages, setActiveStages] = useState<Stage[]>([]);
    const [status, setStatus] = useState(
        "Click a change to see which stages rerun."
    );
    const timeoutRef = useRef<number | null>(null);

    const highlightStages = (nextStages: Stage[], message: string) => {
        setActiveStages(nextStages);
        setStatus(message);
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            setActiveStages([]);
        }, 1400);
    };

    const handleColorChange = () => {
        setColorIndex((prev) => (prev + 1) % colors.length);
        highlightStages(["paint"], "Reruns: paint.");
    };

    const handleWidthChange = () => {
        setWidthIndex((prev) => (prev + 1) % widths.length);
        highlightStages(["layout", "paint"], "Reruns: layout, then paint.");
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const isActive = (stage: Stage) => activeStages.includes(stage);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={handleColorChange}>
                        Change color
                    </Button>
                    <Button
                        onClick={handleWidthChange}
                        className="bg-slate-900"
                    >
                        Change width
                    </Button>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                    {status}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    {stages.map((stage) => {
                        const active = isActive(stage.id);
                        return (
                            <div
                                key={stage.id}
                                className={[
                                    "rounded-xl border px-3 py-2 text-sm transition-all",
                                    active
                                        ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm animate-pulse"
                                        : "border-slate-200 text-slate-600",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <div className="font-semibold">
                                    {stage.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {stage.description}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-500">
                        DOM preview
                    </div>
                    <div className="mt-3 flex justify-center sm:justify-start">
                        <div
                            className="max-w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-300"
                            style={{
                                width: widths[widthIndex],
                                maxWidth: "100%",
                                backgroundColor: colors[colorIndex],
                            }}
                        >
                            <div className="font-semibold">Hero card</div>
                            <div className="text-xs text-slate-700">
                                Width: {widths[widthIndex]}px
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-slate-500">
                    Composite always blends layers into the final frame.
                </div>
            </div>
        </div>
    );
}
