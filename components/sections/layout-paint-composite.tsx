'use client';

import ExampleContainer from "@/components/example-container";
import Highlight from "@/components/highlight";
import Section from "@/components/section";
import LayoutPaintCompositeExample from "@/components/examples/layout-paint-composite-example";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function LayoutPaintComposite({
    sectionId = "layout-paint-composite",
    title = "Layout, Paint, and Composite (The Rendering Pipeline)",
}: SectionProps) {
    const t = useTranslations('sections.layoutPaintComposite');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1Start')}
                <Highlight variant="blue">{t('paragraph1Layout')}</Highlight>
                {t('paragraph1Middle1')}
                <Highlight variant="slate">{t('paragraph1Paint')}</Highlight>
                {t('paragraph1Middle2')}
                <Highlight variant="blue">{t('paragraph1Composite')}</Highlight>
                {t('paragraph1End')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <LayoutPaintCompositeExample />
            </ExampleContainer>
            <p>
                {t('paragraph3')}
            </p>
        </Section>
    );
}
