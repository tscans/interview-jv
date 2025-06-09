import { GitHubActivityResponse } from "@/types/github";
import { atom, useAtom } from "jotai";

const githubDataAtom = atom<GitHubActivityResponse | null>(null);

export const useGithubData = () => {
    const [githubData, setGithubData] = useAtom(githubDataAtom);
    return { githubData, setGithubData };
}
