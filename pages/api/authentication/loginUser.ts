import User, { UserType } from "@/database/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import { status } from "@/config/statusCodes";
import cookie from "cookie";

export default async function registerUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, password } = req.headers;

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(status.wrongCredentials).json("invalidCredentials");
    }

    try {
        const existingUser: UserType | null = await User.findOne({
            email,
        });

        if (existingUser) {
            const passwordIsValid = await existingUser.validatePassword(
                password
            );

            if (!passwordIsValid) {
                return res
                    .status(status.wrongCredentials)
                    .json("wrongPassword");
            }

            const tokenCreated = await existingUser.createAuthToken();

            return res
                .setHeader(
                    "Set-Cookie",
                    cookie.serialize(
                        "auth",
                        JSON.stringify({
                            userId: existingUser._id,
                            authCode: tokenCreated.authCode,
                        }),
                        {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== "development",
                            maxAge: 60 * 60 * 24 * 7,
                            path: "/",
                        }
                    )
                )
                .status(status.success)
                .json({ loggedId: true });
        } else {
            return res.status(status.resourceNotFound).json("emailNotFound");
        }
    } catch (e) {
        return res.status(status.serverError).json("errorDuringLogin");
    }
}
