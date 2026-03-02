import { Request, Response } from "express";
import {
    processWebhookEvent,
    getRecentEvents,
} from "@/services/webhook.service.js";
import {
    addSseClient,
    broadcastSseEvent,
    removeSseClient,
} from "@/services/sse.service.js";

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

        const savedEvent = await processWebhookEvent(
            githubDeliveryId,
            githubEvent,
            payload,
        );

        broadcastSseEvent(savedEvent);

        res.status(202).send("Webhook received and processing");
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const fetchEvents = async (req: Request, res: Response) => {
    try {
        const events = await getRecentEvents();
        res.status(200).json(events ?? []);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
    }
};

//handle sse connenction
export const streamEvents = (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    //send initial msg to established connection
    res.write(": connected\n\n");

    addSseClient(res);

    req.on("close", () => {
        removeSseClient(res);
    });
};
