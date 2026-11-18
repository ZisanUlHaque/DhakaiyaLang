import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DhakaiyaLang (পুরান ঢাকা) — Bhailang Inspired Toy Programming Language",
  description: "A dialect-based educational programming language inspired by Puran Dhaka for CSE 3202 Compiler Design Sessional.",
  keywords: ["compiler", "dhakaiyalang", "bhailang", "bonglang", "puran dhaka", "javascript", "ast", "lexer", "parser"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#08090E] text-[#F8FAFC] selection:bg-[#D94819] selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
