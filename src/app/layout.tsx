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
  title: "Ali Modasser Nayem | Resignation Countdown 🚀",
  description:
    "Official Resignation Countdown for Ali Modasser Nayem (Executive, Backend @ SM Technology). Last working day: 21 October 2026, 5:00 PM!",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Nayem Bhai R Koydin Ache? Live Freedom Countdown! ⏳",
    description:
      "21 October 2026, 5:00 PM sharp! Live countdown, office soundboard, treat meter, and farewell wall.",
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
