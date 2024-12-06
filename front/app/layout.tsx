import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/ui/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Area",
  description: "Make action reaction workflows",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${prompt.className} h-full antialiased`}>
      <body className={`${prompt.className} h-screen bg-gray-100 antialiased`}>
        <Providers>
          <Navbar />
          <main className="h-[calc(100vh-4rem)] w-full pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
