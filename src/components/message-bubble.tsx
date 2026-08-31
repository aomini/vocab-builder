import { Text, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Markdown from "react-native-markdown-display";
import { cn } from "../utils/cn";

type MessageBubbleProps = {
  role: "user" | "assistant";
  text: string;
};

const markdownStyles = StyleSheet.create({
  body: { color: "#1A1A1A", fontSize: 16, lineHeight: 22 },
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
    backgroundColor: "#E5E5E5",
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

export function MessageBubble({ role, text }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className={cn(
        "mb-3 max-w-[80%] rounded-2xl px-4 py-3",
        isUser ? "self-end bg-surface" : "self-start",
      )}
    >
      {isUser ? (
        <Text className="text-base leading-relaxed text-text">{text}</Text>
      ) : (
        <Markdown style={markdownStyles}>{text}</Markdown>
      )}
    </Animated.View>
  );
}
