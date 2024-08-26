import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState, Image, KeyboardAvoidingView, Platform, ToastAndroid } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Input } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if(!email || !password){
      ToastAndroid.showWithGravity(
        "Please enter your email and password.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER 
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error){
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    await AsyncStorage.setItem("authToken", 'false');
    setLoading(false);
    router.replace("/(home)");
  }

  async function signUpWithEmail() {
    if(!email || !password){
      ToastAndroid.showWithGravity(
        "Please enter your email and password.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER 
      );
      return; 
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error){
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    };
    if (!session)
      ToastAndroid.showWithGravity(
        "Please check your email for the confirmation link.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    await AsyncStorage.setItem("authToken", 'true');
    setLoading(false);
    router.replace("/(home)/(tabs)/profile");
  }

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

  return (
    <KeyboardAvoidingView style={styles.container} behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
      <Image
        source={require("../../../assets/images/3.png")}
        style={{
          width: 300,
          height: 300,
          resizeMode: "contain",
          alignSelf: "center",
          borderRadius: 150,
        }}
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope", color: "#686CEA" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock", color: "#686CEA" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
          color={"#686CEA"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
          color={"#686CEA"}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 2,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 2,
  },
});
