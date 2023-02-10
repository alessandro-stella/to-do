import MainPage from "@/components/MainPage";
import SideBar from "@/components/SideBar";
import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <title>To-Do App</title>
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
