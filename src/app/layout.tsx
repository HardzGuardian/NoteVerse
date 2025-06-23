import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import PwaInstaller from "@/components/pwa-installer";

export const metadata: Metadata = {
  title: "NoteVerse",
  description: "A notes app for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6750A4" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Open+Sans:wght@400;700&family=PT+Sans:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <PwaInstaller />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
