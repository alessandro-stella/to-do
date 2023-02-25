import InputField from "@/components/InputField";
import Loader from "@/components/Loader";
import connectDB from "@/database/connectDB";
import url from "@/config/url";
import { UserType } from "@/database/models/userModel";
import cookie from "cookie";
import mongoose from "mongoose";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    // Registration-only credentials
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Errors
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [processError, setProcessError] = useState("");
    const [errorTimeout, setErrorTimeout] = useState<any>({});

    // Utility
    const [isLoading, setIsLoading] = useState(false);

    const emailRegex = /([\w-\.]+)+@([\w-]+\.)+[\w-]{2,4}/g;
    const passwordRegex =
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;

    enum errors {
        shortUsername = "The username entered is too short",
        invalidEmail = "The entered email does not meet the required format",
        differentEmails = "The emails entered are different from each other",
        shortPassword = "The username entered is too short",
        invalidPassword = "The chosen password does not meet the required format",
        differentPasswords = "The passwords entered are different from each other",
        alreadyRegistered = "The entered email is already related to an existing account",
        errorDuringLogin = "There's been an error during the login process, please try again",
        errorDuringRegistration = "There's been an error during the registration process, please try again",
        emailNotFound = "No users associated with this email were found",
        wrongPassword = "The entered password is incorrect",
        invalidCredentials = "The credentials entered does not meet the required format",
    }

    useEffect(() => {
        setUsername("");
        setConfirmEmail("");
        setConfirmPassword("");

        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setProcessError("");
    }, [isRegistering]);

    function removeErrors() {
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
    }

    function triggerError(
        value: string,
        stateF: Dispatch<SetStateAction<string>>
    ) {
        removeErrors();

        stateF(value);
        clearTimeout(errorTimeout);

        const tempTimeout = setTimeout(() => {
            stateF("");
        }, 3000);

        setErrorTimeout(tempTimeout);
    }

    function checkEmail(email: string) {
        if (emailRegex.test(email)) {
            const matches = email.match(emailRegex);

            return matches![0].length === email.length;
        } else return false;
    }

    function checkValues() {
        if (username.trim().length < 3) {
            triggerError(errors.shortUsername, setUsernameError);
            return false;
        }

        if (!checkEmail(email.trim())) {
            triggerError(errors.invalidEmail, setEmailError);
            return false;
        }

        if (email.trim() !== confirmEmail.trim()) {
            triggerError(errors.differentEmails, setEmailError);
            return false;
        }

        if (password.trim().length < 8) {
            triggerError(errors.shortPassword, setPasswordError);
            return false;
        }

        if (!passwordRegex.test(password)) {
            triggerError(errors.invalidPassword, setPasswordError);
            return false;
        }

        if (password.trim() !== confirmPassword.trim()) {
            triggerError(errors.differentPasswords, setPasswordError);
            return false;
        }

        removeErrors();

        return true;
    }

    const loginUser = async () => {
        setIsLoading(true);

        const loginResponse: UserType | string = await fetch(
            "/api/authentication/loginUser",
            { headers: { email, password } }
        ).then((res) => res.json());

        if (typeof loginResponse === "string") {
            triggerError(
                errors[loginResponse as keyof typeof errors],
                setProcessError
            );
            setIsLoading(false);
            return;
        }

        router.push("/");
    };

    const registerUser = async () => {
        setIsLoading(true);

        if (!checkValues()) {
            setIsLoading(false);
            return;
        }

        const registerResponse: UserType | string = await fetch(
            "/api/authentication/registerUser",
            { headers: { username, email, password } }
        ).then((res) => res.json());

        if (typeof registerResponse === "string") {
            triggerError(
                errors[registerResponse as keyof typeof errors],
                setProcessError
            );
            setIsLoading(false);
            return;
        }

        router.push("/");
    };

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
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <div className="grid w-full min-h-screen grid-cols-12 gap-8 px-32 py-16 bg-meshGradient">
                <div className="flex-1 lg:col-start-2 lg:col-end-7 hidden lg:block my-auto text-white bg-opacity-50">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="relative h-16 aspect-square">
                            <Image
                                src="/favicon.svg"
                                alt="To-Do 4U"
                                fill
                                className="h-full aspect-square"
                            />
                        </div>
                        <div className="text-4xl">To-Do 4U</div>
                    </div>

                    <div className="text-lg">
                        Sign in or register with your account
                    </div>
                </div>

                <div className="flex items-center justify-center lg:col-start-7 lg:col-end-12 col-span-full p-12 my-auto rounded-md shadow-xl h-fit bg-customViolet-950">
                    <div className="flex flex-col w-full h-full gap-2">
                        <div className="text-[2.5rem] font-semibold leading-10">
                            {isRegistering ? "Register" : "Sign in"}
                        </div>

                        <div className="flex gap-1 mb-2">
                            <div>
                                {isRegistering
                                    ? "Already with us?"
                                    : "New user?"}
                            </div>
                            <button
                                className="border-b-[1px] border-customViolet-950 hover:border-customViolet-600 transition text-customViolet-600"
                                disabled={isLoading}
                                onClick={() =>
                                    setIsRegistering(!isRegistering)
                                }>
                                {isRegistering ? "Sign in" : "Register"}
                            </button>
                        </div>

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
                            error={passwordError}
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
                        {processError && (
                            <div className="text-sm text-red-500">
                                {processError}
                            </div>
                        )}
                        <button
                            disabled={isLoading}
                            className="relative p-2 min-h-[2.25rem] text-white rounded-md bg-customViolet-600 hover:bg-customViolet-700 focus:bg-customViolet-700 select-none transition grid place-content-center"
                            onClick={isRegistering ? registerUser : loginUser}>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <>{isRegistering ? "Register" : "Sign in"}</>
                            )}
                        </button>
                    </div>
                </div>
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
            redirect: { destination: "/", permanent: false },
            props: {},
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
        props: {},
    };
};
