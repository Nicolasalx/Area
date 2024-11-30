import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
    <html lang="en">
      <body className={`${prompt.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
