import { Request, Response } from "express";
import { processWebhookEvent } from "@/services/webhook.service.js";

export const handleGithubWebhook = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const githubDeliveryId = req.headers["x-github-delivery"] as string;
        const githubEvent = req.headers["x-github-event"] as string;
        const payload = req.body;

        if (!githubDeliveryId || !githubEvent) {
            res.status(400).send("Missing Github Headers");
            return;
        }

        await processWebhookEvent(githubDeliveryId, githubEvent, payload);

        res.status(202).send("Webhook received and processing");
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
};
