import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Default social/AI preview image (1200x630). A route instead of opengraph-image.tsx so pages
// that set their own image (products, articles) are never overridden by the file convention.
// Rendered once at build time.
export const dynamic = "force-static";

export async function GET() {
  const [displayFont, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/Caprasimo-Regular.ttf")),
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
          background: "#f8b4cc",
          color: "#2e1a38",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={320}
          height={320}
          style={{ borderRadius: 9999, border: "8px solid #ffffff" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
          <div style={{ fontFamily: "Caprasimo", fontSize: 96, lineHeight: 1 }}>Crochet CasRey</div>
          <div style={{ fontSize: 36, lineHeight: 1.3, color: "rgba(46,26,56,0.8)" }}>
            Amigurumis, flores eternas, bolsos y regalos personalizados tejidos a crochet.
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Hecho a mano en Honduras: crochetcasrey.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Caprasimo", data: displayFont, style: "normal", weight: 400 }],
    },
  );
}
