import { GitHubEvent } from "@/types/extractedTypes";
import { ActivityCount, RepoAnalysis } from "@/types/github";

export const handleError = (error: Error) => {
    console.error('Error fetching GitHub data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}

export const groupEventsByRepo = (events: GitHubEvent[]): Record<string, GitHubEvent[]> => {
    return events.reduce((acc, event) => {
        if(!acc[event.repo.id]){
            acc[event.repo.id] = [];
        }
        acc[event.repo.id].push(event);
        return acc;
    }, {} as Record<string, GitHubEvent[]>);
}

export const analyzeRepoActivities = (events: GitHubEvent[]): ActivityCount[] => {
    const topActivities = events.reduce((acc, event) => {
        if(!acc[event.type]){
            acc[event.type] = {
                type: event.type,
                count: 1,
            }
        }
        else{
            acc[event.type].count++;
        }
        return acc;
    }, {} as Record<string, ActivityCount>);

    const renameEvent = (event: string) => {
        return event
          .replace(/Event$/, '')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .trim();
    };

    const topActivitiesRenamed = Object.entries(topActivities).map(([key, value]) => ({
        type: renameEvent(key),
        count: value.count,
    }));

    return Object.values(topActivitiesRenamed).sort((a, b) => b.count - a.count).slice(0, 3);
}

export const createRepoAnalysis = (
    events: GitHubEvent[],
    username: string
): RepoAnalysis => {
    const usernameLower = username.toLowerCase();
    const isOwner = events[0].actor.login.toLowerCase() === usernameLower;
    const repoName = events[0].repo.name;
    const repoUrl = events[0].repo.url;

    return {
        repoName,
        repoUrl,
        isOwner,
        topActivities: analyzeRepoActivities(events),
    };
}
