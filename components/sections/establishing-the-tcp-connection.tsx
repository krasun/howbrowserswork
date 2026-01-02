import ExampleContainer from "@/components/example-container";
import TcpHandshakeExample from "@/components/examples/tcp-handshake-example";
import TcpCommunicationExample from "@/components/examples/tcp-communication-example";
import Section from "@/components/section";

export default function EstablishingTheTcpConnection() {
    return (
        <Section title="Establishing the TCP Connection">
            <p>
                After DNS gives the browser an IP address, it still needs a
                reliable connection to the server. TCP is the protocol that sets
                up this connection before any HTTP data is sent.
            </p>
            <p>
                TCP establishes the connection using a three-step handshake that
                confirms both sides are ready to send and receive data.
            </p>
            <ExampleContainer>
                <TcpHandshakeExample />
            </ExampleContainer>
            <p>
                These numbers are how the client and the server keep track of
                the conversation. They count bytes, so both sides agree on where
                the data stream starts and what should come next. If some data
                doesn&apos;t arrive, the sender can see the gap and retransmit
                the missing bytes. This is how TCP keeps data ordered and
                reliable once the connection is established.
            </p>
            <p>
                Start sending packets and try to disrupt the network to see what
                happens.
            </p>
            <ExampleContainer>
                <TcpCommunicationExample />
            </ExampleContainer>
        </Section>
    );
}
