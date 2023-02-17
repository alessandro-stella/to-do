import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { GiSettingsKnobs } from "react-icons/gi";

export default function SideBar({ userId }: { userId: string }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutError, setShowLogoutError] = useState(false);
    const [errorTimeout, setErrorTimeout] = useState<any>({});

    function triggerError() {
        setShowLogoutError(true);
        clearTimeout(errorTimeout);

        const tempTimeout = setTimeout(() => {
            setShowLogoutError(false);
        }, 3000);

        setErrorTimeout(tempTimeout);
    }

    async function logOut() {
        const logoutResponse = await fetch("/api/authentication/logoutUser", {
            headers: { userId },
        }).then((res) => res.json());

        if (!logoutResponse) {
            triggerError();
            return;
        }

        router.push("/login");
    }

    return (
        <div
            className={`p-4 rounded-lg transition-all flex flex-col ${
                isOpen ? "flex-[2] bg-violet-500" : "flex-[0]"
            }`}>
            <div className="flex item-center justify-between transition-all scale-100 mb-2">
                <div
                    className={`transition-all origin-left text-2xl font-semibold ${
                        isOpen
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 w-0 opacity-0"
                    }`}>
                    Menu
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="text-3xl">
                    <AiOutlineMenu />
                </button>
            </div>

            <div
                className={`transition-all origin-left flex flex-col flex-1 gap-2 ${
                    isOpen
                        ? "scale-x-100 w-full opacity-100"
                        : "scale-x-0 w-0 opacity-0"
                }`}>
                <div>
                    <div>Section title</div>
                    <div>Option</div>
                    <div>Option</div>
                    <div>Option</div>
                </div>

                <div>
                    <div>Section title</div>
                    <div>Option</div>
                    <div>Option</div>
                    <div>Option</div>
                </div>

                <div>
                    <div>Section title</div>
                    <div>Option</div>
                    <div>Option</div>
                    <div>Option</div>
                </div>
            </div>

            <div
                className={`flex flex-col gap-2 ${
                    isOpen
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 w-0 opacity-0"
                }`}>
                <div className="flex gap-2 items-center hover:cursor-pointer w-fit">
                    <GiSettingsKnobs className="rotate-90" />
                    <div>Settings</div>
                </div>
                <div
                    className="flex gap-2 items-center hover:cursor-pointer w-fit"
                    onClick={() => logOut()}>
                    <FiLogOut />
                    <div>Log out</div>
                </div>
                {showLogoutError && (
                    <div className="text-sm text-red-500">
                        There's been an error during the process, please try
                        again later
                    </div>
                )}
            </div>
        </div>
    );
}
