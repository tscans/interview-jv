import { GitHubActivityResponse } from '@/types/github';

export async function fetchGitHubActivity(username: string): Promise<{data: GitHubActivityResponse | null, error: string | null}> {
    try{
        const response = await fetch(`/api/github/get?username=${encodeURIComponent(username)}`); 
        const data = await response.json();
        if(response.status !== 200){
            return {
                data: null,
                error: data.error,
            }
        }
        return {
            data: data,
            error: null,
        }
    }
    catch(error: any){
        return {
            data: null,
            error: error.message || 'Failed to fetch GitHub activity',
        }
    }
}
