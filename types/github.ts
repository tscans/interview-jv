export interface ActivityCount {
    type: string;
    count: number;
}

export interface RepoAnalysis {
    repoName: string;
    repoUrl: string;
    isOwner: boolean;
    topActivities: ActivityCount[];
}

export interface GitHubActivityResponse {
    username: string;
    repositories: RepoAnalysis[];
}

export interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        id: number;
        login: string;
        display_login: string;
        gravatar_id: string;
        url: string;
        avatar_url: string;
    };
    repo: {
        id: number;
        name: string;
        url: string;
    };
    payload: {
        commits: Array<{
            sha: string;
            author: {
                email: string;
                name: string;
            };
            message: string;
            distinct: boolean;
            url: string;
        }>;
        push_id: number;
        size: number;
        distinct_size: number;
        ref: string;
        head: string;
        before: string;
    };
    public: boolean;
    created_at: string;
} 