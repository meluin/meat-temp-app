/*
 * icons.js — simple flat SVG animal/glyph silhouettes used as category
 * motifs. Each entry is inner SVG markup (no outer <svg> tag) using
 * currentColor so it inherits the active theme's accent color via CSS.
 * Intentionally simple geometric shapes, not detailed illustrations —
 * legible at small sizes on a phone screen.
 */

const ICONS = {
  cow: `
    <ellipse cx="50" cy="40" rx="9" ry="13" fill="currentColor" opacity="0.9"/>
    <ellipse cx="72" cy="40" rx="9" ry="13" fill="currentColor" opacity="0.9"/>
    <path d="M40 24 Q36 14 42 10 Q44 18 44 26 Z" fill="currentColor"/>
    <path d="M60 24 Q64 14 58 10 Q56 18 56 26 Z" fill="currentColor"/>
    <ellipse cx="50" cy="55" rx="27" ry="24" fill="currentColor"/>
    <ellipse cx="50" cy="70" rx="15" ry="12" fill="currentColor" opacity="0.55"/>
    <circle cx="44" cy="70" r="2.6" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
    <circle cx="56" cy="70" r="2.6" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
    <circle cx="40" cy="50" r="5" fill="currentColor" opacity="0.35"/>
    <circle cx="64" cy="58" r="4" fill="currentColor" opacity="0.35"/>
  `,

  pig: `
    <path d="M32 26 L44 34 L30 40 Z" fill="currentColor"/>
    <path d="M68 26 L56 34 L70 40 Z" fill="currentColor"/>
    <circle cx="50" cy="54" r="26" fill="currentColor"/>
    <ellipse cx="50" cy="63" rx="13" ry="10" fill="currentColor" opacity="0.55"/>
    <ellipse cx="45" cy="63" rx="2.6" ry="3.4" fill="currentColor" opacity="0.9"/>
    <ellipse cx="55" cy="63" rx="2.6" ry="3.4" fill="currentColor" opacity="0.9"/>
  `,

  chicken: `
    <path d="M42 20 Q44 14 48 18 Q46 20 46 22 Z" fill="currentColor"/>
    <path d="M48 16 Q50 9 54 15 Q51 17 50 20 Z" fill="currentColor"/>
    <path d="M54 18 Q58 13 60 19 Q57 20 56 22 Z" fill="currentColor"/>
    <circle cx="50" cy="34" r="13" fill="currentColor"/>
    <path d="M62 34 L72 38 L62 40 Z" fill="currentColor"/>
    <path d="M40 30 Q34 26 30 30 Q34 32 38 34 Z" fill="currentColor" opacity="0.85"/>
    <ellipse cx="52" cy="65" rx="24" ry="20" fill="currentColor"/>
    <path d="M28 62 Q14 56 12 68 Q22 68 30 72 Z" fill="currentColor"/>
    <path d="M26 72 Q14 72 14 82 Q24 78 32 78 Z" fill="currentColor" opacity="0.85"/>
  `,

  sheep: `
    <circle cx="30" cy="42" r="9" fill="currentColor" opacity="0.9"/>
    <circle cx="42" cy="32" r="10" fill="currentColor" opacity="0.9"/>
    <circle cx="58" cy="32" r="10" fill="currentColor" opacity="0.9"/>
    <circle cx="70" cy="42" r="9" fill="currentColor" opacity="0.9"/>
    <circle cx="36" cy="52" r="10" fill="currentColor" opacity="0.9"/>
    <circle cx="64" cy="52" r="10" fill="currentColor" opacity="0.9"/>
    <circle cx="50" cy="46" r="14" fill="currentColor" opacity="0.9"/>
    <ellipse cx="24" cy="58" rx="6" ry="9" fill="currentColor" opacity="0.7"/>
    <ellipse cx="76" cy="58" rx="6" ry="9" fill="currentColor" opacity="0.7"/>
    <ellipse cx="50" cy="64" rx="13" ry="15" fill="currentColor"/>
    <circle cx="45" cy="62" r="2.2" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
    <circle cx="55" cy="62" r="2.2" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
  `,

  fish: `
    <path d="M70 50 L88 38 Q84 50 88 62 Z" fill="currentColor"/>
    <ellipse cx="42" cy="50" rx="30" ry="18" fill="currentColor"/>
    <path d="M40 34 Q48 24 58 32 Q50 36 44 38 Z" fill="currentColor" opacity="0.85"/>
    <path d="M30 62 Q22 70 14 68 Q22 60 26 56 Z" fill="currentColor" opacity="0.7"/>
    <circle cx="24" cy="46" r="3" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
    <path d="M46 42 Q54 50 46 58" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.4"/>
  `,

  deer: `
    <path d="M38 30 Q30 14 20 16 Q24 24 22 30 Q30 26 34 32 Z" fill="currentColor"/>
    <path d="M22 30 Q14 30 12 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62 30 Q70 14 80 16 Q76 24 78 30 Q70 26 66 32 Z" fill="currentColor"/>
    <path d="M78 30 Q86 30 88 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="46" rx="6" ry="9" fill="currentColor" opacity="0.85"/>
    <ellipse cx="62" cy="46" rx="6" ry="9" fill="currentColor" opacity="0.85"/>
    <ellipse cx="50" cy="60" rx="19" ry="18" fill="currentColor"/>
    <ellipse cx="50" cy="72" rx="8" ry="7" fill="currentColor" opacity="0.55"/>
    <circle cx="43" cy="56" r="2.4" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
    <circle cx="57" cy="56" r="2.4" fill="currentColor" opacity="0.9" style="mix-blend-mode:multiply"/>
  `,

  grinder: `
    <rect x="40" y="14" width="20" height="34" rx="6" fill="currentColor"/>
    <path d="M30 46 L70 46 L64 58 L36 58 Z" fill="currentColor"/>
    <ellipse cx="50" cy="72" rx="26" ry="14" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="1.6" opacity="0.4">
      <line x1="30" y1="66" x2="70" y2="66"/>
      <line x1="27" y1="72" x2="73" y2="72"/>
      <line x1="30" y1="78" x2="70" y2="78"/>
      <line x1="38" y1="60" x2="38" y2="84"/>
      <line x1="50" y1="58" x2="50" y2="86"/>
      <line x1="62" y1="60" x2="62" y2="84"/>
    </g>
  `
};

/** Returns a full <svg> element markup for the given icon name. */
function renderIcon(name, extraClass) {
  const inner = ICONS[name] || "";
  const cls = extraClass ? ` ${extraClass}` : "";
  return `<svg class="icon${cls}" viewBox="0 0 100 100" role="img" aria-hidden="true">${inner}</svg>`;
}
