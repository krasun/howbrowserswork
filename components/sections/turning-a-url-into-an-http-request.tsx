"use client";

import ExampleContainer from "@/components/example-container";
import UrlToHttpExample from "@/components/examples/url-to-http-example";
import Section from "@/components/section";
import { useState } from "react";
import Highlight from "@/components/highlight";

export default function TurningAUrlIntoAnHttpRequest() {
    const [host, setHost] = useState("example.com");
    const headers = `Host: ${host}
Accept: text/html
`;

    return (
        <Section title="Turning a URL into an HTTP request">
            <p>
                Once we know the exact URL we want to visit, we can send a
                request to the server to fetch the resource and display it in
                the browser. Browsers communicate with servers using the HTTP
                protocol.
            </p>
            <p>
                To see how a URL is translated into an HTTP request format,
                enter a full URL like https://example.com and press{" "}
                <kbd>Enter</kbd> (or click the "Go" button):
            </p>
            <ExampleContainer>
                <UrlToHttpExample onHostChange={setHost} />
            </ExampleContainer>
            <p>HTTP requests have headers in the format like:</p>
            <pre className="bg-slate-100 p-4 rounded-lg">
                <code>{headers}</code>
            </pre>
            <p>
                One of the headers is the host header. It is used to identify
                the server to which the request is sent:{" "}
                <Highlight variant="blue">{host}</Highlight>.
            </p>
        </Section>
    );
}
