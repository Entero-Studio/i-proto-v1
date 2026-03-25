"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   TERPENE PRESCRIBER INTELLIGENCE — Desktop-First Clinical Tool
   v3.0 — Scoring fixes, UX improvements, accessibility pass
   ============================================================ */

// ── STRAIN DATABASE (28 Catalyst + 11 Personal = 39 total) ──
const strainDB = [
  // PERSONAL — TRIED
  { name:"Electric Honeydew", brand:"Personal", cultivar:"Electric Honeydew", thc:26, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{limonene:0.8,caryophyllene:0.5,pinene:0.4,myrcene:0.2,linalool:0.1}, totalTerpenes:2.0, price:null, rrp:null, sizes:[], notes:"Benchmark intelligent sativa hybrid. Limonene-led with strong anchor." },
  { name:"Greenline Banjo", brand:"Personal", cultivar:"Greenline Banjo", thc:26, cbd:0, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{limonene:0.65,caryophyllene:0.45,farnesene:0.3,pinene:0.25,myrcene:0.15}, totalTerpenes:1.8, price:null, rrp:null, sizes:[], notes:"Near-perfect day hybrid." },
  { name:"Crystal Locomotive", brand:"Personal", cultivar:"Crystal Locomotive", thc:28, cbd:0, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{limonene:0.5,terpinolene:0.35,caryophyllene:0.4,myrcene:0.2}, totalTerpenes:1.45, price:null, rrp:null, sizes:[], notes:"Safe creative haze." },
  { name:"Runtz Punch", brand:"Personal", cultivar:"Runtz Punch", thc:28, cbd:0, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{caryophyllene:0.5,limonene:0.45,myrcene:0.4}, totalTerpenes:1.35, price:null, rrp:null, sizes:[], notes:"Reliable hybrid." },
  { name:"Southern Sky Hybrid", brand:"Personal", cultivar:"Southern Sky", thc:26, cbd:1, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{myrcene:0.45,caryophyllene:0.4,limonene:0.35}, totalTerpenes:1.2, price:null, rrp:null, sizes:[], notes:"FAVOURITE. Ideal heavy-functional crossover. CBD + terpene balance." },
  { name:"MAC-1", brand:"Personal", cultivar:"MAC-1", thc:22, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Hybrid", terpenes:{limonene:0.45,caryophyllene:0.4,farnesene:0.3,linalool:0.25}, totalTerpenes:1.4, price:null, rrp:null, sizes:[], notes:"Intellectual + emotional balance." },
  { name:"Rosa 22:1", brand:"Kind Medical", cultivar:"Rosa", thc:22, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Hybrid", terpenes:{farnesene:0.55,caryophyllene:0.35,bisabolol:0.25,linalool:0.2,myrcene:0.15}, totalTerpenes:1.5, price:null, rrp:null, sizes:[], notes:"Unique body-aware deep state." },
  { name:"Frost'd Flakes", brand:"Personal", cultivar:"Frost'd Flakes", thc:30, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica", terpenes:{myrcene:0.7,caryophyllene:0.35,linalool:0.25}, totalTerpenes:1.3, price:null, rrp:null, sizes:[], notes:"Reliable KO." },
  { name:"Lemon Zkittlez", brand:"Personal", cultivar:"Lemon Zkittlez", thc:28, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Hybrid", terpenes:{limonene:0.7,myrcene:0.4,terpinolene:0.3}, totalTerpenes:1.4, price:null, rrp:null, sizes:[], notes:"Edge-case, slightly anxious." },
  { name:"East Coast Dank'z", brand:"Personal", cultivar:"East Coast Dank'z", thc:25, cbd:0, category:"Avoid", status:"tried", species:"Indica", terpenes:{myrcene:0.15}, totalTerpenes:0.15, price:null, rrp:null, sizes:[], notes:"WORST. Flat, empty, zero terpene intelligence." },
  { name:"Blue Mountain THC25", brand:"Personal", cultivar:"Blue Mountain", thc:25, cbd:0, category:"Avoid", status:"tried", species:"Indica", terpenes:{myrcene:0.7,limonene:0.05}, totalTerpenes:0.75, price:null, rrp:null, sizes:[], notes:"Blunt, one-note sedation." },

  // CATALYST DATABASE
  { name:"Maali Sky", brand:"Maali", cultivar:"Royal Moby", thc:20, cbd:0, category:"Caution", status:"predicted", species:"Sativa dominant", terpenes:{terpinolene:1.0,caryophyllene:0.5,myrcene:0.25}, totalTerpenes:1.75, price:12.90, rrp:129, sizes:["10g"], notes:"Terpinolene-dominant. Unpredictable without limonene anchor." },
  { name:"THC 23 Opal", brand:"Tasmanian Botanics", cultivar:"White Widow", thc:23, cbd:0, category:"Caution", status:"predicted", species:"Sativa dominant", terpenes:{terpinolene:1.10,ocimene:0.32,myrcene:0.26,caryophyllene:0.25,limonene:0.16,betaPinene:0.11,alphaPinene:0.06,alphaTerpinene:0.04,delta3Carene:0.04,bisabolol:0.03,gammaTerpinene:0.02,terpineol:0.01,humulene:0.01}, totalTerpenes:2.41, price:null, rrp:null, sizes:["10g"], notes:"Terpinolene-dominant with very low limonene. Anxiety risk." },
  { name:"Cannatrek T25 Topaz", brand:"Cannatrek", cultivar:"Kush Cookie", thc:25, cbd:0, category:"Unknown", status:"predicted", species:"Indica dominant", terpenes:{}, totalTerpenes:null, price:13.50, rrp:135, sizes:["10g"], notes:"NO TERPENE DATA." },
  { name:"THC 25 Amethyst", brand:"Tasmanian Botanics", cultivar:"Wedding Cake x Animal Cookies", thc:25, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.67,limonene:0.44,caryophyllene:0.39,linalool:0.25,humulene:0.12,betaPinene:0.12,bisabolol:0.11,alphaPinene:0.08,terpineol:0.04,camphene:0.02}, totalTerpenes:2.24, price:9.90, rrp:99, sizes:["10g","30g","28g"], notes:"Strong profile. Pattern-matches Southern Sky but denser." },
  { name:"Iris 21:1", brand:"Kind Medical", cultivar:"Black Cherry Punch", thc:21, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.32,farnesene:0.27,caryophyllene:0.26,myrcene:0.21,linalool:0.16,guaiol:0.09,humulene:0.08,betaPinene:0.05,alphaPinene:0.03,terpineol:0.03,fenchol:0.03,camphene:0.01,nerolidol:0.01,terpinolene:0.01,caryophylleneOxide:0.01,fenchone:0.01}, totalTerpenes:1.58, price:12.00, rrp:120, sizes:["10g"], notes:"Similar architecture to MAC-1. Strong deep-think candidate." },
  { name:"IndiMed Tempo 19", brand:"IndiMed", cultivar:"Delahaze", thc:19, cbd:0, category:"Caution", status:"predicted", species:"Sativa", terpenes:{terpinolene:1.19,myrcene:0.54,ocimene:0.35,alphaPinene:0.19,caryophyllene:0.15}, totalTerpenes:2.98, price:6.60, rrp:99, sizes:["15g"], notes:"Terpinolene-dominant with minimal caryophyllene. No limonene. Anxiety risk." },
  { name:"Bazookas", brand:"Mediquest", cultivar:"Bazookas", thc:30, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.84,caryophyllene:0.48,humulene:0.24,linalool:0.22,ocimene:0.20}, totalTerpenes:2.56, price:16.50, rrp:165, sizes:["10g"], notes:"Limonene-dominant. Pattern-matches Electric Honeydew at 30% THC." },
  { name:"THC 27 Royale Sunflower", brand:"Tasmanian Botanics", cultivar:"GSC x OG Kush", thc:27, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.82,humulene:0.39,limonene:0.36,myrcene:0.30,bisabolol:0.27}, totalTerpenes:2.57, price:5.27, rrp:79, sizes:["15g","28g","30g"], notes:"Caryophyllene-dominant. Deep body-think. Incredible value." },
  { name:"Azure 17:1", brand:"Kind Medical", cultivar:"Blue Dream", thc:17, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{myrcene:0.74,alphaPinene:0.22,caryophyllene:0.21,farnesene:0.19,betaPinene:0.08}, totalTerpenes:1.78, price:12.00, rrp:120, sizes:["10g"], notes:"Myrcene-dominant. No limonene. Gentle but risks flatness." },
  { name:"Cultiva Lee Anne Womac", brand:"Cultiva", cultivar:"Lee Anne WoMAC", thc:24, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Balanced Hybrid", terpenes:{terpinolene:0.76,caryophyllene:0.31,farnesene:0.27,linalool:0.14,limonene:0.14}, totalTerpenes:2.34, price:15.90, rrp:159, sizes:["10g"], notes:"Terpinolene-led but better anchored than others. CBG (2%) notable." },
  { name:"Beacon Medical GSC", brand:"Beacon Medical", cultivar:"Girl Scout Cookies", thc:20, cbd:0, category:"Unknown", status:"predicted", species:"Indica dominant", terpenes:{}, totalTerpenes:null, price:13.50, rrp:135, sizes:["10g"], notes:"NO TERPENE DATA." },
  { name:"Varaski T26", brand:"Entoura", cultivar:"Proprietary", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.90,limonene:0.35,caryophyllene:0.24,humulene:0.09,betaPinene:0.08,guaiol:0.08,bisabolol:0.07,linalool:0.06,alphaPinene:0.06,terpineol:0.05,nerolidol:0.02,camphene:0.01,caryophylleneOxide:0.01,borneol:0.01,terpinolene:0.005,fenchone:0.005,ocimene:0.005}, totalTerpenes:2.04, price:9.67, rrp:145, sizes:["15g"], notes:"Myrcene-dominant. Some structure from limonene+caryophyllene. Borderline." },
  { name:"Pouch Red", brand:"Pouch", cultivar:"Black Cherry Pie", thc:27, cbd:0, category:"Day / Functional", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.53,caryophyllene:0.20,myrcene:0.19,linalool:0.13,humulene:0.09,betaPinene:0.09,guaiol:0.07,alphaPinene:0.05,bisabolol:0.03,camphene:0.01}, totalTerpenes:1.39, price:6.07, rrp:85, sizes:["14g"], notes:"Limonene-led with low myrcene. Clean functional profile. Great value." },
  { name:"Cannatrek C9T7 Argaman", brand:"Cannatrek", cultivar:"White Widow & CBD Critical Mass", thc:7, cbd:9, category:"CBD Dominant", status:"predicted", species:"Balanced Hybrid", terpenes:{}, totalTerpenes:null, price:13.50, rrp:135, sizes:["10g"], notes:"NO TERPENE DATA. High-CBD (9%/7% THC)." },
  { name:"MEDCAN Cold Creek Afghan Kush", brand:"MEDCAN Australia", cultivar:"Afghan Kush", thc:24, cbd:0, category:"Avoid", status:"predicted", species:"Indica", terpenes:{myrcene:0.86,ocimene:0.24,caryophyllene:0.13,cedrene:0.11,limonene:0.07}, totalTerpenes:1.70, price:12.90, rrp:129, sizes:["10g"], notes:"Myrcene-dominant. Near-zero limonene. Flat sedation risk." },
  { name:"IndiMed Tempo 26 Sourdough", brand:"IndiMed", cultivar:"Sourdough", thc:26, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.58,limonene:0.39,farnesene:0.37,myrcene:0.25}, totalTerpenes:2.27, price:6.60, rrp:99, sizes:["15g"], notes:"Near-identical architecture to MAC-1 but stronger. Excellent deep-think. Great value." },
  { name:"MEDCAN Strawberry Cake", brand:"MEDCAN Australia", cultivar:"Strawberry Cake", thc:22, cbd:0, category:"Caution", status:"predicted", species:"Indica dominant", terpenes:{terpinolene:0.86,myrcene:0.47,ocimene:0.36,limonene:0.13,terpineol:0.10,bisabolol:0.09,betaPinene:0.09,caryophyllene:0.07,alphaPinene:0.07,terpinene:0.05,phellandrene:0.04,guaiol:0.04,fenchol:0.03,humulene:0.01,nerolidol:0.01,caryophylleneOxide:0.01}, totalTerpenes:2.43, price:13.90, rrp:139, sizes:["10g"], notes:"Terpinolene-dominant. Minimal anchor. Poorly structured." },
  { name:"Phytoca Chapel of Love", brand:"Phytoca", cultivar:"Chapel of Love", thc:30, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.48,caryophyllene:0.25,myrcene:0.25,linalool:0.19,betaPinene:0.10,humulene:0.07,alphaPinene:0.06,terpineol:0.05,fenchol:0.05,phytol:0.03,camphene:0.01,borneol:0.01,nerolidol:0.01,bisabolol:0.01,terpinolene:0.01}, totalTerpenes:1.58, price:9.90, rrp:99, sizes:["10g"], notes:"Clean functional architecture at 30% THC. Great value." },
  { name:"ANTG Solace THC22", brand:"ANTG", cultivar:"Tangie Chem", thc:22, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{caryophyllene:0.76,limonene:0.59,myrcene:0.53,humulene:0.28,linalool:0.18}, totalTerpenes:2.34, price:14.90, rrp:149, sizes:["10g"], notes:"Strong anchor + lift combo. Dense terpene profile." },
  { name:"Taurus 25:1", brand:"Kind Medical", cultivar:"Donny Burger", thc:25, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica dominant", terpenes:{caryophyllene:0.51,myrcene:0.50,farnesene:0.32,limonene:0.30,linalool:0.23,humulene:0.12,bisabolol:0.09,fenchol:0.06,terpineol:0.06,betaPinene:0.05,alphaPinene:0.03,caryophylleneOxide:0.02,camphene:0.01,borneol:0.01,fenchone:0.01,terpinolene:0.01}, totalTerpenes:2.32, price:11.00, rrp:110, sizes:["10g"], notes:"Almost identical to Rosa 22:1 but with more limonene. Top-tier deep-think." },
  { name:"Sol 1:16", brand:"Kind Medical", cultivar:"Pure Sun CBD", thc:0, cbd:16, category:"CBD Dominant", status:"predicted", species:"Balanced Hybrid", terpenes:{caryophyllene:0.31,myrcene:0.26,farnesene:0.19,guaiol:0.15,bisabolol:0.12,humulene:0.07,linalool:0.05,limonene:0.05}, totalTerpenes:1.24, price:12.00, rrp:120, sizes:["10g"], notes:"CBD-dominant (16% CBD). Soft grounding profile. Useful as buffer." },
  { name:"ANTG Juno", brand:"ANTG", cultivar:"Eve + El Jefe Cross", thc:11.5, cbd:12.5, category:"CBD Balanced", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.23,caryophyllene:0.16,caryophylleneOxide:0.07,linalool:0.07,humulene:0.06,limonene:0.05,bisabolol:0.03}, totalTerpenes:0.67, price:12.90, rrp:129, sizes:["10g"], notes:"Balanced THC:CBD. Low terpenes. Therapeutic/entry-level." },
  { name:"Cultiva Bacio Gelato", brand:"Cultiva", cultivar:"Bacio Gelato", thc:23, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica dominant", terpenes:{caryophyllene:1.20,myrcene:0.28,humulene:0.26,limonene:0.19,linalool:0.13,caryophylleneOxide:0.04,farnesene:0.03,betaPinene:0.03,nerolidol:0.02,terpineol:0.02,fenchol:0.02,alphaPinene:0.02,camphene:0.01}, totalTerpenes:2.24, price:15.90, rrp:159, sizes:["10g"], notes:"Heaviest single-terpene reading (caryophyllene 1.20%). Extreme body anchor." },
  { name:"ANTG Rocky THC30", brand:"ANTG", cultivar:null, thc:30, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{caryophyllene:0.83,limonene:0.47,linalool:0.29,humulene:0.22,bisabolol:0.14,myrcene:0.12,betaPinene:0.11}, totalTerpenes:2.18, price:14.90, rrp:149, sizes:["10g"], notes:"Exceptional structure at 30% THC. Very low myrcene. Strong candidate." },
  { name:"Aura Purple Raine", brand:"AURA Therapeutics", cultivar:"Purple Raine", thc:18, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.85,caryophyllene:0.58,farnesene:0.43,linalool:0.37,myrcene:0.22,humulene:0.13,betaPinene:0.11,fenchol:0.09,alphaPinene:0.08,terpineol:0.07,nerolidol:0.05,bisabolol:0.05,ocimene:0.03,betaCitronellol:0.02,camphene:0.02,terpinolene:0.01,fenchone:0.01,borneol:0.01,caryophylleneOxide:0.01,geraniol:0.01}, totalTerpenes:3.16, price:5.93, rrp:178, sizes:["30g","15g"], notes:"HIGHEST TOTAL TERPENES (3.16%). Near-perfect architecture. Exceptional value." },
  { name:"MCA NOVA T28", brand:"MCA", cultivar:"Original Blitz", thc:28, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.55,caryophyllene:0.47,myrcene:0.24,humulene:0.24,guaiol:0.12,bisabolol:0.09,betaPinene:0.09,alphaPinene:0.07,linalool:0.05}, totalTerpenes:1.92, price:13.90, rrp:139, sizes:["10g"], notes:"Classic functional architecture at 28% THC." },
  { name:"THC 30 Sora", brand:"Althea", cultivar:"Sora", thc:30, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Balanced Hybrid", terpenes:{caryophyllene:0.84,myrcene:0.67,limonene:0.37,humulene:0.25,linalool:0.14,bisabolol:0.12,betaPinene:0.07,terpineol:0.05,alphaPinene:0.04,caryophylleneOxide:0.03,nerolidol:0.02,ocimene:0.02,betaCitronellol:0.01,alphaTerpinene:0.01,camphene:0.01,geraniol:0.01,terpinolene:0.01,cymene:0.01,delta3Carene:0.01,eucalyptol:0.01,guaiol:0.01,isopulegol:0.01,gammaTerpinene:0.01,terpinen4ol:0.01,geranylAcetate:0.01}, totalTerpenes:2.75, price:10.90, rrp:109, sizes:["10g","30g"], notes:"Caryophyllene-dominant at 30% THC. Deep body-think territory." },
];

// ── SCORING ENGINE ──
const GOALS = [
  { id:"functional", label:"Functional Clarity", desc:"Daytime focus, productivity, mood elevation", common:true },
  { id:"creative", label:"Deep Thinking", desc:"Introspection, creativity, philosophical exploration" },
  { id:"pain", label:"Pain Management", desc:"Chronic pain, inflammation, physical relief", common:true },
  { id:"sleep", label:"Sleep Support", desc:"Insomnia, sleep onset, restful sedation" },
  { id:"anxiety_relief", label:"Anxiolytic Effect", desc:"Calm without sedation, social ease" },
];
const AVOID = [
  { id:"anxiety", label:"Overstimulation / Anxiety", desc:"Racing thoughts, paranoia, heart rate", common:true },
  { id:"sedation", label:"Excessive Sedation", desc:"Couch-lock, cognitive fog, flatness" },
  { id:"paranoia", label:"Paranoia / Dissociation", desc:"Loss of control, derealization" },
  { id:"none", label:"No Specific Concerns", desc:"Open to all terpene profiles" },
];
const INTENSITY = [
  { id:"low", label:"Low (THC < 20%)", desc:"Mild, entry-level, controllable" },
  { id:"moderate", label:"Moderate (20–25%)", desc:"Standard therapeutic range", common:true },
  { id:"high", label:"High (25–30%)", desc:"Experienced patients, strong effects" },
  { id:"very_high", label:"Very High (30%+)", desc:"Maximum potency, tolerance required" },
];
const EXPERIENCE = [
  { id:"naive", label:"Cannabis Naive", desc:"No prior use or very limited" },
  { id:"some", label:"Some Experience", desc:"Occasional use, familiar with effects" },
  { id:"experienced", label:"Experienced", desc:"Regular use, established tolerance", common:true },
];
const BUDGET = [
  { id:"economy", label:"Under $8/g", desc:"Value-focused" },
  { id:"mid", label:"$8 – $12/g", desc:"Mid-range", common:true },
  { id:"premium", label:"$12 – $16/g", desc:"Premium tier" },
  { id:"any", label:"No Constraint", desc:"Clinical priority only" },
];

// ── TERPENE ROLE MAP (for rationale generation) ──
const TERPENE_ROLES = {
  limonene: { role:"Mood lift", icon:"↑" },
  caryophyllene: { role:"Body anchor", icon:"⚓" },
  myrcene: { role:"Sedation", icon:"◉" },
  linalool: { role:"Calming", icon:"~" },
  pinene: { role:"Clarity", icon:"◇" },
  alphaPinene: { role:"Clarity", icon:"◇" },
  betaPinene: { role:"Clarity", icon:"◇" },
  farnesene: { role:"Softener", icon:"○" },
  terpinolene: { role:"Stimulant", icon:"⚡" },
  bisabolol: { role:"Healing", icon:"+" },
  humulene: { role:"Anti-inflammatory", icon:"−" },
  ocimene: { role:"Decongestant", icon:"△" },
};

// ── SCORING ENGINE (v3 — fixed) ──
function scoreStrain(strain, answers) {
  if (!strain.totalTerpenes || strain.category === "Unknown") return { score: -999, reasons: [] };
  let score = 0;
  const reasons = [];
  const t = strain.terpenes || {};
  const lim = t.limonene || 0, car = t.caryophyllene || 0, myr = t.myrcene || 0;
  const lin = t.linalool || 0, pin = (t.pinene || 0) + (t.alphaPinene || 0) + (t.betaPinene || 0);
  const far = t.farnesene || 0, terp = t.terpinolene || 0, bis = t.bisabolol || 0;

  // Goal alignment
  if (answers.goal === "functional") {
    const g = lim * 40 + car * 25 + pin * 20 - myr * 15;
    score += g;
    if (lim > 0.3 && car > 0.2) { score += 20; reasons.push("Limonene + caryophyllene synergy — strong functional foundation"); }
    else if (lim > 0.3) reasons.push("Limonene provides mood lift");
    else if (car > 0.3) reasons.push("Caryophyllene anchors without lift — may lack brightness");
    if (myr > 0.5) reasons.push("High myrcene may dampen functional clarity");
  }
  if (answers.goal === "creative") {
    const g = car * 35 + far * 30 + lim * 20 + lin * 25;
    score += g;
    if (car > 0.3 && far > 0.15) { score += 15; reasons.push("Caryophyllene + farnesene — deep introspective architecture"); }
    else if (car > 0.4) reasons.push("Strong body grounding supports sustained deep thinking");
    if (lin > 0.15) reasons.push("Linalool adds dreamy, creative softness");
  }
  if (answers.goal === "pain") {
    const g = car * 45 + myr * 25 + lin * 20 + bis * 15;
    score += g;
    if (car > 0.4) { score += 20; reasons.push("High caryophyllene — direct CB2 receptor binding for anti-inflammatory relief"); }
    if (myr > 0.4) reasons.push("Myrcene enhances THC absorption and muscle relaxation");
    if (bis > 0.1) reasons.push("Bisabolol adds anti-inflammatory support");
  }
  if (answers.goal === "sleep") {
    const g = myr * 45 + lin * 35 + bis * 20 - lim * 15 - pin * 10;
    score += g;
    if (myr > 0.5 && lin > 0.15) { score += 20; reasons.push("Myrcene + linalool synergy — strong sedation with dream quality"); }
    else if (myr > 0.5) reasons.push("High myrcene drives sedation");
    if (lim > 0.4) reasons.push("Limonene may keep mind active — counterproductive for sleep onset");
  }
  if (answers.goal === "anxiety_relief") {
    const g = lin * 40 + car * 30 + bis * 25 - terp * 30 - pin * 10;
    score += g;
    if (lin > 0.15 && car > 0.2) { score += 15; reasons.push("Linalool + caryophyllene — calm without sedation"); }
    if (terp > 0.3) reasons.push("Terpinolene present — may increase stimulation");
  }

  // Contraindication penalties (fixed: no double-dipping)
  if (answers.avoid === "anxiety") {
    if (terp > 0.5) { score -= 40; reasons.push("⚠ High terpinolene (>" + terp.toFixed(1) + "%) — significant anxiety risk"); }
    else if (terp > 0.3) { score -= 20; reasons.push("⚠ Moderate terpinolene — some anxiety risk"); }
    if (lim > 0.6 && car < 0.2) { score -= 15; reasons.push("⚠ High limonene without caryophyllene anchor"); }
  }
  if (answers.avoid === "sedation") {
    if (myr > 0.6 && lim < 0.2) { score -= 35; reasons.push("⚠ Myrcene-dominant with no lift — sedation risk"); }
    if (strain.totalTerpenes < 0.5) { score -= 25; reasons.push("⚠ Very low terpene expression — flat, empty high"); }
  }
  if (answers.avoid === "paranoia") {
    if (strain.thc >= 28 && strain.totalTerpenes < 1.5) { score -= 30; reasons.push("⚠ High THC with low terpene modulation"); }
    if (terp > 0.5) { score -= 20; reasons.push("⚠ Terpinolene may amplify dissociative effects"); }
  }

  // THC bracket (fixed: smooth penalties for out-of-range)
  const thc = strain.thc;
  if (answers.intensity === "low") {
    if (thc <= 20) score += 15;
    else if (thc <= 22) score -= 5;
    else if (thc <= 25) score -= 15;
    else score -= 25;
  } else if (answers.intensity === "moderate") {
    if (thc >= 20 && thc <= 25) score += 15;
    else if (thc < 18 || thc > 27) score -= 10;
  } else if (answers.intensity === "high") {
    if (thc >= 25 && thc <= 30) score += 15;
    else if (thc < 22) score -= 15;
  } else if (answers.intensity === "very_high") {
    if (thc >= 30) score += 20;
    else if (thc >= 28) score += 5;
    else score -= 15;
  }

  // Experience level (fixed: "some" now does something)
  if (answers.experience === "naive") {
    if (thc > 25) { score -= 20; reasons.push("⚠ THC may be too high for cannabis-naive patient"); }
    if (thc > 22) score -= 5;
    if (strain.cbd > 0) { score += 15; reasons.push("CBD presence provides safety buffer for naive patient"); }
  }
  if (answers.experience === "some") {
    // Moderate: reward balanced profiles, mild penalty for extremes
    if (thc > 28) score -= 10;
    if (strain.totalTerpenes >= 1.5 && strain.totalTerpenes <= 2.5) score += 8;
    if (strain.cbd > 0) score += 5;
  }
  if (answers.experience === "experienced") {
    if (strain.totalTerpenes > 2.0) score += 10;
    if (thc >= 25) score += 5;
  }

  // Terpene density bonus
  if (strain.totalTerpenes >= 2.5) { score += 30; reasons.push("Exceptional terpene density (" + strain.totalTerpenes.toFixed(1) + "%)"); }
  else if (strain.totalTerpenes >= 2.0) { score += 20; reasons.push("Strong terpene density (" + strain.totalTerpenes.toFixed(1) + "%)"); }
  else if (strain.totalTerpenes >= 1.5) score += 10;

  // Verified bonus
  if (strain.status === "tried") { score += 12; reasons.push("Clinically verified — real-world data available"); }

  // Avoid category penalty
  if (strain.category === "Avoid") { score -= 50; reasons.push("⚠ Flagged: known poor terpene expression"); }
  if (strain.category === "Caution") { score -= 15; reasons.push("⚠ Caution: unpredictable terpene behaviour"); }

  return { score: Math.round(score), reasons };
}

function budgetFilter(strain, budget) {
  if (budget === "any") return true;
  // Personal strains with no price: show them but they'll be marked as "Price unavailable"
  if (!strain.price) return budget === "any";
  if (budget === "economy") return strain.price < 8;
  if (budget === "mid") return strain.price >= 8 && strain.price <= 12;
  if (budget === "premium") return strain.price >= 12 && strain.price <= 16;
  return true;
}

// ── TOP TERPENES HELPER ──
function getTopTerpenes(terpenes, n = 5) {
  return Object.entries(terpenes || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, val]) => ({ name: formatTerpName(name), key: name, value: val }));
}

function formatTerpName(key) {
  const map = { limonene:"Limonene", caryophyllene:"β-Caryophyllene", myrcene:"Myrcene", linalool:"Linalool", pinene:"α-Pinene", alphaPinene:"α-Pinene", betaPinene:"β-Pinene", farnesene:"Farnesene", terpinolene:"Terpinolene", bisabolol:"α-Bisabolol", humulene:"Humulene", ocimene:"Ocimene", terpineol:"Terpineol", guaiol:"Guaiol", nerolidol:"Nerolidol", fenchol:"Fenchol", camphene:"Camphene", borneol:"Borneol", phytol:"Phytol", cedrene:"Cedrene", caryophylleneOxide:"Caryophyllene Oxide", fenchone:"Fenchone", geraniol:"Geraniol", betaCitronellol:"β-Citronellol", cymene:"Cymene", delta3Carene:"Δ3-Carene", eucalyptol:"Eucalyptol", isopulegol:"Isopulegol", gammaTerpinene:"γ-Terpinene", alphaTerpinene:"α-Terpinene", terpinen4ol:"Terpinen-4-ol", geranylAcetate:"Geranyl Acetate", phellandrene:"Phellandrene", terpinene:"Terpinene" };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

// ── TERPENE BAR COLOR ──
function terpColor(name) {
  const n = (typeof name === 'string' ? name : '').toLowerCase();
  if (n.includes("limonene")) return "#F6C244";
  if (n.includes("caryophyllene") && !n.includes("oxide")) return "#D4763B";
  if (n.includes("myrcene")) return "#7B9E5A";
  if (n.includes("linalool")) return "#A78BBF";
  if (n.includes("pinene")) return "#5BA08A";
  if (n.includes("farnesene")) return "#8CC084";
  if (n.includes("terpinolene")) return "#E06B6B";
  if (n.includes("bisabolol")) return "#D4A87C";
  if (n.includes("humulene")) return "#9B8A6E";
  if (n.includes("ocimene")) return "#6BB8C9";
  return "#999";
}

// ── CATEGORY BADGE ──
function catBadge(cat) {
  const colors = { "Day / Functional":"#2D7A4F", "Deep Think / Creative":"#5B4FA0", "Sleep / KO":"#3B5998", "Avoid":"#9B3333", "Caution":"#B08A2E", "CBD Dominant":"#2E8B8B", "CBD Balanced":"#4A8B7A", "Unknown":"#666" };
  return colors[cat] || "#666";
}

// ── FIXED TERPENE BAR SCALE ──
const TERP_BAR_MAX = 1.3; // Fixed scale so bars are always comparable

// ── MAIN APP ──
export default function PrescriberDesktop() {
  const [view, setView] = useState("engine");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ goal:null, avoid:null, intensity:null, experience:null, budget:null });
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const [results, setResults] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showCount, setShowCount] = useState(8);
  const [libSort, setLibSort] = useState("name");
  const [libFilter, setLibFilter] = useState("all");
  const [libSearch, setLibSearch] = useState("");
  const [libExpanded, setLibExpanded] = useState(null);

  const steps = [
    { key:"goal", title:"Therapeutic Objective", subtitle:"What is the primary clinical goal for this patient?", options:GOALS },
    { key:"avoid", title:"Contraindications", subtitle:"Which adverse effects should be minimised?", options:AVOID },
    { key:"intensity", title:"THC Intensity", subtitle:"What potency bracket is appropriate?", options:INTENSITY },
    { key:"experience", title:"Patient Experience", subtitle:"What is the patient's cannabis use history?", options:EXPERIENCE },
    { key:"budget", title:"Budget Range", subtitle:"What is the target cost per gram?", options:BUDGET },
  ];

  const computeResults = useCallback((a) => {
    const scored = strainDB
      .filter(s => s.totalTerpenes && s.category !== "Unknown")
      .filter(s => budgetFilter(s, a.budget))
      .map(s => {
        const { score, reasons } = scoreStrain(s, a);
        return { ...s, score, reasons };
      })
      .sort((a, b) => b.score - a.score);
    setResults(scored);
    setShowCount(8);
  }, []);

  function handleSelect(key, val) {
    setPendingAnswer({ key, val });
  }

  function confirmAndAdvance() {
    if (!pendingAnswer) return;
    const { key, val } = pendingAnswer;
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    setPendingAnswer(null);
    if (step < 4) {
      setStep(step + 1);
    } else {
      computeResults(newAnswers);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({ goal:null, avoid:null, intensity:null, experience:null, budget:null });
    setPendingAnswer(null);
    setResults(null);
    setExpandedCard(null);
    setShowCount(8);
  }

  // Determine the currently effective value for a step
  const currentVal = pendingAnswer?.key === steps[step]?.key ? pendingAnswer.val : answers[steps[step]?.key];

  // Library helpers
  const libStrains = strainDB
    .filter(s => {
      if (libFilter === "all") return true;
      if (libFilter === "functional") return s.category === "Day / Functional";
      if (libFilter === "creative") return s.category === "Deep Think / Creative";
      if (libFilter === "sleep") return s.category === "Sleep / KO";
      if (libFilter === "cbd") return s.category === "CBD Dominant" || s.category === "CBD Balanced";
      if (libFilter === "caution") return s.category === "Caution" || s.category === "Avoid";
      if (libFilter === "tried") return s.status === "tried";
      return true;
    })
    .filter(s => !libSearch || s.name.toLowerCase().includes(libSearch.toLowerCase()) || (s.brand && s.brand.toLowerCase().includes(libSearch.toLowerCase())) || (s.cultivar && s.cultivar.toLowerCase().includes(libSearch.toLowerCase())))
    .sort((a, b) => {
      if (libSort === "name") return a.name.localeCompare(b.name);
      if (libSort === "thc") return b.thc - a.thc;
      if (libSort === "terpenes") return (b.totalTerpenes || 0) - (a.totalTerpenes || 0);
      if (libSort === "price") return (a.price || 999) - (b.price || 999);
      return 0;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --bg-primary: #0C0F14;
          --bg-secondary: #121620;
          --bg-tertiary: #1A2030;
          --bg-card: #1C2235;
          --bg-card-hover: #222842;
          --border: rgba(255,255,255,0.09);
          --border-active: rgba(196,163,90,0.5);
          --text-primary: rgba(255,255,255,0.95);
          --text-secondary: rgba(255,255,255,0.68);
          --text-tertiary: rgba(255,255,255,0.48);
          --accent: #C4A35A;
          --accent-dim: rgba(196,163,90,0.12);
          --accent-glow: rgba(196,163,90,0.25);
          --green: #4CAF7D;
          --red: #C45A5A;
          --font-main: 'DM Sans', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }
        body { background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-main); -webkit-font-smoothing: antialiased; }

        .shell { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .sidebar { width: 260px; background: var(--bg-secondary); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 10; }
        .sidebar-brand { padding: 28px 24px 20px; border-bottom: 1px solid var(--border); }
        .sidebar-brand h1 { font-size: 14px; font-weight: 700; letter-spacing: 1.5px; color: var(--accent); text-transform: uppercase; }
        .sidebar-brand p { font-size: 12px; color: var(--text-tertiary); margin-top: 6px; line-height: 1.4; }
        .sidebar-nav { padding: 16px 12px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-secondary); transition: all 0.15s; margin-bottom: 4px; }
        .nav-item:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .nav-item.active { background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(196,163,90,0.2); }
        .nav-icon { width: 20px; text-align: center; font-size: 16px; }
        .sidebar-footer { padding: 20px 24px; border-top: 1px solid var(--border); }
        .sidebar-footer p { font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono); line-height: 1.6; }

        .main { margin-left: 260px; flex: 1; min-height: 100vh; }
        .topbar { height: 64px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: var(--bg-secondary); position: sticky; top: 0; z-index: 5; }
        .topbar h2 { font-size: 16px; font-weight: 600; }
        .topbar-meta { font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono); }
        .content { padding: 40px; max-width: 1400px; }

        /* ── ENGINE STEPS ── */
        .step-progress { display: flex; gap: 6px; margin-bottom: 48px; }
        .step-pip { display: flex; align-items: center; gap: 6px; flex: 1; }
        .step-pip-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; font-family: var(--font-mono); background: var(--bg-tertiary); color: var(--text-tertiary); transition: all 0.3s; flex-shrink: 0; }
        .step-pip-dot.done { background: var(--accent); color: #0C0F14; }
        .step-pip-dot.current { background: var(--accent-dim); color: var(--accent); border: 2px solid var(--accent); }
        .step-pip-line { flex: 1; height: 2px; background: var(--border); }
        .step-pip-line.done { background: var(--accent); }
        .step-pip-label { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; display: none; }

        .step-header { margin-bottom: 32px; }
        .step-header h3 { font-size: 26px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.3px; }
        .step-header p { font-size: 15px; color: var(--text-secondary); }

        .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .option-card { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 10px; padding: 22px 24px; cursor: pointer; transition: all 0.15s; position: relative; }
        .option-card:hover { border-color: rgba(255,255,255,0.15); background: var(--bg-card-hover); }
        .option-card.selected { border-color: var(--accent); background: var(--accent-dim); box-shadow: 0 0 0 1px var(--accent); }
        .option-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .option-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
        .option-common { position: absolute; top: 10px; right: 12px; font-size: 10px; color: var(--text-tertiary); background: var(--bg-tertiary); padding: 2px 8px; border-radius: 3px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }

        .step-actions { display: flex; gap: 12px; margin-top: 28px; }
        .btn { border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: var(--font-main); transition: all 0.15s; }
        .btn-primary { background: var(--accent); color: #0C0F14; }
        .btn-primary:hover { background: #D4B36A; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
        .btn-secondary { background: var(--bg-card); border: 1.5px solid var(--border); color: var(--text-secondary); }
        .btn-secondary:hover { border-color: var(--accent); color: var(--text-primary); }

        /* ── RESULTS ── */
        .results-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
        .results-header h3 { font-size: 24px; font-weight: 700; letter-spacing: -0.3px; }
        .results-subtitle { font-size: 14px; color: var(--text-secondary); margin-top: 6px; }

        .results-summary { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
        .summary-chip { font-size: 13px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--bg-tertiary); padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border); }
        .summary-chip strong { color: var(--accent); font-weight: 600; }

        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px; }
        .strain-card { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; transition: all 0.15s; cursor: pointer; }
        .strain-card:hover { border-color: rgba(255,255,255,0.14); }
        .strain-card.top { border-color: var(--border-active); }
        .card-top { padding: 22px 24px 16px; display: flex; justify-content: space-between; align-items: flex-start; }
        .card-rank { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; font-family: var(--font-mono); background: var(--bg-tertiary); color: var(--text-secondary); flex-shrink: 0; }
        .card-rank.gold { background: var(--accent-dim); color: var(--accent); border: 1.5px solid rgba(196,163,90,0.3); }
        .card-info { flex: 1; margin-left: 16px; }
        .card-info h4 { font-size: 17px; font-weight: 600; margin-bottom: 3px; }
        .card-info .brand { font-size: 13px; color: var(--text-tertiary); }
        .card-score { text-align: right; }
        .card-score .pts { font-size: 24px; font-weight: 700; font-family: var(--font-mono); color: var(--accent); }
        .card-score .label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; }

        .card-meta { padding: 0 24px 16px; display: flex; gap: 8px; flex-wrap: wrap; }
        .meta-pill { font-size: 12px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--bg-tertiary); padding: 5px 10px; border-radius: 5px; }

        .card-terpbar { padding: 0 24px 16px; }
        .terpbar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
        .terpbar-name { font-size: 12px; color: var(--text-secondary); width: 110px; text-align: right; font-family: var(--font-mono); flex-shrink: 0; }
        .terpbar-track { flex: 1; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
        .terpbar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        .terpbar-val { font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono); width: 48px; flex-shrink: 0; }

        .card-cat { padding: 0 24px 16px; }
        .cat-badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 5px; letter-spacing: 0.3px; }
        .status-badge { display: inline-block; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 4px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

        .card-expanded { padding: 0 24px 22px; border-top: 1px solid var(--border); margin-top: 4px; padding-top: 18px; }
        .rationale-list { list-style: none; padding: 0; margin: 0 0 16px; }
        .rationale-item { font-size: 14px; color: var(--text-secondary); line-height: 1.6; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; align-items: flex-start; gap: 8px; }
        .rationale-item:last-child { border-bottom: none; }
        .rationale-icon { color: var(--accent); font-size: 14px; flex-shrink: 0; margin-top: 2px; }
        .rationale-warn { color: var(--red); }
        .expanded-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .expanded-section h5 { font-size: 13px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .expanded-section p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
        .price-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; }
        .price-cell { background: var(--bg-tertiary); padding: 10px 14px; border-radius: 6px; }
        .price-cell .price-label { font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.3px; }
        .price-cell .price-val { font-size: 15px; font-weight: 600; font-family: var(--font-mono); color: var(--text-primary); margin-top: 3px; }

        .show-more { display: flex; justify-content: center; margin-top: 24px; }

        /* ── LIBRARY ── */
        .lib-controls { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; flex-wrap: wrap; }
        .lib-search { background: var(--bg-card); border: 1.5px solid var(--border); color: var(--text-primary); padding: 11px 16px; border-radius: 8px; font-size: 14px; font-family: var(--font-main); width: 320px; outline: none; transition: border-color 0.15s; }
        .lib-search:focus { border-color: var(--accent); }
        .lib-search::placeholder { color: var(--text-tertiary); }
        .lib-select { background: var(--bg-card); border: 1.5px solid var(--border); color: var(--text-primary); padding: 11px 14px; border-radius: 8px; font-size: 13px; font-family: var(--font-main); cursor: pointer; outline: none; }
        .lib-select option { background: var(--bg-secondary); }
        .lib-count { font-size: 13px; color: var(--text-tertiary); font-family: var(--font-mono); margin-left: auto; }

        .lib-table { width: 100%; border-collapse: collapse; }
        .lib-table th { text-align: left; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; padding: 14px 16px; border-bottom: 1.5px solid var(--border); }
        .lib-table td { padding: 16px 16px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: top; }
        .lib-table tr { cursor: pointer; transition: background 0.1s; }
        .lib-table tr:hover td { background: var(--bg-card-hover); }
        .lib-table .name-cell { font-weight: 600; font-size: 15px; }
        .lib-table .brand-cell { color: var(--text-secondary); font-size: 13px; margin-top: 2px; }
        .lib-table .mono { font-family: var(--font-mono); font-size: 13px; }
        .lib-terp-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .lib-terp-pill { font-size: 11px; font-family: var(--font-mono); padding: 3px 8px; border-radius: 4px; color: rgba(255,255,255,0.88); white-space: nowrap; }

        .lib-expanded-row td { background: var(--bg-card) !important; padding: 0 16px 20px !important; border-bottom: 2px solid var(--border) !important; }
        .lib-detail { padding: 16px 0 0; }
        .lib-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .lib-detail h5 { font-size: 12px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .lib-detail p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
        .lib-terpbar-mini { margin-top: 8px; }
        .lib-terpbar-mini .terpbar-row { margin-bottom: 5px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .sidebar { width: 72px; }
          .sidebar-brand h1, .sidebar-brand p, .nav-label, .sidebar-footer { display: none; }
          .sidebar-brand { padding: 20px 0; text-align: center; }
          .nav-item { justify-content: center; padding: 14px; }
          .main { margin-left: 72px; }
          .content { padding: 24px; }
          .results-grid { grid-template-columns: 1fr; }
          .expanded-grid { grid-template-columns: 1fr; }
          .lib-detail-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; }
          .options-grid { grid-template-columns: 1fr; }
          .results-grid { grid-template-columns: 1fr; }
          .lib-controls { flex-direction: column; align-items: stretch; }
          .lib-search { width: 100%; }
        }
      `}</style>

      <div className="shell">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h1>Terpene Intel</h1>
            <p>Prescriber Decision Support</p>
          </div>
          <nav className="sidebar-nav">
            <div className={`nav-item ${view === "engine" ? "active" : ""}`} onClick={() => setView("engine")}>
              <span className="nav-icon">◎</span>
              <span className="nav-label">Prescribing Engine</span>
            </div>
            <div className={`nav-item ${view === "library" ? "active" : ""}`} onClick={() => setView("library")}>
              <span className="nav-icon">☰</span>
              <span className="nav-label">Product Library</span>
            </div>
          </nav>
          <div className="sidebar-footer">
            <p>{strainDB.length} products indexed</p>
            <p>{strainDB.filter(s=>s.status==="tried").length} clinically verified</p>
            <p>{strainDB.filter(s=>s.totalTerpenes).length} with terpene data</p>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <h2>{view === "engine" ? "Prescribing Engine" : "Product Library"}</h2>
            <span className="topbar-meta">v3.0 — {strainDB.length} products</span>
          </div>

          <div className="content">
            {/* ── ENGINE: QUESTIONNAIRE ── */}
            {view === "engine" && !results && (
              <>
                <div className="step-progress">
                  {steps.map((s, i) => (
                    <div key={i} className="step-pip">
                      <div className={`step-pip-dot ${i < step ? "done" : i === step ? "current" : ""}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      {i < steps.length - 1 && <div className={`step-pip-line ${i < step ? "done" : ""}`} />}
                    </div>
                  ))}
                </div>

                <div className="step-header">
                  <h3>{steps[step].title}</h3>
                  <p>{steps[step].subtitle}</p>
                </div>

                <div className="options-grid">
                  {steps[step].options.map(opt => (
                    <div
                      key={opt.id}
                      className={`option-card ${currentVal === opt.id ? "selected" : ""}`}
                      onClick={() => handleSelect(steps[step].key, opt.id)}
                    >
                      {opt.common && <span className="option-common">Common</span>}
                      <h4>{opt.label}</h4>
                      <p>{opt.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="step-actions">
                  {step > 0 && (
                    <button className="btn btn-secondary" onClick={() => { setPendingAnswer(null); setStep(step - 1); }}>
                      ← Back
                    </button>
                  )}
                  <button
                    className="btn btn-primary"
                    disabled={!currentVal}
                    onClick={confirmAndAdvance}
                  >
                    {step < 4 ? "Continue →" : "Generate Recommendations"}
                  </button>
                </div>
              </>
            )}

            {/* ── ENGINE: RESULTS ── */}
            {view === "engine" && results && (
              <>
                <div className="results-header">
                  <div>
                    <h3>Prescribing Recommendations</h3>
                    <p className="results-subtitle">{results.length} products scored against patient profile</p>
                  </div>
                  <button className="btn btn-secondary" onClick={reset}>New Assessment</button>
                </div>

                <div className="results-summary">
                  <span className="summary-chip"><strong>Goal:</strong> {GOALS.find(g=>g.id===answers.goal)?.label}</span>
                  <span className="summary-chip"><strong>Avoid:</strong> {AVOID.find(a=>a.id===answers.avoid)?.label}</span>
                  <span className="summary-chip"><strong>THC:</strong> {INTENSITY.find(i=>i.id===answers.intensity)?.label}</span>
                  <span className="summary-chip"><strong>Experience:</strong> {EXPERIENCE.find(e=>e.id===answers.experience)?.label}</span>
                  <span className="summary-chip"><strong>Budget:</strong> {BUDGET.find(b=>b.id===answers.budget)?.label}</span>
                </div>

                <div className="results-grid">
                  {results.slice(0, showCount).map((strain, idx) => {
                    const top = getTopTerpenes(strain.terpenes, 4);
                    const expanded = expandedCard === idx;
                    return (
                      <div key={idx} className={`strain-card ${idx < 3 ? "top" : ""}`} onClick={() => setExpandedCard(expanded ? null : idx)}>
                        <div className="card-top">
                          <div className={`card-rank ${idx < 3 ? "gold" : ""}`}>{idx + 1}</div>
                          <div className="card-info">
                            <h4>{strain.name}</h4>
                            <span className="brand">{strain.brand}{strain.cultivar ? ` · ${strain.cultivar}` : ""}</span>
                          </div>
                          <div className="card-score">
                            <div className="pts">{strain.score}</div>
                            <div className="label">points</div>
                          </div>
                        </div>

                        <div className="card-meta">
                          <span className="meta-pill">THC {strain.thc}%</span>
                          {strain.cbd > 0 && <span className="meta-pill">CBD {strain.cbd}%</span>}
                          <span className="meta-pill">{strain.totalTerpenes?.toFixed(1)}% terps</span>
                          <span className="meta-pill">{strain.species}</span>
                          {strain.price && <span className="meta-pill">${strain.price.toFixed(2)}/g</span>}
                        </div>

                        <div className="card-terpbar">
                          {top.map((t, ti) => (
                            <div key={ti} className="terpbar-row">
                              <span className="terpbar-name">{t.name}</span>
                              <div className="terpbar-track">
                                <div className="terpbar-fill" style={{width:`${Math.min((t.value / TERP_BAR_MAX) * 100, 100)}%`, background: terpColor(t.name)}} />
                              </div>
                              <span className="terpbar-val">{t.value.toFixed(2)}%</span>
                            </div>
                          ))}
                        </div>

                        <div className="card-cat">
                          <span className="cat-badge" style={{background: catBadge(strain.category) + "25", color: catBadge(strain.category)}}>{strain.category}</span>
                          <span className="status-badge" style={{background: strain.status === "tried" ? "rgba(76,175,125,0.15)" : "rgba(255,255,255,0.06)", color: strain.status === "tried" ? "var(--green)" : "var(--text-tertiary)"}}>{strain.status === "tried" ? "✓ Verified" : "Predicted"}</span>
                        </div>

                        {expanded && (
                          <div className="card-expanded">
                            {strain.reasons && strain.reasons.length > 0 && (
                              <>
                                <h5 style={{fontSize:13,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Why This Product Scored {strain.score > 0 ? "Well" : "Poorly"}</h5>
                                <ul className="rationale-list">
                                  {strain.reasons.map((r, ri) => (
                                    <li key={ri} className="rationale-item">
                                      <span className={`rationale-icon ${r.startsWith("⚠") ? "rationale-warn" : ""}`}>
                                        {r.startsWith("⚠") ? "⚠" : "→"}
                                      </span>
                                      <span>{r.startsWith("⚠ ") ? r.slice(2) : r}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                            <div className="expanded-grid">
                              <div className="expanded-section">
                                <h5>Clinical Notes</h5>
                                <p>{strain.notes}</p>
                              </div>
                              {strain.price ? (
                                <div className="expanded-section">
                                  <h5>Pricing</h5>
                                  <div className="price-grid">
                                    <div className="price-cell">
                                      <div className="price-label">Per Gram</div>
                                      <div className="price-val">${strain.price.toFixed(2)}</div>
                                    </div>
                                    <div className="price-cell">
                                      <div className="price-label">RRP</div>
                                      <div className="price-val">${strain.rrp}</div>
                                    </div>
                                    <div className="price-cell">
                                      <div className="price-label">Sizes</div>
                                      <div className="price-val">{strain.sizes?.join(", ") || "—"}</div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="expanded-section">
                                  <h5>Pricing</h5>
                                  <p style={{color:"var(--text-tertiary)", fontStyle:"italic"}}>Price unavailable — personal/verified product</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {showCount < results.length && (
                  <div className="show-more">
                    <button className="btn btn-secondary" onClick={() => setShowCount(prev => prev + 8)}>
                      Show More ({results.length - showCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── LIBRARY ── */}
            {view === "library" && (
              <>
                <div className="lib-controls">
                  <input className="lib-search" placeholder="Search products, brands, cultivars..." value={libSearch} onChange={e => setLibSearch(e.target.value)} />
                  <select className="lib-select" value={libFilter} onChange={e => setLibFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    <option value="functional">Day / Functional</option>
                    <option value="creative">Deep Think / Creative</option>
                    <option value="sleep">Sleep / KO</option>
                    <option value="cbd">CBD Products</option>
                    <option value="caution">Caution / Avoid</option>
                    <option value="tried">Clinically Verified</option>
                  </select>
                  <select className="lib-select" value={libSort} onChange={e => setLibSort(e.target.value)}>
                    <option value="name">Sort: Name</option>
                    <option value="thc">Sort: THC ↓</option>
                    <option value="terpenes">Sort: Total Terpenes ↓</option>
                    <option value="price">Sort: Price ↑</option>
                  </select>
                  <span className="lib-count">{libStrains.length} products</span>
                </div>
                <table className="lib-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>THC</th>
                      <th>CBD</th>
                      <th>Total Terps</th>
                      <th>Top Terpenes</th>
                      <th>Category</th>
                      <th>Price/g</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libStrains.map((s, i) => {
                      const top = getTopTerpenes(s.terpenes, 3);
                      const isExpanded = libExpanded === i;
                      const allTerps = getTopTerpenes(s.terpenes, 8);
                      return (
                        <React.Fragment key={i}>
                          <tr onClick={() => setLibExpanded(isExpanded ? null : i)}>
                            <td>
                              <div className="name-cell">{s.name}</div>
                              <div className="brand-cell">{s.brand}{s.cultivar ? ` · ${s.cultivar}` : ""}</div>
                            </td>
                            <td className="mono">{s.thc}%</td>
                            <td className="mono">{s.cbd > 0 ? `${s.cbd}%` : "—"}</td>
                            <td className="mono">{s.totalTerpenes ? `${s.totalTerpenes.toFixed(2)}%` : "—"}</td>
                            <td>
                              <div className="lib-terp-pills">
                                {top.map((t, ti) => (
                                  <span key={ti} className="lib-terp-pill" style={{background: terpColor(t.name) + "33", color: terpColor(t.name)}}>{t.name} {t.value.toFixed(2)}</span>
                                ))}
                              </div>
                            </td>
                            <td><span className="cat-badge" style={{background: catBadge(s.category) + "25", color: catBadge(s.category), fontSize:12}}>{s.category}</span></td>
                            <td className="mono">{s.price ? `$${s.price.toFixed(2)}` : "—"}</td>
                            <td><span className="status-badge" style={{background: s.status === "tried" ? "rgba(76,175,125,0.15)" : "rgba(255,255,255,0.06)", color: s.status === "tried" ? "var(--green)" : "var(--text-tertiary)"}}>{s.status === "tried" ? "✓ Verified" : "Predicted"}</span></td>
                          </tr>
                          {isExpanded && (
                            <tr className="lib-expanded-row">
                              <td colSpan={8}>
                                <div className="lib-detail">
                                  <div className="lib-detail-grid">
                                    <div>
                                      <h5>Full Terpene Profile</h5>
                                      <div className="lib-terpbar-mini">
                                        {allTerps.map((t, ti) => (
                                          <div key={ti} className="terpbar-row">
                                            <span className="terpbar-name">{t.name}</span>
                                            <div className="terpbar-track">
                                              <div className="terpbar-fill" style={{width:`${Math.min((t.value / TERP_BAR_MAX) * 100, 100)}%`, background: terpColor(t.name)}} />
                                            </div>
                                            <span className="terpbar-val">{t.value.toFixed(2)}%</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h5>Clinical Notes</h5>
                                      <p>{s.notes}</p>
                                      <div style={{marginTop:16}}>
                                        <h5>Product Details</h5>
                                        <p>Species: {s.species}</p>
                                        {s.sizes?.length > 0 && <p>Available sizes: {s.sizes.join(", ")}</p>}
                                      </div>
                                    </div>
                                    <div>
                                      {s.price ? (
                                        <>
                                          <h5>Pricing</h5>
                                          <div className="price-grid" style={{gridTemplateColumns:"1fr 1fr"}}>
                                            <div className="price-cell">
                                              <div className="price-label">Per Gram</div>
                                              <div className="price-val">${s.price.toFixed(2)}</div>
                                            </div>
                                            <div className="price-cell">
                                              <div className="price-label">RRP</div>
                                              <div className="price-val">${s.rrp}</div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <h5>Pricing</h5>
                                          <p style={{color:"var(--text-tertiary)", fontStyle:"italic"}}>Price unavailable</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
