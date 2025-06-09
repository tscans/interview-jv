import { useGithubData } from "@/state/githubDataAtom";
import { useIsLoading } from "@/state/isLoadingAtom";
import { ActivityIndicator, View } from "react-native";

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
}   