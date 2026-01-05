'use client';

import Section from "../section";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function AboutSection({
    sectionId = "about",
    title = "About the guide",
}: {
    sectionId?: string;
    title?: string;
}) {
    const t = useTranslations('sections.about');
    
    return (
        <Section id={sectionId} title={title}>
            <p>
                {t('paragraph1')}
            </p>
            <p>
                {t('paragraph2')}
            </p>
            <p>
                {t('paragraph3')}
                <b>{t('paragraph3Bold')}</b>.
            </p>
            <p>
                {t('paragraph4')}
            </p>
            <p>
                {t('paragraph5Start')}
                <Link
                    href="https://github.com/krasun/howbrowserswork"
                    className="text-blue-500 font-semibold underline hover:text-blue-600"
                >
                    {t('paragraph5Link')}
                </Link>
                {t('paragraph5End')}
            </p>
        </Section>
    );
}
