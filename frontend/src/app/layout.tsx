import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { geistMono } from "../fonts/exporter";

export const metadata: Metadata = {
  title: "Project Management",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
