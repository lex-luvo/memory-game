import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
    weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "Memory Game",
  description: "Created by Luvo Spofana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
