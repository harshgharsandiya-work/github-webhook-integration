import { Router } from "express";
import {
    handleGithubWebhook,
    fetchEvents,
    streamEvents,
} from "@/controllers/webhook.controller.js";
import { verifyGithubSignature } from "@/middlewares/verifyGithubWebhook.js";

const router = Router();

router.post("/github", verifyGithubSignature, handleGithubWebhook);

//no signature required in get events
router.get("/events", fetchEvents);

//sse route
router.get("/stream", streamEvents);

export default router;
