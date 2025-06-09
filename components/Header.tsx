import { Colors } from "@/constants/Colors";
import { useGithubData } from "@/state/githubDataAtom";
import { useIsLoading } from "@/state/isLoadingAtom";
import { fetchGitHubActivity } from "@/utils/api";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Header = () => {
    const {top} = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const {setGithubData} = useGithubData();
    const {isLoading, setIsLoading} = useIsLoading();
    
    const handleSubmit = async () => {
        if(searchQuery.trim() === ""){
            return;
        }

        setIsLoading(true);
        const {data, error} = await fetchGitHubActivity(searchQuery);
        setIsLoading(false);
        if(error){
            console.error('Error fetching GitHub activity:', error);
        }
        else{
            setGithubData(data);
        }
    };
    
    return (
        <View 
            style={{ 
                paddingTop: top, 
                backgroundColor: Colors.main,
            }}
            className="px-4 flex justify-between"
        >   
            <View>
                <Text className="text-[#2C3E50] text-4xl font-serif font-bold text-center mt-8">JellyGit</Text>
                <Text className="text-[#2C3E50]/70 text-lg font-serif text-center mt-2">
                    Discover and explore GitHub repositories
                </Text>
            </View>
            <View className="mb-4 flex-row items-center mt-8 mb-8">
                <TextInput
                    placeholder="Search repositories..."
                    placeholderTextColor="#94A3B8"
                    className="bg-white rounded-lg px-4 py-3 text-[#2C3E50] flex-1 mr-2"
                    style={{
                        fontFamily: 'serif',
                        fontSize: 18,
                        height: 50,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="search"
                />
                <TouchableOpacity 
                    onPress={handleSubmit}
                    className="bg-[#2C3E50] rounded-lg px-4 h-[50px] justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text className="text-white font-serif text-lg">Go</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}   