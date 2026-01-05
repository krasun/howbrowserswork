'use client';

import ExampleContainer from "@/components/example-container";
import Highlight from "@/components/highlight";
import Section from "@/components/section";
import DomImportanceExample from "@/components/examples/dom-importance-example";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function DomImportance({
    sectionId = "dom-importance",
    title = "On the importance of the DOM",
}: SectionProps) {
    const t = useTranslations('sections.domImportance');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1Start')}
                <Highlight variant="blue">{t('paragraph1Dom')}</Highlight>
                {t('paragraph1End')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <DomImportanceExample />
            </ExampleContainer>
        </Section>
    );
}
