"use client";

import { useEffect, useRef, useState } from "react";
import AddressBar from "@/components/address-bar";

type Phase = "idle" | "sending" | "processing" | "responding" | "done";
type PacketKind = "request" | "response";

const requestPacket = `GET / HTTP/1.1
Host: example.com
Accept: text/html
Connection: close
`;

const exampleBodyHtml = [
    "<main>",
    "  <h1>Example Domain</h1>",
    "  <p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p>",
    '  <p><a href="https://www.iana.org/domains/example">More information...</a></p>',
    "</main>",
].join("\n");

const buildHtmlDocument = (title: string, bodyHtml: string) => {
    const bodyLines = bodyHtml
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n");

    return [
        "<!doctype html>",
        "<html>",
        "  <head>",
        `    <title>${title}</title>`,
        '    <meta charset="utf-8" />',
        '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
        "  </head>",
        "  <body>",
        bodyLines,
        "  </body>",
        "</html>",
    ].join("\n");
};

const htmlDocument = buildHtmlDocument("Example Domain", exampleBodyHtml);
const contentLength = htmlDocument.length;

const buildResponse = (date: Date) => {
    const statusLine = "HTTP/1.1 200 OK";
    const headers = [
        `Date: ${date.toUTCString()}`,
        "Content-Type: text/html; charset=UTF-8",
        `Content-Length: ${contentLength}`,
        "Connection: close",
    ];

    return [statusLine, ...headers, "", htmlDocument].join("\n");
};

const buildResponseSnippet = (date: Date) =>
    [
        "HTTP/1.1 200 OK",
        `Date: ${date.toUTCString()}`,
        "Content-Type: text/html; charset=UTF-8",
        `Content-Length: ${contentLength}`,
        "",
        "<!doctype html>",
        "<html>",
        "  <head>...</head>",
        "  <body>...</body>",
        "</html>",
    ].join("\n");

export default function HttpRequestResponseExample() {
    const [phase, setPhase] = useState<Phase>("idle");
    const [packetPosition, setPacketPosition] = useState<number | null>(null);
    const [packetContent, setPacketContent] = useState(requestPacket);
    const [packetKind, setPacketKind] = useState<PacketKind>("request");
    const [packetTick, setPacketTick] = useState(0);
    const [response, setResponse] = useState<string | null>(null);
    const [animateResponse, setAnimateResponse] = useState(false);
    const responseRef = useRef<string | null>(null);
    const responseSnippetRef = useRef("");
    const timersRef = useRef<number[]>([]);

    const isBusy =
        phase === "sending" || phase === "processing" || phase === "responding";

    const clearTimers = () => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
    };

    const schedule = (callback: () => void, delayMs: number) => {
        const timer = window.setTimeout(callback, delayMs);
        timersRef.current.push(timer);
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    useEffect(() => {
        if (!response) return;
        setAnimateResponse(false);
        const id = window.setTimeout(() => setAnimateResponse(true), 30);
        return () => window.clearTimeout(id);
    }, [response]);

    const startRight = 16;
    const endRight = 84;
    const startLeft = 84;
    const endLeft = 16;
    const startDelayMs = 180;
    const travelMs = 2200;
    const serverDelayMs = 600;

    const startSequence = () => {
        if (isBusy) return;
        clearTimers();
        setResponse(null);
        setAnimateResponse(false);

        const now = new Date();
        responseRef.current = buildResponse(now);
        responseSnippetRef.current = buildResponseSnippet(now);

        setPhase("sending");
        setPacketKind("request");
        setPacketContent(requestPacket);
        setPacketPosition(startRight);
        setPacketTick((prev) => prev + 1);

        schedule(() => setPacketPosition(endRight), startDelayMs);
        schedule(() => {
            setPacketPosition(null);
            setPhase("processing");
        }, startDelayMs + travelMs);

        schedule(() => {
            setPhase("responding");
            setPacketKind("response");
            setPacketContent(responseSnippetRef.current);
            setPacketPosition(startLeft);
            setPacketTick((prev) => prev + 1);
        }, startDelayMs + travelMs + serverDelayMs);

        schedule(
            () => setPacketPosition(endLeft),
            startDelayMs + travelMs + serverDelayMs + startDelayMs
        );

        schedule(() => {
            setPacketPosition(null);
            setPhase("done");
            setResponse(responseRef.current);
        }, startDelayMs + travelMs + serverDelayMs + startDelayMs + travelMs);
    };

    const statusLabel =
        phase === "idle"
            ? "Ready to send"
            : phase === "sending"
            ? "Request in flight"
            : phase === "processing"
            ? "Server processing"
            : phase === "responding"
            ? "Response in flight"
            : "Response delivered";

    const statusColor =
        phase === "done"
            ? "bg-green-400"
            : phase === "idle"
            ? "bg-slate-300"
            : "bg-amber-400";

    const browserHint =
        phase === "sending"
            ? "Request packet is traveling to the server."
            : phase === "processing"
            ? "Server is building the response."
            : phase === "responding"
            ? "Response packet is heading back."
            : "Watch the packets move between the browser and the server.";

    const browserRequestState =
        phase === "idle"
            ? "Ready to send"
            : phase === "sending"
            ? "Request sent"
            : phase === "processing"
            ? "Request delivered"
            : "Request complete";

    const browserResponseState =
        phase === "responding"
            ? "Receiving response..."
            : phase === "done"
            ? "Response received"
            : "Waiting for response...";

    const serverRequestState =
        phase === "idle"
            ? "Waiting for request..."
            : phase === "sending"
            ? "Receiving request..."
            : "Request received";

    const serverResponseState =
        phase === "processing"
            ? "Building response..."
            : phase === "responding"
            ? "Sending response..."
            : phase === "done"
            ? "Response sent"
            : "Waiting to respond...";

    const packetStyle =
        packetKind === "request"
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700";

    const handleSubmit = (_value: string) => {
        startSequence();
    };

    return (
        <div className="space-y-4">
            <AddressBar
                value="https://example.com"
                onSubmit={handleSubmit}
                readOnly={true}
                isSubmitDisabled={isBusy}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span
                        className={["h-2 w-2 rounded-full", statusColor]
                            .filter(Boolean)
                            .join(" ")}
                    />
                    <span className="font-semibold">{statusLabel}</span>
                </div>
                <div className="text-xs text-slate-400">{browserHint}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                    <div className="min-w-0 w-full flex-1 space-y-3 lg:min-w-[240px]">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Browser (Client)
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
                            <div className="font-semibold text-slate-700">
                                Client Browser
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                                User agent
                            </div>
                            <div className="mt-3 rounded-md border border-slate-200 bg-white px-2 py-2">
                                <div className="text-[10px] uppercase text-slate-400">
                                    Request
                                </div>
                                <div className="mt-1 font-mono text-[11px] text-slate-700">
                                    {browserRequestState}
                                </div>
                            </div>
                            <div className="mt-2 rounded-md border border-slate-200 bg-white px-2 py-2">
                                <div className="text-[10px] uppercase text-slate-400">
                                    Response
                                </div>
                                <div className="mt-1 font-mono text-[11px] text-slate-700">
                                    {browserResponseState}
                                </div>
                            </div>
                            <div className="mt-2 text-[11px] text-slate-500">
                                {phase === "done"
                                    ? "Response ready to render."
                                    : "Waiting for the server."}
                            </div>
                        </div>
                    </div>
                    <div className="relative h-32 w-full min-w-0 overflow-hidden lg:mt-6 lg:min-w-[160px]">
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
                            HTTP packets over the TCP connection
                        </div>
                        {packetPosition !== null ? (
                            <div
                                key={packetTick}
                                className={[
                                    "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 max-w-[220px] rounded-lg border px-2 py-2 text-[10px] font-mono shadow-sm transition-all",
                                    packetStyle,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                style={{
                                    left: `${packetPosition}%`,
                                    transitionDuration: `${travelMs}ms`,
                                }}
                            >
                                <div className="text-[9px] font-semibold uppercase tracking-wide">
                                    {packetKind === "request"
                                        ? "HTTP Request"
                                        : "HTTP Response"}
                                </div>
                                <pre className="mt-1 whitespace-pre-wrap leading-snug">
                                    {packetContent}
                                </pre>
                            </div>
                        ) : null}
                    </div>
                    <div className="min-w-0 w-full flex-1 space-y-3 lg:min-w-[220px]">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Server
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
                            <div className="font-semibold text-slate-700">
                                example.com
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                                Port 80 - HTTP
                            </div>
                            <div className="mt-3 rounded-md border border-slate-200 bg-white px-2 py-2">
                                <div className="text-[10px] uppercase text-slate-400">
                                    Request
                                </div>
                                <div className="mt-1 font-mono text-[11px] text-slate-700">
                                    {serverRequestState}
                                </div>
                            </div>
                            <div className="mt-2 rounded-md border border-slate-200 bg-white px-2 py-2">
                                <div className="text-[10px] uppercase text-slate-400">
                                    Response
                                </div>
                                <div className="mt-1 font-mono text-[11px] text-slate-700">
                                    {serverResponseState}
                                </div>
                            </div>
                            <div className="mt-2 text-[11px] text-slate-500">
                                {phase === "processing"
                                    ? "Rendering HTML and headers."
                                    : phase === "responding"
                                    ? "Sending response packet."
                                    : phase === "done"
                                    ? "Connection closed."
                                    : "Listening for requests."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {response ? (
                <div
                    className={[
                        "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        animateResponse
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-6 scale-[0.98] opacity-0 ",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <div className="mb-2 text-xs text-slate-400">
                        The raw HTTP response from the server:
                    </div>
                    <pre className="w-full whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-2 text-left font-mono text-xs text-slate-700">
                        {response}
                    </pre>
                </div>
            ) : null}
        </div>
    );
}
