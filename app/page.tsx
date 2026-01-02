import Footer from "@/components/footer";
import { SectionsProgressProvider } from "@/components/sections-progress";
import BrowsersWorkWithUrls from "@/components/sections/browsers-work-with-urls";
import EstablishingTheTcpConnection from "@/components/sections/establishing-the-tcp-connection";
import ResolvingTheServerAddress from "@/components/sections/resolving-the-server-address";
import TurningAUrlIntoAnHttpRequest from "@/components/sections/turning-a-url-into-an-http-request";
import Sidebar from "@/components/sidebar";

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
        title: "Establishing the TCP Connection",
        Component: EstablishingTheTcpConnection,
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
                <div className="w-full max-w-3xl space-y-10">
                    <main className="flex w-full flex-col space-y-10">
                        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                            <h1 className="font-serif max-w-xs text-3xl font-semibold leading-8 tracking-tight text-black dark:text-zinc-50">
                                How Browsers Work
                            </h1>
                            <p className="max-w-lg text-lg leading-8 text-zinc-600 ">
                                An interactive guide to the internal world of
                                browsers.
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
                <div className="hidden lg:fixed lg:right-20 lg:top-16 lg:block lg:w-64">
                    <Sidebar sections={sidebarSections} />
                </div>
            </div>
        </SectionsProgressProvider>
    );
}
