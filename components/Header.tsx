import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Header = () => {
    const insets = useSafeAreaInsets();
    
    return (
        <View className="bg-[#151433]" style={{ paddingTop: insets.top, backgroundColor: Colors.main }}>
            <View className="px-4 pb-4">
                <Text className="text-[#E8F6FF] text-2xl font-bold text-center">JellyGit</Text>
            </View>
        </View>
    )
}   