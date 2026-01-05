'use client';

import { useLocale } from 'next-intl';
import { locales, localeNames } from '@/i18n/config';
import Link from 'next/link';

const localeFlags: Record<string, string> = {
    en: '🇬🇧',
    fr: '🇫🇷',
    es: '🇪🇸',
};

const localeLabels: Record<string, string> = {
    en: 'EN',
    fr: 'FR',
    es: 'ES',
};

export default function LanguageSwitcher() {
    const currentLocale = useLocale();

    return (
        <div className="flex items-center gap-1 text-xs">
            {locales.map((locale) => {
                const isActive = locale === currentLocale;
                const href = locale === 'en' ? '/en/' : `/${locale}/`;
                
                return (
                    <Link
                        key={locale}
                        href={href}
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-all ${
                            isActive
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={localeNames[locale as keyof typeof localeNames]}
                    >
                        <span className="text-sm">{localeFlags[locale]}</span>
                        <span className="text-[10px] font-medium">{localeLabels[locale]}</span>
                    </Link>
                );
            })}
        </div>
    );
}

