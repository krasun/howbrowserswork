'use client';

import ExampleContainer from "../example-container";
import ResolveServerAddressExample from "../examples/resolve-server-address-example";
import Section from "../section";
import Highlight from "../highlight";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function ResolvingTheServerAddress({
    sectionId = "resolving-the-server-address",
    title = "Resolving the server address",
}: SectionProps) {
    const t = useTranslations('sections.resolvingServerAddress');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1Start')}
                <Highlight variant="slate">{t('paragraph1Domain')}</Highlight>
                {t('paragraph1End')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <p>
                {t('paragraph3')}
            </p>
            <ExampleContainer>
                <ResolveServerAddressExample />
            </ExampleContainer>
        </Section>
    );
}
