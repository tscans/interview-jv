import { useGithubData } from "@/state/githubDataAtom";
import { useIsLoading } from "@/state/isLoadingAtom";
import { RepoAnalysis } from "@/types/github";
import { ActivityIndicator, Text, View } from "react-native";
import { RepositoryCard } from "./RepositoryCard";

export const Body = () => {
    const {githubData} = useGithubData();
    const {isLoading} = useIsLoading();

    if (isLoading) {
        return (
            <View className="justify-center items-center mt-8">
                <ActivityIndicator size="large" color="#2C3E50" />
            </View>
        );
    }

    if (!githubData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500 text-lg">Enter a GitHub username to see their activity</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 px-4 py-6">
            <Text className="text-2xl font-bold mb-4 text-gray-800">
                {githubData.username}'s Recent Activity
            </Text>
            {githubData.repositories.map((repo: RepoAnalysis, index: number) => (
                <RepositoryCard key={index} repo={repo} />
            ))}
            {githubData.repositories.length === 0 && (
                <Text className="text-gray-500 text-lg">No repositories found</Text>
            )}
        </View>
    );
}   