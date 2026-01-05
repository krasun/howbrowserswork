import ExampleContainer from "@/components/example-container";
import Highlight from "@/components/highlight";
import Section from "@/components/section";
import CssomConstructionExample from "@/components/examples/cssom-construction-example";

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function CssomConstruction({
    sectionId = "cssom-construction",
    title = "Building the CSSOM",
}: SectionProps) {
    return (
        <Section id={sectionId} title={title}>
            <p>
                While the DOM represents the document structure, the browser also needs to understand styling. 
                CSS rules are parsed into the <Highlight variant="blue">CSSOM</Highlight> — 
                a structured tree that organizes style rules by specificity and resolves inheritance.
            </p>
            <p>
                The CSSOM resolves inheritance, calculates specificity, and determines the final computed styles 
                for each element. This tree structure organizes rules for efficient style matching when building 
                the render tree. Try modifying the CSS below to see how rules become CSSOM nodes:
            </p>
            <ExampleContainer>
                <CssomConstructionExample />
            </ExampleContainer>
            <p>
                Unlike the DOM, CSSOM construction is render-blocking. The browser must finish parsing all CSS 
                before it can build the render tree, since any rule could affect any element through cascading, 
                inheritance, and specificity calculations.
            </p>
            <p>
                Once both DOM and CSSOM are ready, the browser combines them into the render tree, which contains 
                only the elements that will be painted to the screen.
            </p>
        </Section>
    );
}
