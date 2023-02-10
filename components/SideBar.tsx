import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`p-4 rounded-lg transition-all ${
                isOpen ? "flex-[2] bg-violet-500" : "flex-[0]"
            }`}>
            <div className="bg-green-400 flex item-center justify-between transition-all scale-100 mb-2">
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
                className={`transition-all origin-left flex flex-col gap-2 ${
                    isOpen
                        ? "scale-x-100 opacity-100"
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
        </div>
    );
}
