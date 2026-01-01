// -----------------------------------------------
// src/app/layout.tsx
// -----------------------------------------------
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Boilerplate SaaS Premium",
  description: "A estrutura completa para seu projeto Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
