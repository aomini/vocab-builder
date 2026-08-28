import { createContext, useContext, useState, useCallback } from "react";

type Conversation = {
  id: string;
  title: string;
  createdAt: number;
};

type ChatContextValue = {
  conversations: Conversation[];
  addConversation: () => string;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const addConversation = useCallback(() => {
    const id = Date.now().toString();
    setConversations((prev) => [
      { id, title: "New Chat", createdAt: Date.now() },
      ...prev,
    ]);
    return id;
  }, []);

  return (
    <ChatContext value={{ conversations, addConversation }}>
      {children}
    </ChatContext>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
