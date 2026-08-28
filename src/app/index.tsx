import { View, Text, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat } from "../store/chat-context";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, addConversation } = useChat();

  const handleNewChat = () => {
    const id = addConversation();
    router.push(`/chat/${id}`);
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Chats</Text>
        <Pressable
          onPress={handleNewChat}
          className="rounded-full bg-blue-600 px-4 py-2"
        >
          <Text className="font-medium text-white">+ New Chat</Text>
        </Pressable>
      </View>

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl">📚</Text>
          <Text className="mt-4 text-center text-lg font-medium text-gray-700">
            No conversations yet
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-400">
            Tap &quot;+ New Chat&quot; to start learning new words.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 py-2"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}`)}
              className="mb-2 rounded-xl bg-gray-50 px-4 py-4"
            >
              <Text className="text-base font-medium text-gray-900">
                {item.title}
              </Text>
              <Text className="mt-1 text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
