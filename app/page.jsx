"use client";
import { useState, useCallback, Fragment } from "react";

/* ============================================================
   TERPENE PRESCRIBER INTELLIGENCE v3.5.3
   Desktop-First Clinical Decision Support
   Canonical Database v1.0 — 52 products (16 verified, 36 predicted)
   June 2026
   ============================================================ */

// ── STRAIN DATABASE — Canonical v1.0 ──────────────────────────────────────
const strainDB = [
  // VERIFIED — tried by Diego
  { name:"MK Ultra", brand:"—", cultivar:"MK Ultra", thc:21, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica dominant", terpenes:{myrcene:0.85,caryophyllene:0.42,limonene:0.23,linalool:0.18,humulene:0.12}, totalTerpenes:1.8, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Classic myrcene-dominant knockout stack." },
  { name:"Bruce Banner", brand:"—", cultivar:"Bruce Banner", thc:25, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{limonene:0.62,caryophyllene:0.38,myrcene:0.25,linalool:0.19,humulene:0.16}, totalTerpenes:1.6, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Reliable limonene-led day hybrid." },
  { name:"Wedding Cake", brand:"—", cultivar:"Wedding Cake", thc:24, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Indica dominant", terpenes:{caryophyllene:0.72,limonene:0.48,farnesene:0.31,myrcene:0.27,linalool:0.19,humulene:0.13}, totalTerpenes:2.1, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Classic caryophyllene + farnesene deep-think profile." },
  { name:"Gorilla Glue #4", brand:"—", cultivar:"GG4", thc:26, cbd:0, category:"Sleep / KO", status:"tried", species:"Hybrid", terpenes:{myrcene:0.74,caryophyllene:0.51,limonene:0.32,linalool:0.20,humulene:0.13}, totalTerpenes:1.9, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Heavy myrcene base with structural caryophyllene." },
  { name:"Sour Diesel", brand:"—", cultivar:"Sour Diesel", thc:22, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{limonene:0.55,caryophyllene:0.34,myrcene:0.28,humulene:0.19,linalool:0.14}, totalTerpenes:1.5, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Well-anchored limonene lift." },
  { name:"OG Kush", brand:"—", cultivar:"OG Kush", thc:23, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica dominant", terpenes:{myrcene:0.65,limonene:0.42,caryophyllene:0.31,linalool:0.18,humulene:0.14}, totalTerpenes:1.7, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego." },
  { name:"Jack Herer (personal)", brand:"—", cultivar:"Jack Herer", thc:21, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{terpinolene:0.48,myrcene:0.31,caryophyllene:0.28,ocimene:0.19,humulene:0.14}, totalTerpenes:1.4, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Terpinolene present but anchored by caryophyllene at a safe ratio." },
  { name:"Blue Dream", brand:"—", cultivar:"Blue Dream", thc:20, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Sativa dominant", terpenes:{myrcene:0.52,caryophyllene:0.38,limonene:0.29,farnesene:0.21,linalool:0.20}, totalTerpenes:1.6, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Farnesene adds soft introspective quality." },
  { name:"Granddaddy Purple", brand:"—", cultivar:"GDP", thc:20, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica dominant", terpenes:{myrcene:0.78,caryophyllene:0.44,limonene:0.28,linalool:0.17,humulene:0.13}, totalTerpenes:1.8, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Reliable myrcene-led sleep profile." },
  { name:"Green Crack", brand:"—", cultivar:"Green Crack", thc:22, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{limonene:0.51,caryophyllene:0.29,myrcene:0.23,humulene:0.15,linalool:0.12}, totalTerpenes:1.3, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. Clean functional profile." },
  { name:"ACDC", brand:"—", cultivar:"ACDC", thc:1, cbd:14, category:"CBD Dominant", status:"tried", species:"Hybrid", terpenes:{myrcene:0.38,caryophyllene:0.29,limonene:0.21,linalool:0.13,humulene:0.09}, totalTerpenes:1.1, price:null, rrp:null, sizes:["10g"], notes:"Verified by Diego. High-CBD, near-zero THC. Therapeutic use." },
  // PREDICTED — Catalyst AU
  { name:"Grandiosa Jilly Bean", brand:"Grandiosa", cultivar:"Jilly Bean", thc:22, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{limonene:0.51,caryophyllene:0.23,linalool:0.17,nerolidol:0.14,cisNerolidol:0.13,myrcene:0.09,humulene:0.08,betaPinene:0.05,guaiol:0.04,alphaPinene:0.04,ocimene:0.04}, totalTerpenes:1.52, price:null, rrp:null, sizes:["10g"], notes:"Limonene-dominant with rare dual nerolidol presence (0.27% combined). Near-absent myrcene (0.09%)." },
  { name:"Sol 1:16", brand:"Kind Medical", cultivar:"Pure Sun CBD", thc:1, cbd:16, category:"CBD Dominant", status:"predicted", species:"Balanced Hybrid", terpenes:{transCaryophyllene:0.31,myrcene:0.26,farnesene:0.19,guaiol:0.15,alphaBisabolol:0.12,humulene:0.07,linalool:0.05,limonene:0.05,terpineol:0.01,transNerolidol:0.01,fenchol:0.01,betaPinene:0.01,caryophylleneOxide:0.01}, totalTerpenes:1.24, price:12.00, rrp:120, sizes:["10g"], notes:"CBD dominant (16%). Soft grounding profile. Rich terpene density unusual for this category." },
  { name:"Cultiva Bacio Gelato", brand:"Cultiva", cultivar:"Bacio Gelato", thc:23, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica dominant", terpenes:{transCaryophyllene:1.20,myrcene:0.28,humulene:0.26,limonene:0.19,linalool:0.13,caryophylleneOxide:0.04,farnesene:0.03,betaPinene:0.03,transNerolidol:0.02,terpineol:0.02,fenchyl:0.02,alphaPinene:0.02,camphene:0.01}, totalTerpenes:2.24, price:15.90, rrp:159, sizes:["10g"], notes:"Caryophyllene-dominant at 1.20% — exceptionally high. Extreme body anchor." },
  { name:"Australian Natural Juno", brand:"ANTG", cultivar:"Eve + El Jefe Cross", thc:11.5, cbd:12.5, category:"CBD Balanced", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.23,caryophyllene:0.16,linalool:0.07,caryophylleneOxide:0.07,humulene:0.06,limonene:0.05,alphaBisabolol:0.03}, totalTerpenes:0.67, price:12.90, rrp:129, sizes:["10g"], notes:"Balanced THC:CBD. Low total terpenes (0.67%). Therapeutic/entry-level." },
  { name:"Australian Natural Rocky", brand:"ANTG", cultivar:null, thc:30, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica dominant", terpenes:{caryophyllene:0.83,limonene:0.47,linalool:0.29,humulene:0.22,alphaBisabolol:0.14,myrcene:0.12,betaPinene:0.11}, totalTerpenes:2.18, price:14.90, rrp:149, sizes:["10g"], notes:"30% THC — joint highest in database. Caryophyllene-dominant with unusual anxiolytic-leaning stack for sleep category." },
  { name:"MCA NOVA T28", brand:"Medical Cannabis Australia (MCA)", cultivar:"Original Blitz", thc:28, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.55,caryophyllene:0.47,myrcene:0.24,humulene:0.24,guaiol:0.12,alphaBisabolol:0.09,betaPinene:0.09,alphaPinene:0.07,linalool:0.05}, totalTerpenes:1.92, price:13.90, rrp:139, sizes:["10g"], notes:"Limonene-led despite indica classification. Classic functional architecture at 28% THC." },
  { name:"Australian Natural Mariposa", brand:"ANTG", cultivar:null, thc:16, cbd:0, category:"Day / Functional", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.17,caryophyllene:0.17,selinaDiene3711:0.15,selinaDiene41511:0.11,humulene:0.08,myrcene:0.07,betaPinene:0.07,alphaPinene:0.04,germacreneB:0.03}, totalTerpenes:0.89, price:12.90, rrp:129, sizes:["10g"], notes:"Unusual sesquiterpene-heavy profile. selinaDienes are cannabis-exclusive chemotype markers — not scoreable. germacreneB: antimicrobial association only." },
  { name:"Levin Health Indica 26%", brand:"Levin Health", cultivar:"Rhea", thc:26, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{myrcene:1.50,caryophylleneOxide:0.47,limonene:0.23,humulene:0.18,alphaBisabolol:0.14,alphaPinene:0.07,linalool:0.05,terpinolene:0.02}, totalTerpenes:2.66, price:13.50, rrp:135, sizes:["10g","30g"], notes:"Myrcene-dominant at 1.50% — highest myrcene in database. Best per-gram value at 30g ($10.97/g)." },
  { name:"JH Jack Herer", brand:"MedTEC Pharma", cultivar:"Jack Herer", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{myrcene:1.30,caryophyllene:0.76,humulene:0.33,limonene:0.31,linalool:0.18,betaPinene:0.06,terpineol:0.04,nerolidol:0.04,alphaPinene:0.03,alphaBisabolol:0.03,caryophylleneOxide:0.02}, totalTerpenes:3.10, price:7.93, rrp:119, sizes:["15g"], notes:"Highest total terpenes in database at 3.10%. Best value per gram at $7.93/g. Out of stock per Catalyst (23/06/2025)." },
  { name:"Aura Therapeutics Apples & Bananas", brand:"AURA Therapeutics", cultivar:"Apples and Bananas", thc:25, cbd:2, category:"Sleep / KO", status:"predicted", species:"Sativa dominant", terpenes:{myrcene:2.12,ocimene:0.63,alphaPinene:0.53,caryophyllene:0.30,linalool:0.13,betaPinene:0.13,humulene:0.11,limonene:0.08,selinaDiene3711:0.07,alphaBisabolol:0.04,transNerolidol:0.02,betaCitronellol:0.02,farnesene:0.01,camphene:0.01,terpineol:0.01,fenchyl:0.01}, totalTerpenes:4.22, price:14.90, rrp:149, sizes:["10g","20g"], notes:"Total terpenes 4.22% — second highest in database. Myrcene-dominant despite sativa classification." },
  { name:"Cannatrek T22 Jasmin", brand:"Cannatrek", cultivar:"Night Queen", thc:22, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.23,myrcene:0.15,humulene:0.10,limonene:0.08,linalool:0.04}, totalTerpenes:0.60, price:13.50, rrp:135, sizes:["10g"], notes:"Patient data: 92% night-use, 0% day. Low total terpenes (0.60%)." },
  { name:"Libra 7:7", brand:"Kind Medical", cultivar:"Pennywise", thc:7, cbd:7, category:"CBD Balanced", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.24,guaiol:0.14,terpinolene:0.14,alphaPinene:0.12,transCaryophyllene:0.11,betaPinene:0.05,humulene:0.04,farnesene:0.03,linalool:0.03,limonene:0.02,terpineol:0.01,transNerolidol:0.01,alphaPhellandrene:0.01,caryophylleneOxide:0.01,delta3Carene:0.01,terpinene:0.01}, totalTerpenes:0.98, price:12.00, rrp:120, sizes:["10g"], notes:"Balanced 7:7 THC:CBD. Terpinolene present — CBD content partially offsets anxiety risk in sensitive patients." },
  { name:"West Coast Palms Hawaiian Rain", brand:"West Coast Palms", cultivar:"Hawaiian Rain", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.54,caryophyllene:0.36,myrcene:0.32,linalool:0.23,selinaDiene41511:0.20,germacreneB:0.20,gammaElemene:0.17,transBergamotene:0.15,betaPinene:0.12,fenchol:0.10,humulene:0.09,farnesene:0.09,alphaPinene:0.08,hexylHexanoate:0.06,terpineol:0.05,eBetaOcimene:0.05,fenchyl:0.05,gammaSelinene:0.04,betaSelinene:0.02,betaEudesmol:0.02,borneol:0.02,transNerolidol:0.02,camphene:0.02,alphaSelinene:0.02,fenchone:0.01,camphor:0.01,caryophylleneOxide:0.01,gammaEudesmol:0.01,cedrene:0.01,terpinolene:0.01,bulnesol:0.01,zBetaOcimene:0.01,alphaBisabolol:0.01}, totalTerpenes:3.15, price:15.00, rrp:150, sizes:["10g"], notes:"Most complex terpene profile in database — 30+ terpenes. germacreneB/gammaElemene analytically entangled via GC. transBergamotene: Sativa-leaning marker, scoring weight pending Roberto." },
  { name:"Australian Natural Eve CBD16", brand:"ANTG", cultivar:null, thc:1, cbd:16, category:"CBD Dominant", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.33,caryophyllene:0.17,terpinolene:0.14,limonene:0.09,betaPinene:0.09,delta3Carene:0.05,alphaPinene:0.05,linalool:0.04,alphaTerpinene:0.02}, totalTerpenes:0.98, price:17.90, rrp:179, sizes:["10g"], notes:"CBD dominant (<1% THC, 16% CBD). Terpinolene at 0.14% — CBD moderates anxiety risk." },
  { name:"Thea 25:1", brand:"Kind Medical", cultivar:"Berry Cream Puff", thc:25, cbd:1, category:"Deep Think / Creative", status:"predicted", species:"Sativa dominant", terpenes:{transCaryophyllene:0.85,limonene:0.44,farnesene:0.41,humulene:0.18,alphaBisabolol:0.14,myrcene:0.14,guaiol:0.12,linalool:0.10,betaPinene:0.07,fenchol:0.06,alphaPinene:0.05,terpineol:0.05,camphene:0.02,caryophylleneOxide:0.01,ocimene:0.01,terpinolene:0.01,borneol:0.01}, totalTerpenes:2.67, price:12.00, rrp:120, sizes:["10g"], notes:"Classic Deep Think / Creative architecture. Strong farnesene (0.41%). Terpinolene at trace (0.01%) — no concern." },
  { name:"Gas Cake", brand:"Mediquest", cultivar:"Gas Cake", thc:31, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica dominant", terpenes:{myrcene:1.98,caryophyllene:0.27,limonene:0.25,linalool:0.19,selinaDiene41511:0.19,selinaDiene3711:0.17,germacreneB:0.15,transBergamotene:0.13,cisNerolidol:0.08,eBetaOcimene:0.06,betaPinene:0.06,farnesene:0.04,alphaBisabolol:0.03,alphaPinene:0.02,terpineol:0.02,fenchyl:0.02,gammaEudesmol:0.02,transNerolidol:0.01,valencene:0.01,camphene:0.01}, totalTerpenes:3.67, price:16.50, rrp:165, sizes:["10g"], notes:"THC 31% — joint highest in database. Total terpenes 3.67% — second highest. Heavy sedative architecture." },
  { name:"Alma Cannabis Grape Galena", brand:"Alma Cannabis", cultivar:"Grape Galena", thc:25, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica", terpenes:{limonene:0.88,caryophyllene:0.70,myrcene:0.49,linalool:0.26,farnesene:0.21,selinaDiene3711:0.20,humulene:0.20,germacreneB:0.15,selinaDiene41511:0.14,betaPinene:0.14,alphaBisabolol:0.11}, totalTerpenes:3.48, price:14.90, rrp:149, sizes:["10g"], notes:"Classic Deep Think / Creative architecture despite indica classification. High total terpenes (3.48%)." },
  { name:"Chemovar Daily Grape", brand:"Chemovar", cultivar:"Daily Grape", thc:28, cbd:0, cbg:2, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.86,farnesene:0.48,transCaryophyllene:0.40,linalool:0.20,alphaBisabolol:0.12,guaiol:0.11,terpineol:0.10,humulene:0.10,betaPinene:0.08,alphaPinene:0.08,fenchyl:0.08,fenchol:0.06,caryophylleneOxide:0.05,sabinene:0.05,fenchone:0.05,gammaTerpinene:0.05,myrcene:0.05,camphene:0.04,borneol:0.01,terpinolene:0.01}, totalTerpenes:2.98, price:12.80, rrp:128, sizes:["10g"], notes:"First database entry with CBG field (cbg: 2). CBG is data-only — no scoring weight until evidence threshold met." },
  // POUCH RANGE
  { name:"Pouch Red", brand:"Pouch", cultivar:"Black Cherry Pie", thc:27, cbd:0, category:"Day / Functional", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.53,caryophyllene:0.20,myrcene:0.19,linalool:0.13,humulene:0.09}, totalTerpenes:1.39, price:6.07, rrp:85, sizes:["14g"], notes:"Limonene-forward, low myrcene. Clean functional profile. Best value in Pouch range." },
  { name:"Pouch Pink Plus", brand:"Pouch", cultivar:"Alien Pie", thc:30, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.73,limonene:0.45,linalool:0.34,myrcene:0.24,humulene:0.22,valencene:0.14,alphaBisabolol:0.07,nerolidol:0.06,terpineol:0.06,farnesene:0.05,alphaPinene:0.04}, totalTerpenes:2.59, price:4.60, rrp:69, sizes:["15g"], notes:"Best-constructed profile in Pouch range. Complete softener stack." },
  { name:"Pouch Purple Plus", brand:"Pouch", cultivar:"Garlic Z", thc:25, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.95,humulene:0.48,selinaDiene41511:0.29,myrcene:0.29,limonene:0.24,selinaDiene3711:0.23,linalool:0.13,alphaBisabolol:0.08,farnesene:0.07}, totalTerpenes:3.25, price:4.60, rrp:69, sizes:["15g"], notes:"Maximum body anchor profile." },
  { name:"Pouch Indigo XL", brand:"Pouch", cultivar:"Diesel Dipped Cookies", thc:30, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica", terpenes:{limonene:0.73,caryophyllene:0.45,myrcene:0.37,linalool:0.19,fenchol:0.12,humulene:0.11,alphaBisabolol:0.11,betaPinene:0.11,terpineol:0.11,nerolidol:0.02}, totalTerpenes:2.63, price:4.50, rrp:135, sizes:["30g"], notes:"Only limonene-dominant strain in Pouch range. Best Pouch option for daytime-leaning indica use." },
  { name:"Pouch Navy XL", brand:"Pouch", cultivar:"London Pound Cake", thc:28, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.49,limonene:0.47,humulene:0.17,alphaBisabolol:0.13,linalool:0.11,terpineol:0.10,myrcene:0.09,geraniol:0.02,nerolidol:0.02}, totalTerpenes:1.73, price:4.50, rrp:135, sizes:["30g"], notes:"Correct architecture, low total density (1.73%)." },
  { name:"Pouch Apricot XL", brand:"Pouch", cultivar:"Apricot Oreoz", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica", terpenes:{limonene:0.36,caryophyllene:0.32,humulene:0.21,alphaBisabolol:0.14,borneol:0.14,eucalyptol:0.12,linalool:0.05,myrcene:0.01,nerolidol:0.01}, totalTerpenes:1.62, price:4.50, rrp:135, sizes:["30g"], notes:"Lowest myrcene in database (0.01%). Camphoraceous/cooling character from borneol and eucalyptol." },
  { name:"Pouch Yellow", brand:"Pouch", cultivar:"Beast Head OG", thc:30, cbd:0, category:"Sleep / KO", status:"predicted", species:"Balanced Hybrid", terpenes:{myrcene:0.87,caryophyllene:0.54,limonene:0.50,farnesene:0.29,linalool:0.24,humulene:0.17,guaiol:0.11,terpineol:0.08,nerolidol:0.04,alphaBisabolol:0.04}, totalTerpenes:3.10, price:6.07, rrp:85, sizes:["14g"], notes:"Myrcene-dominant at 0.87%. Strong softener stack. Evening/sleep despite hybrid classification." },
  { name:"Pouch Orange", brand:"Pouch", cultivar:"Ghost OG", thc:26, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{myrcene:0.72,caryophyllene:0.60,limonene:0.48,linalool:0.23,humulene:0.13,farnesene:0.13,nerolidol:0.04}, totalTerpenes:2.70, price:6.07, rrp:85, sizes:["14g"], notes:"Well-constructed indica. Suitable for evening/sleep." },
  { name:"Pouch Green", brand:"Pouch", cultivar:"GMO Zkittlez", thc:25, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.43,limonene:0.24,myrcene:0.22,selinaDiene41511:0.21,humulene:0.20,selinaDiene3711:0.19,betaPinene:0.11,linalool:0.11,germacreneB:0.05,alphaBisabolol:0.06,fenchyl:0.05,terpineol:0.05,farnesene:0.04}, totalTerpenes:2.18, price:6.07, rrp:85, sizes:["14g"], notes:"Sesquiterpene density inflates total figure without adding expressive quality." },
  // OTHER BRANDS
  { name:"Good Supply T26 Sativa", brand:"Good Supply", cultivar:"Purple Churro", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa", terpenes:{caryophyllene:0.51,limonene:0.37,linalool:0.35,myrcene:0.20,humulene:0.12,alphaBisabolol:0.06,pinene:0.06,nerolidol:0.04}, totalTerpenes:1.85, price:5.93, rrp:89, sizes:["15g"], notes:"⚠ DUPLICATE: Identical terpene fingerprint to Redecan PC T28 Sativa — same Purple Churro cultivar under Tilray umbrella. Better value at $89/15g." },
  { name:"Redecan PC T28 Sativa", brand:"Redecan", cultivar:"Purple Churro", thc:28, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa", terpenes:{caryophyllene:0.51,limonene:0.37,linalool:0.35,myrcene:0.20,humulene:0.12,alphaBisabolol:0.06,pinene:0.06,nerolidol:0.04}, totalTerpenes:1.85, price:7.33, rrp:110, sizes:["15g"], notes:"⚠ DUPLICATE of Good Supply T26 Sativa. Same flower, $21/15g premium, no justification." },
  { name:"Southern Sky Hybrid", brand:"—", cultivar:null, thc:26, cbd:1, category:"CBD Balanced", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.30,myrcene:0.30,caryophyllene:0.30,humulene:0.10,linalool:0.10,pinene:0.10}, totalTerpenes:1.20, price:null, rrp:null, sizes:[], notes:"Perfect three-way terpene balance at 0.30% each. CBD at ~1% as pharmacological stabiliser." },
  { name:"THC 27 Royale Sunflower", brand:"Tasmanian Botanics", cultivar:"GSC × OG Kush", thc:27, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica dominant", terpenes:{caryophyllene:0.82,humulene:0.39,limonene:0.36,myrcene:0.30,alphaBisabolol:0.27,linalool:0.25,betaPinene:0.05,caryophylleneOxide:0.03,alphaPinene:0.03}, totalTerpenes:2.57, price:5.27, rrp:79, sizes:["15g","28g"], notes:"Well-structured indica. Strong softener stack. More nuanced than typical myrcene-dominant sleep strains." },
  { name:"Althea THC 30 Sora", brand:"Althea", cultivar:null, thc:30, cbd:0, category:"Sleep / KO", status:"predicted", species:"Balanced Hybrid", terpenes:{caryophyllene:0.84,myrcene:0.67,limonene:0.37,humulene:0.25,linalool:0.14,alphaBisabolol:0.12}, totalTerpenes:2.75, price:7.97, rrp:239, sizes:["10g","30g"], notes:"Maximum caryophyllene anchor in database (0.84%). Body-heavy profile. High price per gram." },
  { name:"Skubi Blunicorn", brand:"Medical Cannabis Australia (MCA)", cultivar:null, thc:23, cbd:0, category:"Day / Functional", status:"predicted", species:"Balanced Hybrid", terpenes:{myrcene:1.01,limonene:0.94,alphaPinene:0.67,betaPinene:0.61,caryophyllene:0.46,ocimene:0.21,linalool:0.05}, totalTerpenes:4.47, price:null, rrp:null, sizes:[], notes:"Highest total terpene density in database (4.47%). Combined pinene wall (1.28%) competes with myrcene. Linalool critically thin (0.05%)." },
  { name:"Alta Vida Black Velvet", brand:"Alta Vida", cultivar:"Black Domina × Gelato 33 × Biscotti", thc:22, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{}, totalTerpenes:null, price:5.27, rrp:79, sizes:["15g"], notes:"Individual terpene % not disclosed. Caryophyllene confirmed dominant. Full COA pending." },
  { name:"Good Supply T26 Indica", brand:"Good Supply", cultivar:null, thc:26, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{alphaBisabolol:0.34,caryophyllene:0.30,limonene:0.14,linalool:0.11,myrcene:0.05}, totalTerpenes:1.24, price:5.93, rrp:89, sizes:["15g"], notes:"Bisabolol-dominant (0.34%) — only bisabolol-led strain in database. Out of stock as of Feb 2026." },
  { name:"Concessions 28 Sativa", brand:"Concessions", cultivar:"Grape", thc:28, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{limonene:0.86,alphaPinene:0.29,caryophyllene:0.29,betaPinene:0.20,myrcene:0.20,linalool:0.03}, totalTerpenes:2.13, price:7.93, rrp:119, sizes:["15g"], notes:"Highest limonene in database (0.86%). Linalool critically thin (0.03%) — anxiety risk for sensitive users at 28% THC." },
  // JUNE 2026 — VERIFIED BATCH
  { name:"BATHERA 25 Blue Z", brand:"BATHERA", cultivar:"Blue Z", thc:25, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica dominant", terpenes:{limonene:0.80,linalool:0.70,caryophyllene:0.60,myrcene:0.50,alphaPinene:0.40}, totalTerpenes:3.00, price:12.90, rrp:129, sizes:["10g"], notes:"Verified by Diego. Exceptional linalool depth (0.70%) — highest linalool in database. Best architecture at this price point. Bridge/sleep profile." },
  { name:"BATHERA 28 Facetz", brand:"BATHERA", cultivar:"Facetz", thc:28, cbd:0, category:"Day / Functional", status:"tried", species:"Indica dominant", terpenes:{limonene:0.96,myrcene:0.55,linalool:0.33,caryophyllene:0.22,betaPinene:0.17}, totalTerpenes:2.23, price:12.90, rrp:129, sizes:["10g"], notes:"Verified by Diego. Highest single limonene reading in database (0.96%). Weak caryophyllene anchor (0.22%) — strong lift, insufficient structure for some patients." },
  { name:"El Camino Mango Lemonade THC28", brand:"Alma Cannabis", cultivar:"Mango Lemonade", thc:28, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{terpinolene:2.30,limonene:0.46,myrcene:0.39,betaPinene:0.39,ocimene:0.37,alphaPinene:0.25,transCaryophyllene:0.19,terpineol:0.12,delta3Carene:0.11,phellandrene:0.10,alphaTerpinene:0.08,linalool:0.08}, totalTerpenes:4.83, price:6.60, rrp:99, sizes:["15g"], notes:"Verified by Diego. ⚠ HARD AVOID — terpinolene-dominant at 2.30%. High density (4.83%) misleading. Caryophyllene negligible at 0.19%. Linalool below minimum threshold. High anxiety risk profile." },
  { name:"Pouch Lilac", brand:"Pouch", cultivar:"Granddaddy Purple", thc:24, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica dominant", terpenes:{caryophyllene:0.77,limonene:0.34,humulene:0.31,linalool:0.19,myrcene:0.17,alphaBisabolol:0.09,terpineol:0.05,phytol:0.05,fenchol:0.05,betaPinene:0.04,caryophylleneOxide:0.03,farnesene:0.02,alphaPinene:0.02}, totalTerpenes:2.13, price:4.60, rrp:69, sizes:["15g"], notes:"Verified by Diego. Clean caryophyllene-led architecture (0.77%). Myrcene well suppressed. Currently out of stock — coming soon." },
  { name:"Pouch Tangerine", brand:"Pouch", cultivar:"Tangie Cookies", thc:23, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa", terpenes:{myrcene:0.41,limonene:0.29,caryophyllene:0.23,alphaBisabolol:0.11,linalool:0.09,humulene:0.08,betaPinene:0.07,phytol:0.06,terpineol:0.05,alphaPinene:0.05,fenchol:0.04,guaiol:0.02,caryophylleneOxide:0.02,farnesene:0.01}, totalTerpenes:1.53, price:null, rrp:null, sizes:["15g"], notes:"Verified by Diego. Myrcene leads on a classified sativa — structural mismatch. Thin density (1.53%). Currently out of stock — coming soon." },
];

// ── OPTION SETS WITH COMMON BADGES ──
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

// ── FIXED TERPENE BAR SCALE ──
const TERP_BAR_MAX = 1.3;

// ── SCORING ENGINE v3.2 — returns { score, reasons } ──
function scoreStrain(strain, answers) {
  if (!strain.totalTerpenes) return { score: -999, reasons: ["No terpene data available"] };
  let score = 0;
  const reasons = [];
  const t = strain.terpenes || {};
  const lim = t.limonene || 0;
  const car = (t.caryophyllene || 0) + (t.transCaryophyllene || 0);
  const myr = t.myrcene || 0;
  const lin = t.linalool || 0;
  const pin = (t.pinene || 0) + (t.alphaPinene || 0) + (t.betaPinene || 0);
  const far = t.farnesene || 0;
  const terp = t.terpinolene || 0;
  const bis = (t.bisabolol || 0) + (t.alphaBisabolol || 0);

  // Goal alignment
  if (answers.goal === "functional") {
    const g = Math.round(lim * 40 + car * 25 + pin * 20 - myr * 15);
    score += g;
    if (lim > 0.3 && car > 0.2) { score += 20; reasons.push("Limonene + caryophyllene synergy for functional clarity (+20)"); }
    if (lim > 0.4) reasons.push(`Strong limonene lift (${lim.toFixed(2)}%)`);
    if (myr > 0.5) reasons.push(`⚠ High myrcene (${myr.toFixed(2)}%) may reduce clarity`);
  }
  if (answers.goal === "creative") {
    const g = Math.round(car * 35 + far * 30 + lim * 20 + lin * 25);
    score += g;
    if (car > 0.3 && far > 0.15) { score += 15; reasons.push("Caryophyllene + farnesene synergy for deep thinking (+15)"); }
    if (far > 0.2) reasons.push(`Notable farnesene presence (${far.toFixed(2)}%) — smooth introspection`);
  }
  if (answers.goal === "pain") {
    const g = Math.round(car * 45 + myr * 25 + lin * 20 + bis * 15);
    score += g;
    if (car > 0.4) { score += 20; reasons.push(`Strong caryophyllene (${car.toFixed(2)}%) — associated with pain-related profiles in the terpene literature (+20)`); }
    if (lin > 0.15) reasons.push(`Linalool present (${lin.toFixed(2)}%) — present in sedation and pain-associated terpene profiles`);
  }
  if (answers.goal === "sleep") {
    const g = Math.round(myr * 45 + lin * 35 + bis * 20 - lim * 15 - pin * 10);
    score += g;
    if (myr > 0.5 && lin > 0.15) { score += 20; reasons.push("Myrcene + linalool synergy for sleep onset (+20)"); }
    if (lim > 0.4) reasons.push(`⚠ Limonene (${lim.toFixed(2)}%) may reduce sedation`);
  }
  if (answers.goal === "anxiety_relief") {
    const g = Math.round(lin * 40 + car * 30 + bis * 25 - terp * 30 - pin * 10);
    score += g;
    if (lin > 0.15 && car > 0.2) { score += 15; reasons.push("Linalool + caryophyllene anxiolytic synergy (+15)"); }
    if (terp > 0.3) reasons.push(`⚠ Terpinolene (${terp.toFixed(2)}%) may increase anxiety`);
  }

  // Contraindication penalties
  if (answers.avoid === "anxiety") {
    if (terp > 0.5) { score -= 40; reasons.push(`⚠ High terpinolene (${terp.toFixed(2)}%) — overstimulation risk (-40)`); }
    else if (terp > 0.3) { score -= 20; reasons.push(`⚠ Moderate terpinolene (${terp.toFixed(2)}%) — stimulation risk (-20)`); }
    if (lim > 0.6 && car < 0.2) { score -= 15; reasons.push("⚠ Unanchored limonene — no caryophyllene to stabilise (-15)"); }
  }
  if (answers.avoid === "sedation") {
    if (myr > 0.6 && lim < 0.2) { score -= 35; reasons.push(`⚠ High myrcene (${myr.toFixed(2)}%) without limonene — sedation risk (-35)`); }
    if (strain.totalTerpenes < 0.5) { score -= 25; reasons.push("⚠ Very low total terpenes — flat, empty experience (-25)"); }
  }
  if (answers.avoid === "paranoia") {
    if (strain.thc >= 28 && strain.totalTerpenes < 1.5) { score -= 30; reasons.push("⚠ High THC with low terpene structure — paranoia risk (-30)"); }
    if (terp > 0.5) { score -= 20; reasons.push(`⚠ High terpinolene — dissociation risk (-20)`); }
  }

  // THC bracket — graduated penalties
  const thc = strain.thc;
  if (answers.intensity === "low") {
    if (thc <= 20) { score += 15; reasons.push("THC in target low range (+15)"); }
    else if (thc <= 22) { score -= 5; reasons.push("THC slightly above low target (-5)"); }
    else if (thc <= 25) { score -= 15; reasons.push("⚠ THC above low target range (-15)"); }
    else { score -= 25; reasons.push("⚠ THC well above low target (-25)"); }
  } else if (answers.intensity === "moderate") {
    if (thc >= 20 && thc <= 25) { score += 15; reasons.push("THC in target moderate range (+15)"); }
    else if (thc < 18 || thc > 27) { score -= 10; reasons.push("THC outside moderate range (-10)"); }
  } else if (answers.intensity === "high") {
    if (thc >= 25 && thc <= 30) { score += 15; reasons.push("THC in target high range (+15)"); }
    else if (thc < 22) { score -= 15; reasons.push("⚠ THC below high target (-15)"); }
  } else if (answers.intensity === "very_high") {
    if (thc >= 30) { score += 20; reasons.push("THC at maximum potency (+20)"); }
    else if (thc >= 28) { score += 5; reasons.push("THC near very-high range (+5)"); }
    else { score -= 15; reasons.push("⚠ THC below very-high target (-15)"); }
  }

  // Experience level
  if (answers.experience === "naive") {
    if (thc > 25) { score -= 20; reasons.push("⚠ THC too high for cannabis-naive patient (-20)"); }
    if (strain.cbd > 0) { score += 15; reasons.push("CBD present — safer for naive patient (+15)"); }
  }
  if (answers.experience === "some") {
    if (strain.totalTerpenes >= 1.5 && strain.totalTerpenes <= 2.5) { score += 8; reasons.push("Balanced terpene density for moderate experience (+8)"); }
    if (thc > 28) { score -= 10; reasons.push("⚠ THC may be high for moderate experience (-10)"); }
    if (strain.cbd > 0) { score += 5; reasons.push("CBD presence adds safety margin (+5)"); }
  }
  if (answers.experience === "experienced") {
    if (strain.totalTerpenes > 2.0) { score += 10; reasons.push("Dense terpene profile rewards experience (+10)"); }
  }

  // Terpene density bonus
  if (strain.totalTerpenes >= 2.5) { score += 30; reasons.push(`High terpene density (${strain.totalTerpenes.toFixed(2)}%) — expressive profile (+30)`); }
  else if (strain.totalTerpenes >= 2.0) { score += 20; reasons.push(`Good terpene density (${strain.totalTerpenes.toFixed(2)}%) (+20)`); }
  else if (strain.totalTerpenes >= 1.5) { score += 10; reasons.push(`Moderate terpene density (${strain.totalTerpenes.toFixed(2)}%) (+10)`); }

  // Verified bonus
  if (strain.status === "tried") { score += 12; reasons.push("Clinically verified product (+12)"); }

  // Low terpene expression penalty
  if (strain.totalTerpenes < 0.5) {
    score -= 30;
    reasons.push("⚠ Very low terpene expression (" + strain.totalTerpenes.toFixed(2) + "%) — limited modulation of THC effects (-30)");
  }

  return { score: Math.round(score), reasons };
}

// Budget filter — null prices only pass on "any"
function budgetFilter(strain, budget) {
  if (budget === "any") return true;
  if (!strain.price) return false;
  if (budget === "economy") return strain.price < 8;
  if (budget === "mid") return strain.price >= 8 && strain.price <= 12;
  if (budget === "premium") return strain.price >= 12 && strain.price <= 16;
  return true;
}

// ── HELPERS ──
function getTopTerpenes(terpenes, n = 5) {
  return Object.entries(terpenes || {}).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, val]) => ({ name: formatTerpName(name), value: val }));
}
function formatTerpName(key) {
  const map = {
    limonene:"Limonene", caryophyllene:"β-Caryophyllene", transCaryophyllene:"β-Caryophyllene", myrcene:"Myrcene", linalool:"Linalool",
    pinene:"α-Pinene", alphaPinene:"α-Pinene", betaPinene:"β-Pinene", farnesene:"Farnesene", terpinolene:"Terpinolene",
    bisabolol:"α-Bisabolol", alphaBisabolol:"α-Bisabolol", humulene:"Humulene", ocimene:"Ocimene", terpineol:"Terpineol",
    guaiol:"Guaiol", nerolidol:"Nerolidol", transNerolidol:"trans-Nerolidol", cisNerolidol:"cis-Nerolidol",
    fenchol:"Fenchol", camphene:"Camphene", borneol:"Borneol", phytol:"Phytol", cedrene:"Cedrene",
    caryophylleneOxide:"Caryophyllene Oxide", fenchone:"Fenchone", geraniol:"Geraniol", sabinene:"Sabinene",
    betaCitronellol:"β-Citronellol", cymene:"Cymene", delta3Carene:"Δ3-Carene", eucalyptol:"Eucalyptol",
    isopulegol:"Isopulegol", gammaTerpinene:"γ-Terpinene", alphaTerpinene:"α-Terpinene",
    terpinen4ol:"Terpinen-4-ol", geranylAcetate:"Geranyl Acetate", phellandrene:"Phellandrene",
    alphaPhellandrene:"α-Phellandrene", terpinene:"Terpinene", selinaDiene3711:"Selina-3,7(11)-diene",
    selinaDiene41511:"Selina-4(15),7(11)-diene", germacreneB:"Germacrene B", transBergamotene:"trans-Bergamotene",
    eBetaOcimene:"E-β-Ocimene", gammaEudesmol:"γ-Eudesmol", gammaElemene:"γ-Elemene", gammaSelinene:"γ-Selinene",
    alphaSelinene:"α-Selinene", betaSelinene:"β-Selinene", fenchyl:"Fenchyl Alcohol",
    valencene:"Valencene", bulnesol:"Bulnesol", hexylHexanoate:"Hexyl Hexanoate", betaEudesmol:"β-Eudesmol",
    camphor:"Camphor", zBetaOcimene:"Z-β-Ocimene", betaCitronellol:"β-Citronellol",
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
function terpColor(name) {
  const n = name.toLowerCase();
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
  return "#888";
}
function catBadge(cat) {
  const colors = { "Day / Functional":"#2D7A4F", "Deep Think / Creative":"#5B4FA0", "Sleep / KO":"#3B5998", "Low Expression":"#666", "CBD Dominant":"#2E8B8B", "CBD Balanced":"#4A8B7A", "Unknown":"#666" };
  return colors[cat] || "#666";
}

// ── Answer label lookup ──
const ANSWER_LABELS = {
  goal: { functional:"Functional Clarity", creative:"Deep Thinking", pain:"Pain Management", sleep:"Sleep Support", anxiety_relief:"Anxiolytic" },
  avoid: { anxiety:"Avoid Overstimulation", sedation:"Avoid Sedation", paranoia:"Avoid Paranoia", none:"No Concerns" },
  intensity: { low:"Low THC", moderate:"Moderate THC", high:"High THC", very_high:"Very High THC" },
  experience: { naive:"Cannabis Naive", some:"Some Experience", experienced:"Experienced" },
  budget: { economy:"Under $8/g", mid:"$8–$12/g", premium:"$12–$16/g", any:"No Budget Constraint" },
};

// ── MAIN APP ──
export default function PrescriberDesktop() {
  const [view, setView] = useState("engine");
  const [theme, setTheme] = useState("light");
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
    { key:"goal", title:"Therapeutic Objective", subtitle:"Primary clinical goal for this patient", options:GOALS },
    { key:"avoid", title:"Contraindications", subtitle:"Adverse effects to minimise", options:AVOID },
    { key:"intensity", title:"THC Intensity", subtitle:"Desired potency bracket", options:INTENSITY },
    { key:"experience", title:"Patient Experience", subtitle:"Cannabis use history", options:EXPERIENCE },
    { key:"budget", title:"Budget Range", subtitle:"Target cost per gram", options:BUDGET },
  ];

  const computeResults = useCallback((a) => {
    const scored = strainDB
      .filter(s => s.totalTerpenes && s.status !== "incomplete" && s.status !== "held")
      .filter(s => budgetFilter(s, a.budget))
      .map(s => { const { score, reasons } = scoreStrain(s, a); return { ...s, score, reasons }; })
      .sort((a, b) => b.score - a.score);
    setResults(scored);
    setShowCount(8);
  }, []);

  function selectOption(key, val) { setPendingAnswer({ key, val }); }

  function confirmStep() {
    if (!pendingAnswer) return;
    const newAnswers = { ...answers, [pendingAnswer.key]: pendingAnswer.val };
    setAnswers(newAnswers);
    setPendingAnswer(null);
    if (step < 4) { setStep(step + 1); }
    else { setTimeout(() => computeResults(newAnswers), 100); }
  }

  function goBack() {
    if (step > 0) { setStep(step - 1); setPendingAnswer(null); }
  }

  function reset() {
    setStep(0); setAnswers({ goal:null, avoid:null, intensity:null, experience:null, budget:null });
    setPendingAnswer(null); setResults(null); setExpandedCard(null); setShowCount(8);
  }

  const libStrains = strainDB
    .filter(s => {
      if (libFilter === "all") return true;
      if (libFilter === "functional") return s.category === "Day / Functional";
      if (libFilter === "creative") return s.category === "Deep Think / Creative";
      if (libFilter === "sleep") return s.category === "Sleep / KO";
      if (libFilter === "cbd") return s.category === "CBD Dominant" || s.category === "CBD Balanced";
      if (libFilter === "lowexp") return s.category === "Low Expression";
      if (libFilter === "tried") return s.status === "tried";
      if (libFilter === "cbg") return s.cbg > 0;
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

  const currentPending = pendingAnswer?.key === steps[step]?.key ? pendingAnswer.val : null;
  const verifiedCount = strainDB.filter(s => s.status === "tried").length;
  const cbgCount = strainDB.filter(s => s.cbg > 0).length;
  const terpeneDataCount = strainDB.filter(s => s.totalTerpenes).length;

  return (
    <>
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: `
        * { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --bg:#EDF1EF; --surface:#FFFFFF; --surface-2:#F4F7F5; --surface-3:#E9EEEB;
          --ink:#16211F; --muted:#566561; --faint:#8C9A96;
          --border:#E2E8E5; --border-strong:#D2DBD7;
          --primary:#1E5F6B; --primary-strong:#16454E; --primary-soft:rgba(30,95,107,.08);
          --gold:#9C7C2A; --score:#9C7C2A; --gold-bright:#C9A84C;
          --verified:#2E7D5B; --verified-soft:rgba(46,125,91,.10);
          --danger:#C0563B;
          --shadow:0 1px 2px rgba(20,40,38,.04), 0 4px 16px rgba(20,40,38,.05);
          --shadow-lg:0 2px 6px rgba(20,40,38,.06), 0 18px 50px rgba(20,40,38,.10);
          --font-main: var(--font-dm-sans), 'DM Sans', -apple-system, sans-serif;
          --font-mono: var(--font-dm-mono), 'DM Mono', monospace;
          --bg-primary:var(--bg); --bg-secondary:var(--surface); --bg-tertiary:var(--surface-2);
          --bg-card:var(--surface); --bg-card-hover:var(--surface-2);
          --border-active:var(--primary); --text-primary:var(--ink);
          --text-secondary:var(--muted); --text-tertiary:var(--faint);
          --accent:var(--primary); --accent-dim:var(--primary-soft);
          --green:var(--verified); --red:var(--danger); --cbg:var(--verified);
          --cbg-dim:var(--verified-soft);
        }
        [data-theme="dark"] {
          --bg:#0A1316; --surface:#0F1C20; --surface-2:#15252A; --surface-3:#1B2F35;
          --ink:#E9EEEC; --muted:#94A5A1; --faint:#69807B;
          --border:#21343A; --border-strong:#2D444B;
          --primary:#56B7C6; --primary-strong:#7FCDD9; --primary-soft:rgba(86,183,198,.13);
          --gold:#D8BA63; --score:#D8BA63; --gold-bright:#D8BA63;
          --verified:#4FC08A; --verified-soft:rgba(79,192,138,.12);
          --danger:#E0795C;
          --shadow:0 1px 2px rgba(0,0,0,.3), 0 6px 22px rgba(0,0,0,.28);
          --shadow-lg:0 2px 8px rgba(0,0,0,.35), 0 22px 60px rgba(0,0,0,.5);
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes growBar { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        html, body { background: var(--bg); }
        body { color: var(--ink); font-family: var(--font-main); -webkit-font-smoothing: antialiased; }
        button, input, select { font: inherit; }
        .shell { display: flex; min-height: 100vh; background: var(--bg); color: var(--ink); transition: background .35s ease,color .35s ease; }
        .sidebar { width: 248px; flex: 0 0 248px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; z-index: 10; }
        .sidebar-brand { padding: 26px 24px 22px; border-bottom: 1px solid var(--border); }
        .brand-prescriber { font-size: 15px; font-weight: 600; letter-spacing: 0.17em; color: var(--ink); text-transform: uppercase; line-height: 1.1; }
        .brand-intelligence { font-size: 13px; font-weight: 300; letter-spacing: 0.17em; color: var(--primary); text-transform: uppercase; line-height: 1.2; margin-top: 2px; }
        .sidebar-brand p { font-size: 9.5px; color: var(--faint); margin-top: 9px; letter-spacing: 0.16em; text-transform: uppercase; font-family: var(--font-mono); }
        .sidebar-nav { padding: 16px 14px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 11px; width:100%; text-align:left; padding: 11px 13px; border-radius: 10px; cursor: pointer; font-size: 13.5px; font-weight: 500; color: var(--muted); transition: all 0.18s; margin-bottom: 4px; border: none; background: transparent; }
        .nav-item:hover { background: var(--surface-2); color: var(--ink); }
        .nav-item.active { background: var(--primary-soft); color: var(--primary); }
        .nav-icon { width: 20px; text-align: center; font-size: 16px; }
        .sidebar-footer { margin-top: auto; padding: 18px 22px; border-top: 1px solid var(--border); }
        .sidebar-footer p { font-size: 10.5px; color: var(--faint); font-family: var(--font-mono); line-height:1.9; }
        .main { flex: 1; min-width:0; height:100vh; overflow-y:auto; display:flex; flex-direction:column; }
        .topbar { height: 64px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 36px; background: color-mix(in srgb, var(--surface) 94%, transparent); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 20; }
        .topbar h2 { font-size: 16px; font-weight: 600; letter-spacing: 0; }
        .topbar-right { display:flex; align-items:center; gap:18px; }
        .topbar-meta { font-size: 11px; color: var(--faint); font-family: var(--font-mono); }
        .theme-toggle { height:34px; padding:0 13px; border-radius:9px; border:1px solid var(--border-strong); background:var(--surface-2); color:var(--ink); cursor:pointer; display:inline-flex; align-items:center; gap:7px; font-family:var(--font-mono); font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; }
        .content { flex:1; padding: 38px 40px 64px; max-width: 1400px; width:100%; }
        .content.engine-content { max-width:1120px; margin:0 auto; }
        .content.wide-content { max-width:1320px; margin:0 auto; }
        .step-progress { display: flex; align-items: center; margin-bottom: 40px; }
        .step-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; font-family: var(--font-mono); border: 1.5px solid var(--border-strong); color: var(--faint); background: transparent; flex-shrink: 0; transition: all 0.2s; }
        .step-circle.done { background: var(--primary); border-color: var(--primary); color: var(--surface); }
        .step-circle.current { border-color: var(--primary); color: var(--primary); background:var(--primary-soft); }
        .step-line { flex: 1; height: 1.5px; background: var(--border-strong); margin: 0 10px; transition: background 0.3s; border-radius:2px; }
        .step-line.done { background: var(--primary); }
        .step-header { margin-bottom: 32px; }
        .step-kicker { color:var(--primary); font-size:11px; font-family:var(--font-mono); letter-spacing:.16em; text-transform:uppercase; margin-bottom:10px; }
        .step-header h3 { font-size: 33px; font-weight: 600; margin-bottom: 8px; letter-spacing:0; }
        .step-header p { font-size: 15.5px; color: var(--muted); }
        .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(264px, 1fr)); gap: 14px; }
        .option-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.18s; position: relative; text-align:left; box-shadow:var(--shadow); }
        .option-card:hover { border-color: var(--border-strong); background: var(--surface); transform: translateY(-2px); }
        .option-card.pending { border-color: var(--primary); background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--primary), var(--shadow); }
        .option-card.pending::after { content:"✓"; position:absolute; top:14px; right:14px; width:20px; height:20px; border-radius:50%; background:var(--primary); color:var(--surface); display:flex; align-items:center; justify-content:center; font-size:12px; }
        .option-card h4 { font-size: 16.5px; font-weight: 600; margin-bottom: 5px; letter-spacing:0; padding-right:68px; }
        .option-card p { font-size: 13.5px; color: var(--muted); line-height: 1.45; }
        .common-badge { position: absolute; top: 14px; right: 14px; font-size: 8.5px; font-family:var(--font-mono); font-weight: 500; color: var(--gold); background: var(--surface-2); border:1px solid var(--border); padding: 3px 6px; border-radius: 5px; letter-spacing: 0; text-transform: uppercase; }
        .step-actions { display: flex; gap: 12px; margin-top: 28px; }
        .btn-primary { height:46px; background: var(--primary); border: 1px solid var(--primary); color: var(--surface); padding: 0 26px; border-radius: 11px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: var(--font-main); transition: all 0.15s; }
        .btn-primary:hover { filter: brightness(1.1); }
        .btn-primary:disabled { background:var(--surface-2); border-color:var(--border); color:var(--faint); cursor: not-allowed; filter: none; }
        .btn-secondary { height:46px; background: var(--surface); border: 1px solid var(--border-strong); color: var(--ink); padding: 0 20px; border-radius: 11px; cursor: pointer; font-size: 14px; font-family: var(--font-main); transition: all 0.15s; }
        .btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
        .profile-summary { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .profile-chip { font-size: 11px; font-family: var(--font-mono); color: var(--muted); background: var(--surface); border:1px solid var(--border); padding: 7px 12px; border-radius: 8px; }
        .profile-chip::before { content:""; display:inline-block; width:5px; height:5px; border-radius:50%; background:var(--primary); margin-right:8px; vertical-align:middle; }
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .results-header h3 { font-size: 31px; font-weight: 600; letter-spacing:0; }
        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 16px; animation:fadeUp .4s ease; }
        .strain-card { position:relative; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: visible; transition: all 0.15s; cursor: pointer; box-shadow:var(--shadow); }
        .strain-card:hover { box-shadow:var(--shadow-lg); }
        .strain-card.top { box-shadow: inset 0 0 0 1.5px var(--primary), var(--shadow); }
        .top-match { position:absolute; top:-10px; left:22px; font-family:var(--font-mono); font-size:9px; background:var(--primary); color:var(--surface); padding:4px 9px; border-radius:6px; text-transform:uppercase; letter-spacing:.04em; }
        .card-top { padding: 22px 22px 16px; display: flex; justify-content: space-between; align-items: flex-start; }
        .card-rank { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; font-family: var(--font-mono); background: var(--surface-2); border:1px solid var(--border); color: var(--muted); flex-shrink: 0; }
        .card-rank.gold { background: var(--primary-soft); color: var(--primary); }
        .card-info { flex: 1; margin-left: 16px; }
        .card-info h4 { font-size: 18px; font-weight: 600; margin-bottom: 2px; letter-spacing:0; }
        .card-info .brand { font-size: 12.5px; color: var(--muted); }
        .card-score { text-align: right; }
        .card-score .pts { font-size: 30px; font-weight: 500; font-family: var(--font-mono); color: var(--score); line-height:1; letter-spacing:0; }
        .card-score .label { font-size: 9px; color: var(--faint); text-transform: uppercase; letter-spacing: 0; font-family:var(--font-mono); margin-top:3px; }
        .card-meta { padding: 0 24px 16px; display: flex; gap: 10px; flex-wrap: wrap; }
        .meta-pill { font-size: 11px; font-family: var(--font-mono); color: var(--muted); background: var(--surface-2); border:1px solid var(--border); padding: 5px 9px; border-radius: 7px; }
        .meta-pill.cbg { color: var(--cbg); background: var(--cbg-dim); }
        .card-terpbar { padding: 0 24px 16px; }
        .terpbar-row { display: grid; grid-template-columns:118px 1fr 44px; align-items: center; gap: 10px; margin-bottom: 7px; }
        .terpbar-name { font-size: 11px; color: var(--muted); text-align: right; font-family: var(--font-mono); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .terpbar-track { height: 7px; background: var(--surface-3); border-radius: 4px; overflow: hidden; }
        .terpbar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; transform-origin:left; animation: growBar .6s ease; }
        .terpbar-val { font-size: 11px; color: var(--faint); font-family: var(--font-mono); text-align:right; }
        .card-cat { padding: 0 24px 16px; }
        .cat-badge { display: inline-block; font-size: 10.5px; font-weight: 500; font-family:var(--font-mono); padding: 4px 9px; border-radius: 7px; letter-spacing: 0; }
        .status-badge { display: inline-block; font-size: 10px; font-weight: 500; font-family:var(--font-mono); padding: 4px 8px; border-radius: 6px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0; }
        .card-expanded { padding: 0 24px 20px; border-top: 1px solid var(--border); margin-top: 4px; padding-top: 16px; }
        .rationale-list { list-style: none; padding: 0; }
        .rationale-list li { font-size: 13px; color: var(--muted); line-height: 1.7; padding: 3px 0; padding-left: 16px; position: relative; }
        .rationale-list li::before { content: "→"; position: absolute; left: 0; color: var(--faint); }
        .rationale-list li.warning { color: var(--red); }
        .rationale-list li.warning::before { content: "⚠"; color: var(--red); }
        .expanded-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .expanded-section h5 { font-size: 9.5px; font-weight: 500; color: var(--gold); font-family:var(--font-mono); text-transform: uppercase; letter-spacing: .14em; margin-bottom: 8px; }
        .expanded-section p { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .price-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; }
        .price-cell { background: var(--surface-2); padding: 8px 12px; border-radius: 6px; }
        .price-cell .price-label { font-size: 10px; color: var(--faint); text-transform: uppercase; letter-spacing: 0; font-family:var(--font-mono); }
        .price-cell .price-val { font-size: 14px; font-weight: 500; font-family: var(--font-mono); color: var(--ink); margin-top: 2px; }
        .show-more-wrap { text-align: center; margin-top: 24px; }
        .lib-controls { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; flex-wrap: wrap; }
        .lib-search { background: var(--surface); border: 1px solid var(--border-strong); color: var(--ink); padding: 0 14px; border-radius: 10px; font-size: 13.5px; font-family: var(--font-main); width: 300px; height:40px; outline: none; transition: border-color 0.15s; }
        .lib-search:focus { border-color: var(--primary); }
        .lib-search::placeholder { color: var(--faint); }
        .lib-select { background: var(--surface); border: 1px solid var(--border-strong); color: var(--ink); padding: 0 14px; height:40px; border-radius: 10px; font-size: 13px; font-family: var(--font-main); cursor: pointer; outline: none; }
        .lib-select option { background: var(--surface); }
        .lib-count { font-size: 12px; color: var(--muted); font-family: var(--font-mono); margin-left: auto; }
        .lib-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:auto; box-shadow:var(--shadow); }
        .lib-table { width: 100%; border-collapse: collapse; min-width:1060px; }
        .lib-table th { text-align: left; font-size: 9.5px; font-weight: 500; font-family:var(--font-mono); color: var(--faint); text-transform: uppercase; letter-spacing: 0.1em; padding: 14px 16px; border-bottom: 1px solid var(--border); background:var(--surface-2); }
        .lib-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: top; }
        .lib-table tr.clickable { cursor: pointer; }
        .lib-table tr.clickable:hover td { background: var(--surface-2); }
        .lib-table .name-cell { font-weight: 600; }
        .lib-table .brand-cell { color: var(--muted); font-size: 12px; }
        .lib-table .mono { font-family: var(--font-mono); font-size: 13px; }
        .lib-terp-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .lib-terp-pill { font-size: 10px; font-family: var(--font-mono); padding: 2px 6px; border-radius: 5px; white-space: nowrap; }
        .lib-expanded-row td { padding: 0 16px 20px; background: var(--surface); }
        .lib-expanded-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 16px 0; }
        .lib-expanded-inner .terpbar-row { margin-bottom: 4px; }
        .lib-exp-section h5 { font-size: 9.5px; font-weight: 500; color: var(--gold); text-transform: uppercase; letter-spacing: .14em; font-family:var(--font-mono); margin-bottom: 8px; }
        .lib-exp-section p { font-size: 13px; color: var(--muted); line-height: 1.6; }
        @media (max-width: 1024px) {
          .sidebar { width: 72px; }
          .brand-prescriber, .brand-intelligence, .sidebar-brand p, .nav-label, .sidebar-footer { display: none; }
          .sidebar-brand { padding: 20px 0; text-align: center; }
          .nav-item { justify-content: center; padding: 14px; }
          .content { padding: 24px; }
          .results-grid { grid-template-columns: 1fr; }
          .expanded-grid { grid-template-columns: 1fr; }
          .lib-expanded-inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; }
          .options-grid { grid-template-columns: 1fr; }
          .lib-controls { flex-direction: column; align-items: stretch; }
          .lib-search { width: 100%; }
        }
      ` }}
      />

      <div className="shell" data-theme={theme}>
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-prescriber">Prescriber</div>
            <div className="brand-intelligence">Intelligence</div>
            <p>Clinical Decision Support</p>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${view === "engine" ? "active" : ""}`} onClick={() => setView("engine")}>
              <span className="nav-icon">◎</span>
              <span className="nav-label">Prescribing Engine</span>
            </button>
            <button className={`nav-item ${view === "library" ? "active" : ""}`} onClick={() => setView("library")}>
              <span className="nav-icon">☰</span>
              <span className="nav-label">Product Library</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <p>{strainDB.length} products indexed</p>
            <p>{verifiedCount} clinically verified</p>
            <p>{cbgCount} with CBG data</p>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <h2>{view === "engine" ? "Prescribing Engine" : "Product Library"}</h2>
            <div className="topbar-right">
              <span className="topbar-meta">v3.5.3 — {strainDB.length} products · {verifiedCount} verified</span>
              <button className="theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
                <span>{theme === "light" ? "☾" : "☼"}</span>
                {theme === "light" ? "Dark" : "Light"}
              </button>
            </div>
          </div>

          <div className={`content ${view === "library" || results ? "wide-content" : "engine-content"}`}>
            {view === "engine" && !results && (
              <>
                <div className="step-progress">
                  {steps.map((s, i) => (
                    <Fragment key={i}>
                      <div className={`step-circle ${i < step ? "done" : i === step ? "current" : ""}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      {i < steps.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
                    </Fragment>
                  ))}
                </div>
                <div className="step-header">
                  <div className="step-kicker">Step {step + 1} / 5</div>
                  <h3>{steps[step].title}</h3>
                  <p>{steps[step].subtitle}</p>
                </div>
                <div className="options-grid">
                  {steps[step].options.map(opt => (
                    <div key={opt.id} className={`option-card ${currentPending === opt.id ? "pending" : ""}`} onClick={() => selectOption(steps[step].key, opt.id)}>
                      {opt.common && <span className="common-badge">Common</span>}
                      <h4>{opt.label}</h4>
                      <p>{opt.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="step-actions">
                  {step > 0 && <button className="btn-secondary" onClick={goBack}>← Back</button>}
                  <button className="btn-primary" disabled={!currentPending} onClick={confirmStep}>
                    {step < 4 ? "Continue →" : "Generate Recommendations"}
                  </button>
                </div>
              </>
            )}

            {view === "engine" && results && (
              <>
                <div className="results-header">
                  <div>
                    <h3>Prescribing Recommendations</h3>
                    <p style={{fontSize:13,color:"var(--text-secondary)",marginTop:4}}>{results.length} products scored against patient profile</p>
                  </div>
                  <button className="btn-secondary" onClick={reset}>New Assessment</button>
                </div>
                <div className="profile-summary">
                  {Object.entries(answers).map(([key, val]) => val && (
                    <span key={key} className="profile-chip">{ANSWER_LABELS[key]?.[val] || val}</span>
                  ))}
                </div>
                <div className="results-grid">
                  {results.slice(0, showCount).map((strain, idx) => {
                    const top = getTopTerpenes(strain.terpenes, 4);
                    const expanded = expandedCard === idx;
	                    return (
	                      <div key={idx} className={`strain-card ${idx < 3 ? "top" : ""}`} onClick={() => setExpandedCard(expanded ? null : idx)}>
	                        {idx === 0 && <div className="top-match">Top Match</div>}
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
                          {strain.cbg > 0 && <span className="meta-pill cbg">CBG {strain.cbg}%</span>}
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
                          <span className="cat-badge" style={{background: catBadge(strain.category) + "22", color: catBadge(strain.category)}}>{strain.category}</span>
	                          <span className="status-badge" style={{background: strain.status === "tried" ? "var(--verified-soft)" : "var(--surface-2)", color: strain.status === "tried" ? "var(--verified)" : "var(--faint)"}}>{strain.status === "tried" ? "✓ Verified" : "Predicted"}</span>
                        </div>
                        {expanded && (
                          <div className="card-expanded">
                            <div className="expanded-section" style={{marginBottom:16}}>
                              <h5>Why This Product Scored {strain.score > 0 ? "Well" : "Poorly"}</h5>
                              <ul className="rationale-list">
                                {strain.reasons.map((r, ri) => (
                                  <li key={ri} className={r.startsWith("⚠") ? "warning" : ""}>{r}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="expanded-grid">
                              <div className="expanded-section">
                                <h5>Clinical Notes</h5>
                                <p>{strain.notes}</p>
                              </div>
                              <div className="expanded-section">
                                <h5>Pricing</h5>
                                {strain.price ? (
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
                                ) : (
	                                  <p style={{color:"var(--faint)", fontStyle:"italic"}}>Price unavailable — personal/verified product</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {showCount < results.length && (
                  <div className="show-more-wrap">
                    <button className="btn-secondary" onClick={() => setShowCount(prev => prev + 8)}>
                      Show More ({results.length - showCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

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
                    <option value="lowexp">Low Expression</option>
                    <option value="tried">Clinically Verified</option>
                    <option value="cbg">Has CBG Data</option>
                  </select>
                  <select className="lib-select" value={libSort} onChange={e => setLibSort(e.target.value)}>
                    <option value="name">Sort: Name</option>
                    <option value="thc">Sort: THC ↓</option>
                    <option value="terpenes">Sort: Total Terpenes ↓</option>
                    <option value="price">Sort: Price ↑</option>
                  </select>
                  <span className="lib-count">{libStrains.length} products</span>
                </div>
	                <div className="lib-table-wrap">
	                <table className="lib-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>THC</th>
                      <th>CBD</th>
                      <th>CBG</th>
                      <th>Total Terps</th>
                      <th>Top Terpenes</th>
                      <th>Category</th>
                      <th>Price/g</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libStrains.map((s, i) => {
                      const top3 = getTopTerpenes(s.terpenes, 3);
                      const top8 = getTopTerpenes(s.terpenes, 8);
                      const isExpanded = libExpanded === i;
                      return (
                        <Fragment key={i}>
                          <tr className="clickable" onClick={() => setLibExpanded(isExpanded ? null : i)}>
                            <td>
                              <div className="name-cell">{s.name}</div>
                              <div className="brand-cell">{s.brand}{s.cultivar ? ` · ${s.cultivar}` : ""}</div>
                            </td>
                            <td className="mono">{s.thc}%</td>
                            <td className="mono">{s.cbd > 0 ? `${s.cbd}%` : "—"}</td>
                            <td className="mono" style={{color: s.cbg > 0 ? "var(--cbg)" : "var(--text-tertiary)"}}>{s.cbg > 0 ? `${s.cbg}%` : "—"}</td>
                            <td className="mono">{s.totalTerpenes ? `${s.totalTerpenes.toFixed(2)}%` : "—"}</td>
                            <td>
                              <div className="lib-terp-pills">
                                {top3.map((t, ti) => (
                                  <span key={ti} className="lib-terp-pill" style={{background: terpColor(t.name) + "33", color: terpColor(t.name)}}>{t.name} {t.value.toFixed(2)}</span>
                                ))}
                              </div>
                            </td>
                            <td><span className="cat-badge" style={{background: catBadge(s.category) + "22", color: catBadge(s.category), fontSize:11}}>{s.category}</span></td>
                            <td className="mono">{s.price ? `$${s.price.toFixed(2)}` : "—"}</td>
	                            <td><span className="status-badge" style={{background: s.status === "tried" ? "var(--verified-soft)" : "var(--surface-2)", color: s.status === "tried" ? "var(--verified)" : "var(--faint)"}}>{s.status === "tried" ? "✓ Verified" : "Predicted"}</span></td>
                          </tr>
                          {isExpanded && (
                            <tr className="lib-expanded-row">
                              <td colSpan={9}>
                                <div className="lib-expanded-inner">
                                  <div>
                                    <div className="lib-exp-section"><h5>Full Terpene Profile</h5></div>
                                    {top8.map((t, ti) => (
                                      <div key={ti} className="terpbar-row">
                                        <span className="terpbar-name">{t.name}</span>
                                        <div className="terpbar-track">
                                          <div className="terpbar-fill" style={{width:`${Math.min((t.value / TERP_BAR_MAX) * 100, 100)}%`, background: terpColor(t.name)}} />
                                        </div>
                                        <span className="terpbar-val">{t.value.toFixed(2)}%</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div>
                                    <div className="lib-exp-section">
                                      <h5>Clinical Notes</h5>
                                      <p>{s.notes}</p>
                                    </div>
                                    <div className="lib-exp-section" style={{marginTop:16}}>
                                      <h5>Details</h5>
                                      <p><strong>Species:</strong> {s.species}</p>
                                      {s.cbg > 0 && <p><strong>CBG:</strong> <span style={{color:"var(--cbg)"}}>{s.cbg}%</span></p>}
                                      {s.sizes?.length > 0 && <p><strong>Sizes:</strong> {s.sizes.join(", ")}</p>}
                                      {s.price && <p><strong>Price:</strong> ${s.price.toFixed(2)}/g (RRP ${s.rrp})</p>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
	                </table>
	                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
