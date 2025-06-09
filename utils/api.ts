import { GitHubActivityResponse } from '@/types/github';

interface ActivityCount {
    type: string;
    count: number;
}

interface RepoAnalysis {
    repoName: string;
    repoUrl: string;
    isOwner: boolean;
    topActivities: ActivityCount[];
}

export async function fetchGitHubActivity(username: string): Promise<GitHubActivityResponse> {
    const response = await fetch(`/api/github/get?username=${encodeURIComponent(username)}`);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch GitHub activity');
    }

    return response.json();
}
