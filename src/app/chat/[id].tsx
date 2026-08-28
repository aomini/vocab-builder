import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <Text className="text-lg text-blue-600">←</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">New Chat</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl">💬</Text>
        <Text className="mt-4 text-center text-lg font-medium text-gray-700">
          Ask about any word or phrase
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Type a word below to get its meaning, usage, and examples.
        </Text>
      </View>

      <View className="border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Type a word or phrase..."
            placeholderTextColor="#9ca3af"
            editable={false}
          />
          <Pressable className="ml-2 rounded-full bg-blue-600 px-4 py-2">
            <Text className="font-medium text-white">Send</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
