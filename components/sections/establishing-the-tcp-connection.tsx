'use client';

import ExampleContainer from "@/components/example-container";
import TcpHandshakeExample from "@/components/examples/tcp-handshake-example";
import TcpCommunicationExample from "@/components/examples/tcp-communication-example";
import Section from "@/components/section";
import { useTranslations } from 'next-intl';

type SectionProps = {
    sectionId?: string;
    title?: string;
};

export default function EstablishingTheTcpConnection({
    sectionId = "establishing-the-tcp-connection",
    title = "Establishing the TCP connection",
}: SectionProps) {
    const t = useTranslations('sections.establishingTcpConnection');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <ExampleContainer>
                <TcpHandshakeExample />
            </ExampleContainer>
            <p>
                {t('paragraph3')}
            </p>
            <p>
                {t('paragraph4')}
            </p>
            <ExampleContainer>
                <TcpCommunicationExample />
            </ExampleContainer>
        </Section>
    );
}
