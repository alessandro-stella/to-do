import User, { UserType } from "@/database/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import { status } from "@/config/statusCodes";
import cookie from "cookie";

export default async function registerUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userid: userId } = req.headers;

    try {
        const loggedUser: UserType | null = await User.findById(userId);

        if (!loggedUser) {
            return res
                .setHeader(
                    "Set-Cookie",
                    cookie.serialize("auth", "", {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        maxAge: -1,
                        path: "/",
                    })
                )
                .status(status.resourceNotFound)
                .json(false);
        }

        await loggedUser.logoutUser();

        return res
            .setHeader(
                "Set-Cookie",
                cookie.serialize("auth", "", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: -1,
                    path: "/",
                })
            )
            .status(status.success)
            .json(true);
    } catch (e) {
        return res.status(status.serverError).json("serverError");
    }
}
