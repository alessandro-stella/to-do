import InputField from "@/components/InputField";
import url from "@/config/url";
import { UserType } from "@/database/models/userModel";
import { GetServerSideProps } from "next";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

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
    const unparsedCookie: string = context.req.cookies["auth"] ?? "{}";
    const userData = JSON.parse(unparsedCookie);

    console.log(userData);

    console.log("BEFORE FETCH");

    const isSessionValid = await fetch(
        `${url}/api/authentication/checkSession`,
        {
            headers: { ...userData },
        }
    ).then((res) => res.json());

    const isLoggedIn = false;

    console.log({ isSessionValid });

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
