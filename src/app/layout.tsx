import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import Navbar from "@/components/layout/Navbar";
import MouseLight from "@/components/ui/MouseLight";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ALENNA.ART | Decipher the Glitch",
  description: "Exclusive NFT Art Collection on Cardano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${cormorant.variable} ${pinyon.variable} antialiased bg-primary text-light`}
        suppressHydrationWarning
      >
        <div className="noise-overlay" />
        <Providers>
          <MouseLight />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
