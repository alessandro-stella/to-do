import User, { UserType } from "@/database/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import { status } from "@/config/statusCodes";
import cookie from "cookie";

export default async function registerUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { username, email, password } = req.headers;

    try {
        const existingUser: UserType | null = await User.findOne({ email });

        if (existingUser) {
            return res.status(status.alreadyExisting).json("alreadyRegistered");
        }

        const newUser = new User({ username, email, password });

        const saveResponse: UserType | null = await newUser
            .save()
            .catch(() => null);

        if (saveResponse) {
            return res
                .setHeader(
                    "Set-Cookie",
                    cookie.serialize(
                        "auth",
                        JSON.stringify({
                            userId: saveResponse._id,
                            authCode: saveResponse.authCode,
                        }),
                        {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== "development",
                            maxAge: 60 * 60 * 24 * 7,
                            path: "/",
                        }
                    )
                )
                .status(status.created)
                .json(saveResponse);
        }
    } catch (e) {
        return res.status(status.serverError).json("errorDuringRegistration");
    }
}
