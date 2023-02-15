import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Lexend_Deca } from "@next/font/google";

import { useEffect } from "react";
import { useState } from "react";

const font = Lexend_Deca({ subsets: ["latin"] });

interface connectionResponse {
    status: number;
    error?: string;
    connected: boolean;
}

export default function App({ Component, pageProps }: AppProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const connectDb = async () => {
            console.log("Trying to connect...");

            const connectionResponse: connectionResponse = await fetch(
                "/api/connectMongo"
            ).then((res) => res.json());

            if (connectionResponse.error) {
                console.log(
                    "***********************\nError during connection\n***********************"
                );
                setError(connectionResponse.error);
            } else {
                console.log(
                    "====================\nConnected to MongoDB\n===================="
                );
                setIsConnected(connectionResponse.connected);
            }
        };

        connectDb();
    }, []);

    return (
        <>
            <style jsx global>{`
                html {
                    font-family: ${font.style.fontFamily};
                }
            `}</style>
            {isConnected ? (
                <Component {...pageProps} />
            ) : (
                <>{error ? "ERROR" : "Loading"}</>
            )}
        </>
    );
}
