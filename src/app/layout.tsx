import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://nayem-resignation.vercel.app"),
  title: "আলী মোদাচ্ছের নায়েম | বিদায়ী লাইভ কাউন্টডাউন 🚀",
  description:
    "এসএম টেকনোলজি (SM Technology) থেকে আলী মোদাচ্ছের নায়েম ভাইয়ের বিদায়ী লাইভ কাউন্টডাউন। শেষ কর্মদিবস: ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টা!",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    title: "নায়েম ভাইয়ের অফিসে আর বাকি মাত্র... লাইভ কাউন্টডাউন! ⏳🎉",
    description:
      "আগামী ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টা পর্যন্ত লাইভ বিদায়ী কাউন্টডাউন ও শুভকামনা ওয়াল।",
    images: ["/profile-5.1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 bg-grid-pattern">
        {children}
      </body>
    </html>
  );
}
