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
});
export const metadata: Metadata = {
  title: "Area",
  description: "Make action reaction workflows",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${prompt.className} antialiased`}>
      <Providers>
        <body
          className={`${prompt.className} min-h-full min-w-full antialiased bg-gray-100`}
        >
          <Navbar />
          <div className="h-full w-full pt-16">{children}</div>
        </body>
      </Providers>
    </html>
  );
}
