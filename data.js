/*
 * data.js — hardcoded reference data for the Meat Temp app.
 *
 * All temperatures are in Celsius (°C). Safe-minimum internal temperatures
 * follow published USDA/FDA guidance — the source figures are published in
 * Fahrenheit and have been converted here and rounded to the nearest whole
 * degree Celsius. See notes on each item and the disclaimer in the app
 * footer. Doneness ranges above the safe minimum, and all oven / smoker /
 * grill time estimates, are common enthusiast/smoking-community reference
 * points, not regulatory figures — actual time always depends on
 * thickness, bone-in vs boneless, starting temperature, and your
 * equipment. Always confirm with an instant-read thermometer.
 *
 * Data model per cut:
 * {
 *   id, name, safeMinTemp (°C), safeMinNote,
 *   doneness: [{ label, temp (°C) }]   // optional
 *   methods: {
 *     oven:    { temp, time, pull, notes }
 *     smoker:  { temp, time, pull, notes }
 *     grill:   { temp, time, pull, notes }
 *     other:   { label, time, pull, notes }   // stovetop / braise / boil-steam
 *   }
 *   rest: string,
 *   notes: string   // assumptions / enthusiast tips, optional
 * }
 */

const MEAT_DATA = {
  categories: [
    {
      id: "beef",
      name: "Beef",
      icon: "cow",
      tagline: "Steaks, roasts & brisket",
      theme: {
        accent: "#8a2635",
        accentDark: "#5c1521",
        accentLight: "#c1495a",
        bg1: "#3a0f16",
        bg2: "#1f0810"
      },
      cuts: [
        {
          id: "beef-steak",
          name: "Steak (Ribeye, Strip, Sirloin, Filet)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of beef, plus a 3-minute rest.",
          doneness: [
            { label: "Rare", temp: 52 },
            { label: "Medium Rare", temp: 57 },
            { label: "Medium", temp: 63 },
            { label: "Medium Well", temp: 66 },
            { label: "Well Done", temp: 71 }
          ],
          methods: {
            grill: { temp: "232°C direct, high heat", time: "4-6 min per side (2.5-4cm cut)", pull: "~3°C below target (carryover)", notes: "Sear both sides, move to indirect heat to finish for thicker cuts." },
            oven: { temp: "135°C (reverse sear), then 260°C sear", time: "~20-25 min low, 1-2 min/side sear", pull: "~3°C below target", notes: "Reverse sear works well for cuts over 4cm thick." }
          },
          rest: "5-10 minutes, loosely tented with foil.",
          notes: "Rare and Medium Rare are common preferences below the USDA-recommended minimum; eating undercooked beef whole-cuts is lower risk than ground beef but still a personal choice."
        },
        {
          id: "beef-prime-rib",
          name: "Prime Rib / Standing Rib Roast",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of beef, plus a 3-minute rest.",
          doneness: [
            { label: "Rare", temp: 52 },
            { label: "Medium Rare", temp: 57 },
            { label: "Medium", temp: 63 },
            { label: "Well Done", temp: 71 }
          ],
          methods: {
            oven: { temp: "163°C", time: "~15 min per lb (~33 min per kg)", pull: "49-52°C for med-rare (carries to ~54-57°C)", notes: "Optional initial 260°C sear for 15-20 min, then drop to 163°C." },
            smoker: { temp: "107-121°C", time: "~30-35 min per lb (~66-77 min per kg)", pull: "~3°C below target doneness", notes: "Great with post-oak or hickory." }
          },
          rest: "20-30 minutes, tented — large roasts carry over several degrees."
        },
        {
          id: "beef-tenderloin",
          name: "Beef Tenderloin Roast",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of beef, plus a 3-minute rest.",
          doneness: [
            { label: "Rare", temp: 52 },
            { label: "Medium Rare", temp: 57 },
            { label: "Medium", temp: 63 }
          ],
          methods: {
            oven: { temp: "218°C sear, then 163°C", time: "~20 min per lb total (~44 min per kg)", pull: "52°C for medium-rare", notes: "Very lean — easy to overcook, watch closely near the end." },
            smoker: { temp: "121°C", time: "~20-25 min per lb (~44-55 min per kg)", pull: "52°C for medium-rare" }
          },
          rest: "15 minutes."
        },
        {
          id: "beef-brisket",
          name: "Brisket",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of beef. In practice brisket is cooked well past this for tenderness.",
          methods: {
            smoker: { temp: "107-121°C", time: "~1-1.5 hr per lb (~2-3.3 hr per kg; 12-18 hr for a full packer)", pull: "91-95°C, probe-tender", notes: "Wrap in butcher paper or foil once bark sets (~74°C) to push through the stall." },
            oven: { temp: "149°C, wrapped tightly in foil", time: "~1 hr per lb (~2.2 hr per kg)", pull: "91-95°C, probe-tender" }
          },
          rest: "1-2 hours wrapped, in a cooler — critical for brisket, don't skip it."
        },
        {
          id: "beef-chuck-roast",
          name: "Chuck Roast (Pot Roast)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of beef. Cooked well past this to break down connective tissue.",
          methods: {
            oven: { temp: "149-163°C (braise, covered)", time: "3-4 hr total", pull: "91-95°C, fork tender", notes: "Braise in liquid covering 1/3-1/2 of the roast." },
            smoker: { temp: "107-121°C", time: "~1.5 hr per lb (~3.3 hr per kg)", pull: "74°C, then wrap and continue to 95°C", notes: "\"Poor man's burnt ends\" territory." }
          },
          rest: "15-20 minutes."
        },
        {
          id: "beef-ribs",
          name: "Beef Ribs (Short Ribs / Back Ribs)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of beef. Cooked well past this for tenderness.",
          methods: {
            smoker: { temp: "107-121°C", time: "6-8 hr", pull: "93-96°C, probe tender" },
            oven: { temp: "135°C, wrapped after bark forms", time: "4-5 hr", pull: "93-96°C" }
          },
          rest: "20-30 minutes."
        }
      ]
    },
    {
      id: "pork",
      name: "Pork",
      icon: "pig",
      tagline: "Chops, roasts & pulled pork",
      theme: {
        accent: "#c76b85",
        accentDark: "#93435a",
        accentLight: "#e79bb0",
        bg1: "#4a1e2a",
        bg2: "#2a0f18"
      },
      cuts: [
        {
          id: "pork-chops",
          name: "Pork Chops",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for pork (updated 2011 guidance) — a hint of pink is safe at this temp.",
          doneness: [
            { label: "Medium (USDA min)", temp: 63 },
            { label: "Medium Well", temp: 66 },
            { label: "Well Done", temp: 71 }
          ],
          methods: {
            grill: { temp: "204°C direct", time: "4-5 min per side (bone-in, 2.5cm)", pull: "63°C" },
            oven: { temp: "204°C", time: "20-25 min", pull: "63°C" }
          },
          rest: "3 minutes minimum (USDA requirement), 5 min recommended."
        },
        {
          id: "pork-tenderloin",
          name: "Pork Tenderloin",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for pork.",
          methods: {
            oven: { temp: "204°C", time: "20-27 min (~13 min per lb / ~29 min per kg)", pull: "63°C" },
            grill: { temp: "191-204°C", time: "15-20 min, turning", pull: "63°C" }
          },
          rest: "3-5 minutes."
        },
        {
          id: "pork-loin-roast",
          name: "Pork Loin Roast",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for pork.",
          methods: {
            oven: { temp: "177°C", time: "~20 min per lb (~44 min per kg)", pull: "63°C" },
            smoker: { temp: "107-121°C", time: "~30 min per lb (~66 min per kg)", pull: "63°C" }
          },
          rest: "10 minutes."
        },
        {
          id: "pork-shoulder",
          name: "Pork Shoulder / Butt (Pulled Pork)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for pork. Cooked well past this to render fat and connective tissue for pulling.",
          methods: {
            smoker: { temp: "107-121°C", time: "~1.5-2 hr per lb (~3.3-4.4 hr per kg)", pull: "91-95°C, probe tender", notes: "Expect a stall around 71-77°C; wrapping (Texas crutch) can push through it." },
            oven: { temp: "149°C, wrapped", time: "~1.5 hr per lb (~3.3 hr per kg)", pull: "91-95°C" }
          },
          rest: "30-60 minutes wrapped, before pulling."
        },
        {
          id: "pork-ribs",
          name: "Pork Ribs (Baby Back / Spare)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for pork. Judged by tenderness (bend test) more than temperature.",
          methods: {
            smoker: { temp: "107-121°C", time: "Baby back: 4-5 hr · Spare: 5-6 hr", pull: "~91-95°C / bends & cracks without falling apart", notes: "Classic 3-2-1 method (spare ribs): 3 hr smoke, 2 hr wrapped, 1 hr unwrapped with sauce." },
            oven: { temp: "135°C, wrapped in foil", time: "~2.5-3 hr", pull: "~91-95°C" }
          },
          rest: "10 minutes, tented."
        },
        {
          id: "pork-fresh-ham",
          name: "Fresh Ham (uncooked leg)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for fresh (uncooked) pork ham. Note: pre-cooked/cured ham only needs reheating to 60°C.",
          methods: {
            oven: { temp: "163°C", time: "~18-20 min per lb (~40-44 min per kg)", pull: "63°C" }
          },
          rest: "15-20 minutes."
        }
      ]
    },
    {
      id: "poultry",
      name: "Poultry",
      icon: "chicken",
      tagline: "Chicken, turkey & duck",
      theme: {
        accent: "#d99b2b",
        accentDark: "#a5730f",
        accentLight: "#f0bc5e",
        bg1: "#4a3512",
        bg2: "#2b1e09"
      },
      cuts: [
        {
          id: "poultry-whole-chicken",
          name: "Whole Chicken",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for all poultry, measured in the thickest part of the breast/thigh not touching bone.",
          methods: {
            oven: { temp: "191°C (or 177°C)", time: "~20 min per lb (~44 min per kg)", pull: "74°C breast / 79°C thigh", notes: "Tent with foil if skin browns too fast." },
            smoker: { temp: "135-149°C (higher heat keeps skin from going rubbery)", time: "~30 min per lb (~66 min per kg)", pull: "74°C breast / 79°C thigh" }
          },
          rest: "15 minutes."
        },
        {
          id: "poultry-chicken-breast",
          name: "Chicken Breast (boneless)",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for poultry.",
          methods: {
            oven: { temp: "204°C", time: "20-25 min", pull: "74°C" },
            grill: { temp: "191-204°C", time: "6-8 min per side", pull: "74°C" },
            smoker: { temp: "107-121°C", time: "45-75 min", pull: "74°C" }
          },
          rest: "5 minutes."
        },
        {
          id: "poultry-chicken-thighs",
          name: "Chicken Thighs / Drumsticks",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for poultry. Dark meat stays juicy well above this.",
          methods: {
            oven: { temp: "204°C", time: "35-40 min", pull: "74°C min, 79-85°C for best texture" },
            grill: { temp: "191°C", time: "~30 min, turning", pull: "74°C min, 79-85°C for best texture" },
            smoker: { temp: "121°C", time: "1.5-2 hr", pull: "79-85°C" }
          },
          rest: "5 minutes."
        },
        {
          id: "poultry-whole-turkey",
          name: "Whole Turkey (unstuffed)",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for poultry, measured in the thickest part of the breast and inner thigh.",
          methods: {
            oven: { temp: "163°C", time: "~13 min per lb / ~29 min per kg (e.g. ~2.5-3 hr for 4.5-5.5kg, ~4-4.25 hr for 9kg)", pull: "74°C breast / 79°C thigh", notes: "Stuffed birds need longer — check stuffing center reaches 74°C too." },
            smoker: { temp: "135-149°C", time: "~30 min per lb (~66 min per kg)", pull: "74°C breast / 79°C thigh" }
          },
          rest: "20-40 minutes (large bird, tent loosely)."
        },
        {
          id: "poultry-turkey-breast",
          name: "Turkey Breast",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for poultry.",
          methods: {
            oven: { temp: "163°C", time: "~20 min per lb (~44 min per kg)", pull: "74°C" },
            smoker: { temp: "121-135°C", time: "~30-40 min per lb (~66-88 min per kg)", pull: "74°C" }
          },
          rest: "15-20 minutes."
        },
        {
          id: "poultry-duck",
          name: "Duck (whole / breast)",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for poultry, same as chicken/turkey.",
          doneness: [
            { label: "USDA Safe Minimum", temp: 74 }
          ],
          methods: {
            oven: { temp: "177°C (whole)", time: "~20 min per lb (~44 min per kg)", pull: "74°C breast / 79°C leg", notes: "Score the skin and render fat over low heat first for crisp skin." }
          },
          rest: "15 minutes.",
          notes: "Many restaurants and enthusiasts serve duck breast pan-seared to 54-60°C (medium-rare) for texture, similar to red meat — this is below the USDA poultry minimum and a personal risk choice, not a food-safety recommendation."
        }
      ]
    },
    {
      id: "lamb",
      name: "Lamb",
      icon: "sheep",
      tagline: "Chops, leg & rack",
      theme: {
        accent: "#b5713a",
        accentDark: "#7d4c22",
        accentLight: "#d9a06a",
        bg1: "#3d2712",
        bg2: "#221507"
      },
      cuts: [
        {
          id: "lamb-chops",
          name: "Lamb Chops",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of lamb, plus a 3-minute rest.",
          doneness: [
            { label: "Rare", temp: 52 },
            { label: "Medium Rare", temp: 57 },
            { label: "Medium", temp: 63 },
            { label: "Well Done", temp: 71 }
          ],
          methods: {
            grill: { temp: "232°C direct", time: "3-4 min per side", pull: "~3°C below target" },
            oven: { temp: "204°C (pan-sear then oven finish)", time: "6-8 min total", pull: "~3°C below target" }
          },
          rest: "3-5 minutes."
        },
        {
          id: "lamb-leg",
          name: "Leg of Lamb (bone-in or boneless)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of lamb, plus a 3-minute rest.",
          doneness: [
            { label: "Medium Rare", temp: 57 },
            { label: "Medium", temp: 63 },
            { label: "Well Done", temp: 71 }
          ],
          methods: {
            oven: { temp: "163°C", time: "~20 min per lb (bone-in) (~44 min per kg)", pull: "54-57°C for medium-rare" },
            smoker: { temp: "107-121°C", time: "~30 min per lb (~66 min per kg)", pull: "54-57°C for medium-rare" }
          },
          rest: "15-20 minutes."
        },
        {
          id: "lamb-rack",
          name: "Rack of Lamb",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of lamb, plus a 3-minute rest.",
          doneness: [
            { label: "Medium Rare", temp: 57 },
            { label: "Medium", temp: 63 }
          ],
          methods: {
            oven: { temp: "232°C sear, then 163°C", time: "~20-25 min total", pull: "54-57°C for medium-rare" }
          },
          rest: "10 minutes."
        },
        {
          id: "lamb-shoulder",
          name: "Lamb Shoulder",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of lamb. Cooked well past this for pulled/braised texture.",
          methods: {
            oven: { temp: "149°C (braise or covered roast)", time: "~40 min per lb (~88 min per kg)", pull: "91-95°C, fork tender" },
            smoker: { temp: "107-121°C", time: "~1.5 hr per lb (~3.3 hr per kg)", pull: "91-95°C" }
          },
          rest: "15-20 minutes."
        }
      ]
    },
    {
      id: "ground",
      name: "Ground Meats",
      icon: "grinder",
      tagline: "Burgers, meatloaf & more",
      theme: {
        accent: "#7a3b2e",
        accentDark: "#4f241a",
        accentLight: "#a8654f",
        bg1: "#33170f",
        bg2: "#1c0c07"
      },
      cuts: [
        {
          id: "ground-beef",
          name: "Ground Beef (Burgers, Meatloaf)",
          safeMinTemp: 71,
          safeMinNote: "USDA safe minimum for ground beef — higher than whole-cut beef because grinding spreads surface bacteria through the meat.",
          methods: {
            grill: { temp: "204°C direct", time: "4-5 min per side (2cm patty)", pull: "71°C" },
            oven: { temp: "177°C (meatloaf, ~0.7kg loaf)", time: "~1 hr", pull: "71°C" }
          },
          rest: "3 minutes."
        },
        {
          id: "ground-pork",
          name: "Ground Pork",
          safeMinTemp: 71,
          safeMinNote: "USDA safe minimum for ground pork.",
          methods: {
            grill: { temp: "204°C direct", time: "4-5 min per side (patty)", pull: "71°C" },
            oven: { temp: "191°C", time: "20-25 min (meatballs/patties)", pull: "71°C" }
          },
          rest: "3 minutes."
        },
        {
          id: "ground-poultry",
          name: "Ground Turkey / Chicken",
          safeMinTemp: 74,
          safeMinNote: "USDA safe minimum for all ground poultry — same as whole poultry cuts, unlike red meat.",
          methods: {
            grill: { temp: "191-204°C direct", time: "5-6 min per side (patty)", pull: "74°C" },
            oven: { temp: "191°C", time: "20-25 min", pull: "74°C" }
          },
          rest: "3 minutes."
        },
        {
          id: "ground-lamb",
          name: "Ground Lamb (Kofta, Burgers)",
          safeMinTemp: 71,
          safeMinNote: "USDA safe minimum for ground lamb.",
          methods: {
            grill: { temp: "204°C direct", time: "3-4 min per side (kofta/skewers)", pull: "71°C" },
            oven: { temp: "191°C", time: "18-22 min", pull: "71°C" }
          },
          rest: "3 minutes."
        },
        {
          id: "ground-venison",
          name: "Ground Venison / Game",
          safeMinTemp: 71,
          safeMinNote: "USDA safe minimum for ground game meat. Often blended with beef fat or pork fat since venison is very lean.",
          methods: {
            grill: { temp: "204°C direct", time: "4-5 min per side (patty)", pull: "71°C" },
            oven: { temp: "191°C", time: "~1 hr (meatloaf)", pull: "71°C" }
          },
          rest: "3 minutes."
        }
      ]
    },
    {
      id: "seafood",
      name: "Fish & Seafood",
      icon: "fish",
      tagline: "Fillets, shrimp & shellfish",
      theme: {
        accent: "#2b8a94",
        accentDark: "#175b62",
        accentLight: "#5cb9c2",
        bg1: "#0e3238",
        bg2: "#071c20"
      },
      cuts: [
        {
          id: "fish-fin",
          name: "Fin Fish (Salmon, Cod, Halibut, Tuna...)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for fish — or cook until flesh is opaque and flakes easily with a fork.",
          methods: {
            oven: { temp: "204°C", time: "~4-6 min per 1.25cm thickness (~10 min per 2.5cm)", pull: "63°C or opaque & flaking" },
            grill: { temp: "204-232°C", time: "~8-10 min per 2.5cm of thickness, turning once", pull: "63°C or opaque & flaking" }
          },
          rest: "2-3 minutes.",
          notes: "Salmon and tuna are often served rarer (medium-rare, ~46-52°C) by choice for texture — a personal preference below USDA guidance, not a safety recommendation. Sushi-grade fish for raw preparations has separate freezing requirements not covered here."
        },
        {
          id: "seafood-shrimp",
          name: "Shrimp",
          safeMinTemp: null,
          safeMinNote: "USDA guidance is visual, not a set temperature: cook until flesh is pearly/opaque and curled into a loose \"C\" shape. Informally, this is roughly 49-54°C internal.",
          methods: {
            grill: { temp: "High heat, direct", time: "2-3 min per side", pull: "Opaque & pink, curled into a C" },
            other: { label: "Stovetop / Sauté", time: "2-3 min per side", pull: "Opaque & pink, curled into a C" }
          },
          rest: "None needed.",
          notes: "Overcooked shrimp turns rubbery fast and curls into a tight \"O\" — pull as soon as it's opaque."
        },
        {
          id: "seafood-scallops",
          name: "Scallops",
          safeMinTemp: null,
          safeMinNote: "USDA guidance is visual: cook until milky white/opaque and firm throughout.",
          methods: {
            other: { label: "Pan Sear (high heat)", time: "1-2 min per side", pull: "Opaque, firm, golden crust" }
          },
          rest: "None needed."
        },
        {
          id: "seafood-lobster",
          name: "Lobster",
          safeMinTemp: 60,
          safeMinNote: "Informal internal target for tail meat; USDA guidance is visual — flesh should be opaque white, shell bright red.",
          methods: {
            other: { label: "Boil / Steam", time: "~8-10 min per lb (~18-22 min per kg)", pull: "Opaque white flesh, ~60°C" }
          },
          rest: "None needed."
        },
        {
          id: "seafood-crab",
          name: "Crab",
          safeMinTemp: 63,
          safeMinNote: "Informal internal target; USDA guidance is visual — shell turns bright red/orange and meat is opaque.",
          methods: {
            other: { label: "Steam / Boil", time: "~8-15 min depending on size", pull: "Opaque meat, ~63°C" }
          },
          rest: "None needed."
        },
        {
          id: "seafood-shellfish",
          name: "Clams, Mussels & Oysters",
          safeMinTemp: 63,
          safeMinNote: "USDA guidance: cook until shells open. Discard any that stay closed after cooking — they were not viable/safe.",
          methods: {
            other: { label: "Steam", time: "5-10 min, until shells open" }
          },
          rest: "None needed."
        }
      ]
    },
    {
      id: "game",
      name: "Game",
      icon: "deer",
      tagline: "Venison, boar & elk",
      theme: {
        accent: "#4c7a4a",
        accentDark: "#2e4f2c",
        accentLight: "#7ea87c",
        bg1: "#1c2e18",
        bg2: "#0f1a0c"
      },
      cuts: [
        {
          id: "game-venison-steak",
          name: "Venison Steak / Chops",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of game meat, plus a 3-minute rest.",
          doneness: [
            { label: "Rare", temp: 49 },
            { label: "Medium Rare (recommended)", temp: 54 },
            { label: "Medium", temp: 60 },
            { label: "Well Done", temp: 71 }
          ],
          methods: {
            grill: { temp: "232°C direct", time: "3-4 min per side", pull: "~3°C below target" },
            other: { label: "Pan Sear (high heat)", time: "2-3 min per side", pull: "~3°C below target" }
          },
          rest: "5 minutes.",
          notes: "Venison is very lean and turns tough/dry well done — medium-rare is the enthusiast-community sweet spot, above the USDA minimum but below common well-done targets."
        },
        {
          id: "game-venison-roast",
          name: "Venison Roast",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of game meat.",
          doneness: [
            { label: "Medium Rare", temp: 54 },
            { label: "Medium", temp: 60 }
          ],
          methods: {
            oven: { temp: "121-135°C (low & slow)", time: "~25-30 min per lb (~55-66 min per kg)", pull: "54-60°C" },
            smoker: { temp: "107-121°C", time: "~30-40 min per lb (~66-88 min per kg)", pull: "54-60°C" }
          },
          rest: "15 minutes."
        },
        {
          id: "game-wild-boar",
          name: "Wild Boar (Chops / Roast)",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum, treated like pork due to historical trichinosis risk in wild pigs.",
          methods: {
            oven: { temp: "177°C", time: "~25 min per lb (roast) (~55 min per kg)", pull: "63°C" },
            grill: { temp: "204°C direct", time: "4-5 min per side (chops)", pull: "63°C" }
          },
          rest: "10 minutes."
        },
        {
          id: "game-elk-steak",
          name: "Elk Steak",
          safeMinTemp: 63,
          safeMinNote: "USDA safe minimum for whole cuts of game meat, plus a 3-minute rest.",
          doneness: [
            { label: "Medium Rare (recommended)", temp: 54 },
            { label: "Medium", temp: 60 }
          ],
          methods: {
            grill: { temp: "232°C direct", time: "3-4 min per side", pull: "~3°C below target" }
          },
          rest: "5 minutes.",
          notes: "Like venison, elk is very lean — best kept at medium-rare to medium."
        }
      ]
    }
  ]
};
