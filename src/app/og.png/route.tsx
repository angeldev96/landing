import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Default social/AI preview image (1200x630). A route instead of opengraph-image.tsx so pages
// that set their own image (products, articles) are never overridden by the file convention.
// Rendered once at build time.
export const dynamic = "force-static";

export async function GET() {
  const [displayFont, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/Cheeky Rabbit.ttf")),
    readFile(join(process.cwd(), "public/android-chrome-512x512.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 80px",
          background: "#130f23",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={320}
          height={320}
          style={{ borderRadius: 9999, border: "8px solid #c3b4fd" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#c3b4fd", textTransform: "uppercase" }}>
            Hecho a mano en Honduras
          </div>
          <div style={{ fontFamily: "Cheeky Rabbit", fontSize: 96, lineHeight: 1 }}>Crochet CasRey</div>
          <div style={{ fontSize: 36, lineHeight: 1.3, color: "rgba(255,255,255,0.75)" }}>
            Amigurumis, flores eternas, bolsos y regalos personalizados tejidos a crochet.
          </div>
          <div style={{ fontSize: 28, color: "#fbbf24" }}>crochetcasrey.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Cheeky Rabbit", data: displayFont, style: "normal", weight: 400 }],
    },
  );
}
