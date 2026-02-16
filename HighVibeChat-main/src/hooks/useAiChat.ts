import { useState, useCallback, useRef } from "react";

interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export const useAiChat = () => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const conversationHistory = useRef<AiMessage[]>([]);

  const sendAiMessage = useCallback(async (
    userMessage: string,
    onResponse: (content: string) => void
  ) => {
    conversationHistory.current.push({ role: "user", content: userMessage });
    setIsAiTyping(true);

    // Initial "seen" delay before they start "typing" (1-2 seconds)
    const seenDelay = 1000 + Math.random() * 1000;
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
          body: JSON.stringify({ messages: conversationHistory.current }),
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

    // Simulate realistic human typing time based on message length
    // Average person types ~40 words per minute on mobile = ~3.3 chars/sec
    // Add some randomness to feel natural
    const charsPerSecond = 2.5 + Math.random() * 2; // 2.5-4.5 chars/sec
    const typingTimeMs = Math.min(
      (responseText.length / charsPerSecond) * 1000,
      12000 // cap at 12 seconds so it doesn't feel too slow
    );
    // Subtract time already spent waiting for the API response, minimum 500ms
    const remainingDelay = Math.max(typingTimeMs, 500);
    await new Promise(resolve => setTimeout(resolve, remainingDelay));

    // Now show the message
    conversationHistory.current.push({ role: "assistant", content: responseText });
    onResponse(responseText);
    setIsAiTyping(false);
  }, []);

  const resetAiChat = useCallback(() => {
    conversationHistory.current = [];
    setIsAiMode(false);
    setIsAiTyping(false);
  }, []);

  const activateAiMode = useCallback(() => {
    conversationHistory.current = [];
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
