import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MenuBar from "@/components/MenuBar";
import Dock from "@/components/Dock";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Portfolio saya: proyek, skill, dan pencapaian.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.variable}>
        <div className="wallpaper" aria-hidden />
        <MenuBar />
        <main>{children}</main>
        <Dock />
      </body>
    </html>
  );
}