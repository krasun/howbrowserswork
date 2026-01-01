import ExampleContainer from "@/components/example-container";
import AnythingToUrlExample from "@/components/examples/anything-to-url-example";
import Highlight from "@/components/highlight";
import Section from "@/components/section";

export default function BrowsersWorkWithUrls() {
    return (
        <Section title="Browsers work with URLs">
            <p>
                You can type literally anything in the address bar. But under
                the hood, browsers work with URLs:
            </p>
            <ul className="list-disc list-inside leading-7">
                <li>
                    A random text like{" "}
                    <Highlight variant="slate">pizza</Highlight> will be
                    transformed into a "search" URL like{" "}
                    <Highlight variant="blue">
                        https://google.com/search?q=pizza
                    </Highlight>{" "}
                    (or{" "}
                    <Highlight variant="blue">
                        https://duckduckgo.com/?q=pizza
                    </Highlight>{" "}
                    depending on your preferences).
                </li>
                <li>
                    A domain name like{" "}
                    <Highlight variant="slate">example.com</Highlight> will be
                    normalized as a full URL:{" "}
                    <Highlight variant="blue">https://example.com</Highlight>
                </li>
            </ul>
            <p>
                To see how this works in practice, type something in the address
                bar and press <kbd>Enter</kbd> (or click the "Go" button):
            </p>
            <ExampleContainer>
                <AnythingToUrlExample />
            </ExampleContainer>
        </Section>
    );
}
