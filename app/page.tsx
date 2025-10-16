"use client";

import { useChat, type UIMessage as Message } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const { messages, sendMessage, stop, status } = useChat();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <main className="mx-auto flex h-dvh max-w-3xl flex-col p-4 gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agentic Chat</h1>
        <a className="text-sm text-blue-600 hover:underline" href="https://vercel.com/docs/ai" target="_blank" rel="noreferrer">Docs</a>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto rounded-lg border bg-white p-4">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {messages.map(renderMessage)}
            {(status === "submitted" || status === "streaming") && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          if (!text) return;
          sendMessage({ text }).catch(() => {});
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {status === "submitted" || status === "streaming" ? (
          <button type="button" onClick={() => stop()} className="rounded-md bg-red-600 px-4 py-2 text-white">Stop</button>
        ) : (
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">Send</button>
        )}
      </form>

      <footer className="text-center text-xs text-zinc-500">OpenAI-backed when configured. Falls back to demo if not.</footer>
    </main>
  );
}

function renderMessage(message: Message) {
  const isUser = message.role === "user";
  const text = getMessageText(message);
  return (
    <div key={message.id} className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`h-8 w-8 shrink-0 rounded-full ${isUser ? "bg-blue-600" : "bg-zinc-800"}`} />
      <div className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${isUser ? "bg-blue-600 text-white" : "bg-zinc-100"}`}>
        {text}
      </div>
    </div>
  );
}

function getMessageText(message: Message): string {
  try {
    // Aggregate all text parts from the message
    const parts: any[] = Array.isArray((message as any).parts) ? (message as any).parts : [];
    let out = "";
    for (const part of parts) {
      if (part && part.type === "text" && typeof part.text === "string") {
        out += (out ? "\n" : "") + part.text;
      }
    }
    return out || "";
  } catch {
    return "";
  }
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center text-center text-zinc-500">
      <div className="space-y-2">
        <p className="text-lg">Start a conversation</p>
        <p className="text-sm">Your messages and AI responses will appear here.</p>
      </div>
    </div>
  );
}
