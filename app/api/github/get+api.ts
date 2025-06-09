import { GitHubEvent } from "@/types/api";
import { ActivityCount, GitHubActivityResponse, RepoAnalysis } from "@/types/github";

const handleError = (error: Error) => {
    console.error('Error fetching GitHub data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return handleError(new Error('Username is required'));
    }

    try {
        // Fetch user's recent events
        const eventsResponse = await fetch(
            `https://api.github.com/users/${username}/events/public`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Activity-Analyzer'
                }
            }
        );

        if (!eventsResponse.ok) {
            return handleError(new Error(`GitHub API error: ${eventsResponse.statusText}`));
        }

        // Acceptance Criteria
        // Write a program to access GitHubʼs public API for a user (ie ge0ffrey )
        // For each repo that the user has contributed to recently:
        // Find their 3 most common activity types. (e.g. commits, pull requests, comments, merges...)
        // Within that recent activity, flag any repos that the user owns.

        const events: GitHubEvent[] = await eventsResponse.json();

        const eventsByRepoId = events.reduce((acc, event) => {
            if(!acc[event.repo.id]){
                acc[event.repo.id] = [];
            }
            acc[event.repo.id].push(event);
            return acc;
        }, {} as Record<string, GitHubEvent[]>);

        console.log('eventsByRepoId');
        console.log(JSON.stringify(eventsByRepoId, null, 2));

        const usernameLower = username.toLowerCase();

        const repoAnalysis: RepoAnalysis[] = [];
        for(const repoId in eventsByRepoId){
            const events = eventsByRepoId[repoId];

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

            const topActivitiesSorted = Object.values(topActivities).sort((a, b) => b.count - a.count).slice(0, 3);
            const isOwner = events[0].actor.login.toLowerCase() === usernameLower;
            const repoName = events[0].repo.name;
            const repoUrl = events[0].repo.url;

            const repoAnalysisItem: RepoAnalysis = {
                repoName: repoName,
                repoUrl: repoUrl,
                isOwner: isOwner,
                topActivities: topActivitiesSorted,
            }

            repoAnalysis.push(repoAnalysisItem);
        }

        const response : GitHubActivityResponse = {
            username: username,
            repositories: repoAnalysis,
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        handleError(error as Error);
    }
}
