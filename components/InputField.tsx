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
                className={`bg-customViolet-900 p-1.5 w-full rounded-md placeholder-customViolet-750 border-[1px] focus:border-customViolet-600 border-customViolet-950 transition-all ${
                    setIsPasswordShown ? "pr-9" : ""
                } ${error ? "border-red-500" : "border-customViolet-950"}`}
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
                    className="absolute top-0 right-0 h-[2.37rem] grid text-xl px-2 place-content-center text-customViolet-750"
                    disabled={disabled}
                    onClick={() => setIsPasswordShown(!isPasswordShown)}>
                    {isPasswordShown ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
    );
}
