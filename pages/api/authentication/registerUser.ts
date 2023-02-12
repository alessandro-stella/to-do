import { NextApiRequest, NextApiResponse } from "next";

export default function registerUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { username, email, password } = req.headers;

    console.log({ username, email, password });

    return res.status(200).json({ daje: "ok" });
}
