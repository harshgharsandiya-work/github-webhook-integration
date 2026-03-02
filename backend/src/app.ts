import express, { Request, Response } from "express";
import cors from "cors";

//routes import
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req: Request, res: Response) => {
    console.log("Server is running...");
});

app.use("/api/webhooks", webhookRoutes);

export default app;
