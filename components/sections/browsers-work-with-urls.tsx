'use client';

import ExampleContainer from "@/components/example-container";
import AnythingToUrlExample from "@/components/examples/anything-to-url-example";
import Highlight from "@/components/highlight";
import Section from "@/components/section";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function BrowsersWorkWithUrls({
    sectionId = "browsers-work-with-urls",
    title = "Browsers work with URLs",
}: SectionProps) {
    const t = useTranslations('sections.browsersWorkWithUrls');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1')}
            </p>
            <ul className="list-disc list-inside leading-7">
                <li>
                    {t('listItem1Start')}
                    <Highlight variant="slate">{t('listItem1Pizza')}</Highlight>
                    {t('listItem1Middle')}
                    <Highlight variant="blue">
                        {t('listItem1Google')}
                    </Highlight>
                    {t('listItem1Or')}
                    <Highlight variant="blue">
                        {t('listItem1DuckDuckGo')}
                    </Highlight>
                    {t('listItem1End')}
                </li>
                <li>
                    {t('listItem2Start')}
                    <Highlight variant="slate">{t('listItem2Domain')}</Highlight>
                    {t('listItem2Middle')}
                    <Highlight variant="blue">{t('listItem2Url')}</Highlight>
                </li>
            </ul>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <AnythingToUrlExample />
            </ExampleContainer>
        </Section>
    );
}
