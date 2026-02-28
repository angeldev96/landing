import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Crochet CasRey — Amigurumis y Tejidos Personalizados",
  description:
    "Regalos únicos y eternos, hechos a mano con amor. Amigurumis, muñecos y tejidos personalizados punto a punto.",
  keywords: ["crochet", "amigurumi", "tejido", "handmade", "personalizado"],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fredoka.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
