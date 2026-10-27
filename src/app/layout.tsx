import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Cheeky Rabbit ships blank glyphs for accented letters (á, é, ñ, ¿...), so it is limited to
// basic Latin and those characters fall back to a rounded system font instead of disappearing.
const cheekyRabbit = localFont({
  src: "../fonts/Cheeky Rabbit.ttf",
  variable: "--font-cheeky-rabbit",
  declarations: [{ prop: "unicode-range", value: "U+0020-007E" }],
  adjustFontFallback: false,
  fallback: ["ui-rounded", "Arial Rounded MT Bold", "sans-serif"],
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
