"use client";

import { useState, useEffect } from "react";

import { getEvents } from "@/actions/events";
import { GithubEvent } from "@/types/prisma";

//fetch data server A

export default function DashboardPage() {
    const [events, setEvents] = useState<GithubEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //fetch past data
        const fetchInitialData = async () => {
            try {
                const events = await getEvents();
                setEvents(events);
            } catch (error) {
                console.error("Failed to fetch initial events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        //real time updates
        const sse = new EventSource(
            "http://localhost:3000/api/webhooks/stream",
        );

        sse.onmessage = (event) => {
            const newEvents: GithubEvent = JSON.parse(event.data);
            setEvents((prevEvents) => [newEvents, ...prevEvents]);
        };

        sse.onerror = (err) => {
            console.error("SSE connection error: ", err);
            sse.close();
        };

        //clean up connection when component unmount
        return () => {
            sse.close();
        };
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex  justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            GitHub Activity Dashboard
                        </h1>
                        <p className="text-gray-500">
                            Live feed of repository events
                        </p>
                    </div>
                    {/* Live indicator pulsing dot */}
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live
                    </div>
                </header>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading events...
                        </div>
                    ) : events.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No events received yet. Trigger something on GitHub!
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <li
                                    key={event.id}
                                    className="p-4 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-top-2 duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold text-blue-600">
                                                {event.sender}
                                            </span>
                                            <span className="text-gray-600 mx-2">
                                                {event.action
                                                    ? `${event.eventType} (${event.action})`
                                                    : event.eventType}
                                            </span>
                                            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                                                {event.repoName}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {new Date(
                                                event.receivedAt,
                                            ).toLocaleTimeString()}{" "}
                                            -{" "}
                                            {new Date(
                                                event.receivedAt,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
