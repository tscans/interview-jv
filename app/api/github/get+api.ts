import { GitHubEvent } from "@/types/extractedTypes";
import { GitHubActivityResponse } from "@/types/github";
import { createRepoAnalysis, groupEventsByRepo, handleError } from "@/utils/backend";

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_API_HEADERS = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Activity-Analyzer'
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return handleError(new Error('Username is required'));
    }

    try {
        // Fetch user's recent events
        const eventsResponse = await fetch(
            `${GITHUB_API_BASE_URL}/users/${username}/events/public`,
            {
                headers: GITHUB_API_HEADERS
            }
        );

        if (!eventsResponse.ok) {
            return handleError(new Error(`GitHub API error: ${eventsResponse.statusText}`));
        }

        const events: GitHubEvent[] = await eventsResponse.json();
        const eventsByRepoId = groupEventsByRepo(events);

        const repoAnalysis = Object.values(eventsByRepoId).map(repoEvents => 
            createRepoAnalysis(repoEvents, username)
        );

        const response: GitHubActivityResponse = {
            username: username,
            repositories: repoAnalysis,
        }

        console.log('response 333333');

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return handleError(error as Error);
    }
}
