import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { DM_Sans, Figtree, Geist, Geist_Mono, Inter, JetBrains_Mono, Noto_Sans, Outfit, Public_Sans, Raleway, Roboto } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";


// const nunitoSans = Nunito_Sans({variable:'--font-sans'});
const outfit = Outfit({subsets:['latin'],variable:'--font-outfit'});
const inter = Inter({subsets:['latin'],variable:'--font-inter'});
const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-noto-sans', weight: ['400', '500', '600', '700']});
const figtree = Figtree({subsets:['latin'],variable:'--font-figtree', weight: ['400', '500', '600', '700']});
const roboto = Roboto({subsets:['latin'],variable:'--font-roboto', weight: ['400', '500', '700']});
const raleway = Raleway({subsets:['latin'],variable:'--font-raleway', weight: ['400', '500', '600', '700']});
const dmSans = DM_Sans({subsets:['latin'],variable:'--font-dm-sans', weight: ['400', '500', '600', '700']});
const publicSans = Public_Sans({subsets:['latin'],variable:'--font-public-sans', weight: ['400', '500', '600', '700']});
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-jetbrains-mono', weight: ['400', '500', '600', '700']});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Commerce Core",
  description: "Production-ready Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${notoSans.variable} ${figtree.variable} ${roboto.variable} ${raleway.variable} ${dmSans.variable} ${publicSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader showSpinner={false} />
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}