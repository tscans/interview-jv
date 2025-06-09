export interface GitHubEvent {
    type: string;
    repo: {
        name: string;
        url: string;
    };
}

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