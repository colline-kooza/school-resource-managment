import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BusiLearn — Academic Hub",
  description:
    "Your Campus, Your Resources, Your Success. The official digital learning platform for academic excellence.",
  keywords: ["BusiLearn", "Academic Hub", "e-learning", "Uganda", "University"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} style={{ backgroundColor: "#F5F7FA" }}>
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
