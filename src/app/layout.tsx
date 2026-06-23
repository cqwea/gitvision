import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "AI Review Hub",
  description: "Review and discover the latest AI models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
              AI Review Hub
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Models</Link>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-center">
            <p className="text-xs text-gray-400">AI Review Hub — Share your experience with AI models</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
