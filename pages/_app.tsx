import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Lexend_Deca } from "@next/font/google";

const font = Lexend_Deca({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <style jsx global>{`
                html {
                    font-family: ${font.style.fontFamily};
                }
            `}</style>
            <Component {...pageProps} />
        </>
    );
}
