import { useAuth } from "@/src/providers/AuthProvider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, router, Stack } from "expo-router";
import { ChannelList } from "stream-chat-expo";

export default function MainTabScreen() {
  const { user } = useAuth();
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href={"/(home)/users"} asChild> 
              <FontAwesome5
                name="users"
                size={22}
                color="#686CEA"
                style={{ marginHorizontal: 15 }}
              />
            </Link>
          ),
        }}
      />
      <ChannelList
        filters={{ members: { $in: [user.id] } }}
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
      />
    </>
  );
}
