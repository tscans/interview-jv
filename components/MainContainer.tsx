import { Body } from "@/components/Body";
import { Header } from "@/components/Header";
import { View } from "react-native";

export const MainContainer = () => {
    //fetchGitHubActivity
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Header />
            <Body />
        </View>
    )
}   