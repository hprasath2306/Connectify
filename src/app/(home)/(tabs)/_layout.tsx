import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from '@expo/vector-icons/Fontisto';

export default function TabNavigator() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({size,color}) => <Fontisto name="hipchat" size={size} color={color} />,
          headerTitleStyle: { color: "#686CEA" },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({size,color}) => <FontAwesome name="user" size={size} color={color} />,
          headerTitleStyle: { color: "#686CEA" },
        }}
      />
    </Tabs>
  );
}
