import { GitHubEvent } from '@/types/github';
import { fetchRepositoriesDetails } from '../backend';

describe('Backend Utilities', () => {
    describe('fetchRepositoriesDetails', () => {
        const mockUsername = 'testuser';
        const mockEventsByRepoId: Record<string, GitHubEvent[]> = {
            '123': [{
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
                    commits: [],
                    push_id: 123,
                    size: 1,
                    distinct_size: 1,
                    ref: 'refs/heads/main',
                    head: 'abc123',
                    before: 'def456'
                },
                public: true,
                created_at: '2024-03-20T00:00:00Z'
            }],
            '456': [{
                id: '2',
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
                    id: 456,
                    name: 'otheruser/repo2',
                    url: 'https://github.com/otheruser/repo2'
                },
                payload: {
                    commits: [],
                    push_id: 456,
                    size: 1,
                    distinct_size: 1,
                    ref: 'refs/heads/main',
                    head: 'abc123',
                    before: 'def456'
                },
                public: true,
                created_at: '2024-03-20T00:00:00Z'
            }]
        };

        beforeEach(() => {
            global.fetch = jest.fn();
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should correctly identify repository ownership', async () => {
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ owner: { login: 'testuser' } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ owner: { login: 'otheruser' } })
                });

            const result = await fetchRepositoriesDetails(mockEventsByRepoId, mockUsername);

            expect(result).toEqual({
                'testuser/repo1': true,
                'otheruser/repo2': false
            });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should handle API errors gracefully', async () => {
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ owner: { login: 'testuser' } })
                })
                .mockRejectedValueOnce(new Error('API Error'));

            const result = await fetchRepositoriesDetails(mockEventsByRepoId, mockUsername);

            expect(result).toEqual({
                'testuser/repo1': true,
                'otheruser/repo2': false
            });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should handle non-200 responses', async () => {
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ owner: { login: 'testuser' } })
                })
                .mockResolvedValueOnce({
                    ok: false,
                    statusText: 'Not Found'
                });

            const result = await fetchRepositoriesDetails(mockEventsByRepoId, mockUsername);

            expect(result).toEqual({
                'testuser/repo1': true,
                'otheruser/repo2': false
            });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });
}); 