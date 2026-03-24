"use client";
import { useState, useMemo } from "react";

// ─── COMPLETE STRAIN DATABASE ──────────────────────────────────────────────────
const strainDB = [
  // PERSONAL DATABASE — TRIED & VERIFIED
  { name: "Electric Honeydew", brand: "N/A", cultivar: "Electric Honeydew", thc: 26, cbd: 0, category: "Day / Functional", status: "tried", verdict: "Benchmark intelligent sativa hybrid", species: "Hybrid", terpenes: { limonene: 0.8, caryophyllene: 0.5, pinene: 0.4, myrcene: 0.2, linalool: 0.1 }, totalTerpenes: 2.0, price: null, rrp: null, sizes: [], notes: "Clean, creative, zero heaviness. Strong top-end lift + grounding backbone." },
  { name: "Greenline Banjo", brand: "N/A", cultivar: "Greenline Banjo", thc: 26, cbd: 0, category: "Day / Functional", status: "tried", verdict: "Near-perfect day hybrid", species: "Hybrid", terpenes: { limonene: 0.65, caryophyllene: 0.45, farnesene: 0.3, pinene: 0.25, myrcene: 0.15 }, totalTerpenes: 1.8, price: null, rrp: null, sizes: [], notes: "Bright, productive, enjoyable. Lift + cushion + structure." },
  { name: "Crystal Locomotive", brand: "N/A", cultivar: "Crystal Locomotive", thc: 28, cbd: 0, category: "Day / Functional", status: "tried", verdict: "Safe creative haze", species: "Hybrid", terpenes: { limonene: 0.5, terpinolene: 0.35, caryophyllene: 0.4, myrcene: 0.2 }, totalTerpenes: 1.45, price: null, rrp: null, sizes: [], notes: "Controlled stimulation without overload." },
  { name: "Runtz Punch", brand: "N/A", cultivar: "Runtz Punch", thc: 28, cbd: 0, category: "Day / Functional", status: "tried", verdict: "Reliable hybrid", species: "Hybrid", terpenes: { caryophyllene: 0.5, limonene: 0.45, myrcene: 0.4 }, totalTerpenes: 1.35, price: null, rrp: null, sizes: [], notes: "Even terpene spread, no dominance. Versatile and smooth." },
  { name: "Southern Sky Hybrid", brand: "N/A", cultivar: "Southern Sky", thc: 26, cbd: 1, category: "Day / Functional", status: "tried", verdict: "Ideal heavy-functional crossover", species: "Hybrid", terpenes: { myrcene: 0.45, caryophyllene: 0.4, limonene: 0.35 }, totalTerpenes: 1.2, price: null, rrp: null, sizes: [], notes: "CBD + terpene balance = structured sedation. Heavy but controlled." },
  { name: "MAC-1", brand: "N/A", cultivar: "MAC-1", thc: 22, cbd: 0, category: "Deep Think / Creative", status: "tried", verdict: "Intellectual + emotional balance", species: "Hybrid", terpenes: { limonene: 0.45, caryophyllene: 0.4, farnesene: 0.3, linalool: 0.25 }, totalTerpenes: 1.4, price: null, rrp: null, sizes: [], notes: "High terpene density despite low THC. Deep thinking + calm." },
  { name: "Rosa 22:1", brand: "Kind Medical", cultivar: "Pink Kush (Relative of OG Kush)", thc: 22, cbd: 0, category: "Deep Think / Creative", status: "tried", verdict: "Unique body-aware deep state", species: "Indica dominant", aromas: "White Pepper, Orange, Butterscotch", terpenes: { caryophyllene: 0.88, farnesene: 0.75, myrcene: 0.42, humulene: 0.22, limonene: 0.22 }, totalTerpenes: 2.98, price: 12.00, rrp: 120, sizes: ["10g"], notes: "Rare terpene combo. Sedative + sensual + enveloping." },
  { name: "Lemon Zkittlez", brand: "N/A", cultivar: "Lemon Zkittlez", thc: 28, cbd: 0, category: "Deep Think / Creative", status: "tried", verdict: "Edge-case deep thinker", species: "Hybrid", terpenes: { limonene: 0.7, myrcene: 0.4, terpinolene: 0.3 }, totalTerpenes: 1.4, price: null, rrp: null, sizes: [], notes: "Strong lift without enough grounding. Slightly anxious edge." },
  { name: "Frost'd Flakes", brand: "N/A", cultivar: "Frost'd Flakes", thc: 30, cbd: 0, category: "Sleep / KO", status: "tried", verdict: "Reliable knockout", species: "Indica", terpenes: { myrcene: 0.7, caryophyllene: 0.35, linalool: 0.25 }, totalTerpenes: 1.3, price: null, rrp: null, sizes: [], notes: "Fast knockout. Classic sedation stack." },
  { name: "East Coast Dank'z", brand: "N/A", cultivar: "East Coast Dank'z", thc: 25, cbd: 0, category: "Avoid", status: "tried", verdict: "Zero terpene intelligence", species: "Unknown", terpenes: { myrcene: 0.15 }, totalTerpenes: 0.15, price: null, rrp: null, sizes: [], notes: "Flat, empty. No limonene, no structure." },
  { name: "Blue Mountain THC25", brand: "N/A", cultivar: "Critical Kush", thc: 25, cbd: 0, category: "Avoid", status: "tried", verdict: "Blunt one-note sedation", species: "Indica", terpenes: { myrcene: 0.7, limonene: 0.05 }, totalTerpenes: 0.75, price: null, rrp: null, sizes: [], notes: "Myrcene-heavy, no lift." },

  // CATALYST DATABASE — PREDICTED
  { name: "Maali Sky", brand: "Maali", cultivar: "Royal Moby", thc: 20, cbd: 0, category: "Caution", status: "predicted", species: "Sativa dominant", terpenes: { terpinolene: 1.0, caryophyllene: 0.5, myrcene: 0.25 }, totalTerpenes: 1.75, price: 12.90, rrp: 129, sizes: ["10g"], notes: "Terpinolene-dominant with no limonene. Caryophyllene anchor helps but unpredictable." },
  { name: "THC 23 Opal", brand: "Tasmanian Botanics", cultivar: "White Widow", thc: 23, cbd: 0, category: "Caution", status: "predicted", species: "Sativa dominant", terpenes: { terpinolene: 1.10, ocimene: 0.32, myrcene: 0.26, caryophyllene: 0.25, limonene: 0.16, betaPinene: 0.11, alphaPinene: 0.06, alphaTerpinene: 0.04, delta3Carene: 0.04, bisabolol: 0.03, gammaTerpinene: 0.02, terpineol: 0.01, humulene: 0.01 }, totalTerpenes: 2.41, price: null, rrp: null, sizes: [], notes: "Terpinolene-dominant with very low limonene. Anxiety risk." },
  { name: "Cannatrek T25 Topaz", brand: "Cannatrek", cultivar: "Kush Cookie", thc: 25, cbd: 0, category: "Unknown", status: "predicted", species: "Indica dominant", terpenes: {}, totalTerpenes: null, price: 13.50, rrp: 135, sizes: ["10g"], notes: "NO TERPENE DATA." },
  { name: "THC 25 Amethyst", brand: "Tasmanian Botanics", cultivar: "Wedding Cake x Animal Cookies", thc: 25, cbd: 0, category: "Day / Functional", status: "predicted", species: "Indica dominant", aromas: "Sweet, Spicy, Fruity", terpenes: { myrcene: 0.67, limonene: 0.44, caryophyllene: 0.39, linalool: 0.25, humulene: 0.12, betaPinene: 0.12, bisabolol: 0.11, alphaPinene: 0.08, terpineol: 0.04, camphene: 0.02 }, totalTerpenes: 2.24, price: 9.90, rrp: 99, sizes: ["10g", "30g", "28g"], notes: "Myrcene leads but limonene + caryophyllene + linalool provide real structure. High potential." },
  { name: "Iris 21:1", brand: "Kind Medical", cultivar: "Black Cherry Punch", thc: 21, cbd: 0, category: "Deep Think / Creative", status: "predicted", species: "Balanced Hybrid", aromas: "Cherry, Wood, Spice", terpenes: { limonene: 0.32, farnesene: 0.27, caryophyllene: 0.26, myrcene: 0.21, linalool: 0.16, guaiol: 0.09, humulene: 0.08, betaPinene: 0.05, alphaPinene: 0.03, terpineol: 0.03, fenchol: 0.03, camphene: 0.01, nerolidol: 0.01, terpinolene: 0.01, caryophylleneOxide: 0.01, fenchone: 0.01 }, totalTerpenes: 1.58, price: 12.00, rrp: 120, sizes: ["10g"], notes: "Limonene + farnesene + caryophyllene + linalool. Similar to MAC-1." },
  { name: "IndiMed Tempo 19", brand: "IndiMed", cultivar: "Delahaze", thc: 19, cbd: 0, category: "Caution", status: "predicted", species: "Sativa", terpenes: { terpinolene: 1.19, other: 0.56, myrcene: 0.54, ocimene: 0.35, alphaPinene: 0.19, caryophyllene: 0.15 }, totalTerpenes: 2.98, price: 6.60, rrp: 99, sizes: ["15g"], notes: "Terpinolene-dominant with high myrcene. No limonene. Anxiety/flatness risk." },
  { name: "Bazookas", brand: "Mediquest", cultivar: "Bazookas", thc: 30, cbd: 0, category: "Day / Functional", status: "predicted", species: "Indica dominant", aromas: "Sweet Gas, Grape, Citrus", terpenes: { limonene: 0.84, caryophyllene: 0.48, humulene: 0.24, linalool: 0.22, ocimene: 0.20 }, totalTerpenes: 2.56, price: 16.50, rrp: 165, sizes: ["10g"], notes: "Limonene-dominant + caryophyllene + linalool. Pattern-matches Electric Honeydew at 30% THC." },
  { name: "THC 27 Royale Sunflower", brand: "Tasmanian Botanics", cultivar: "Girl Scout Cookies x OG Kush", thc: 27, cbd: 0, category: "Deep Think / Creative", status: "predicted", species: "Indica", terpenes: { caryophyllene: 0.82, humulene: 0.39, limonene: 0.36, myrcene: 0.30, bisabolol: 0.27 }, totalTerpenes: 2.57, price: 5.27, rrp: 79, sizes: ["15g", "28g", "30g"], notes: "Heaviest caryophyllene anchor. Deep body-think. Incredible value." },
  { name: "Azure 17:1", brand: "Kind Medical", cultivar: "Blue Dream", thc: 17, cbd: 0, category: "Day / Functional", status: "predicted", species: "Sativa dominant", aromas: "Berry, Citrus, Pine", terpenes: { myrcene: 0.74, alphaPinene: 0.22, caryophyllene: 0.21, farnesene: 0.19, betaPinene: 0.08 }, totalTerpenes: 1.78, price: 12.00, rrp: 120, sizes: ["10g"], notes: "Myrcene-dominant but farnesene + pinene add structure. No limonene. Risks flatness." },
  { name: "Cultiva Lee Anne Womac", brand: "Cultiva", cultivar: "Lee Anne WoMAC", thc: 24, cbd: 0, cbg: 2, category: "Deep Think / Creative", status: "predicted", species: "Balanced Hybrid", aromas: "Mango, Pine, Floral", terpenes: { terpinolene: 0.76, caryophyllene: 0.31, farnesene: 0.27, linalool: 0.14, limonene: 0.14 }, totalTerpenes: 2.34, price: 15.90, rrp: 159, sizes: ["10g"], notes: "Terpinolene-led but with caryophyllene anchor + farnesene. CBG (2%) notable." },
  { name: "Beacon Medical GSC", brand: "Beacon Medical", cultivar: "Girl Scout Cookies", thc: 20, cbd: 0, category: "Unknown", status: "predicted", species: "Indica dominant", terpenes: {}, totalTerpenes: null, price: 13.50, rrp: 135, sizes: ["10g"], notes: "NO TERPENE DATA." },
  { name: "Varaski T26", brand: "Entoura", cultivar: "Proprietary", thc: 26, cbd: 0, category: "Day / Functional", status: "predicted", species: "Indica dominant", aromas: "Citrus, Pine, Earth", terpenes: { myrcene: 0.90, limonene: 0.35, caryophyllene: 0.24, humulene: 0.09, betaPinene: 0.08, guaiol: 0.08, bisabolol: 0.07, linalool: 0.06, alphaPinene: 0.06, terpineol: 0.05, nerolidol: 0.02, camphene: 0.01, caryophylleneOxide: 0.01, borneol: 0.01 }, totalTerpenes: 2.04, price: 9.67, rrp: 145, sizes: ["15g"], notes: "Myrcene-dominant but some limonene + caryophyllene structure. Borderline." },
  { name: "Pouch Red", brand: "Pouch", cultivar: "Black Cherry Pie", thc: 27, cbd: 0, category: "Day / Functional", status: "predicted", species: "Balanced Hybrid", aromas: "Cherry, Berry, Dough", terpenes: { limonene: 0.53, caryophyllene: 0.20, myrcene: 0.19, linalool: 0.13, humulene: 0.09, betaPinene: 0.09, guaiol: 0.07, alphaPinene: 0.05, bisabolol: 0.03, camphene: 0.01 }, totalTerpenes: 1.39, price: 6.07, rrp: 85, sizes: ["14g"], notes: "Limonene-led with low myrcene. Clean functional profile. Great value." },
  { name: "Cannatrek C9T7 Argaman", brand: "Cannatrek", cultivar: "White Widow & CBD Critical Mass", thc: 7, cbd: 9, category: "CBD Dominant", status: "predicted", species: "Balanced Hybrid", terpenes: {}, totalTerpenes: null, price: 13.50, rrp: 135, sizes: ["10g"], notes: "NO TERPENE DATA. High-CBD product." },
  { name: "MEDCAN Cold Creek Afghan Kush", brand: "MEDCAN Australia", cultivar: "Afghan Kush (Cold Creek Kush)", thc: 24, cbd: 0, category: "Avoid", status: "predicted", species: "Indica", terpenes: { myrcene: 0.86, ocimene: 0.24, caryophyllene: 0.13, cedrene: 0.11, limonene: 0.07 }, totalTerpenes: 1.70, price: 12.90, rrp: 129, sizes: ["10g"], notes: "Myrcene-dominant with near-zero limonene. Pattern-matches Blue Mountain." },
  { name: "IndiMed Tempo 26 Sourdough", brand: "IndiMed", cultivar: "Sourdough", thc: 26, cbd: 0, category: "Deep Think / Creative", status: "predicted", species: "Indica", terpenes: { caryophyllene: 0.58, other: 0.52, limonene: 0.39, farnesene: 0.37, myrcene: 0.25 }, totalTerpenes: 2.27, price: 6.60, rrp: 99, sizes: ["15g"], notes: "Caryophyllene + limonene + farnesene. Near-identical to MAC-1 but stronger. Great value." },
  { name: "MEDCAN Strawberry Cake", brand: "MEDCAN Australia", cultivar: "Strawberry Cake", thc: 22, cbd: 0, category: "Caution", status: "predicted", species: "Indica dominant", terpenes: { terpinolene: 0.86, myrcene: 0.47, ocimene: 0.36, limonene: 0.13, terpineol: 0.10, bisabolol: 0.09, betaPinene: 0.09, caryophyllene: 0.07, alphaPinene: 0.07, terpinene: 0.05, phellandrene: 0.04, guaiol: 0.04, fenchol: 0.03, humulene: 0.01, nerolidol: 0.01, caryophylleneOxide: 0.01 }, totalTerpenes: 2.43, price: 13.90, rrp: 139, sizes: ["10g"], notes: "Terpinolene-dominant + high myrcene, minimal anchor. Poorly structured." },
  { name: "Phytoca Chapel of Love", brand: "Phytoca", cultivar: "Chapel of Love", thc: 30, cbd: 0, category: "Day / Functional", status: "predicted", species: "Indica dominant", aromas: "Sweet, Creamy, Vanilla, Cake, Gas", terpenes: { limonene: 0.48, caryophyllene: 0.25, myrcene: 0.25, linalool: 0.19, betaPinene: 0.10, humulene: 0.07, alphaPinene: 0.06, terpineol: 0.05, fenchol: 0.05, phytol: 0.03, camphene: 0.01, borneol: 0.01, nerolidol: 0.01, bisabolol: 0.01, terpinolene: 0.01 }, totalTerpenes: 1.58, price: 9.90, rrp: 99, sizes: ["10g"], notes: "Limonene-led + caryophyllene + linalool at 30% THC. Great value." },
  { name: "ANTG Solace THC22", brand: "ANTG", cultivar: "Tangie Chem", thc: 22, cbd: 0, category: "Day / Functional", status: "predicted", species: "Sativa dominant", aromas: "Citrus, Sweet, Orange", terpenes: { caryophyllene: 0.76, limonene: 0.59, myrcene: 0.53, humulene: 0.28, linalool: 0.18 }, totalTerpenes: 2.34, price: 14.90, rrp: 149, sizes: ["10g"], notes: "Caryophyllene + limonene — strong anchor + lift. Solid functional candidate." },
  { name: "Taurus 25:1", brand: "Kind Medical", cultivar: "Donny Burger", thc: 25, cbd: 0, category: "Deep Think / Creative", status: "predicted", species: "Indica dominant", aromas: "Citrus, Spicy, Pungent", terpenes: { caryophyllene: 0.51, myrcene: 0.50, farnesene: 0.32, limonene: 0.30, linalool: 0.23, humulene: 0.12, bisabolol: 0.09, fenchol: 0.06, terpineol: 0.06, betaPinene: 0.05, alphaPinene: 0.03, caryophylleneOxide: 0.02, camphene: 0.01, borneol: 0.01, fenchone: 0.01, terpinolene: 0.01 }, totalTerpenes: 2.32, price: 11.00, rrp: 110, sizes: ["10g"], notes: "Almost identical to Rosa 22:1 but with more limonene lift. Top-tier deep-think." },
  { name: "Sol 1:16", brand: "Kind Medical", cultivar: "Pure Sun CBD", thc: 0, cbd: 16, category: "CBD Dominant", status: "predicted", species: "Balanced Hybrid", aromas: "Tropical, Floral, Nutty", terpenes: { caryophyllene: 0.31, myrcene: 0.26, farnesene: 0.19, guaiol: 0.15, bisabolol: 0.12, humulene: 0.07, linalool: 0.05, limonene: 0.05 }, totalTerpenes: 1.24, price: 12.00, rrp: 120, sizes: ["10g"], notes: "CBD-dominant. Useful as buffer to pair with high-THC strains." },
  { name: "ANTG Juno", brand: "ANTG", cultivar: "Eve + El Jefe Cross", thc: 11.5, cbd: 12.5, category: "CBD Balanced", status: "predicted", species: "Indica dominant", terpenes: { myrcene: 0.23, caryophyllene: 0.16, caryophylleneOxide: 0.07, linalool: 0.07, humulene: 0.06, limonene: 0.05, bisabolol: 0.03 }, totalTerpenes: 0.67, price: 12.90, rrp: 129, sizes: ["10g"], notes: "Balanced THC:CBD. Low terpenes. CBD provides structure." },
  { name: "Cultiva Bacio Gelato", brand: "Cultiva", cultivar: "Bacio Gelato", thc: 23, cbd: 0, category: "Deep Think / Creative", status: "predicted", species: "Indica dominant", aromas: "Vanilla, Diesel, Earth", terpenes: { caryophyllene: 1.20, myrcene: 0.28, humulene: 0.26, limonene: 0.19, linalool: 0.13, caryophylleneOxide: 0.04, farnesene: 0.03, betaPinene: 0.03, nerolidol: 0.02, terpineol: 0.02, alphaPinene: 0.02, camphene: 0.01 }, totalTerpenes: 2.24, price: 15.90, rrp: 159, sizes: ["10g"], notes: "Caryophyllene monster (1.20%). Extreme body anchor." },
  { name: "ANTG Rocky THC30", brand: "ANTG", cultivar: null, thc: 30, cbd: 0, category: "Day / Functional", status: "predicted", species: "Indica dominant", terpenes: { caryophyllene: 0.83, limonene: 0.47, linalool: 0.29, humulene: 0.22, bisabolol: 0.14, myrcene: 0.12, betaPinene: 0.11 }, totalTerpenes: 2.18, price: 14.90, rrp: 149, sizes: ["10g"], notes: "Caryophyllene + limonene + linalool with very low myrcene. Exceptional structure at 30% THC." },
  { name: "Aura Purple Raine", brand: "AURA Therapeutics", cultivar: "Purple Raine", thc: 18, cbd: 0, category: "Deep Think / Creative", status: "predicted", species: "Indica dominant", aromas: "Candy, diesel undertones", terpenes: { limonene: 0.85, caryophyllene: 0.58, farnesene: 0.43, linalool: 0.37, myrcene: 0.22, humulene: 0.13, betaPinene: 0.11, fenchyl: 0.09, alphaPinene: 0.08, terpineol: 0.07, nerolidol: 0.05, bisabolol: 0.05, ocimene: 0.03, camphene: 0.02, terpinolene: 0.01, borneol: 0.01, caryophylleneOxide: 0.01, geraniol: 0.01 }, totalTerpenes: 3.16, price: 5.93, rrp: 178, sizes: ["30g", "15g"], notes: "HIGHEST total terpenes in database (3.16%). Near-perfect architecture. Exceptional value." },
  { name: "MCA NOVA T28", brand: "MCA", cultivar: "Original Blitz", thc: 28, cbd: 0, category: "Day / Functional", status: "predicted", species: "Indica dominant", aromas: "Citrus, Earthy, Gassy, Black Pepper", terpenes: { limonene: 0.55, caryophyllene: 0.47, myrcene: 0.24, humulene: 0.24, guaiol: 0.12, bisabolol: 0.09, betaPinene: 0.09, alphaPinene: 0.07, linalool: 0.05 }, totalTerpenes: 1.92, price: 13.90, rrp: 139, sizes: ["10g"], notes: "Classic functional architecture at 28% THC." },
];

// ─── TERPENE METADATA ──────────────────────────────────────────────────────────
const terpeneColors = {
  limonene: "#E8C840",
  caryophyllene: "#C4733A",
  myrcene: "#7A8B69",
  linalool: "#9B7ED8",
  pinene: "#4A9C6D",
  alphaPinene: "#4A9C6D",
  betaPinene: "#4A9C6D",
  farnesene: "#8AB86D",
  bisabolol: "#D4A574",
  terpinolene: "#E86855",
  humulene: "#8B7355",
  ocimene: "#6BAFB2",
  guaiol: "#A0856B",
  nerolidol: "#7B6FA0",
  terpineol: "#6B9BAF",
  default: "#888"
};

const terpeneRoles = {
  limonene: "Lift",
  caryophyllene: "Anchor",
  myrcene: "Sedator",
  linalool: "Dreamer",
  farnesene: "Softener",
  bisabolol: "Healer",
  terpinolene: "Wildcard",
  pinene: "Clarifier",
  alphaPinene: "Clarifier",
  betaPinene: "Clarifier",
  humulene: "Suppressant",
  ocimene: "Energiser",
  guaiol: "Coolant",
  nerolidol: "Sedative",
};

function getTerpColor(name) {
  const key = name.toLowerCase().replace(/[^a-z]/g, "").replace("beta", "betaP").replace("alpha", "alphaP");
  for (const [k, v] of Object.entries(terpeneColors)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return terpeneColors.default;
}

// ─── SCORING ENGINE ────────────────────────────────────────────────────────────
function scoreStrain(strain, answers) {
  if (!strain.totalTerpenes || strain.category === "Avoid" || strain.category === "Unknown") return -1;

  let score = 0;
  const t = strain.terpenes;
  const lim = t.limonene || 0;
  const car = t.caryophyllene || t.transCaryophyllene || 0;
  const myr = t.myrcene || 0;
  const lin = t.linalool || 0;
  const far = t.farnesene || 0;
  const pin = (t.pinene || 0) + (t.alphaPinene || 0) + (t.betaPinene || 0);
  const terp = t.terpinolene || 0;
  const bis = t.bisabolol || 0;

  // Goal scoring
  if (answers.goal === "functional") {
    score += lim * 40 + car * 25 + pin * 20 - myr * 15 - terp * 10;
    if (lim > 0.4) score += 15;
    if (car > 0.3 && lim > 0.3) score += 20;
  } else if (answers.goal === "cognitive") {
    score += far * 35 + car * 30 + lim * 20 + lin * 25 + bis * 15;
    if (far > 0.2 && car > 0.3) score += 20;
    if (lin > 0.15) score += 10;
  } else if (answers.goal === "sleep") {
    score += myr * 40 + lin * 30 + car * 15 + bis * 20 - lim * 10 - pin * 15;
    if (myr > 0.5) score += 15;
  } else if (answers.goal === "pain") {
    score += car * 45 + bis * 30 + myr * 15 + lin * 20;
    if (car > 0.5) score += 20;
    if (strain.cbd > 0) score += 15;
  } else if (answers.goal === "anxiety") {
    score += car * 35 + lin * 35 + far * 25 + bis * 20 - terp * 30 - lim * 5;
    if (strain.cbd > 0) score += 25;
    if (terp > 0.5) score -= 30;
  }

  // Contraindication penalties
  if (answers.avoid === "overstimulation") {
    if (terp > 0.5) score -= 40;
    if (lim > 0.6 && car < 0.2) score -= 25;
    if (strain.thc > 28) score -= 10;
  } else if (answers.avoid === "sedation") {
    if (myr > 0.6) score -= 40;
    if (!lim && !pin) score -= 20;
  } else if (answers.avoid === "fog") {
    if (strain.totalTerpenes < 0.5) score -= 40;
    if (myr > 0.5 && lim < 0.1) score -= 30;
  } else if (answers.avoid === "appetite") {
    // Minor adjustments
    score -= myr * 5;
  }

  // THC intensity matching
  const thc = strain.thc;
  if (answers.intensity === "low" && thc <= 20) score += 15;
  else if (answers.intensity === "low" && thc > 25) score -= 20;
  else if (answers.intensity === "moderate" && thc >= 20 && thc <= 25) score += 15;
  else if (answers.intensity === "standard" && thc >= 25 && thc <= 28) score += 10;
  else if (answers.intensity === "high" && thc >= 28) score += 15;
  else if (answers.intensity === "high" && thc < 22) score -= 15;

  // Experience level
  if (answers.experience === "naive" && thc > 22) score -= 15;
  if (answers.experience === "naive" && strain.cbd > 0) score += 20;
  if (answers.experience === "experienced" && thc < 18) score -= 5;

  // Budget filter — this eliminates rather than scores, handled separately

  // Terpene density bonus
  if (strain.totalTerpenes > 2.0) score += 10;
  if (strain.totalTerpenes > 2.5) score += 10;
  if (strain.totalTerpenes > 3.0) score += 10;

  // Tried bonus (verified data)
  if (strain.status === "tried") score += 8;

  // CBD bonus for certain goals
  if (strain.cbd > 0 && ["anxiety", "pain"].includes(answers.goal)) score += 15;

  return Math.max(0, score);
}

// ─── QUESTIONS ─────────────────────────────────────────────────────────────────
const questions = [
  {
    id: "goal",
    label: "Therapeutic Objective",
    prompt: "What is the primary therapeutic outcome being targeted?",
    options: [
      { value: "functional", label: "Functional Clarity", desc: "Daytime productivity, mood elevation, sustained focus" },
      { value: "cognitive", label: "Deep Cognitive", desc: "Introspection, creative ideation, emotional processing" },
      { value: "sleep", label: "Sleep / Sedation", desc: "Onset of sleep, physical relaxation, muscle release" },
      { value: "pain", label: "Pain / Anti-inflammatory", desc: "Chronic pain management, inflammation reduction, body comfort" },
      { value: "anxiety", label: "Anxiolytic", desc: "Anxiety reduction, nervous system regulation, calm without sedation" },
    ]
  },
  {
    id: "avoid",
    label: "Contraindications",
    prompt: "What adverse effect profile should be minimised?",
    options: [
      { value: "overstimulation", label: "Overstimulation / Anxiety", desc: "Racing thoughts, paranoia, heart rate elevation" },
      { value: "sedation", label: "Excessive Sedation", desc: "Unwanted drowsiness, couch-lock, loss of motivation" },
      { value: "fog", label: "Cognitive Fog", desc: "Memory impairment, confusion, inability to focus" },
      { value: "appetite", label: "Appetite Disruption", desc: "Excessive hunger or nausea" },
    ]
  },
  {
    id: "intensity",
    label: "THC Intensity Range",
    prompt: "What potency bracket is appropriate for this patient?",
    options: [
      { value: "low", label: "Low (≤20% THC)", desc: "Treatment-naive or sensitivity concerns" },
      { value: "moderate", label: "Moderate (20–25% THC)", desc: "Established tolerance, balanced approach" },
      { value: "standard", label: "Standard (25–28% THC)", desc: "Regular use, reliable tolerance" },
      { value: "high", label: "High (28%+ THC)", desc: "Experienced patient, high tolerance" },
    ]
  },
  {
    id: "experience",
    label: "Patient Experience",
    prompt: "What is the patient's prior cannabis experience?",
    options: [
      { value: "naive", label: "Treatment-Naive", desc: "No prior cannabis use" },
      { value: "occasional", label: "Occasional", desc: "Infrequent or sporadic use" },
      { value: "regular", label: "Regular", desc: "Consistent therapeutic use" },
      { value: "experienced", label: "Experienced", desc: "Long-term, well-established tolerance" },
    ]
  },
  {
    id: "budget",
    label: "Budget Range",
    prompt: "What is the target cost per gram?",
    options: [
      { value: "economy", label: "Under $8/g", desc: "Budget-conscious prescribing" },
      { value: "mid", label: "$8 – $12/g", desc: "Mid-range, good value-to-quality" },
      { value: "standard", label: "$12 – $16/g", desc: "Standard retail pricing" },
      { value: "any", label: "No Constraint", desc: "Outcome-driven, price secondary" },
    ]
  },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function TerpPill({ name, value }) {
  const baseKey = name.toLowerCase().replace(/[^a-z]/g, "");
  let color = terpeneColors.default;
  for (const [k, v] of Object.entries(terpeneColors)) {
    if (baseKey.includes(k.toLowerCase())) { color = v; break; }
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: `${color}18`, border: `1px solid ${color}35`,
      color: color, padding: "5px 14px", borderRadius: "20px",
      fontSize: "13px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
    }}>
      {name} <span style={{ opacity: 0.7 }}>{value}%</span>
    </span>
  );
}

function RiskBar({ level, compact }) {
  const colors = { "Low": "#4A9C6D", "Low–Moderate": "#6B8E4E", "Moderate": "#C4A35A", "High": "#C4533A", "Very High": "#8B1A1A" };
  const widths = { "Low": "20%", "Low–Moderate": "35%", "Moderate": "50%", "High": "75%", "Very High": "95%" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ flex: 1, height: compact ? "4px" : "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: widths[level] || "50%", height: "100%", background: colors[level] || "#888", borderRadius: "3px", transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: "12px", color: colors[level] || "#888", fontWeight: 600, minWidth: "90px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{level}</span>
    </div>
  );
}

function StrainCard({ strain, rank, expanded, onToggle, score }) {
  const topTerps = Object.entries(strain.terpenes)
    .filter(([_, v]) => v >= 0.05)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const pricePerG = strain.price;
  const hasPrice = pricePerG !== null && pricePerG !== undefined;

  return (
    <div
      onClick={onToggle}
      style={{
        background: expanded ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${expanded ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "12px",
        padding: expanded ? "28px" : "22px 28px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        marginBottom: "10px",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "10px",
            background: rank <= 3 ? "rgba(74,156,109,0.15)" : "rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "16px", fontWeight: 700,
            color: rank <= 3 ? "#4A9C6D" : "rgba(255,255,255,0.4)",
          }}>
            {rank}
          </div>
          <div>
            <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#F0EDE8", margin: 0, letterSpacing: "-0.3px" }}>{strain.name}</h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
              <span style={{ fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", color: "rgba(255,255,255,0.5)" }}>{strain.brand}</span>
              <span style={{ fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", color: "#C4A35A" }}>THC {strain.thc}%</span>
              {strain.cbd > 0 && <span style={{ fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", color: "#6BAFB2" }}>CBD {strain.cbd}%</span>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#4A9C6D" }}>
            {Math.round(score)}pts
          </div>
          {hasPrice && (
            <div style={{ fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
              ${pricePerG.toFixed(2)}/g
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "24px" }}>
          {/* Terpene pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {topTerps.map(([name, val]) => (
              <TerpPill key={name} name={name} value={val} />
            ))}
          </div>

          {/* Data grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>Total Terpenes</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#F0EDE8", fontFamily: "'IBM Plex Mono', monospace" }}>{strain.totalTerpenes}%</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>Species</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#F0EDE8" }}>{strain.species}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>Status</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: strain.status === "tried" ? "#4A9C6D" : "#C4A35A" }}>
                {strain.status === "tried" ? "Clinically Verified" : "Predicted"}
              </div>
            </div>
          </div>

          {/* Pricing */}
          {hasPrice && (
            <div style={{ background: "rgba(196,163,90,0.06)", border: "1px solid rgba(196,163,90,0.15)", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#C4A35A", marginBottom: "8px", fontFamily: "'IBM Plex Mono', monospace" }}>Pricing</div>
              <div style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: "24px", fontWeight: 700, color: "#F0EDE8", fontFamily: "'IBM Plex Mono', monospace" }}>${pricePerG.toFixed(2)}</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>/gram</span>
                </div>
                {strain.rrp && (
                  <div>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>${strain.rrp}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginLeft: "4px" }}>RRP</span>
                  </div>
                )}
                {strain.sizes?.length > 0 && (
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                    Available: {strain.sizes.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cultivar & Notes */}
          {strain.cultivar && (
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginRight: "8px" }}>Cultivar</span>
              {strain.cultivar}
            </div>
          )}
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", margin: "12px 0 0" }}>
            {strain.notes}
          </p>
          {strain.verdict && (
            <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: 600, color: "#C4A35A", fontStyle: "italic" }}>
              {strain.verdict}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function TerpeneIntelV2() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [view, setView] = useState("recommend"); // "recommend" | "library"
  const [librarySort, setLibrarySort] = useState("terpenes");
  const [libraryFilter, setLibraryFilter] = useState("all");

  const isComplete = step >= questions.length;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => setStep(prev => prev + 1), 200);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setExpandedCard(null);
    setShowAll(false);
  };

  // Budget filter
  const budgetFilter = (strain) => {
    if (!answers.budget || answers.budget === "any") return true;
    if (!strain.price) return true; // Include strains without price data
    if (answers.budget === "economy") return strain.price <= 8;
    if (answers.budget === "mid") return strain.price <= 12;
    if (answers.budget === "standard") return strain.price <= 16;
    return true;
  };

  // Scored & sorted results
  const results = useMemo(() => {
    if (!isComplete) return [];
    return strainDB
      .map(s => ({ ...s, score: scoreStrain(s, answers) }))
      .filter(s => s.score > 0 && budgetFilter(s))
      .sort((a, b) => b.score - a.score);
  }, [isComplete, answers]);

  const topResults = showAll ? results : results.slice(0, 5);
  const avoidStrains = strainDB.filter(s => s.category === "Avoid" || s.category === "Caution");

  // Library view
  const libraryStrains = useMemo(() => {
    let list = [...strainDB].filter(s => s.totalTerpenes !== null);
    if (libraryFilter !== "all") {
      list = list.filter(s => s.category === libraryFilter);
    }
    if (librarySort === "terpenes") list.sort((a, b) => (b.totalTerpenes || 0) - (a.totalTerpenes || 0));
    else if (librarySort === "thc") list.sort((a, b) => b.thc - a.thc);
    else if (librarySort === "price") list.sort((a, b) => (a.price || 999) - (b.price || 999));
    else if (librarySort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [librarySort, libraryFilter]);

  const currentQ = questions[step];

  return (
    <div style={{
      fontFamily: "'Sora', 'DM Sans', -apple-system, sans-serif",
      background: "#0A0A0D",
      color: "#F0EDE8",
      minHeight: "100vh",
      padding: 0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "36px 32px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{
              fontSize: "30px", fontWeight: 800, color: "#fff",
              letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "8px",
            }}>
              Terpene Intelligence
            </h1>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
              color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase",
            }}>
              Clinical Decision Support — v2.0
            </span>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
            color: "rgba(255,255,255,0.3)", textAlign: "right",
          }}>
            <div>{strainDB.length} products indexed</div>
            <div>{strainDB.filter(s => s.status === "tried").length} clinically verified</div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { id: "recommend", label: "Prescribing Engine" },
          { id: "library", label: "Product Library" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              background: view === tab.id ? "rgba(255,255,255,0.04)" : "transparent",
              border: "none",
              borderBottom: view === tab.id ? "2px solid #C4A35A" : "2px solid transparent",
              color: view === tab.id ? "#F0EDE8" : "rgba(255,255,255,0.35)",
              padding: "16px 28px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PRESCRIBING ENGINE ── */}
      {view === "recommend" && (
        <div style={{ maxWidth: "860px", padding: "32px" }}>
          {!isComplete ? (
            <div className="fade-up" key={step}>
              {/* Progress */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
                {questions.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1, height: "4px", borderRadius: "2px",
                      background: i < step ? "#4A9C6D" : i === step ? "#C4A35A" : "rgba(255,255,255,0.08)",
                      transition: "background 0.3s ease",
                    }}
                  />
                ))}
              </div>

              {/* Question header */}
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
                letterSpacing: "1.5px", textTransform: "uppercase",
                color: "#C4A35A", marginBottom: "10px",
              }}>
                Step {step + 1} of {questions.length} — {currentQ.label}
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "28px", lineHeight: 1.3 }}>
                {currentQ.prompt}
              </h2>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentQ.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(currentQ.id, opt.value)}
                    style={{
                      background: answers[currentQ.id] === opt.value ? "rgba(196,163,90,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${answers[currentQ.id] === opt.value ? "rgba(196,163,90,0.3)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "10px",
                      padding: "20px 24px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "block",
                      width: "100%",
                    }}
                  >
                    <div style={{ fontSize: "17px", fontWeight: 600, color: "#F0EDE8", marginBottom: "4px" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Back button */}
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    background: "none", border: "none", color: "rgba(255,255,255,0.35)",
                    fontSize: "14px", cursor: "pointer", marginTop: "20px", padding: "8px 0",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  ← Previous step
                </button>
              )}
            </div>
          ) : (
            /* ── RESULTS ── */
            <div className="fade-up">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                    Prescribing Recommendations
                  </h2>
                  <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)" }}>
                    {results.length} product{results.length !== 1 ? "s" : ""} matched from {strainDB.length} indexed
                    {answers.budget && answers.budget !== "any" && (
                      <span> · Budget filter active</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#F0EDE8", padding: "10px 20px", borderRadius: "8px",
                    fontSize: "14px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  New Assessment
                </button>
              </div>

              {/* Answer summary */}
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "20px", marginBottom: "24px",
                display: "flex", flexWrap: "wrap", gap: "16px",
              }}>
                {questions.map(q => {
                  const opt = q.options.find(o => o.value === answers[q.id]);
                  return opt ? (
                    <div key={q.id}>
                      <div style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "4px" }}>
                        {q.label}
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#C4A35A" }}>{opt.label}</div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Result cards */}
              {topResults.length > 0 ? (
                <>
                  {topResults.map((strain, i) => (
                    <StrainCard
                      key={strain.name}
                      strain={strain}
                      rank={i + 1}
                      score={strain.score}
                      expanded={expandedCard === strain.name}
                      onToggle={() => setExpandedCard(expandedCard === strain.name ? null : strain.name)}
                    />
                  ))}

                  {results.length > 5 && !showAll && (
                    <button
                      onClick={() => setShowAll(true)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                        padding: "16px", color: "rgba(255,255,255,0.5)", fontSize: "15px",
                        fontWeight: 600, cursor: "pointer", marginTop: "4px",
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      Show all {results.length} matches
                    </button>
                  )}
                </>
              ) : (
                <div style={{
                  background: "rgba(196,83,58,0.08)", border: "1px solid rgba(196,83,58,0.2)",
                  borderRadius: "10px", padding: "28px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: "#C4533A", marginBottom: "8px" }}>No Matches Found</div>
                  <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>
                    The current criteria and budget filter returned no results. Consider adjusting the budget range or intensity bracket.
                  </p>
                </div>
              )}

              {/* Contraindication warnings */}
              {avoidStrains.length > 0 && (
                <div style={{ marginTop: "32px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#C4533A", marginBottom: "16px" }}>
                    Contraindicated Products
                  </h3>
                  <div style={{
                    background: "rgba(196,83,58,0.05)", border: "1px solid rgba(196,83,58,0.12)",
                    borderRadius: "10px", padding: "20px",
                  }}>
                    {avoidStrains.map(s => (
                      <div key={s.name} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}>
                        <div>
                          <span style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{s.name}</span>
                          <span style={{
                            fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace",
                            color: s.category === "Avoid" ? "#C4533A" : "#C4A35A",
                            marginLeft: "12px",
                          }}>
                            {s.category === "Avoid" ? "AVOID" : "CAUTION"}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", maxWidth: "350px", textAlign: "right" }}>
                          {s.notes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── PRODUCT LIBRARY ── */}
      {view === "library" && (
        <div style={{ maxWidth: "860px", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>
              Product Library
            </h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {/* Sort */}
              {["terpenes", "thc", "price", "name"].map(s => (
                <button
                  key={s}
                  onClick={() => setLibrarySort(s)}
                  style={{
                    background: librarySort === s ? "rgba(196,163,90,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${librarySort === s ? "rgba(196,163,90,0.3)" : "rgba(255,255,255,0.08)"}`,
                    color: librarySort === s ? "#C4A35A" : "rgba(255,255,255,0.4)",
                    padding: "6px 14px", borderRadius: "6px", fontSize: "13px",
                    fontWeight: 600, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {s === "terpenes" ? "Terp%" : s === "thc" ? "THC%" : s === "price" ? "Price" : "A–Z"}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {["all", "Day / Functional", "Deep Think / Creative", "Sleep / KO", "CBD Dominant", "CBD Balanced", "Caution", "Avoid"].map(f => (
              <button
                key={f}
                onClick={() => setLibraryFilter(f)}
                style={{
                  background: libraryFilter === f ? "rgba(255,255,255,0.08)" : "transparent",
                  border: `1px solid ${libraryFilter === f ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                  color: libraryFilter === f ? "#F0EDE8" : "rgba(255,255,255,0.35)",
                  padding: "6px 14px", borderRadius: "20px", fontSize: "13px",
                  fontWeight: 500, cursor: "pointer", fontFamily: "'Sora', sans-serif",
                }}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>

          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "16px", fontFamily: "'IBM Plex Mono', monospace" }}>
            {libraryStrains.length} products
          </div>

          {/* Library list */}
          {libraryStrains.map((strain, i) => (
            <div
              key={strain.name}
              onClick={() => setExpandedCard(expandedCard === strain.name ? null : strain.name)}
              style={{
                background: expandedCard === strain.name ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
                border: `1px solid ${expandedCard === strain.name ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
                borderRadius: "10px",
                padding: expandedCard === strain.name ? "24px" : "16px 24px",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background:
                      strain.category === "Day / Functional" ? "#4A9C6D" :
                      strain.category === "Deep Think / Creative" ? "#6B5CE7" :
                      strain.category === "Sleep / KO" ? "#4A6FA5" :
                      strain.category === "Avoid" ? "#C4533A" :
                      strain.category === "Caution" ? "#E86855" :
                      strain.category.includes("CBD") ? "#6BAFB2" : "#555",
                  }} />
                  <div>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#F0EDE8" }}>{strain.name}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginLeft: "12px" }}>{strain.brand}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontFamily: "'IBM Plex Mono', monospace", color: "#C4A35A" }}>
                    THC {strain.thc}%
                  </span>
                  <span style={{ fontSize: "14px", fontFamily: "'IBM Plex Mono', monospace", color: "rgba(255,255,255,0.45)" }}>
                    {strain.totalTerpenes}% terp
                  </span>
                  {strain.price && (
                    <span style={{ fontSize: "14px", fontFamily: "'IBM Plex Mono', monospace", color: "rgba(255,255,255,0.45)" }}>
                      ${strain.price.toFixed(2)}/g
                    </span>
                  )}
                </div>
              </div>

              {expandedCard === strain.name && (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {Object.entries(strain.terpenes)
                      .filter(([_, v]) => v >= 0.05)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([name, val]) => (
                        <TerpPill key={name} name={name} value={val} />
                      ))}
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {strain.cultivar && <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}><strong style={{ color: "rgba(255,255,255,0.3)" }}>Cultivar:</strong> {strain.cultivar}</div>}
                    {strain.species && <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}><strong style={{ color: "rgba(255,255,255,0.3)" }}>Species:</strong> {strain.species}</div>}
                    {strain.cbd > 0 && <div style={{ fontSize: "14px", color: "#6BAFB2" }}>CBD {strain.cbd}%</div>}
                  </div>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>{strain.notes}</p>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: strain.category === "Avoid" ? "#C4533A" : strain.category === "Caution" ? "#E86855" : "#C4A35A", marginTop: "10px" }}>
                    {strain.category} · {strain.verdict}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ padding: "28px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "32px" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>
          Terpene Intelligence System v2.0 — Clinical Decision Support Prototype<br />
          Not a substitute for clinical judgement. Terpene data sourced from Catalyst AU product registry. Scoring model based on validated response patterns.
        </p>
      </div>
    </div>
  );
}
