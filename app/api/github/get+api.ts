import { GitHubEvent, RepoAnalysis } from '@/types/github';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return new Response(JSON.stringify({ error: 'Username is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
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
            throw new Error(`GitHub API error: ${eventsResponse.statusText}`);
        }

        const events: GitHubEvent[] = await eventsResponse.json();

        // Group events by repository
        const repoAnalysis = new Map<string, RepoAnalysis>();

        for (const event of events) {
            const repoName = event.repo.name;
            
            if (!repoAnalysis.has(repoName)) {
                repoAnalysis.set(repoName, {
                    repoName,
                    repoUrl: event.repo.url,
                    isOwner: false,
                    topActivities: []
                });
            }

            const repo = repoAnalysis.get(repoName)!;
            const activityIndex = repo.topActivities.findIndex(a => a.type === event.type);
            
            if (activityIndex === -1) {
                repo.topActivities.push({ type: event.type, count: 1 });
            } else {
                repo.topActivities[activityIndex].count++;
            }
        }

        // Sort activities by count and take top 3
        for (const repo of repoAnalysis.values()) {
            repo.topActivities.sort((a, b) => b.count - a.count);
            repo.topActivities = repo.topActivities.slice(0, 3);
        }

        // Check repository ownership
        const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Activity-Analyzer'
                }
            }
        );

        if (!reposResponse.ok) {
            throw new Error(`GitHub API error: ${reposResponse.statusText}`);
        }

        const ownedRepos = await reposResponse.json();
        const ownedRepoNames = new Set(ownedRepos.map((repo: any) => repo.full_name));

        for (const repo of repoAnalysis.values()) {
            repo.isOwner = ownedRepoNames.has(repo.repoName);
        }

        return new Response(JSON.stringify({
            username,
            repositories: Array.from(repoAnalysis.values())
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch GitHub data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
