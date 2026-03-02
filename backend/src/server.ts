import express, { Request, Response } from "express";
import { prisma } from "@/config/prisma.js";
import app from "@/app.js";

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await prisma.$connect();
        console.log("Database connected!!!");

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to db: ", error);
        process.exit(1);
    }
})();
