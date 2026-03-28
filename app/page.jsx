"use client";
import { useState, useCallback, Fragment } from "react";

/* ============================================================
   TERPENE PRESCRIBER INTELLIGENCE v3.1
   Desktop-First Clinical Decision Support
   ============================================================ */

// ── STRAIN DATABASE (35 existing + 10 new = 45 total) ──
const strainDB = [
  // VERIFIED — status:"tried" means confirmed by patient outcome data
  { name:"IndiMed Tempo 26 Electric Honeydew", brand:"IndiMed", cultivar:"Electric Honeydew", thc:26, cbd:0, category:"Day / Functional", status:"tried", species:"Sativa dominant", terpenes:{limonene:0.8,caryophyllene:0.5,pinene:0.4,myrcene:0.2,linalool:0.1}, totalTerpenes:2.0, price:null, rrp:null, sizes:[], notes:"Benchmark intelligent sativa hybrid. Limonene-led with strong caryophyllene anchor." },
  { name:"Greenline Banjo", brand:"Greenline Therapy", cultivar:"Greenline Banjo", thc:26, cbd:0, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{limonene:0.65,caryophyllene:0.45,farnesene:0.3,pinene:0.25,myrcene:0.15}, totalTerpenes:1.8, price:null, rrp:null, sizes:[], notes:"Near-perfect day hybrid. Limonene + caryophyllene + farnesene." },
  { name:"El Camino Crystal Locomotive THC28", brand:"Alma Cannabis", cultivar:"Crystal Locomotive", thc:28, cbd:0, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{limonene:0.5,terpinolene:0.35,caryophyllene:0.4,myrcene:0.2}, totalTerpenes:1.45, price:null, rrp:null, sizes:[], notes:"Safe creative haze. Terpinolene present but anchored by caryophyllene." },
  { name:"Runtz Punch", brand:"MiniBuds", cultivar:"Runtz Punch", thc:28, cbd:0, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{caryophyllene:0.5,limonene:0.45,myrcene:0.4}, totalTerpenes:1.35, price:null, rrp:null, sizes:[], notes:"Reliable hybrid. Balanced caryophyllene + limonene." },
  { name:"Southern Sky Hybrid", brand:"Alfie Therapeutics", cultivar:"Southern Sky", thc:26, cbd:1, category:"Day / Functional", status:"tried", species:"Hybrid", terpenes:{myrcene:0.45,caryophyllene:0.4,limonene:0.35}, totalTerpenes:1.2, price:null, rrp:null, sizes:[], notes:"Patient outcome: ideal heavy-functional crossover. CBD + terpene balance provides structured effect." },
  { name:"MAC-1", brand:"Alfie Therapeutics", cultivar:"MAC-1", thc:22, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Hybrid", terpenes:{limonene:0.45,caryophyllene:0.4,farnesene:0.3,linalool:0.25}, totalTerpenes:1.4, price:null, rrp:null, sizes:[], notes:"Intellectual + emotional balance. Farnesene + linalool add depth." },
  { name:"Rosa 22:1", brand:"Kind Medical", cultivar:"Rosa", thc:22, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Hybrid", terpenes:{farnesene:0.55,caryophyllene:0.35,bisabolol:0.25,linalool:0.2,myrcene:0.15}, totalTerpenes:1.5, price:null, rrp:null, sizes:[], notes:"Unique body-aware deep state. Farnesene-led architecture." },
  { name:"Frost'd Flakes", brand:"Alma Cannabis", cultivar:"Frost'd Flakes", thc:30, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica", terpenes:{myrcene:0.7,caryophyllene:0.35,linalool:0.25}, totalTerpenes:1.3, price:null, rrp:null, sizes:[], notes:"Patient outcome: reliable sleep onset. Myrcene-led with linalool support." },
  { name:"Lemon Zkittlez", brand:"Munchiestash", cultivar:"Lemon Zkittlez", thc:28, cbd:0, category:"Deep Think / Creative", status:"tried", species:"Hybrid", terpenes:{limonene:0.7,myrcene:0.4,terpinolene:0.3}, totalTerpenes:1.4, price:null, rrp:null, sizes:[], notes:"Patient outcome: edge-case, slight overstimulation reported. Terpinolene may contribute." },
  { name:"East Coast Dank'z", brand:"Alma Cannabis", cultivar:"East Coast Dank'z", thc:25, cbd:0, category:"Low Expression", status:"tried", species:"Indica", terpenes:{myrcene:0.15}, totalTerpenes:0.15, price:null, rrp:null, sizes:[], notes:"Very low terpene expression (0.15%). Patient outcome: flat, undifferentiated effect reported. May suit patients seeking minimal cognitive modulation." },
  { name:"Blue Mountain THC25", brand:"Blue Mountain Global", cultivar:"Blue Mountain", thc:25, cbd:0, category:"Sleep / KO", status:"tried", species:"Indica", terpenes:{myrcene:0.7,limonene:0.05}, totalTerpenes:0.75, price:null, rrp:null, sizes:[], notes:"Myrcene-dominant (0.70%) with near-zero limonene. Patient outcome: one-note sedation reported. Suitable for sleep-focused profiles." },

  // CATALYST DATABASE
  { name:"Maali Sky", brand:"Maali", cultivar:"Royal Moby", thc:20, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{terpinolene:1.0,caryophyllene:0.5,myrcene:0.25}, totalTerpenes:1.75, price:12.90, rrp:129, sizes:["10g"], notes:"Terpinolene-dominant (1.0%). No limonene anchor. Monitor for overstimulation in anxiety-prone patients." },
  { name:"THC 23 Opal", brand:"Tasmanian Botanics", cultivar:"White Widow", thc:23, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{terpinolene:1.10,ocimene:0.32,myrcene:0.26,caryophyllene:0.25,limonene:0.16,betaPinene:0.11,alphaPinene:0.06,alphaTerpinene:0.04,delta3Carene:0.04,bisabolol:0.03,gammaTerpinene:0.02,terpineol:0.01,humulene:0.01}, totalTerpenes:2.41, price:null, rrp:null, sizes:["10g"], notes:"Terpinolene-dominant (1.10%) with very low limonene (0.16%). High total terpenes but stimulation risk without anchor. Monitor in anxiety-prone patients." },
  { name:"THC 25 Amethyst", brand:"Tasmanian Botanics", cultivar:"Wedding Cake x Animal Cookies", thc:25, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.67,limonene:0.44,caryophyllene:0.39,linalool:0.25,humulene:0.12,betaPinene:0.12,bisabolol:0.11,alphaPinene:0.08,terpineol:0.04,camphene:0.02}, totalTerpenes:2.24, price:9.90, rrp:99, sizes:["10g","30g","28g"], notes:"Strong profile. Pattern-matches Southern Sky but denser." },
  { name:"Iris 21:1", brand:"Kind Medical", cultivar:"Black Cherry Punch", thc:21, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.32,farnesene:0.27,caryophyllene:0.26,myrcene:0.21,linalool:0.16,guaiol:0.09,humulene:0.08,betaPinene:0.05,alphaPinene:0.03,terpineol:0.03,fenchol:0.03,camphene:0.01,nerolidol:0.01,terpinolene:0.01,caryophylleneOxide:0.01,fenchone:0.01}, totalTerpenes:1.58, price:12.00, rrp:120, sizes:["10g"], notes:"Similar architecture to MAC-1. Strong deep-think candidate." },
  { name:"IndiMed Tempo 19", brand:"IndiMed", cultivar:"Delahaze", thc:19, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa", terpenes:{terpinolene:1.19,myrcene:0.54,ocimene:0.35,alphaPinene:0.19,caryophyllene:0.15}, totalTerpenes:2.98, price:6.60, rrp:99, sizes:["15g"], notes:"Terpinolene-dominant (1.19%) with high myrcene (0.54%). No limonene. Complex interaction — may overstimulate or sedate unpredictably." },
  { name:"Bazookas", brand:"Mediquest", cultivar:"Bazookas", thc:30, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.84,caryophyllene:0.48,humulene:0.24,linalool:0.22,ocimene:0.20}, totalTerpenes:2.56, price:16.50, rrp:165, sizes:["10g"], notes:"Limonene-dominant. Pattern-matches Electric Honeydew at 30% THC." },
  { name:"THC 27 Royale Sunflower", brand:"Tasmanian Botanics", cultivar:"GSC x OG Kush", thc:27, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.82,humulene:0.39,limonene:0.36,myrcene:0.30,bisabolol:0.27}, totalTerpenes:2.57, price:5.27, rrp:79, sizes:["15g","28g","30g"], notes:"Caryophyllene-dominant. Deep body-think. Incredible value." },
  { name:"Azure 17:1", brand:"Kind Medical", cultivar:"Blue Dream", thc:17, cbd:0, category:"Day / Functional", status:"predicted", species:"Sativa dominant", terpenes:{myrcene:0.74,alphaPinene:0.22,caryophyllene:0.21,farnesene:0.19,betaPinene:0.08}, totalTerpenes:1.78, price:12.00, rrp:120, sizes:["10g"], notes:"Myrcene-dominant. No limonene. Gentle but risks flatness." },
  { name:"Cultiva Lee Anne Womac", brand:"Cultiva", cultivar:"Lee Anne WoMAC", thc:24, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Balanced Hybrid", terpenes:{terpinolene:0.76,caryophyllene:0.31,farnesene:0.27,linalool:0.14,limonene:0.14}, totalTerpenes:2.34, price:15.90, rrp:159, sizes:["10g"], notes:"Terpinolene-led but better anchored than others. CBG (2%) notable." },
  { name:"Varaski T26", brand:"Entoura", cultivar:"Proprietary", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.90,limonene:0.35,caryophyllene:0.24,humulene:0.09,betaPinene:0.08,guaiol:0.08,bisabolol:0.07,linalool:0.06,alphaPinene:0.06,terpineol:0.05,nerolidol:0.02,camphene:0.01,caryophylleneOxide:0.01,borneol:0.01,terpinolene:0.005,fenchone:0.005,ocimene:0.005}, totalTerpenes:2.04, price:9.67, rrp:145, sizes:["15g"], notes:"Myrcene-dominant. Some structure from limonene+caryophyllene. Borderline." },
  { name:"Pouch Red", brand:"Pouch", cultivar:"Black Cherry Pie", thc:27, cbd:0, category:"Day / Functional", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.53,caryophyllene:0.20,myrcene:0.19,linalool:0.13,humulene:0.09,betaPinene:0.09,guaiol:0.07,alphaPinene:0.05,bisabolol:0.03,camphene:0.01}, totalTerpenes:1.39, price:6.07, rrp:85, sizes:["14g"], notes:"Limonene-led with low myrcene. Clean functional profile. Great value." },
  { name:"MEDCAN Cold Creek Afghan Kush", brand:"MEDCAN Australia", cultivar:"Afghan Kush", thc:24, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{myrcene:0.86,ocimene:0.24,caryophyllene:0.13,cedrene:0.11,limonene:0.07}, totalTerpenes:1.70, price:12.90, rrp:129, sizes:["10g"], notes:"Myrcene-dominant (0.86%) with minimal limonene (0.07%). Predicted: heavy sedation profile." },
  { name:"IndiMed Tempo 26 Sourdough", brand:"IndiMed", cultivar:"Sourdough", thc:26, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.58,limonene:0.39,farnesene:0.37,myrcene:0.25}, totalTerpenes:2.27, price:6.60, rrp:99, sizes:["15g"], notes:"Near-identical architecture to MAC-1 but stronger. Excellent deep-think. Great value." },
  { name:"MEDCAN Strawberry Cake", brand:"MEDCAN Australia", cultivar:"Strawberry Cake", thc:22, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{terpinolene:0.86,myrcene:0.47,ocimene:0.36,limonene:0.13,terpineol:0.10,bisabolol:0.09,betaPinene:0.09,caryophyllene:0.07,alphaPinene:0.07,terpinene:0.05,phellandrene:0.04,guaiol:0.04,fenchol:0.03,humulene:0.01,nerolidol:0.01,caryophylleneOxide:0.01}, totalTerpenes:2.43, price:13.90, rrp:139, sizes:["10g"], notes:"Terpinolene-dominant (0.86%) with minimal caryophyllene (0.07%) and limonene (0.13%). Low anchor. Monitor in anxiety-prone patients." },
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

  // NEW — BATCH 28 March 2026
  { name:"Australian Natural Mariposa", brand:"ANTG", cultivar:null, thc:16, cbd:0, category:"Day / Functional", status:"predicted", species:"Balanced Hybrid", terpenes:{limonene:0.17,caryophyllene:0.17,selinaDiene3711:0.15,selinaDiene41511:0.11,humulene:0.08,myrcene:0.07,betaPinene:0.07,alphaPinene:0.04,germacreneB:0.03}, totalTerpenes:0.89, price:12.90, rrp:129, sizes:["10g"], notes:"Unusual terpene profile dominated by sesquiterpenes — selinaDiene3711 (0.15%) and selinaDiene41511 (0.11%). Limonene and caryophyllene tied at lead (0.17% each). Moderate total terpenes (0.89%). Balanced hybrid. Day / Functional predicted." },
  { name:"Aura Therapeutics Apples & Bananas", brand:"AURA Therapeutics", cultivar:"Apples and Bananas", thc:25, cbd:2, category:"Sleep / KO", status:"predicted", species:"Sativa dominant", terpenes:{myrcene:2.12,ocimene:0.63,alphaPinene:0.53,caryophyllene:0.30,linalool:0.13,betaPinene:0.13,humulene:0.11,limonene:0.08,selinaDiene3711:0.07,alphaBisabolol:0.04,transNerolidol:0.02,betaCitronellol:0.02,farnesene:0.01,camphene:0.01,terpineol:0.01,fenchyl:0.01}, totalTerpenes:4.22, price:14.90, rrp:149, sizes:["10g","20g"], notes:"Myrcene-dominant at 2.12%. Total terpenes 4.22% — highest in the database. Ocimene prominent (0.63%). Despite sativa classification, myrcene dominance strongly predicts sedative effect. Sleep / KO." },
  { name:"Cannatrek T22 Jasmin", brand:"Cannatrek", cultivar:"Night Queen", thc:22, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica", terpenes:{caryophyllene:0.23,myrcene:0.15,humulene:0.10,limonene:0.08,linalool:0.04}, totalTerpenes:0.60, price:13.50, rrp:135, sizes:["10g"], notes:"Low total terpenes (0.60%). Caryophyllene-led with myrcene support. Patient data confirms strong night-use: 92% night, 0% day. Cultivar name Night Queen consistent with sleep profile. Sleep / KO." },
  { name:"Libra 7:7", brand:"Kind Medical", cultivar:"Pennywise", thc:7, cbd:7, category:"CBD Balanced", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.24,guaiol:0.14,terpinolene:0.14,alphaPinene:0.12,transCaryophyllene:0.11,betaPinene:0.05,humulene:0.04,farnesene:0.03,linalool:0.03,limonene:0.02,terpineol:0.01,transNerolidol:0.01,alphaPhellandrene:0.01,caryophylleneOxide:0.01,delta3Carene:0.01,terpinene:0.01}, totalTerpenes:0.98, price:12.00, rrp:120, sizes:["10g"], notes:"Balanced 7:7 THC:CBD. Three-way lead: myrcene (0.24%), guaiol (0.14%), terpinolene (0.14%). Terpinolene present at meaningful level — CBD content partially offsets anxiety risk in sensitive patients. CBD Balanced." },
  { name:"West Coast Palms Hawaiian Rain", brand:"West Coast Palms", cultivar:"Hawaiian Rain", thc:26, cbd:0, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.54,caryophyllene:0.36,myrcene:0.32,linalool:0.23,selinaDiene41511:0.20,germacreneB:0.20,gammaElemene:0.17,transBergamotene:0.15,betaPinene:0.12,fenchol:0.10,humulene:0.09,farnesene:0.09,alphaPinene:0.08,hexylHexanoate:0.06,terpineol:0.05,eBetaOcimene:0.05,fenchyl:0.05,gammaSelinene:0.04,betaSelinene:0.02,betaEudesmol:0.02,borneol:0.02,transNerolidol:0.02,camphene:0.02,alphaSelinene:0.02,fenchone:0.01,camphor:0.01,caryophylleneOxide:0.01,gammaEudesmol:0.01,cedrene:0.01,terpinolene:0.01,bulnesol:0.01,zBetaOcimene:0.01,alphaBisabolol:0.01}, totalTerpenes:3.15, price:15.00, rrp:150, sizes:["10g"], notes:"Most complex terpene profile in the database — 30+ terpenes. Limonene-led (0.54%) with strong caryophyllene (0.36%) and myrcene (0.32%). Day / Functional despite indica species. Rich sesquiterpene content throughout. Terpinolene at trace (0.01%) only." },
  { name:"Australian Natural Eve CBD16", brand:"ANTG", cultivar:null, thc:1, cbd:16, category:"CBD Dominant", status:"predicted", species:"Indica dominant", terpenes:{myrcene:0.33,caryophyllene:0.17,terpinolene:0.14,limonene:0.09,betaPinene:0.09,delta3Carene:0.05,alphaPinene:0.05,linalool:0.04,alphaTerpinene:0.02}, totalTerpenes:0.98, price:17.90, rrp:179, sizes:["10g"], notes:"CBD dominant (<1% THC, 16% CBD). Myrcene-led (0.33%) with notable terpinolene (0.14%) — CBD content likely moderates terpinolene anxiety risk. Most expensive per gram in this batch at $17.90/g. Patient data: 0% day, 33% night, 66% both." },
  { name:"Thea 25:1", brand:"Kind Medical", cultivar:"Berry Cream Puff", thc:25, cbd:1, category:"Deep Think / Creative", status:"predicted", species:"Sativa dominant", terpenes:{transCaryophyllene:0.85,limonene:0.44,farnesene:0.41,humulene:0.18,alphaBisabolol:0.14,myrcene:0.14,guaiol:0.12,linalool:0.10,betaPinene:0.07,fenchol:0.06,alphaPinene:0.05,terpineol:0.05,camphene:0.02,caryophylleneOxide:0.01,ocimene:0.01,terpinolene:0.01,borneol:0.01}, totalTerpenes:2.67, price:12.00, rrp:120, sizes:["10g"], notes:"Caryophyllene-led (0.85%) with strong farnesene (0.41%) and limonene (0.44%). Classic Deep Think / Creative architecture. Total terpenes 2.67%. Sativa dominant. Terpinolene at trace (0.01%) — no concern." },
  { name:"Gas Cake", brand:"Mediquest", cultivar:"Gas Cake", thc:31, cbd:0, category:"Sleep / KO", status:"predicted", species:"Indica dominant", terpenes:{myrcene:1.98,caryophyllene:0.27,limonene:0.25,linalool:0.19,selinaDiene41511:0.19,selinaDiene3711:0.17,germacreneB:0.15,transBergamotene:0.13,cisNerolidol:0.08,eBetaOcimene:0.06,betaPinene:0.06,farnesene:0.04,alphaBisabolol:0.03,alphaPinene:0.02,terpineol:0.02,fenchyl:0.02,gammaEudesmol:0.02,transNerolidol:0.01,valencene:0.01,camphene:0.01}, totalTerpenes:3.67, price:16.50, rrp:165, sizes:["10g"], notes:"Myrcene-dominant at 1.98%. THC 31% — joint highest in database. Total terpenes 3.67% — second highest overall. Heavy sedative architecture. Sleep / KO." },
  { name:"Alma Cannabis Grape Galena", brand:"Alma Cannabis", cultivar:"Grape Galena", thc:25, cbd:0, category:"Deep Think / Creative", status:"predicted", species:"Indica", terpenes:{limonene:0.88,caryophyllene:0.70,myrcene:0.49,linalool:0.26,farnesene:0.21,selinaDiene3711:0.20,humulene:0.20,germacreneB:0.15,selinaDiene41511:0.14,betaPinene:0.14,alphaBisabolol:0.11}, totalTerpenes:3.48, price:14.90, rrp:149, sizes:["10g"], notes:"Limonene-led (0.88%) with strong caryophyllene (0.70%) and farnesene (0.21%). Classic Deep Think / Creative architecture despite indica classification. High total terpenes (3.48%)." },
  { name:"Chemovar Daily Grape", brand:"Chemovar", cultivar:"Daily Grape", thc:28, cbd:0, cbg:2, category:"Day / Functional", status:"predicted", species:"Indica dominant", terpenes:{limonene:0.86,farnesene:0.48,transCaryophyllene:0.40,linalool:0.20,alphaBisabolol:0.12,guaiol:0.11,terpineol:0.10,humulene:0.10,betaPinene:0.08,alphaPinene:0.08,fenchyl:0.08,fenchol:0.06,caryophylleneOxide:0.05,sabinene:0.05,fenchone:0.05,gammaTerpinene:0.05,myrcene:0.05,camphene:0.04,borneol:0.01,terpinolene:0.01}, totalTerpenes:2.98, price:12.80, rrp:128, sizes:["10g"], notes:"Limonene-led (0.86%) with strong farnesene (0.48%) and caryophyllene (0.40%). Day / Functional. First database entry with CBG field (cbg: 2). Total terpenes 2.98%. Good price point at $12.80/g. Terpinolene at trace (0.01%) — no concern." },
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

// ── SCORING ENGINE v3 — returns { score, reasons } ──
function scoreStrain(strain, answers) {
  if (!strain.totalTerpenes || strain.category === "Unknown") return { score: -999, reasons: ["No terpene data available"] };
  let score = 0;
  const reasons = [];
  const t = strain.terpenes || {};
  const lim = t.limonene || 0, car = (t.caryophyllene || 0) + (t.transCaryophyllene || 0), myr = t.myrcene || 0;
  const lin = t.linalool || 0, pin = (t.pinene || 0) + (t.alphaPinene || 0) + (t.betaPinene || 0);
  const far = t.farnesene || 0, terp = t.terpinolene || 0, bis = (t.bisabolol || 0) + (t.alphaBisabolol || 0);

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

  // Contraindication penalties — terpinolene no longer double-dips
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
    caryophylleneOxide:"Caryophyllene Oxide", fenchone:"Fenchone", geraniol:"Geraniol",
    betaCitronellol:"β-Citronellol", cymene:"Cymene", delta3Carene:"Δ3-Carene", eucalyptol:"Eucalyptol",
    isopulegol:"Isopulegol", gammaTerpinene:"γ-Terpinene", alphaTerpinene:"α-Terpinene",
    terpinen4ol:"Terpinen-4-ol", geranylAcetate:"Geranyl Acetate", phellandrene:"Phellandrene",
    terpinene:"Terpinene", selinaDiene3711:"Selina-3,7(11)-diene", selinaDiene41511:"Selina-4(15),7(11)-diene",
    germacreneB:"Germacrene B", transBergamotene:"trans-Bergamotene", eBetaOcimene:"E-β-Ocimene",
    gammaEudesmol:"γ-Eudesmol", gammaElemene:"γ-Elemene", gammaSelinene:"γ-Selinene",
    alphaSelinene:"α-Selinene", betaSelinene:"β-Selinene", sabinene:"Sabinene", fenchyl:"Fenchyl Alcohol",
    gammaTerpinene:"γ-Terpinene", alphaPhellandrene:"α-Phellandrene", valencene:"Valencene",
    bulnesol:"Bulnesol", borneol:"Borneol", hexylHexanoate:"Hexyl Hexanoate", betaEudesmol:"β-Eudesmol",
    camphor:"Camphor", zBetaOcimene:"Z-β-Ocimene", transCaryophyllene:"β-Caryophyllene",
    alphaBisabolol:"α-Bisabolol", cisNerolidol:"cis-Nerolidol", gammaEudesmol:"γ-Eudesmol",
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
      .filter(s => s.totalTerpenes && s.category !== "Unknown")
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

  // Library
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
          --border-active: rgba(196,163,90,0.4);
          --text-primary: rgba(255,255,255,0.92);
          --text-secondary: rgba(255,255,255,0.68);
          --text-tertiary: rgba(255,255,255,0.48);
          --accent: #C4A35A;
          --accent-dim: rgba(196,163,90,0.15);
          --green: #4CAF7D;
          --red: #C45A5A;
          --cbg: #7EC8A4;
          --cbg-dim: rgba(126,200,164,0.15);
          --font-main: 'DM Sans', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }
        body { background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-main); -webkit-font-smoothing: antialiased; }

        .shell { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background: var(--bg-secondary); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 10; }
        .sidebar-brand { padding: 28px 24px 20px; border-bottom: 1px solid var(--border); }
        .sidebar-brand h1 { font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: var(--accent); text-transform: uppercase; }
        .sidebar-brand p { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; letter-spacing: 0.3px; }
        .sidebar-nav { padding: 16px 12px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-secondary); transition: all 0.15s; margin-bottom: 4px; }
        .nav-item:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .nav-item.active { background: var(--accent-dim); color: var(--accent); }
        .nav-icon { width: 20px; text-align: center; font-size: 16px; }
        .sidebar-footer { padding: 16px 24px; border-top: 1px solid var(--border); }
        .sidebar-footer p { font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono); }

        .main { margin-left: 260px; flex: 1; min-height: 100vh; }
        .topbar { height: 64px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: var(--bg-secondary); position: sticky; top: 0; z-index: 5; }
        .topbar h2 { font-size: 16px; font-weight: 600; }
        .topbar-meta { font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono); }
        .content { padding: 40px; max-width: 1400px; }

        .step-progress { display: flex; align-items: center; margin-bottom: 40px; }
        .step-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; font-family: var(--font-mono); border: 2px solid var(--border); color: var(--text-tertiary); background: transparent; flex-shrink: 0; transition: all 0.2s; }
        .step-circle.done { background: var(--accent); border-color: var(--accent); color: #0C0F14; }
        .step-circle.current { border-color: var(--accent); color: var(--accent); }
        .step-line { flex: 1; height: 2px; background: var(--border); margin: 0 8px; transition: background 0.3s; }
        .step-line.done { background: var(--accent); }

        .step-header { margin-bottom: 32px; }
        .step-header h3 { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
        .step-header p { font-size: 14px; color: var(--text-secondary); }

        .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .option-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 20px 24px; cursor: pointer; transition: all 0.15s; position: relative; }
        .option-card:hover { border-color: var(--border-active); background: var(--bg-card-hover); transform: translateY(-1px); }
        .option-card.pending { border-color: var(--accent); background: var(--accent-dim); }
        .option-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
        .option-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
        .common-badge { position: absolute; top: 12px; right: 12px; font-size: 9px; font-weight: 700; color: var(--accent); background: var(--accent-dim); padding: 2px 7px; border-radius: 3px; letter-spacing: 0.8px; text-transform: uppercase; }

        .step-actions { display: flex; gap: 12px; margin-top: 28px; }

        .btn-primary { background: var(--accent); border: 1px solid var(--accent); color: #0C0F14; padding: 10px 28px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: var(--font-main); transition: all 0.15s; }
        .btn-primary:hover { filter: brightness(1.1); }
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; filter: none; }
        .btn-secondary { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); padding: 10px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-family: var(--font-main); transition: all 0.15s; }
        .btn-secondary:hover { border-color: var(--accent); color: var(--text-primary); }

        .profile-summary { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .profile-chip { font-size: 12px; font-family: var(--font-mono); color: var(--accent); background: var(--accent-dim); padding: 5px 12px; border-radius: 5px; }

        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .results-header h3 { font-size: 22px; font-weight: 700; }

        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px; }
        .strain-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; transition: all 0.15s; cursor: pointer; }
        .strain-card:hover { border-color: rgba(255,255,255,0.14); }
        .strain-card.top { border-color: var(--border-active); }
        .card-top { padding: 20px 24px 16px; display: flex; justify-content: space-between; align-items: flex-start; }
        .card-rank { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; font-family: var(--font-mono); background: var(--bg-tertiary); color: var(--text-secondary); flex-shrink: 0; }
        .card-rank.gold { background: var(--accent-dim); color: var(--accent); }
        .card-info { flex: 1; margin-left: 16px; }
        .card-info h4 { font-size: 17px; font-weight: 600; margin-bottom: 2px; }
        .card-info .brand { font-size: 12px; color: var(--text-tertiary); }
        .card-score { text-align: right; }
        .card-score .pts { font-size: 24px; font-weight: 700; font-family: var(--font-mono); color: var(--accent); }
        .card-score .label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; }

        .card-meta { padding: 0 24px 16px; display: flex; gap: 10px; flex-wrap: wrap; }
        .meta-pill { font-size: 12px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--bg-tertiary); padding: 4px 10px; border-radius: 4px; }
        .meta-pill.cbg { color: var(--cbg); background: var(--cbg-dim); }

        .card-terpbar { padding: 0 24px 16px; }
        .terpbar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .terpbar-name { font-size: 12px; color: var(--text-secondary); width: 110px; text-align: right; font-family: var(--font-mono); flex-shrink: 0; }
        .terpbar-track { flex: 1; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
        .terpbar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        .terpbar-val { font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono); width: 44px; flex-shrink: 0; }

        .card-cat { padding: 0 24px 16px; }
        .cat-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 4px; letter-spacing: 0.3px; }
        .status-badge { display: inline-block; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 3px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

        .card-expanded { padding: 0 24px 20px; border-top: 1px solid var(--border); margin-top: 4px; padding-top: 16px; }
        .rationale-list { list-style: none; padding: 0; }
        .rationale-list li { font-size: 13px; color: var(--text-secondary); line-height: 1.7; padding: 3px 0; padding-left: 16px; position: relative; }
        .rationale-list li::before { content: "→"; position: absolute; left: 0; color: var(--text-tertiary); }
        .rationale-list li.warning { color: var(--red); }
        .rationale-list li.warning::before { content: "⚠"; color: var(--red); }
        .expanded-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .expanded-section h5 { font-size: 12px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .expanded-section p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
        .price-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; }
        .price-cell { background: var(--bg-tertiary); padding: 8px 12px; border-radius: 6px; }
        .price-cell .price-label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.3px; }
        .price-cell .price-val { font-size: 14px; font-weight: 600; font-family: var(--font-mono); color: var(--text-primary); margin-top: 2px; }

        .show-more-wrap { text-align: center; margin-top: 24px; }

        .lib-controls { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; flex-wrap: wrap; }
        .lib-search { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); padding: 10px 16px; border-radius: 8px; font-size: 14px; font-family: var(--font-main); width: 300px; outline: none; transition: border-color 0.15s; }
        .lib-search:focus { border-color: var(--accent); }
        .lib-search::placeholder { color: var(--text-tertiary); }
        .lib-select { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-family: var(--font-main); cursor: pointer; outline: none; }
        .lib-select option { background: var(--bg-secondary); }
        .lib-count { font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono); margin-left: auto; }

        .lib-table { width: 100%; border-collapse: collapse; }
        .lib-table th { text-align: left; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .lib-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: top; }
        .lib-table tr.clickable { cursor: pointer; }
        .lib-table tr.clickable:hover td { background: var(--bg-card-hover); }
        .lib-table .name-cell { font-weight: 600; }
        .lib-table .brand-cell { color: var(--text-secondary); font-size: 12px; }
        .lib-table .mono { font-family: var(--font-mono); font-size: 13px; }
        .lib-terp-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .lib-terp-pill { font-size: 10px; font-family: var(--font-mono); padding: 2px 6px; border-radius: 3px; color: rgba(255,255,255,0.85); white-space: nowrap; }

        .lib-expanded-row td { padding: 0 16px 20px; background: var(--bg-card); }
        .lib-expanded-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 16px 0; }
        .lib-expanded-inner .terpbar-row { margin-bottom: 4px; }
        .lib-exp-section h5 { font-size: 12px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .lib-exp-section p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

        @media (max-width: 1024px) {
          .sidebar { width: 72px; }
          .sidebar-brand h1, .sidebar-brand p, .nav-label, .sidebar-footer { display: none; }
          .sidebar-brand { padding: 20px 0; text-align: center; }
          .nav-item { justify-content: center; padding: 14px; }
          .main { margin-left: 72px; }
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
      `}</style>

      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h1>Prescriber Intelligence</h1>
            <p>Clinical Decision Support</p>
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
            <p style={{marginTop:4}}>{strainDB.filter(s=>s.status==="tried").length} clinically verified</p>
            <p style={{marginTop:4}}>{strainDB.filter(s=>s.cbg>0).length} with CBG data</p>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <h2>{view === "engine" ? "Prescribing Engine" : "Product Library"}</h2>
            <span className="topbar-meta">v3.1 — {strainDB.length} products • {strainDB.filter(s=>s.totalTerpenes).length} with terpene data</span>
          </div>

          <div className="content">
            {/* ── ENGINE: QUESTIONNAIRE ── */}
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
                  <h3>{steps[step].title}</h3>
                  <p>{steps[step].subtitle}</p>
                </div>
                <div className="options-grid">
                  {steps[step].options.map(opt => (
                    <div
                      key={opt.id}
                      className={`option-card ${currentPending === opt.id ? "pending" : ""}`}
                      onClick={() => selectOption(steps[step].key, opt.id)}
                    >
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

            {/* ── ENGINE: RESULTS ── */}
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
                          <span className="status-badge" style={{background: strain.status === "tried" ? "rgba(76,175,125,0.15)" : "rgba(255,255,255,0.06)", color: strain.status === "tried" ? "var(--green)" : "var(--text-tertiary)"}}>{strain.status === "tried" ? "✓ Verified" : "Predicted"}</span>
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
                                  <p style={{color:"var(--text-tertiary)", fontStyle:"italic"}}>Price unavailable — personal/verified product</p>
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
                            <td><span className="status-badge" style={{background: s.status === "tried" ? "rgba(76,175,125,0.15)" : "rgba(255,255,255,0.06)", color: s.status === "tried" ? "var(--green)" : "var(--text-tertiary)"}}>{s.status === "tried" ? "✓ Verified" : "Predicted"}</span></td>
                          </tr>
                          {isExpanded && (
                            <tr className="lib-expanded-row">
                              <td colSpan={9}>
                                <div className="lib-expanded-inner">
                                  <div>
                                    <div className="lib-exp-section">
                                      <h5>Full Terpene Profile</h5>
                                    </div>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
