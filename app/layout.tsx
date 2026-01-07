import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ramadan Iftaar Calendar",
  description: "Community Iftaar hosting calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "antialiased min-h-screen flex flex-col")}>
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto p-4 md:p-8">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground">
            © 2026 Ramadan Committee
          </footer>
        </Providers>
      </body>
    </html>
  );
}
