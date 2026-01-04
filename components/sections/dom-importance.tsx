import ExampleContainer from "@/components/example-container";
import Highlight from "@/components/highlight";
import Section from "@/components/section";
import DomImportanceExample from "@/components/examples/dom-importance-example";

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function DomImportance({
    sectionId = "dom-importance",
    title = "On the importance of the DOM",
}: SectionProps) {
    return (
        <Section id={sectionId} title={title}>
            <p>
                The <Highlight variant="blue">DOM</Highlight> is the browser's
                in-memory model of the document. It is the shared contract
                between the HTML parser, CSS selector engine, and JavaScript
                runtime, so changes to it immediately affect layout, styling,
                and what users can interact with.
            </p>
            <p>
                The DOM powers everything from query selection to dynamic
                styling and event handling. Try editing the script and watch how
                the DOM changes on the right.
            </p>
            <ExampleContainer>
                <DomImportanceExample />
            </ExampleContainer>
        </Section>
    );
}
