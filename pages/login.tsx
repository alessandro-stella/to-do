import InputField from "@/components/InputField";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    // Registration-only credentials
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Errors
    const [usernameError, setUsernameError] = useState("Negri");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setUsername("");
        setConfirmEmail("");
        setConfirmPassword("");
    }, [isRegistering]);

    const loginUser = async () => {
        console.log("login");
    };

    const registerUser = async () => {
        setIsLoading(true);

        const registerResponse = await fetch(
            "/api/authentication/registerUser",
            { headers: { username, email, password } }
        ).then((res) => res.json());

        console.log(registerResponse);

        setIsLoading(false);
    };

    return (
        <div className="bg-red-500 min-h-screen w-full flex p-12">
            <div className="bg-green-400 flex-[1]">IMMAGINE LATERALE</div>
            <div className="bg-violet-400 flex-[1.5] grid place-content-center">
                <div className="bg-amber-400">
                    <div>{isRegistering ? "Register" : "Sign in"}</div>

                    {isRegistering && (
                        <InputField
                            label="Username"
                            type="text"
                            value={username}
                            setValue={setUsername}
                            disabled={isLoading}
                            error={usernameError}
                        />
                    )}

                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        setValue={setEmail}
                        disabled={isLoading}
                        error={emailError}
                    />

                    {isRegistering && (
                        <InputField
                            label="Confirm email"
                            type="email"
                            value={confirmEmail}
                            setValue={setConfirmEmail}
                            disabled={isLoading}
                        />
                    )}

                    <InputField
                        label="Password"
                        type={isPasswordShown ? "text" : "password"}
                        value={password}
                        setValue={setPassword}
                        isPasswordShown={isPasswordShown}
                        setIsPasswordShown={setIsPasswordShown}
                        disabled={isLoading}
                        error={confirmPassword}
                    />

                    {isRegistering && (
                        <InputField
                            label="Confirm password"
                            type={isPasswordShown ? "text" : "password"}
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            isPasswordShown={isPasswordShown}
                            setIsPasswordShown={setIsPasswordShown}
                            disabled={isLoading}
                        />
                    )}

                    <button
                        disabled={isLoading}
                        className="bg-stone-800 p-2 text-white"
                        onClick={isRegistering ? registerUser : loginUser}>
                        {isRegistering ? "Register" : "Login"}
                    </button>

                    <div className="flex gap-1">
                        <div>
                            {isRegistering ? "Already with us?" : "New user?"}
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? "Sign in" : "Register"}
                        </button>
                    </div>
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
