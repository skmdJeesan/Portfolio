import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({subsets: ['latin']})
export const metadata: Metadata = {
  title: "SMJ | Fullstack developer",
  description: "Hi, I'm a fullstack developer based on India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white bg-grid`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
