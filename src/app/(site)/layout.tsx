import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-background grain-overlay">
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsappFloat />
      <MobileBottomNav />
    </div>
  );
}
