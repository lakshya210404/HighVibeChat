import { useState, useCallback, useRef } from "react";

interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export const useAiChat = (actAsGender?: string) => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const conversationHistory = useRef<AiMessage[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingMessages = useRef<string[]>([]);
  const isProcessing = useRef(false);

  const processResponse = useCallback(async (
    onResponse: (content: string) => void
  ) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    // Merge any pending messages into one user turn if they double-texted
    const merged = pendingMessages.current.join("\n");
    pendingMessages.current = [];

    conversationHistory.current.push({ role: "user", content: merged });

    // Human-like "seen" delay before typing indicator (2-4 seconds)
    // Longer messages get read longer
    const readTime = Math.min(2000 + merged.length * 30, 5000);
    const preTypingDelay = readTime + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, preTypingDelay));

    setIsAiTyping(true);

    // Short pause after typing indicator starts (0.5-1.5s)
    const seenDelay = 500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, seenDelay));

    let responseText = "";

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: conversationHistory.current, actAsGender: actAsGender || "other" }),
        }
      );

      if (!resp.ok || !resp.body) {
        throw new Error("AI chat failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              responseText += content;
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      const fallbacks = [
        "lol sorry my phone glitched for a sec 😅",
        "wait what were we talking about again",
        "bruh my wifi is acting up 💀",
        "sorry was distracted for a sec haha",
      ];
      responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Simulate typing time proportional to response length
    const charsPerSecond = 2.5 + Math.random() * 2;
    const typingTimeMs = Math.min(
      (responseText.length / charsPerSecond) * 1000,
      12000
    );
    const remainingDelay = Math.max(typingTimeMs, 500);
    await new Promise(resolve => setTimeout(resolve, remainingDelay));

    conversationHistory.current.push({ role: "assistant", content: responseText });
    onResponse(responseText);
    setIsAiTyping(false);
    isProcessing.current = false;
  }, [actAsGender]);

  const sendAiMessage = useCallback((
    userMessage: string,
    onResponse: (content: string) => void
  ) => {
    // Queue the message
    pendingMessages.current.push(userMessage);

    // Clear existing debounce — wait for potential double-text
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Wait 3-4 seconds to see if user sends another message
    const waitTime = 3000 + Math.random() * 1000;
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      processResponse(onResponse);
    }, waitTime);
  }, [processResponse]);

  const resetAiChat = useCallback(() => {
    conversationHistory.current = [];
    pendingMessages.current = [];
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    isProcessing.current = false;
    setIsAiMode(false);
    setIsAiTyping(false);
  }, []);

  const activateAiMode = useCallback(() => {
    conversationHistory.current = [];
    pendingMessages.current = [];
    setIsAiMode(true);
    setIsAiTyping(false);
  }, []);

  return {
    isAiMode,
    isAiTyping,
    sendAiMessage,
    resetAiChat,
    activateAiMode,
  };
};
