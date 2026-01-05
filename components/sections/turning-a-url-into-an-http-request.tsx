"use client";

import ExampleContainer from "@/components/example-container";
import UrlToHttpExample from "@/components/examples/url-to-http-example";
import Section from "@/components/section";
import { useState } from "react";
import Highlight from "@/components/highlight";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function TurningAUrlIntoAnHttpRequest({
    sectionId = "turning-a-url-into-an-http-request",
    title = "Turning a URL into an HTTP request",
}: SectionProps) {
    const t = useTranslations('sections.turningUrlIntoHttpRequest');
    const [host, setHost] = useState("example.com");
    const headers = `Host: ${host}
Accept: text/html
`;

    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <UrlToHttpExample onHostChange={setHost} />
            </ExampleContainer>
            <p>{t('paragraph3')}</p>
            <pre className="bg-slate-100 p-4 rounded-lg">
                <code>{headers}</code>
            </pre>
            <p>
                {t('paragraph4Start')}
                <Highlight variant="blue">{host}</Highlight>
                {t('paragraph4End')}
            </p>
        </Section>
    );
}
