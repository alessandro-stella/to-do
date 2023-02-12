import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
const SALT_FACTOR = 10;

interface User {
    username: string;
    email: string;
    password: string;
    lastLogin: Date | boolean;
    authCode: string | boolean;
}

const userSchema = new Schema<User>({
    username: { type: String, require: true },
    email: {
        type: String,
        require: true,
        index: { unique: true },
    },
    password: { type: String, require: true },
    lastLogin: { type: Date, default: false },
    authCode: { type: String, default: false },
});

userSchema.pre("save", async function save(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err: any) {
        return next(err);
    }
});

userSchema.methods.validatePassword = async function validatePassword(
    passwordToCheck: string
) {
    return bcrypt.compare(passwordToCheck, this.password);
};

function calculateTimeBetweenDates(date1: Date, date2: Date): number {
    const differenceInTime = Math.abs(date2.getTime() - date1.getTime());
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
}

userSchema.methods.checkUserAuthCode = async function checkUserAuthCode(
    codeToCheck: string
) {
    if (codeToCheck !== this.authCode) {
        return { error: "different code" };
    }

    const daysPassed = calculateTimeBetweenDates(this.lastLogin, new Date());

    if (daysPassed >= 7) {
        this.lastLogin = false;
        this.authCode = false;

        return { error: "expired session" };
    }

    return true;
};

const User = model("user", userSchema);

export default User;
