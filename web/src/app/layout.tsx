"use client"

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import TopBar from "@/deps/components/TopNav";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body data-theme="corporate"
        className={`${geistSans.variable} ${geistMono.variable} ] h-[90dvh] antialiased`}
      >
        <TopBar></TopBar>
        <div className="h-full flex-1">
          {children}
        </div>
        
      </body>
    </html>
  );
}
