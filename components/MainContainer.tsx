import { Body } from "@/components/Body";
import { Header } from "@/components/Header";
import { ScrollView } from "react-native";

export const MainContainer = () => {
    return (
        <ScrollView
            style={{
                backgroundColor:'white',
                flex:1,
            }}
        >
            <Header />
            <Body />
        </ScrollView>
    )
}   