'use client';

import ExampleContainer from "@/components/example-container";
import Section from "@/components/section";
import HttpRequestResponseExample from "@/components/examples/http-request-response-example";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function HttpRequestAndResponse({
    sectionId = "http-request-and-response",
    title = "HTTP requests and responses",
}: SectionProps) {
    const t = useTranslations('sections.httpRequestAndResponse');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <HttpRequestResponseExample />
            </ExampleContainer>
            <p>
                {t('paragraph3')}
            </p>
        </Section>
    );
}
