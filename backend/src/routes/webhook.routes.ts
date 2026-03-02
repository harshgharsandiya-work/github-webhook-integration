import { Router } from "express";
import {
    handleGithubWebhook,
    fetchEvents,
} from "@/controllers/webhook.controller.js";
import { verifyGithubSignature } from "@/middlewares/verifyGithubWebhook.js";

const router = Router();

router.post("/github", verifyGithubSignature, handleGithubWebhook);

//no signature required in get events
router.get("/events", fetchEvents);

export default router;
