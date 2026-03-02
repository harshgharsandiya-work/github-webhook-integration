export interface GithubEvent {
    id: string;
    eventType: string;
    action: string | null;
    sender: string;
    repoName: string;
    receivedAt: string;
}
