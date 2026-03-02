/**
 * open connection with client
 * broadcast new data from webhook
 */

import { Response } from "express";

//store all active client connections
let clients: Response[] = [];

export const addSseClient = (res: Response) => {
    clients.push(res);
};

export const removeSseClient = (res: Response) => {
    clients = clients.filter((client) => client !== res);
};

export const broadcastSseEvent = (data: any) => {
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};
