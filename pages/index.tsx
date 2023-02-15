import MainPage from "@/components/MainPage";
import SideBar from "@/components/SideBar";
import url from "@/config/url";
import { GetServerSideProps } from "next";
import cookie from "cookie";

export default function Home() {
    return (
        <>
            <div className="bg-red-500 min-h-screen w-full flex p-12">
                <SideBar />
                <MainPage />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
            props: {},
        };
    }

    return {
        redirect: { destination: "/login", permanent: false },
        props: { isLoggedIn: false },
    };
};
