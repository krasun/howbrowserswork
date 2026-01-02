"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/button";

type Direction = "right" | "left";
type PacketStatus = "idle" | "in-flight" | "dropped";
type SequenceState = {
    clientSeq: number;
    clientAck: number;
    serverSeq: number;
    serverAck: number;
};

const initialSequence: SequenceState = {
    clientSeq: 1001,
    clientAck: 5001,
    serverSeq: 5000,
    serverAck: 1001,
};

export default function TcpCommunicationExample() {
    const [sequenceState, setSequenceState] =
        useState<SequenceState>(initialSequence);
    const [isSending, setIsSending] = useState(false);
    const [direction, setDirection] = useState<Direction>("right");
    const [packetPosition, setPacketPosition] = useState<number | null>(null);
    const [packetStatus, setPacketStatus] = useState<PacketStatus>("idle");
    const [packetName, setPacketName] = useState("");
    const [packetMeta, setPacketMeta] = useState("");
    const [networkAlert, setNetworkAlert] = useState(false);
    const [packetTick, setPacketTick] = useState(0);
    const [hasDisrupted, setHasDisrupted] = useState(false);
    const [hasStartedOnce, setHasStartedOnce] = useState(false);
    const packetIdRef = useRef(0);
    const isSendingRef = useRef(isSending);
    const sequenceRef = useRef(sequenceState);
    const travelTimeoutRef = useRef<number | null>(null);
    const deliveryTimeoutRef = useRef<number | null>(null);
    const resendTimeoutRef = useRef<number | null>(null);
    const networkTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        isSendingRef.current = isSending;
    }, [isSending]);

    useEffect(() => {
        sequenceRef.current = sequenceState;
    }, [sequenceState]);

    const clearTimers = () => {
        if (travelTimeoutRef.current) {
            window.clearTimeout(travelTimeoutRef.current);
            travelTimeoutRef.current = null;
        }
        if (deliveryTimeoutRef.current) {
            window.clearTimeout(deliveryTimeoutRef.current);
            deliveryTimeoutRef.current = null;
        }
        if (resendTimeoutRef.current) {
            window.clearTimeout(resendTimeoutRef.current);
            resendTimeoutRef.current = null;
        }
        if (networkTimeoutRef.current) {
            window.clearTimeout(networkTimeoutRef.current);
            networkTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    const getPacketContent = (activeDirection: Direction) => {
        const current = sequenceRef.current;
        if (activeDirection === "right") {
            return {
                name: "DATA",
                meta: `seq=${current.clientSeq} ack=${current.clientAck}`,
            };
        }
        return {
            name: "DATA",
            meta: `seq=${current.serverSeq} ack=${current.serverAck}`,
        };
    };

    const scheduleNext = (nextDirection: Direction, delayMs: number) => {
        if (!isSendingRef.current) {
            return;
        }
        if (resendTimeoutRef.current) {
            window.clearTimeout(resendTimeoutRef.current);
        }
        resendTimeoutRef.current = window.setTimeout(() => {
            sendPacket(nextDirection);
        }, delayMs);
    };

    const deliverPacket = (activeDirection: Direction) => {
        setSequenceState((prev) => {
            if (activeDirection === "right") {
                const nextClientSeq = prev.clientSeq + 1;
                return {
                    clientSeq: nextClientSeq,
                    clientAck: prev.clientAck,
                    serverSeq: prev.serverSeq,
                    serverAck: nextClientSeq,
                };
            }
            const nextServerSeq = prev.serverSeq + 1;
            return {
                clientSeq: prev.clientSeq,
                clientAck: nextServerSeq,
                serverSeq: nextServerSeq,
                serverAck: prev.serverAck,
            };
        });
    };

    const sendPacket = (activeDirection: Direction) => {
        if (!isSendingRef.current) {
            return;
        }
        const packetId = packetIdRef.current + 1;
        packetIdRef.current = packetId;
        const { name, meta } = getPacketContent(activeDirection);
        setPacketName(name);
        setPacketMeta(meta);
        setPacketStatus("in-flight");
        setPacketTick((prev) => prev + 1);

        const start = activeDirection === "right" ? 18 : 82;
        const end = activeDirection === "right" ? 82 : 18;
        const startDelayMs = 140;
        const travelMs = 1200;
        setPacketPosition(start);
        if (travelTimeoutRef.current) {
            window.clearTimeout(travelTimeoutRef.current);
        }
        if (deliveryTimeoutRef.current) {
            window.clearTimeout(deliveryTimeoutRef.current);
        }
        travelTimeoutRef.current = window.setTimeout(() => {
            setPacketPosition(end);
        }, startDelayMs);
        deliveryTimeoutRef.current = window.setTimeout(() => {
            if (packetIdRef.current !== packetId) {
                return;
            }
            setPacketStatus("idle");
            setPacketPosition(null);
            deliverPacket(activeDirection);
            const nextDirection =
                activeDirection === "right" ? "left" : "right";
            setDirection(nextDirection);
            scheduleNext(nextDirection, 420);
        }, startDelayMs + travelMs + 120);
    };

    const handleStart = () => {
        if (isSendingRef.current && !hasDisrupted) {
            return;
        }
        clearTimers();
        setPacketStatus("idle");
        setPacketPosition(null);
        setSequenceState(initialSequence);
        packetIdRef.current += 1;
        if (!hasStartedOnce) {
            setHasStartedOnce(true);
        }
        isSendingRef.current = true;
        setIsSending(true);
        sendPacket(direction);
    };

    const handleDisrupt = () => {
        if (packetStatus !== "in-flight") {
            return;
        }
        setHasDisrupted(true);
        packetIdRef.current += 1;
        if (travelTimeoutRef.current) {
            window.clearTimeout(travelTimeoutRef.current);
            travelTimeoutRef.current = null;
        }
        if (deliveryTimeoutRef.current) {
            window.clearTimeout(deliveryTimeoutRef.current);
            deliveryTimeoutRef.current = null;
        }
        setPacketStatus("dropped");
        setNetworkAlert(true);
        if (networkTimeoutRef.current) {
            window.clearTimeout(networkTimeoutRef.current);
        }
        networkTimeoutRef.current = window.setTimeout(() => {
            setNetworkAlert(false);
        }, 600);
        if (resendTimeoutRef.current) {
            window.clearTimeout(resendTimeoutRef.current);
        }
        resendTimeoutRef.current = window.setTimeout(() => {
            setPacketStatus("idle");
            setPacketPosition(null);
            scheduleNext(direction, 200);
        }, 560);
    };

    const showSending = isSending && packetStatus === "in-flight";
    const statusLabel =
        packetStatus === "dropped" ? "Network issues" : "Connected";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span
                        className={[
                            "h-3 w-3 rounded-full",
                            packetStatus === "dropped"
                                ? "bg-red-400"
                                : "bg-green-400",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    />
                    <span className="font-semibold">
                        {statusLabel}
                        {showSending ? (
                            <span className="ml-2 inline-flex items-center gap-1">
                                <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                                <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                                <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
                            </span>
                        ) : null}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {!hasStartedOnce || hasDisrupted ? (
                        <Button
                            onClick={handleStart}
                            disabled={isSending && !hasDisrupted}
                            className={[
                                isSending && !hasDisrupted ? "opacity-60" : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {hasDisrupted
                                ? "Restart sending packets"
                                : "Start sending packets"}
                        </Button>
                    ) : null}
                    <Button
                        onClick={handleDisrupt}
                        disabled={!isSending}
                        className={[
                            "bg-rose-500",
                            !isSending ? "opacity-60" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        Disrupt network
                    </Button>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex items-center gap-4">
                    <div className="min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-700">
                        Your Computer
                        <div className="mt-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600">
                            Browser
                        </div>
                        <div className="mt-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">
                            <div className="mb-1 font-semibold text-slate-600">
                                State
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
                    <div className="relative h-16 w-full min-w-[120px]">
                        <div
                            className={[
                                "absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full",
                                networkAlert ? "bg-rose-200" : "bg-slate-100",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        />
                        <div className="absolute top-1/2 flex w-full -translate-y-1/2 items-center justify-center gap-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <span
                                    key={index}
                                    className="h-2 w-2 rounded-sm bg-slate-200"
                                />
                            ))}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 text-center text-[10px] tracking-widest text-slate-400">
                            Packets travel over the network
                        </div>
                        {packetPosition !== null ? (
                            <div
                                key={packetTick}
                                className={[
                                    "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-24 items-center justify-center border text-[10px] font-mono shadow-sm transition-all duration-[1200ms]",
                                    packetStatus === "dropped"
                                        ? "border-rose-200 bg-rose-50 text-rose-700 opacity-0 translate-y-6 scale-75 duration-500"
                                        : "border-blue-200 bg-blue-50 text-blue-700",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
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
                    <div className="min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-700">
                        Server
                        <div className="mt-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">
                            <div className="mb-1 font-semibold text-slate-600">
                                State
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
