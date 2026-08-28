import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatProvider } from "../store/chat-context";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ChatProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ChatProvider>
    </SafeAreaProvider>
  );
}
