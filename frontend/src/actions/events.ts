import { GithubEvent } from "@/types/prisma";

export const getEvents = async (): Promise<GithubEvent[]> => {
    const res = await fetch("http://localhost:3000/api/webhooks/events", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch events ${res.status}`);
    }

    return res.json();
};
