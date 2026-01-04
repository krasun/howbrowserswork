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

type SectionComponentProps = {
    sectionId?: string;
    title?: string;
};

type SectionConfig = {
    id: string;
    title: string;
    Component: (props: SectionComponentProps) => React.ReactNode;
};

const sections: SectionConfig[] = [
    {
        id: "about",
        title: "Why?",
        Component: AboutSection,
    },
    {
        id: "browsers-work-with-urls",
        title: "Browsers work with URLs",
        Component: BrowsersWorkWithUrls,
    },
    {
        id: "turning-a-url-into-an-http-request",
        title: "Turning a URL into an HTTP request",
        Component: TurningAUrlIntoAnHttpRequest,
    },
    {
        id: "resolving-the-server-address",
        title: "Resolving the server address",
        Component: ResolvingTheServerAddress,
    },
    {
        id: "establishing-the-tcp-connection",
        title: "Establishing the TCP connection",
        Component: EstablishingTheTcpConnection,
    },
    {
        id: "http-request-and-response",
        title: "HTTP requests and responses",
        Component: HttpRequestAndResponse,
    },
    {
        id: "parsing-html",
        title: "Parsing HTML to build the DOM tree",
        Component: ParsingHtml,
    },
    {
        id: "dom-importance",
        title: "On the importance of the DOM",
        Component: DomImportance,
    },
    {
        id: "layout-paint-composite",
        title: "Layout, Paint, and Composite",
        Component: LayoutPaintComposite,
    },
    {
        id: "summary",
        title: "Summary",
        Component: SummarySection,
    },
];

const sectionIds = sections.map((section) => section.id);
const sidebarSections = sections.map(({ id, title }) => ({
    id,
    title,
}));

export default function IndexPage() {
    return (
        <SectionsProgressProvider sectionIds={sectionIds}>
            <div className="relative flex min-h-screen justify-center px-6 py-12 sm:p-16 lg:p-20">
                <div className="w-full max-w-3xl">
                    <MobileToc sections={sidebarSections} />
                    <div className="mt-8 space-y-10 lg:mt-0">
                        <main className="flex w-full flex-col space-y-10">
                            <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                                <Link href="/">
                                    <h1 className="font-serif max-w-xs text-3xl font-semibold leading-8 tracking-tight text-black dark:text-zinc-50">
                                        How Browsers Work
                                    </h1>
                                </Link>
                                <p className="max-w-lg text-lg leading-8 text-zinc-600 ">
                                    An interactive guide to how browsers work.
                                </p>
                            </div>
                            {sections.map(
                                ({ Component, id, title }: SectionConfig) => (
                                    <Component
                                        key={id}
                                        sectionId={id}
                                        title={title}
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
