"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/button";
import { useTranslations } from "next-intl";

const getSteps = (t: any) => [
    {
        label: "SYN",
        direction: "right",
        description: t("synDescription"),
        buttonLabel: t("sendFirstPacket"),
        packetName: "SYN",
        packetMeta: "seq=1000",
        clientSeq: 1000,
        clientAck: 0,
        serverSeq: 0,
        serverAck: 0,
    },
    {
        label: "SYN-ACK",
        direction: "left",
        description: t("synAckDescription"),
        buttonLabel: t("confirmClientPacket"),
        packetName: "SYN-ACK",
        packetMeta: "seq=5000 ack=1001",
        clientSeq: 1000,
        clientAck: 0,
        serverSeq: 5000,
        serverAck: 1001,
    },
    {
        label: "ACK",
        direction: "right",
        description: t("ackDescription"),
        buttonLabel: t("confirmServerPacket"),
        packetName: "ACK",
        packetMeta: "seq=1001 ack=5001",
        clientSeq: 1001,
        clientAck: 5001,
        serverSeq: 5000,
        serverAck: 1001,
    },
] as const;

type ConnectionState = "Disconnected" | "Connecting" | "Retrying" | "Connected";

type SequenceState = {
    clientSeq: number;
    clientAck: number;
    serverSeq: number;
    serverAck: number;
};

const initialSequence: SequenceState = {
    clientSeq: 0,
    clientAck: 0,
    serverSeq: 0,
    serverAck: 0,
};

export default function TcpHandshakeExample() {
    const t = useTranslations("examples.tcpHandshake");
    const steps = useMemo(() => getSteps(t), [t]);
    const [activeStep, setActiveStep] = useState(-1);
    const [connectionState, setConnectionState] =
        useState<ConnectionState>("Disconnected");
    const [packetPosition, setPacketPosition] = useState<number | null>(null);
    const [packetMeta, setPacketMeta] = useState("");
    const [packetName, setPacketName] = useState("");
    const [sequenceState, setSequenceState] =
        useState<SequenceState>(initialSequence);
    const [packetTick, setPacketTick] = useState(0);
    const packetTimeoutRef = useRef<number | null>(null);
    const statusTimeoutRef = useRef<number | null>(null);

    const clearTimers = () => {
        if (packetTimeoutRef.current) {
            window.clearTimeout(packetTimeoutRef.current);
            packetTimeoutRef.current = null;
        }
        if (statusTimeoutRef.current) {
            window.clearTimeout(statusTimeoutRef.current);
            statusTimeoutRef.current = null;
        }
    };

    const applyStepState = (stepIndex: number) => {
        const step = steps[stepIndex];
        setSequenceState({
            clientSeq: step.clientSeq,
            clientAck: step.clientAck,
            serverSeq: step.serverSeq,
            serverAck: step.serverAck,
        });
        setPacketMeta(step.packetMeta);
        setPacketName(step.packetName);
        setActiveStep(stepIndex);
        setPacketTick((prev) => prev + 1);
    };

    const handleConnect = () => {
        clearTimers();
        if (activeStep === -1) {
            setConnectionState("Connecting");
            applyStepState(0);
            return;
        }
        if (activeStep < steps.length - 1) {
            applyStepState(activeStep + 1);
            return;
        }
        setActiveStep(-1);
        setSequenceState(initialSequence);
        setPacketPosition(null);
        setPacketMeta("");
        setPacketName("");
        setConnectionState("Disconnected");
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    useEffect(() => {
        if (activeStep < 0) {
            setPacketPosition(null);
            setPacketMeta("");
            setPacketName("");
            return;
        }

        const step = steps[activeStep];
        const start = step.direction === "right" ? 18 : 82;
        const end = step.direction === "right" ? 82 : 18;
        setPacketPosition(start);
        if (packetTimeoutRef.current) {
            window.clearTimeout(packetTimeoutRef.current);
        }
        const startDelayMs = 180;
        const travelMs = 1400;
        packetTimeoutRef.current = window.setTimeout(() => {
            setPacketPosition(end);
        }, startDelayMs);
        if (activeStep === steps.length - 1) {
            statusTimeoutRef.current = window.setTimeout(() => {
                setConnectionState("Connected");
            }, startDelayMs + travelMs);
        }
    }, [activeStep, packetTick, steps]);

    const nextStepIndex = activeStep < 0 ? 0 : activeStep + 1;
    const nextStep = steps[nextStepIndex];
    const buttonLabel =
        activeStep < steps.length - 1 && nextStep
            ? `${nextStep.buttonLabel}`
            : t("disconnect");
    
    const getConnectionStateLabel = (state: ConnectionState) => {
        switch (state) {
            case "Disconnected": return t("disconnected");
            case "Connecting": return t("connecting");
            case "Retrying": return t("retrying");
            case "Connected": return t("connected");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span
                        className={[
                            "h-3 w-3 rounded-full",
                            connectionState === "Connected"
                                ? "bg-green-400"
                                : connectionState === "Disconnected"
                                ? "bg-slate-300"
                                : "bg-yellow-400",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    />
                    <span className="font-semibold">
                        {getConnectionStateLabel(connectionState)}
                    </span>
                </div>
                <Button onClick={handleConnect}>{buttonLabel}</Button>
            </div>
            <div className="space-y-1 text-xs">
                {steps.map((step, index) => (
                    <div
                        key={step.label}
                        className={[
                            "rounded-md px-2 py-1",
                            activeStep === index
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-slate-600",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {index + 1}. {step.description}
                    </div>
                ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-700 lg:min-w-[200px]">
                        {t("yourComputer")}
                        <div className="mt-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600">
                            {t("browser")}
                        </div>
                        <div className="mt-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">
                            <div className="mb-1 font-semibold text-slate-600">
                                {t("state")}
                            </div>
                            <div className="flex items-center justify-between font-mono">
                                <span>seq</span>
                                <span>{sequenceState.clientSeq}</span>
                            </div>
                            <div className="flex items-center justify-between font-mono">
                                <span>ack</span>
                                <span>{sequenceState.clientAck}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-16 w-full min-w-0 lg:min-w-[120px]">
                        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-100" />
                        <div className="absolute top-1/2 flex w-full -translate-y-1/2 items-center justify-center gap-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <span
                                    key={index}
                                    className="h-2 w-2 rounded-sm bg-slate-200"
                                />
                            ))}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 text-center text-[10px] tracking-widest text-slate-400">
                            {t("packetsTravel")}
                        </div>
                        {packetPosition !== null ? (
                            <div
                                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-24 items-center justify-center border border-blue-200 bg-blue-50 text-[10px] font-mono text-blue-700 shadow-sm transition-all duration-[1400ms]"
                                style={{ left: `${packetPosition}%` }}
                            >
                                <div className="text-center leading-tight">
                                    <div className="font-semibold">
                                        {packetName}
                                    </div>
                                    <div className="mt-1">{packetMeta}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="min-w-0 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-700 lg:min-w-[200px]">
                        {t("server")}
                        <div className="mt-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">
                            <div className="mb-1 font-semibold text-slate-600">
                                {t("state")}
                            </div>
                            <div className="flex items-center justify-between font-mono">
                                <span>seq</span>
                                <span>{sequenceState.serverSeq}</span>
                            </div>
                            <div className="flex items-center justify-between font-mono">
                                <span>ack</span>
                                <span>{sequenceState.serverAck}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
