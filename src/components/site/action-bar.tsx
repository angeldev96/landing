import { MAIN_ACTION_LABEL, SOCIAL_LINKS } from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

// The phone's action bar: the main action, always one tap away (shown under 640px only).
export function ActionBar() {
  return (
    <nav className="actionbar" aria-label="Pedido">
      <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
        <SocialIcon network="whatsapp" className="btn__icon" />
        {MAIN_ACTION_LABEL}
      </a>
    </nav>
  );
}
