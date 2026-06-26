# Prescriber Intelligence — Agent Seed

Clinical decision support tool for Australian medicinal cannabis prescribers.
Single-file Next.js 14 app. All logic lives in `app/page.jsx`.

---

## Repo & Deploy

- **GitHub:** `https://github.com/Entero-Studio/i-proto-v1` (transferred from `demsone/i-proto-v1`)
- **Remote:** `https://Entero-Studio@github.com/Entero-Studio/i-proto-v1.git`
- **Deploy:** Vercel free tier, auto-deploys on push to `main`
- **Push command:**
  ```
  git push https://Entero-Studio:TOKEN@github.com/Entero-Studio/i-proto-v1.git main
  ```
  Generate token at https://github.com/settings/tokens — Classic, `repo` scope.
- **Do not** include `#` comment lines in zsh terminal commands — causes paste errors.

---

## Tech Stack

- Next.js 14, React 18
- No backend, no database — all strain data is JS arrays in `app/page.jsx`
- No Tailwind, no external CSS framework — inline styles only
- DM Sans typeface (loaded via Google Fonts in `layout.jsx`)

---

## Architecture

Everything is in `app/page.jsx`. Sections in order:

1. `strainDB` — array of 52 strain objects (16 verified, 36 predicted)
2. `GOALS`, `AVOID`, `INTENSITY`, `EXPERIENCE`, `BUDGET` — questionnaire option sets
3. `scoreStrain(strain, answers)` — scoring engine, returns `{ score, reasons[] }`
4. `getRecommendations(answers)` — sorts strains by score, returns top results
5. React component — five-step questionnaire + results UI

---

## Strain Object Shape

```js
{
  name: "Strain Name",
  brand: "Brand Name",
  cultivar: "Cultivar Name",
  thc: 26,
  cbd: 0,
  cbg: 0,           // data field only — not scored
  category: "Day / Functional",
  status: "predicted",   // "tried" = verified by Diego; "predicted" = Catalyst AU data
  species: "Indica dominant",
  terpenes: {
    limonene: 0.5,
    caryophyllene: 0.4,
    myrcene: 0.2,
    // ... absolute % values
  },
  totalTerpenes: 1.1,
  price: 9.90,      // per gram
  rrp: 99,          // total pack price
  sizes: ["10g"],
  notes: "..."
}
```

**Status meanings:**
- `"tried"` — personally verified by Diego; gets a verification bonus in scoring
- `"predicted"` — terpene data from Catalyst AU (Honahlee); unverified

---

## Scoring Engine Rules

The engine scores each strain against five questionnaire inputs.

**Terpene variables (normalised at top of scoreStrain):**
- `lim` = limonene
- `car` = caryophyllene + transCaryophyllene
- `myr` = myrcene
- `lin` = linalool
- `pin` = pinene + alphaPinene + betaPinene
- `far` = farnesene
- `terp` = terpinolene
- `bis` = bisabolol + alphaBisabolol

**Do not score independently:**
- `selinaDienes` — chemotype markers only
- `germacreneB` / `gammaElemene` — analytically entangled via GC
- `CBG` — data field only, no weight until further notice

**Pending activation (do not enable without Diego sign-off):**
- `transBergamotene` — modest sativa-leaning scoring weight, literature insufficient for activation yet

---

## Claims Framework — Read Before Touching Any User-Facing Copy

Every clinic-facing claim must be tagged:
- `SOLID` — directly supported by published terpene science
- `DEFENSIBLE` — reasonable extrapolation with disclosed limitations
- `EXTRAPOLATION` — model-based prediction, explicitly flagged
- `PLACEHOLDER` — awaiting validation data, do not publish

**Prohibited language (absolute, zero exceptions):**
- "Clinically validated"
- "Evidence-based protocol"
- "Proven"
- Any language implying peer-reviewed outcome data or clinical trial results

**Required disclosure** wherever terpene effect associations appear:
> "Based on published terpene research; individual responses vary."

**Approved master framing (verbatim):**
> "Decision support informed by terpene science and structured patient outcome data."

---

## Visual Identity

- **Typeface:** DM Sans — "Prescriber" Medium/SemiBold, "Intelligence" Light, 2px smaller, left-aligned two-line stack, 3–5% letter tracking
- **Current skin (v3.1/3.2 light):** bg `#F4F6F4`, primary teal `#1E5F6B`, gold `#C9A84C`
- **New skin (v3.2 dark — pending):** bg `#0F1C20`, sidebar `#0A1316`, teal `#56B7C6`, gold `#D8BA63`, text `#E9EEEC`
- No symbol mark — wordmark only

---

## Compliance

- Operates behind AHPRA-verified prescriber login (separate auth layer)
- Tool supports clinical judgment; does not replace it
- Disclaimers must remain visible wherever terpene associations appear
- No patient data architecture changes without privacy review (Australian Privacy Principles + My Health Records Act)

---

## Database Notes

- 52 strains total: 16 verified ("tried"), 36 predicted
- **On hold:** Tilray Warlock CBD — source data likely reporting relative %, not absolute. Do not add until confirmed.
- **Excluded (no terpene data):** Cannatrek T25 Topaz, Beacon Medical GSC, Cannatrek C9T7 Argaman
- Prices are per gram. `rrp` is full pack price.

---

## MiManagement Board

Board: `prj_fa63249d` — Terpene-Intelligence
API: `http://localhost:4317/api`
Always set `X-Source: claude` on writes.
