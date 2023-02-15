import InputField from "@/components/InputField";
import url from "@/config/url";
import { UserType } from "@/database/models/userModel";
import { GetServerSideProps } from "next";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import cookie from "cookie";

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
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorTimeout, setErrorTimeout] = useState<any>({});
    const [processError, setProcessError] = useState("");

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
    }

    useEffect(() => {
        setUsername("");
        setConfirmEmail("");
        setConfirmPassword("");
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

        console.log("login");

        setIsLoading(false);
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
                registerResponse === "alreadyRegistered"
                    ? errors.alreadyRegistered
                    : errors.errorDuringRegistration,
                setProcessError
            );
            setIsLoading(false);
            return;
        }

        console.log(registerResponse);

        setIsLoading(false);
    };

    return (
        <div className="flex w-full min-h-screen p-12 bg-red-500">
            <div className="flex-1 bg-green-400">IMMAGINE LATERALE</div>
            <div className="flex items-center justify-center flex-1 bg-white">
                <div className="flex flex-col w-1/2 max-w-full max-h-full gap-2">
                    <div className="mb-2 text-5xl font-semibold">
                        {isRegistering ? "Register" : "Sign in"}
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

                    {processError && <div>{processError}</div>}

                    <button
                        disabled={isLoading}
                        className="p-2 text-white rounded-md bg-stone-800 hover:bg-stone-700 transition"
                        onClick={isRegistering ? registerUser : loginUser}>
                        {isRegistering ? "Register" : "Sign in"}
                    </button>

                    <div className="flex gap-1 m-auto text-slate-600">
                        <div>
                            {isRegistering ? "Already with us?" : "New user?"}
                        </div>
                        <button
                            className="border-b-[1px] border-white hover:border-slate-600 transition"
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

    return {
        props: {},
    };
};
