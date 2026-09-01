import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { useChat } from "../../store/chat-context";

const markdownStyles = StyleSheet.create({
  body: { color: "#111827", fontSize: 16, lineHeight: 22 },
  paragraph: { marginTop: 0, marginBottom: 8 },
  heading1: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  heading2: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  heading3: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  bullet_list: { marginBottom: 8 },
  ordered_list: { marginBottom: 8 },
  list_item: { marginBottom: 2 },
  strong: { fontWeight: "700" },
  em: { fontStyle: "italic" },
  code_inline: {
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontFamily: "monospace",
    fontSize: 14,
  },
  fence: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  code_block: {
    color: "#f9fafb",
    fontFamily: "monospace",
    fontSize: 14,
  },
});

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { messages, sendMessage, isStreaming, stopStreaming } = useChat();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  const conversationMessages = messages.filter((m) => m.conversationId === id);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !id) return;
    sendMessage(id, trimmed);
    setInput("");
  };

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

      {conversationMessages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl">💬</Text>
          <Text className="mt-4 text-center text-lg font-medium text-gray-700">
            Ask about any word or phrase
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-400">
            Type a word below to get its meaning, usage, and examples.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={conversationMessages}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 py-3"
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => (
            <View
              className={`mb-3 max-w-[80%] rounded-2xl px-4 py-3 ${
                item.role === "user"
                  ? "self-end bg-blue-600"
                  : "self-start bg-gray-200"
              }`}
            >
              {item.role === "user" ? (
                <Text className="text-base text-white">{item.text}</Text>
              ) : (
                <Markdown style={markdownStyles}>{item.text}</Markdown>
              )}
            </View>
          )}
        />
      )}

      <View className="border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Type a word or phrase..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          {isStreaming ? (
            <Pressable
              onPress={stopStreaming}
              className="ml-2 rounded-full bg-red-500 px-4 py-2"
            >
              <Text className="font-medium text-white">Stop</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSend}
              className="ml-2 rounded-full bg-blue-600 px-4 py-2"
            >
              <Text className="font-medium text-white">Send</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
