"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MAIN_ACTION_LABEL, SOCIAL_LINKS } from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

// Any on-page WhatsApp button marked with this attribute hides the bar while it is on screen,
// so the phone never shows the same action twice (the hero, the footer, a product's own button).
const MAIN_CTA_SELECTOR = "[data-main-cta]";

// The phone's action bar: the main action, one tap away (shown under 640px only).
export function ActionBar() {
  const pathname = usePathname();
  // Start hidden: the home hero opens with its own WhatsApp button in view.
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = document.querySelectorAll(MAIN_CTA_SELECTOR);
    if (!targets.length) {
      // No on-page button to defer to: show the bar (after paint, so it slides in).
      const frame = requestAnimationFrame(() => setHidden(false));
      return () => cancelAnimationFrame(frame);
    }
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setHidden(onScreen.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="actionbar" aria-label="Pedido" data-hidden={hidden || undefined} inert={hidden}>
      <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
        <SocialIcon network="whatsapp" className="btn__icon" />
        {MAIN_ACTION_LABEL}
      </a>
    </nav>
  );
}
