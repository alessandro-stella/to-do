import { NextApiRequest, NextApiResponse } from "next";

export default async function checkSession(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userid: userId, authcode: authCode } = req.headers;

    console.log({ userId, authCode });

    res.status(200).json({ msg: "OK" });
}
