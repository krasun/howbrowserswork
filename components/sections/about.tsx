import Section from "../section";
import Link from "next/link";

export default function AboutSection({
    sectionId = "about",
    title = "About the guide",
}: {
    sectionId?: string;
    title?: string;
}) {
    return (
        <Section id={sectionId} title={title}>
            <p>
                The guide is for engineers and curious people who use the web
                every day, but never built a mental model of how browsers work.
            </p>
            <p>
                I find most guides too technical, too detailed, or too shallow,
                so I have decided to take a different approach.
            </p>
            <p>
                I built the guide with many tiny interactive examples you can
                play with to help you go get through the technical details and{" "}
                <b>build an intuition of how browsers work</b>.
            </p>
            <p>
                To keep it short and straight to the point, many critical
                details are omitted like different versions of the HTTP
                protocol, SSL, TLS, nuances of the DNS, and many more.
            </p>
            <p>
                I made the guide{" "}
                <Link
                    href="https://github.com/krasun/howbrowserswork"
                    className="text-blue-500 font-semibold underline hover:text-blue-600"
                >
                    open source
                </Link>
                . Feel free to suggest improvements by creating an issue or a
                pull request.
            </p>
        </Section>
    );
}
