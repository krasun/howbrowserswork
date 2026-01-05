'use client';

import Section from "../section";
import { useTranslations } from 'next-intl';

export default function SummarySection({
    sectionId = "summary",
    title = "Summary",
}: {
    sectionId?: string;
    title?: string;
}) {
    const t = useTranslations('sections.summary');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1')}
            </p>
            <p>{t('paragraph2')}</p>
        </Section>
    );
}
