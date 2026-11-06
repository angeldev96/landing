"use client";

import { useState } from "react";

// The hero wall drifts by itself, so it carries one pause button (WCAG 2.2.2: anything moving past 5 s
// can be stopped). It pauses the wall by setting data-paused on its hero section; the CSS does the rest.
export function WallPause() {
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      className="wall-pause"
      aria-pressed={paused}
      aria-label={paused ? "Reanudar el movimiento de las fotos" : "Pausar el movimiento de las fotos"}
      onClick={(event) => {
        const next = !paused;
        event.currentTarget.closest(".hero")?.toggleAttribute("data-paused", next);
        setPaused(next);
      }}
    >
      {paused ? (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4.5 3.5h2.25v9H4.5zM9.25 3.5h2.25v9H9.25z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
