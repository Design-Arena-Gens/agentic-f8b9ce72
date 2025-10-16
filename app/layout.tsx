import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic Chat",
  description: "Lightweight ChatGPT-like AI chat app",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-zinc-50">
      <body className="min-h-screen text-zinc-900">
        {children}
      </body>
    </html>
  );
}
