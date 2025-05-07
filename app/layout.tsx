import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "vazirmatn/Vazirmatn-font-face.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "چت‌نگار",
  description: "برنامه چت آنلاین با Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.variable} font-vazir antialiased`}>
        {children}
      </body>
    </html>
  );
}