import { GitHubActivityResponse } from "../../../types/github";
import { createRepoAnalysis, fetchRepositoriesDetails, fetchUserEvents, groupEventsByRepo, handleError } from "../../../utils/backend";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return handleError(new Error('Username is required'));
    }

    try {
        const events = await fetchUserEvents(username);
        const eventsByRepoId = groupEventsByRepo(events);

        const repoOwnershipMap = await fetchRepositoriesDetails(eventsByRepoId, username);

        const repoAnalysis = Object.values(eventsByRepoId).map(repoEvents => 
            createRepoAnalysis(repoEvents, repoOwnershipMap[repoEvents[0].repo.name])
        );

        const response: GitHubActivityResponse = {
            username: username,
            repositories: repoAnalysis,
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return handleError(error as Error);
    }
}
