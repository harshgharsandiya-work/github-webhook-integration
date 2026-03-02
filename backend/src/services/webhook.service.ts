import { prisma } from "@/config/prisma.js";
import { WebhookEvent } from "@octokit/webhooks-types";

export const processWebhookEvent = async (
    githubDeliveryId: string,
    eventType: string,
    payload: WebhookEvent,
) => {
    //extract data from payload
    const action = "action" in payload ? payload.action : null;

    const sender = "sender" in payload ? payload.sender?.login : "unknown";

    const repoName =
        "repository" in payload ? payload.repository?.name : "unknown_repo";

    //save to db
    await prisma.githubEvent.create({
        data: {
            githubId: githubDeliveryId,
            eventType,
            action,
            sender,
            repoName,
            payload: payload as any,
        },
    });
};

export const getRecentEvents = async (limit: number = 20) => {
    return await prisma.githubEvent.findMany({
        orderBy: { receivedAt: "desc" },
        take: limit,
    });
};
