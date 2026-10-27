import { SOCIAL_LINKS } from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

export function WhatsappFloat() {
  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="group fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-xl shadow-black/15 transition-all hover:scale-105 hover:shadow-2xl md:bottom-6 md:right-6 md:px-5"
    >
      <SocialIcon network="whatsapp" className="h-6 w-6" />
      <span className="hidden text-sm font-bold md:inline">WhatsApp</span>
    </a>
  );
}
