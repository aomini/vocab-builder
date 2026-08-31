import { useState, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat } from "../../store/chat-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MessageBubble } from "../../components/message-bubble";
import { TypingIndicator } from "../../components/typing-indicator";

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { messages, sendMessage, isStreaming, stopStreaming } = useChat();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  const conversationMessages = messages.filter((m) => m.conversationId === id);
  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const showTyping =
    isStreaming && lastMessage?.role === "assistant" && !lastMessage.text;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !id) return;
    sendMessage(id, trimmed);
    setInput("");
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center border-b border-border px-4 py-3">
        <Button
          onPress={() => router.back()}
          label="←"
          variant="icon"
          className="mr-3"
        />
        <Text className="text-lg font-semibold text-text">New Chat</Text>
      </View>

      {conversationMessages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl">💬</Text>
          <Text className="mt-4 text-center text-lg font-medium text-text">
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
            <MessageBubble role={item.role} text={item.text} />
          )}
          ListFooterComponent={showTyping ? <TypingIndicator /> : null}
        />
      )}

      <View className="border-t border-border px-4 py-3">
        <View className="flex-row items-center rounded-full bg-surface px-4 py-2">
          <Input
            value={input}
            onChangeText={setInput}
            placeholder="Type a word or phrase..."
            onSubmitEditing={handleSend}
            returnKeyType="send"
            className="border-0 bg-transparent"
          />
          {isStreaming ? (
            <Button
              onPress={stopStreaming}
              label="Stop"
              variant="danger"
              className="ml-2"
            />
          ) : (
            <Button onPress={handleSend} label="Send" className="ml-2" />
          )}
        </View>
      </View>
    </View>
  );
}
