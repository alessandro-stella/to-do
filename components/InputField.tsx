import { Dispatch, FormEvent, SetStateAction } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface inputFieldProps {
    label: string;
    value: string;
    type: string;
    setValue: Dispatch<SetStateAction<string>>;
    isPasswordShown?: boolean;
    setIsPasswordShown?: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
    error?: string | boolean;
}

export default function InputField({
    label,
    value,
    type,
    setValue,
    isPasswordShown,
    setIsPasswordShown,
    disabled,
    error = false,
}: inputFieldProps) {
    return (
        <div className="relative">
            <input
                className={`bg-white p-1.5 w-full rounded-md placeholder-slate-400 border-[1px] transition ${
                    setIsPasswordShown ? "pr-9" : ""
                } ${
                    error
                        ? "border-red-500 outline-red-500"
                        : "border-slate-400"
                }`}
                disabled={disabled}
                type={type}
                value={value}
                placeholder={label}
                onChange={(e: FormEvent<HTMLInputElement>) => {
                    setValue(e.currentTarget.value);
                }}
            />

            {setIsPasswordShown && (
                <button
                    className="absolute top-0 right-0 h-[2.37rem] grid text-xl px-2 place-content-center text-slate-500"
                    disabled={disabled}
                    onClick={() => setIsPasswordShown(!isPasswordShown)}>
                    {isPasswordShown ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
    );
}
