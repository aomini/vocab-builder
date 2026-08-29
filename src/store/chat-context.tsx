import { createContext, useContext, useState, useCallback } from "react";

type Message = {
  id: string;
  conversationId: string;
  text: string;
  role: "user";
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
  addConversation: () => string;
  sendMessage: (conversationId: string, text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const addConversation = useCallback(() => {
    const id = Date.now().toString();
    setConversations((prev) => [
      { id, title: "New Chat", createdAt: Date.now() },
      ...prev,
    ]);
    return id;
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const message: Message = {
        id: Date.now().toString(),
        conversationId,
        text,
        role: "user",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, title: text.slice(0, 30) } : c
        )
      );
    },
    []
  );

  return (
    <ChatContext value={{ conversations, messages, addConversation, sendMessage }}>
      {children}
    </ChatContext>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
