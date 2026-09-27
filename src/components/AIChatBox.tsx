"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChatBox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello 👋 How can I help you?",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage = input.trim();

    setInput("");

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content:
            "Sorry 😔 Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-purple-600
            text-2xl
            
            shadow-lg
            hover:bg-purple-700
          "
        >
          💬
        </button>
      )}

      {isOpen && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-[600px]
            w-[380px]
            max-w-[calc(100vw-32px)]
            flex-col
            overflow-hidden
            rounded-2xl
            
            shadow-2xl
          "
        >
          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              bg-purple-600
              px-5
              py-4
              text-white
            "
          >
            <div>
              <h2 className="font-semibold">
                AI Assistant
              </h2>

              <p className="text-xs text-purple-100">
                Ask me anything
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}

          <div
            className="
              flex-1
              space-y-4
              overflow-y-auto
              bg-gray-50
              p-4
            "
          >
            {messages.map((message, index) => {
              const isUser =
                message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[80%]
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      ${
                        isUser
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-800 shadow"
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="text-sm text-gray-500">
                AI is thinking...
              </div>
            )}
          </div>

          {/* Input */}

          <div className="border-t bg-white p-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                rows={1}
                disabled={loading}
                className="
                  flex-1
                  resize-none
                  rounded-lg
                  border
                  px-3
                  py-2
                  outline-none
                  focus:border-purple-500
                "
              />

              <button
                onClick={sendMessage}
                disabled={
                  !input.trim() || loading
                }
                className="
                  rounded-lg
                  bg-purple-600
                  px-4
                  text-white
                  hover:bg-purple-700
                  disabled:opacity-50
                "
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}