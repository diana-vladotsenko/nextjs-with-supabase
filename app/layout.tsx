import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import Navbar from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "violet",
  defaultRadius: "md",
  colors: {
    violet: [
      "#f5f3ff",
      "#ede9fe",
      "#ddd6fe",
      "#c4b5fd",
      "#a78bfa",
      "#8b5cf6",
      "#7c3aed",
      "#6d28d9",
      "#5b21b6",
      "#4c1d95",
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <Navbar />
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
