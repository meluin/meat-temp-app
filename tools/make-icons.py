#!/usr/bin/env python3
"""
Dev utility: regenerate the PWA app icons from a single SVG source.

Renders crisp PNGs with headless Chromium (via Playwright) so the vector
motif — a seared steak with a dial meat-probe thermometer, on the app's
oxblood theme — rasterises identically to how a browser would draw it.

Outputs into ../icons/:
  icon-192.png, icon-512.png            (purpose "any"     — rounded square)
  icon-maskable-192.png, -512.png       (purpose "maskable"— full-bleed, motif
                                          kept inside the ~80% safe zone)

Requires:  pip install playwright  &&  playwright install chromium
Run:       python tools/make-icons.py
Not part of the shipped app.
"""
import os
from playwright.sync_api import sync_playwright

ICONS_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")

DEFS = """
<defs>
  <radialGradient id="bg" cx="32%" cy="24%" r="95%">
    <stop offset="0" stop-color="#a02f40"/>
    <stop offset="52%" stop-color="#7c202c"/>
    <stop offset="100%" stop-color="#450e19"/>
  </radialGradient>
  <linearGradient id="meat" x1="0.15" y1="0" x2="0.55" y2="1">
    <stop offset="0" stop-color="#9c5f3a"/>
    <stop offset="0.55" stop-color="#743f24"/>
    <stop offset="1" stop-color="#4f2a18"/>
  </linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#b9bec7"/>
    <stop offset="0.45" stop-color="#eef1f5"/>
    <stop offset="1" stop-color="#aab0ba"/>
  </linearGradient>
  <clipPath id="steakClip">
    <path d="M138 300 C112 250 150 196 214 186 C270 178 332 182 374 210 C412 236 416 290 384 328 C354 366 290 382 226 374 C180 368 160 340 138 300 Z"/>
  </clipPath>
</defs>
"""

# Motif in a 512x512 space, visual centre ~ (256,256).
MOTIF = """
<g>
  <ellipse cx="258" cy="380" rx="122" ry="22" fill="#000000" opacity="0.15"/>

  <path d="M138 300 C112 250 150 196 214 186 C270 178 332 182 374 210 C412 236 416 290 384 328 C354 366 290 382 226 374 C180 368 160 340 138 300 Z" fill="url(#meat)"/>
  <path d="M138 300 C112 250 150 196 214 186 C270 178 332 182 374 210 C412 236 416 290 384 328 C354 366 290 382 226 374 C180 368 160 340 138 300 Z" fill="none" stroke="#2c1710" stroke-width="7" opacity="0.45"/>

  <g clip-path="url(#steakClip)">
    <g opacity="0.32" stroke="#25120a" stroke-width="16" stroke-linecap="round">
      <line x1="120" y1="352" x2="352" y2="188"/>
      <line x1="156" y1="372" x2="388" y2="208"/>
      <line x1="196" y1="388" x2="420" y2="230"/>
    </g>
    <g opacity="0.16" stroke="#f0b06a" stroke-width="5" stroke-linecap="round">
      <line x1="138" y1="362" x2="370" y2="198"/>
      <line x1="176" y1="382" x2="404" y2="220"/>
    </g>
  </g>
  <ellipse cx="208" cy="236" rx="76" ry="36" fill="#ffffff" opacity="0.11" transform="rotate(-24 208 236)"/>

  <!-- probe stem -->
  <rect x="311" y="150" width="20" height="156" rx="10" fill="url(#steel)"/>
  <!-- dial face -->
  <circle cx="321" cy="140" r="70" fill="#fbfbfb"/>
  <circle cx="321" cy="140" r="70" fill="none" stroke="#8f1e2a" stroke-width="9"/>
  <g stroke="#9aa0aa" stroke-width="5" stroke-linecap="round">
    <line x1="321" y1="80" x2="321" y2="92"/>
    <line x1="381" y1="140" x2="369" y2="140"/>
    <line x1="321" y1="200" x2="321" y2="188"/>
    <line x1="261" y1="140" x2="273" y2="140"/>
    <line x1="364" y1="97" x2="356" y2="105"/>
    <line x1="364" y1="183" x2="356" y2="175"/>
    <line x1="278" y1="183" x2="286" y2="175"/>
    <line x1="278" y1="97" x2="286" y2="105"/>
  </g>
  <line x1="321" y1="140" x2="360" y2="104" stroke="#c8232f" stroke-width="10" stroke-linecap="round"/>
  <circle cx="321" cy="140" r="12" fill="#7c202c"/>
</g>
"""


def svg(size, rounded, motif_scale):
    rx = (size * 0.22) if rounded else 0
    transform = f"translate(256 256) scale({motif_scale}) translate(-256 -256)"
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' "
        f"width='{size}' height='{size}'>{DEFS}"
        f"<rect x='0' y='0' width='512' height='512' rx='{rx * 512 / size:.1f}' fill='url(#bg)'/>"
        f"<g transform='{transform}'>{MOTIF}</g></svg>"
    )


def html(svgstr):
    return (
        "<!doctype html><html><head><style>*{margin:0;padding:0}"
        "html,body{background:transparent}</style></head><body>"
        f"{svgstr}</body></html>"
    )


VARIANTS = [
    ("icon-512.png", 512, True, 1.0),
    ("icon-192.png", 192, True, 1.0),
    ("icon-maskable-512.png", 512, False, 0.78),
    ("icon-maskable-192.png", 192, False, 0.78),
]


def main():
    os.makedirs(ICONS_DIR, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--force-color-profile=srgb"])
        for name, size, rounded, scale in VARIANTS:
            page = b.new_page(viewport={"width": size, "height": size}, device_scale_factor=1)
            page.set_content(html(svg(size, rounded, scale)))
            page.wait_for_timeout(120)
            page.screenshot(path=os.path.join(ICONS_DIR, name), omit_background=True)
            page.close()
        b.close()
    print("Icons generated in", os.path.normpath(ICONS_DIR))


if __name__ == "__main__":
    main()
