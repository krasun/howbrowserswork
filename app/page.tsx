import BrowsersWorkWithUrls from "@/components/sections/browsers-work-with-urls";

export default function IndexPage() {
    return (
        <div className="flex min-h-screen justify-center p-20">
            <main className="flex w-full max-w-3xl flex-col space-y-10">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="font-serif max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                        How Browsers Work
                    </h1>
                    <p className="max-w-lg text-lg leading-8 text-zinc-600 ">
                        An interactive guide to the internals of browser
                        operations.
                    </p>
                </div>
                <BrowsersWorkWithUrls />
            </main>
        </div>
    );
}
