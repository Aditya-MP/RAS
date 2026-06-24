import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/shared/AuthContext";

export const metadata: Metadata = {
  title: "Redrob Sandbox – Futuristic Collaborative Technical Assessment Platform",
  description:
    "Hire beyond the resume. Redrob Sandbox is a next-generation pre-employment collaborative evaluation workspace powered by Socratic AI guidance, keystroke dynamics biometrics, and real-time system chaos injections.",
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
