import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

    return [
      // Private panel: never indexed.
      { source: "/admin", headers: noindex },
      { source: "/admin/:path*", headers: noindex },
      // vercel.app aliases and previews duplicate crochetcasrey.com; only the custom domain is indexable.
      { source: "/:path*", has: [{ type: "host", value: "(?<host>.+)\\.vercel\\.app" }], headers: noindex },
    ];
  },
  async redirects() {
    return [
      { source: "/galeria", destination: "/tienda", permanent: true },
      { source: "/galeria/:slug", destination: "/tienda/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "vfvkvksgtyiwvzjqpbhy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
