import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cheekyRabbit = localFont({
  src: "../fonts/Cheeky Rabbit.ttf",
  variable: "--font-cheeky-rabbit",
});

const creamySauce = localFont({
  src: "../fonts/Creamy Sauce.otf",
  variable: "--font-creamy-sauce",
});

export const metadata: Metadata = {
  title: "Crochet CasRey — Amigurumis y Tejidos Personalizados",
  description:
    "Regalos unicos y eternos, hechos a mano con amor. Amigurumis, munecos y tejidos personalizados punto a punto.",
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
      <body className={`${cheekyRabbit.variable} ${creamySauce.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
