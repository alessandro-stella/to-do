import { status } from "@/config/statusCodes";
import User, { UserType } from "@/database/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function checkSession(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userid: userId, authcode: authCode } = req.headers;

    if (typeof userId !== "string" || typeof authCode !== "string") {
        return res.status(status.wrongCredentials).json(false);
    }

    const user: UserType | null = await User.findById(userId);

    if (!user) {
        return res.status(status.wrongCredentials).json(false);
    }

    const isAuthenticated = await user.checkUserAuthCode(authCode);

    if (!isAuthenticated) {
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("auth", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: -1,
                path: "/",
            })
        );
    }

    res.status(isAuthenticated ? status.success : status.wrongCredentials).json(
        isAuthenticated ? user._id?.toString() : false
    );
}
