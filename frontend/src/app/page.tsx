import { GithubEvent } from "@/types/prisma";
import { getEvents } from "@/actions/events";

//fetch data server A

export default async function Home() {
    const events = await getEvents();

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">
                        GitHub Activity Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Live feed of repository events
                    </p>
                </header>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No events received yet. Trigger something on GitHub!
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <li
                                    key={event.id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
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
                                            ).toLocaleString()}
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
