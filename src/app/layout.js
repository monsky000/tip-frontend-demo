import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TIP Auth — Spring Boot & JWT Portal",
  description: "Next.js frontend with Spring Boot JWT authentication and MySQL persistence",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>
          <Navbar />
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />
          <main className="flex-1 relative z-10 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
