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
        res.status(status.unauthenticated).json({ authenticated: false });
        return;
    }

    const user: UserType | null = await User.findById(userId);

    if (!user) {
        res.status(status.unauthenticated).json({ isAuthenticated: false });
        return;
    }

    const isAuthenticated = user.checkUserAuthCode(authCode);

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

    res.status(isAuthenticated ? status.success : status.unauthenticated).json(
        isAuthenticated
    );
}
