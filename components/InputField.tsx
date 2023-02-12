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
        <div className="relative bg-blue-300">
            <input
                className="bg-white"
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
                    disabled={disabled}
                    className="absolute top-0 right-0 grid h-full bg-orange-500 place-content-center"
                    onClick={() => setIsPasswordShown(!isPasswordShown)}>
                    {isPasswordShown ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
            )}

            {error && <div>{error}</div>}
        </div>
    );
}
