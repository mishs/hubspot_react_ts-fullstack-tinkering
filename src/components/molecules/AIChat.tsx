import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Skeleton, Text } from "@/components/atoms";
import { chatWithAI } from "@/lib/gemini";
import type { User } from "@/types";

interface AIChatProps {
  user: User;
}

interface Message {
  role: "user" | "ai";
  content: string;
}

export const AIChat = ({ user }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await chatWithAI(user, userMessage);
      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <Text size="sm" weight="semibold" className="mb-3">
        Ask AI about {user.name}
      </Text>

      <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
        {messages.length === 0 ? (
          <Text size="sm" color="muted">
            Try asking: "What company do they work for?" or "Where are they located?"
          </Text>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded p-2 text-sm ${
                msg.role === "user"
                  ? "ml-4 bg-primary-100 text-primary-900"
                  : "mr-4 bg-neutral-100 text-neutral-900"
              }`}
            >
              <Text size="sm" weight={msg.role === "user" ? "medium" : "normal"}>
                {msg.content}
              </Text>
            </div>
          ))
        )}
        {isLoading && (
          <div className="mr-4 rounded bg-neutral-100 p-2">
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="text-sm"
        />
        <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};
