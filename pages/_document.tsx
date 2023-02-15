import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head title="To-Do 4U" />
            <Head>
                <meta
                    name="description"
                    content="A to-do app created with typescript"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
