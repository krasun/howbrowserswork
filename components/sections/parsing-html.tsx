'use client';

import ExampleContainer from "@/components/example-container";
import Highlight from "@/components/highlight";
import Section from "@/components/section";
import ParsingHtmlIntoDomTreeExample from "@/components/examples/parsing-html-into-dom-tree-example";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function ParsingHtml({
    sectionId = "parsing-html",
    title = "Parsing HTML to build the DOM tree",
}: SectionProps) {
    const t = useTranslations('sections.parsingHtml');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1Start')}
                <Highlight variant="slate">{t('paragraph1H1')}</Highlight>
                {t('paragraph1Middle')}
                <Highlight variant="blue">{t('paragraph1Dom')}</Highlight>
                {t('paragraph1End')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <ParsingHtmlIntoDomTreeExample />
            </ExampleContainer>
            <p>
                {t('paragraph3Start')}
                <Highlight variant="slate">{t('paragraph3Script')}</Highlight>
                {t('paragraph3End')}
            </p>
            <p>
                {t('paragraph4')}
            </p>
        </Section>
    );
}
