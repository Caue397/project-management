import type { Metadata } from "next";
import "./globals.css";
import { geistMono } from "../fonts/exporter";
import ClientProvider from "@/providers/client";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Project Management",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${geistMono.className} antialiased`}>
        <NextIntlClientProvider>
          <ClientProvider>
            {children}
          </ClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
