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
  description: "Rate and review the latest AI models. Community-driven insights on GPT, Claude, Gemini and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#090b11] text-slate-100 font-sans antialiased bg-grid relative pb-12">
        {/* Glow Spheres */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090b11]/75 border-b border-slate-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors tracking-tight">AI Review Hub</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/" className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors">
                Models
              </Link>
              <Link href="/categories" className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors">
                Categories
              </Link>
              <Link href="/compare" className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors">
                Compare
              </Link>
              <Link href="/admin" className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          {children}
        </main>
        <footer className="border-t border-slate-900 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-slate-500">
            <p className="text-xs">© 2026 AI Review Hub. All rights reserved.</p>
            <p className="text-xs">Community-driven AI model reviews</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
