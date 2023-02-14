import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";
const SALT_FACTOR = 10;
import crypto from "crypto";

export interface UserType {
    _id?: string,
    username: string;
    email: string;
    password: string;
    lastLogin: Date | boolean;
    authCode: string;
}

const userSchema = new Schema<UserType>({
    username: { type: String, require: true },
    email: {
        type: String,
        require: true,
        index: { unique: true },
    },
    password: { type: String, require: true },
    lastLogin: { type: Schema.Types.Mixed, default: Date.now },
    authCode: { type: String, default: generateAuthString() },
});

function calculateTimeBetweenDates(date1: Date, date2: Date): number {
    const differenceInTime = Math.abs(date2.getTime() - date1.getTime());
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
}

function generateAuthString(): string {
    return crypto.randomBytes(256).toString("hex");
}

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

userSchema.methods.createAuthToken = function createAuthToken() {
    this.authCode = generateAuthString();
    this.lastLogin = Date.now;
};

userSchema.methods.checkUserAuthCode = async function checkUserAuthCode(
    codeToCheck: string
) {
    if (codeToCheck !== this.authCode) {
        return { error: "different code" };
    }

    const daysPassed = calculateTimeBetweenDates(this.lastLogin, new Date());

    if (daysPassed >= 7) {
        this.lastLogin = false;
        this.authCode = "";

        return { error: "expired session" };
    }

    return true;
};

const User = models.User || model("User", userSchema);

export default User;
