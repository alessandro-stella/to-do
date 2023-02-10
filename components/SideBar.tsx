import { useState } from "react";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`bg-violet-500 flex justify-between ${
                isOpen ? "w-1/4" : "w-min"
            }`}>
            SideBar
            <button onClick={() => setIsOpen(!isOpen)} className="h-fit">
                Close
            </button>
        </div>
    );
}
