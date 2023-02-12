import InputField from "@/components/InputField";
import { GetServerSideProps } from "next";
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    return (
        <div className="bg-red-500 min-h-screen w-full flex p-12">
            <div className="bg-green-400 flex-[1]">IMMAGINE LATERALE</div>
            <div className="bg-violet-400 flex-[1.5] grid place-content-center">
                <div className="bg-amber-400">
                    <div>Sign in</div>

                    <InputField
                        label="Username"
                        type="text"
                        value={username}
                        setValue={setUsername}
                    />

                    <InputField
                        label="Password"
                        type={isPasswordShown ? "text" : "password"}
                        value={password}
                        setValue={setPassword}
                        isPasswordShown={isPasswordShown}
                        setIsPasswordShown={setIsPasswordShown}
                    />
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const unparsedCookie: string = context.req.cookies["session"] ?? "{}";
    const userData = JSON.parse(unparsedCookie);

    console.log({ userData });

    const isLoggedIn = false;

    if (isLoggedIn) {
        return {
            redirect: { destination: "/", permanent: false },
            props: {},
        };
    }

    return {
        props: {},
    };
};
