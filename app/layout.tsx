import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gian Jericho Espino — Portfolio",
    template: "%s | Gian Jericho Espino",
  },
  description:
    "Computer Engineering student and full-stack developer. Building enterprise-grade web and mobile applications — from real-time dispatch systems to field technician mobile apps.",
  keywords: [
    "Gian Jericho Espino",
    "Portfolio",
    "Computer Engineering",
    "Full-Stack Developer",
    "Flutter",
    "JavaScript",
    "Supabase",
    "Next.js",
    "Web Development",
    "Mobile Development",
  ],
  authors: [{ name: "Gian Jericho Espino" }],
  creator: "Gian Jericho Espino",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Gian Jericho Espino — Portfolio",
    description:
      "Computer Engineering student and full-stack developer building enterprise-grade applications.",
    siteName: "Gian Jericho Espino Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gian Jericho Espino — Portfolio",
    description:
      "Computer Engineering student and full-stack developer building enterprise-grade applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
