import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TranslationProvider } from "@/components/translation/translation-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalonAI",
  description: "AI-powered hairstyle and makeup preview for salons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  );
}
