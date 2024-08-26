import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { StyleSheet, View, Alert, ScrollView, ToastAndroid } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useAuth } from "@/src/providers/AuthProvider";
import Avatar from "@/src/components/Avatar";
import { StreamChat } from "stream-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function CreateProfile() {
  const { session } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>("");

  const chatClient = StreamChat.getInstance("r29ubtmnckk8");

  const updateLogic = async () => {
    if (!fullname || fullname === "") {
      ToastAndroid.showWithGravity(
        "Please enter your full name.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    updateProfile({
      username,
      website,
      avatar_url: avatarUrl!,
      full_name: fullname,
    });
    const update = async () => {
      await chatClient.upsertUser({
        id: session?.user.id!,
        name: fullname,
        image: supabase.storage.from("avatars").getPublicUrl(avatarUrl!).data
          .publicUrl,
      });
    };
    update();
    await AsyncStorage.setItem("authToken", "false");
    router.replace("/(home)");
  };

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, full_name`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setFullName(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string;
    website: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              username,
              website,
              avatar_url: url,
              full_name: fullname,
            });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="FullName"
          value={fullname || ""}
          onChangeText={(text) => setFullName(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Create Profile"}
          onPress={() => updateLogic()}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
    marginBottom: 10,
  },
  mt20: {
    marginTop: 20,
  },
});
