import { GitHubEvent } from "../types/extractedTypes";
import { ActivityCount, RepoAnalysis } from "../types/github";

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_API_HEADERS = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Activity-Analyzer'
};

async function fetchRepoDetails(repoName: string) {
    const response = await fetch(
        `${GITHUB_API_BASE_URL}/repos/${repoName}`,
        {
            headers: GITHUB_API_HEADERS
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch repo details: ${response.statusText}`);
    }

    return response.json();
}

export const fetchRepositoriesDetails = async (eventsByRepoId: Record<string, GitHubEvent[]>, username: string) => {
    const repoDetailsPromises = Object.values(eventsByRepoId).map(async (repoEvents) => {
        const repoName = repoEvents[0].repo.name;
        try {
            const repoDetails = await fetchRepoDetails(repoName);
            return {
                repoName,
                isOwner: repoDetails.owner.login.toLowerCase() === username.toLowerCase()
            };
        } catch (error) {
            console.error(`Error fetching details for ${repoName}:`, error);
            return {
                repoName,
                isOwner: false
            };
        }
    });

    const repoDetails = await Promise.all(repoDetailsPromises);
    return Object.fromEntries(
        repoDetails.map(details => [details.repoName, details.isOwner])
    );
}

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
    isOwner: boolean
): RepoAnalysis => {
    const repoName = events[0].repo.name;
    const repoUrl = events[0].repo.url;

    return {
        repoName,
        repoUrl,
        isOwner,
        topActivities: analyzeRepoActivities(events),
    };
}

export const fetchUserEvents = async (username: string): Promise<GitHubEvent[]> => {
    const response = await fetch(
        `${GITHUB_API_BASE_URL}/users/${username}/events/public`,
        {
            headers: GITHUB_API_HEADERS
        }
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
}
