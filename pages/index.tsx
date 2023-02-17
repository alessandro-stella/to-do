import MainPage from "@/components/MainPage";
import SideBar from "@/components/SideBar";
import url from "@/config/url";
import { GetServerSideProps } from "next";
import cookie from "cookie";
import Head from "next/head";
import connectDB from "@/config/connectDB";
import mongoose from "mongoose";

export default function Home({ userId }: { userId: string }) {
    console.log({ userId });

    return (
        <>
            <Head>
                <title>To-Do 4U</title>
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

            <div className="bg-red-500 min-h-screen w-full flex p-12">
                <SideBar userId={userId} />
                <MainPage />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (mongoose.connection.readyState !== 1) {
        const dbIsConnected = await connectDB();

        if (!dbIsConnected) {
            return {
                redirect: { destination: "/connectionError", permanent: false },
                props: {},
            };
        }
    }

    const unparsedCookie: string = context.req.cookies["auth"] ?? "none";

    if (unparsedCookie === "none") {
        return {
            redirect: { destination: "/login", permanent: false },
            props: {},
        };
    }

    let userData;

    try {
        userData = JSON.parse(unparsedCookie);
    } catch (e) {
        context.res.setHeader(
            "Set-Cookie",
            cookie.serialize("auth", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: -1,
                path: "/",
            })
        );

        return {
            redirect: { destination: "/login", permanent: false },
            props: {},
        };
    }

    const isSessionValid = await fetch(
        `${url}/api/authentication/checkSession`,
        {
            headers: { ...userData },
        }
    ).then((res) => res.json());

    if (isSessionValid) {
        return {
            props: { userId: userData.userId },
        };
    }

    context.res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            path: "/",
        })
    );

    return {
        redirect: { destination: "/login", permanent: false },
        props: {},
    };
};
