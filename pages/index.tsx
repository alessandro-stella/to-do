import MainPage from "@/components/MainPage";
import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import Head from "next/head";

export default function Home() {
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
                <SideBar />
                <MainPage />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const unparsedCookie: string = context.req.cookies["session"] ?? "{}";
    const userData = JSON.parse(unparsedCookie);

    console.log({ userData });
    const isLoggedIn = false;

    if (isLoggedIn) {
        return {
            props: {},
        };
    }

    return {
        redirect: { destination: "/login", permanent: false },
        props: { isLoggedIn: false },
    };
};
