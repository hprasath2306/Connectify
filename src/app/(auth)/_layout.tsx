import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    fetchToken();
  });

  useEffect(() => {
    if (token) {
        const checkFirstLogin = async () => {
            try {
              const isFirstLogin = await AsyncStorage.getItem("authToken");
              if (isFirstLogin === 'true') {
                router.replace("/(home)/(tabs)/profile")
              } else {
                router.replace("/(home)");
              }
            } catch (error) {
              console.error("Error checking first login:", error);
            }
          };
          checkFirstLogin(); 
    }
  }, [token]); 

  // const {user} = useAuth();
  // if(user){
  //     return <Redirect href={"/(home)"} />
  // }
  return (
    <Stack
      screenOptions={{
        headerTitle: "Connectify",
        headerTintColor: "#686CEA",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#686CEA",
        },
      }}
    />
  );
}
