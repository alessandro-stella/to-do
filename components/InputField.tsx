import { Dispatch, SetStateAction, FormEvent } from "react";
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
                className={`bg-white p-1.5 w-full rounded-md border-slate-400 placeholder-slate-400 border-[1px] ${
                    setIsPasswordShown ? "pr-8" : ""
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
                <div className="absolute top-0 right-0 grid h-full px-2 place-content-center text-slate-500">
                    <button
                        disabled={disabled}
                        onClick={() => setIsPasswordShown(!isPasswordShown)}>
                        {isPasswordShown ? (
                            <AiFillEyeInvisible />
                        ) : (
                            <AiFillEye />
                        )}
                    </button>
                </div>
            )}

            {error && <div>{error}</div>}
        </div>
    );
}
