import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

type Message = {
  id: string;
  conversationId: string;
  text: string;
  role: "user" | "assistant";
  createdAt: number;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: number;
};

type ChatContextValue = {
  conversations: Conversation[];
  messages: Message[];
  isStreaming: boolean;
  addConversation: () => string;
  sendMessage: (conversationId: string, text: string) => void;
  stopStreaming: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stopStreaming = useCallback(() => {
    try {
      abortRef.current?.abort("Requested abort");
    } catch {
      // abort() can synchronously throw on some platforms
    }
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const addConversation = useCallback(() => {
    const id = Date.now().toString();
    setConversations((prev) => [
      { id, title: "New Chat", createdAt: Date.now() },
      ...prev,
    ]);
    return id;
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        text,
        role: "user",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, title: text.slice(0, 30) } : c,
        ),
      );

      const history = [...messages, userMessage]
        .filter((m) => m.conversationId === conversationId)
        .map((m) => ({ role: m.role, content: m.text }));

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          conversationId,
          text: "",
          role: "assistant",
          createdAt: Date.now(),
        },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ") || trimmed === "data: [DONE]")
                continue;
              try {
                const json = JSON.parse(trimmed.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, text: m.text + content }
                        : m,
                    ),
                  );
                }
              } catch {
                // skip malformed SSE lines
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: `Sorry, something went wrong. ${message}` }
              : m,
          ),
        );
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantId && m.text === "")),
        );
      }
    },
    [messages],
  );

  return (
    <ChatContext
      value={{
        conversations,
        messages,
        isStreaming,
        addConversation,
        sendMessage,
        stopStreaming,
      }}
    >
      {children}
    </ChatContext>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
