import { GitHubActivityResponse } from '@/types/github';

export async function fetchGitHubActivity(username: string): Promise<{data: GitHubActivityResponse | null, error: string | null}> {
    try{
        const response = await fetch(`/api/github/get?username=${encodeURIComponent(username)}`); 
        return {
            data: await response.json(),
            error: null,
        }
    }
    catch(error: any){
        console.error('Error fetching GitHub activity:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch GitHub activity',
        }
    }
}
