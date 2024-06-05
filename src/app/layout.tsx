import { User } from "@/components/header/user";
import "./globals.css";
import { Header } from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public | Issue",
  description: "Issue",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          `${fontSans.variable} ${fontMono.variable}`,
        )}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
