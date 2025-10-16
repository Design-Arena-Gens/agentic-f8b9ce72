import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    // Fallback: no API key or provider error -> return a simple demo response
    const userLast = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content ?? "" : "";
    const reply = `Demo mode: I cannot access an AI provider right now.\nYou said: "${userLast}"\n\nTo enable real AI responses, set OPENAI_API_KEY in your environment.`;

    return new Response(reply, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
