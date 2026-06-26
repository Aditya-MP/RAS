import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/shared/AuthContext";

export const metadata: Metadata = {
  title: "AI HireHub – Autonomous Multi-Agent Technical Assessment Platform",
  description:
    "Hire beyond the resume. AI HireHub is a next-generation fully autonomous pre-employment evaluation workspace powered by AI agent scheduling, Socratic workspace mentors, and dynamic task scaffolding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#050814] text-slate-100" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
