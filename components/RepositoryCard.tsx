import { RepoAnalysis } from "@/types/github";
import { Text, View } from "react-native";

interface RepositoryCardProps {
    repo: RepoAnalysis;
}

export const RepositoryCard = ({ repo }: RepositoryCardProps) => {
    return (
        <View 
            className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100"
        >
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2" numberOfLines={2}>
                    {repo.repoName}
                </Text>
                {repo.isOwner && (
                    <View className="bg-blue-100 px-2 py-1 rounded flex-shrink-0">
                        <Text className="text-blue-600 text-sm">Owner</Text>
                    </View>
                )}
            </View>
            <View className="space-y-2">
                {repo.topActivities.map((activity, actIndex) => (
                    <View key={actIndex} className="flex-row justify-between items-center">
                        <Text className="text-gray-600 capitalize">
                            {activity.type.replace(/_/g, ' ')}
                        </Text>
                        <Text className="text-gray-800 font-medium">
                            {activity.count} {activity.count === 1 ? 'time' : 'times'}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}; 