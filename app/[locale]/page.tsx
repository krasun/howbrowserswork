import Footer from "@/components/footer";
import { SectionsProgressProvider } from "@/components/sections-progress";
import AboutSection from "@/components/sections/about";
import BrowsersWorkWithUrls from "@/components/sections/browsers-work-with-urls";
import DomImportance from "@/components/sections/dom-importance";
import EstablishingTheTcpConnection from "@/components/sections/establishing-the-tcp-connection";
import HttpRequestAndResponse from "@/components/sections/http-request-and-response";
import LayoutPaintComposite from "@/components/sections/layout-paint-composite";
import ParsingHtml from "@/components/sections/parsing-html";
import ResolvingTheServerAddress from "@/components/sections/resolving-the-server-address";
import TurningAUrlIntoAnHttpRequest from "@/components/sections/turning-a-url-into-an-http-request";
import Sidebar from "@/components/sidebar";
import MobileToc from "@/components/mobile-toc";
import Link from "next/link";
import SummarySection from "@/components/sections/summary";
import { getTranslations, setRequestLocale } from 'next-intl/server';

type SectionComponentProps = {
    sectionId?: string;
    title?: string;
};

type SectionConfig = {
    id: string;
    titleKey: string;
    Component: (props: SectionComponentProps) => React.ReactNode;
};

const sectionsConfig: SectionConfig[] = [
    {
        id: "about",
        titleKey: "sections.about.title",
        Component: AboutSection,
    },
    {
        id: "browsers-work-with-urls",
        titleKey: "sections.browsersWorkWithUrls.title",
        Component: BrowsersWorkWithUrls,
    },
    {
        id: "turning-a-url-into-an-http-request",
        titleKey: "sections.turningUrlIntoHttpRequest.title",
        Component: TurningAUrlIntoAnHttpRequest,
    },
    {
        id: "resolving-the-server-address",
        titleKey: "sections.resolvingServerAddress.title",
        Component: ResolvingTheServerAddress,
    },
    {
        id: "establishing-the-tcp-connection",
        titleKey: "sections.establishingTcpConnection.title",
        Component: EstablishingTheTcpConnection,
    },
    {
        id: "http-request-and-response",
        titleKey: "sections.httpRequestAndResponse.title",
        Component: HttpRequestAndResponse,
    },
    {
        id: "parsing-html",
        titleKey: "sections.parsingHtml.title",
        Component: ParsingHtml,
    },
    {
        id: "dom-importance",
        titleKey: "sections.domImportance.title",
        Component: DomImportance,
    },
    {
        id: "layout-paint-composite",
        titleKey: "sections.layoutPaintComposite.title",
        Component: LayoutPaintComposite,
    },
    {
        id: "summary",
        titleKey: "sections.summary.title",
        Component: SummarySection,
    },
];

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function IndexPage({ params }: Props) {
    const { locale } = await params;
    
    // Enable static rendering
    setRequestLocale(locale);
    
    const t = await getTranslations({ locale });
    
    const sectionIds = sectionsConfig.map((section) => section.id);
    
    const sidebarSections = sectionsConfig.map(({ id, titleKey }) => ({
        id,
        title: t(titleKey),
    }));

    return (
        <SectionsProgressProvider sectionIds={sectionIds}>
            <div className="relative flex min-h-screen justify-center px-6 py-12 sm:p-16 lg:p-20">
                <div className="w-full max-w-3xl">
                    <MobileToc sections={sidebarSections} />
                    <div className="mt-8 space-y-10 lg:mt-0">
                        <main className="flex w-full flex-col space-y-10">
                            <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                                <h1 className="font-serif max-w-md text-3xl font-semibold leading-9 tracking-tight text-black">
                                    {t('home.title')}
                                </h1>
                                <p className="max-w-lg text-lg leading-8 text-zinc-600 ">
                                    {t('home.subtitle')}
                                </p>
                            </div>
                            {sectionsConfig.map(
                                ({ Component, id, titleKey }: SectionConfig) => (
                                    <Component
                                        key={id}
                                        sectionId={id}
                                        title={t(titleKey)}
                                    />
                                )
                            )}
                        </main>
                        <Footer />
                    </div>
                </div>
                <div className="hidden 2xl:fixed  2xl:right-20 2xl:top-16 2xl:block 2xl:w-80 px-4">
                    <Sidebar sections={sidebarSections} />
                </div>
            </div>
        </SectionsProgressProvider>
    );
}

