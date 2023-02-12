import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "mongoose";

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    const uri = process.env.MONGO_URI;

    const connectionResponse = await connect(uri)
        .then(() => ({ status: 200, connected: true }))
        .catch((err) => ({
            status: 500,
            error: err.message,
            connected: false,
        }));

    res.status(connectionResponse.status).json(connectionResponse);
}
