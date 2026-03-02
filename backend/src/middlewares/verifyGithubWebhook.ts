import crypto, { sign, verify } from "crypto";
import { Request, Response, NextFunction } from "express";

export interface RequestWithRawBody extends Request {
    rawBody?: Buffer;
}

export const verifyGithubSignature = (
    req: RequestWithRawBody,
    res: Response,
    next: NextFunction,
) => {
    const signature = req.headers["x-hub-signature-256"] as string;
    const secret = process.env.WEBHOOK_SECRET;

    if (!signature || !secret || !req.rawBody) {
        return res
            .status(401)
            .send("Unauthorized: Missing signature, secret, or raw body");
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");

    try {
        const signatureBuffer = Buffer.from(signature);
        const digestBuffer = Buffer.from(digest);

        if (
            signatureBuffer.length !== digestBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, digestBuffer)
        ) {
            res.status(401).send("Unauthorized: Signature mismatch");
            return;
        }
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid signature format");
        return;
    }

    next();
};
