import { GitHubEvent } from '@/types/extractedTypes';
import { GET } from '../get+api';

// Mock fetch
global.fetch = jest.fn();
const url = 'http://localhost:8081/api/github/get';
const constantErrorCode = 500;

describe('GitHub API Endpoint', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('should return error when username is not provided', async () => {
        const request = new Request(url);
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(constantErrorCode);
        expect(data.error).toBe('Username is required');
    });

    it('should handle GitHub API errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const request = new Request(`${url}?username=testuser`);
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(constantErrorCode);
        expect(data.error).toBe('Network error');
    });

    it('should handle non-200 GitHub API responses', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: 'Not Found'
        });

        const request = new Request(`${url}?username=testuser`);
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(constantErrorCode);
        expect(data.error).toBe('GitHub API error: Not Found');
    });

    it('should successfully process GitHub events', async () => {
        const mockEvents: GitHubEvent[] = [
            {
                id: '1',
                type: 'PushEvent',
                actor: {
                    id: 123,
                    login: 'testuser',
                    display_login: 'testuser',
                    gravatar_id: '',
                    url: 'https://api.github.com/users/testuser',
                    avatar_url: 'https://github.com/avatar.png'
                },
                repo: {
                    id: 123,
                    name: 'testuser/repo1',
                    url: 'https://github.com/testuser/repo1'
                },
                payload: {
                    commits: [
                        {
                            sha: 'abc123',
                            author: {
                                email: 'test@example.com',
                                name: 'Test User'
                            },
                            message: 'Test commit',
                            distinct: true,
                            url: 'https://github.com/testuser/repo1/commit/abc123'
                        }
                    ],
                    push_id: 123,
                    size: 1,
                    distinct_size: 1,
                    ref: 'refs/heads/main',
                    head: 'abc123',
                    before: 'def456'
                },
                public: true,
                created_at: '2024-03-20T00:00:00Z'
            }
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockEvents)
        });

        const request = new Request(`${url}?username=testuser`);
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.username).toBe('testuser');
        expect(data.repositories).toHaveLength(1);
        expect(data.repositories[0].repoName).toBe('testuser/repo1');
    });
}); 