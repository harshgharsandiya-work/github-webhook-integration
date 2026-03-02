import express, { Request, Response } from "express";
import cors from "cors";
import { RequestWithRawBody } from "@/middlewares/verifyGithubWebhook.js";

//routes import
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

//middleware
app.use(cors());
app.use(
    express.json({
        verify(req: RequestWithRawBody, res, buf, encoding) {
            req.rawBody = buf;
        },
    }),
);

//routes
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Server is running...");
});

app.use("/api/webhooks", webhookRoutes);

export default app;
