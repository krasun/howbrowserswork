'use client';

import Link from "next/link";
import LanguageSwitcher from "./language-switcher";
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    
    return (
        <footer className="flex flex-col items-center gap-4 text-center sm:text-left">
            <hr className="w-full border-slate-200" />
            <p className="text-sm text-slate-500 sm:self-start">
                {t('feedbackStart')}
                <Link
                    href="https://github.com/krasun/howbrowserswork"
                    className="text-blue-500 font-semibold underline hover:text-blue-600"
                >
                    {t('openSourceLink')}
                </Link>
                {t('feedbackMiddle')}
                <Link
                    href="https://github.com/krasun/howbrowserswork/issues"
                    className="text-blue-500 font-semibold underline hover:text-blue-600"
                >
                    {t('createIssueLink')}
                </Link>
                {t('feedbackEnd')}
            </p>
            <div className="w-full flex justify-center">
                <LanguageSwitcher />
            </div>
        </footer>
    );
}
