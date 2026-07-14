<div align="center">

# प्रहरी · Prahari

### The intelligence layer between citizens and organised digital fraud

*ET AI Hackathon 2026 · Problem Statement 6 — AI for Digital Public Safety*

**Shield** (citizens) · **Graph** (cyber police) · **Command** (national war-room) — one connected intelligence fabric.

</div>

---

## The problem, in one sentence

India files **1.14 million cybercrime complaints a year** and acts on them **one victim at a time, after the money is gone.** "Digital arrest" scams alone stole **₹1,776 crore in nine months** (MHA, 2024). The data exists — the intelligence layer to act on it *before* mass victimisation does not.

Prahari is that layer. It fuses **scam-call intelligence, fraud-network graphs and counterfeit detection** into a single real-time system, shifting public safety from *reactive investigation* to *predictive neutralisation*.

## The demo spine — one campaign, three surfaces

A single fraud campaign flows through Prahari end-to-end, **signal to neutralisation in minutes**:

1. A retiree gets a WhatsApp video call from a fake "CBI officer."
2. **Prahari Shield** reads the call live, recognises the digital-arrest script and returns a **CRITICAL** verdict *before any transfer* — then orchestrates the response (1930/NCRB, telecom block, bank freeze, family alert).
3. The spoofed number and mule account feed **Prahari Graph**, which clusters scattered complaints into one **court-admissible** campaign (*Op. Chakravyuh*) spanning four states.
4. **Prahari Command** shows the campaign's live geospatial spread, prioritises enforcement, and dispatches the nearest cyber cell — while a bank teller gets a **counterfeit-note CV** flag on the mule's cash deposit.

## The three surfaces

| Surface | Audience | What it does | Core AI |
|---|---|---|---|
| **Shield** | Citizens, banks | Live multilingual triage of a call/message; recognises the digital-arrest playbook as it unfolds; verdict + orchestrated response | Weighted linguistic classifier, **noisy-OR** signal fusion |
| **Graph** | Cyber police | Fuses numbers, mule accounts, devices & victims into a live fraud-network graph; generates court-admissible intelligence packages | **Force-directed graph AI**, centrality ranking, entity resolution |
| **Command** | Agencies, MHA | Geospatial threat map, live interception feed, enforcement prioritisation, on-device counterfeit detection | Geospatial hotspot analytics, **computer-vision** note authentication |

## Why it wins (mapped to the rubric)

*Judging: Innovation 25 · Business Impact 25 · Technical Excellence 20 · Scalability 15 · UX 15.*

- **Innovation (25):** the only entry that *converges* four modalities — voice/NLP, graph, geospatial and CV — into one thread, with court-admissible output and a chain-of-custody digest.
- **Business Impact (25):** the most topical crime in India; every screen quantifies rupees protected and lives shielded, grounded in cited 2024–26 figures.
- **Technical Excellence (20):** a real multi-agent core, deterministic classifier with probabilistic fusion, a live force-directed graph, and a clean production build.
- **Scalability (15):** stateless surfaces over a shared intelligence fabric; agent mesh scales per-modality (see [Architecture](docs/ARCHITECTURE.md)).
- **User Experience (15):** a hand-built "command intelligence" design system — not a template, not a default dashboard.

## Tech stack

**Frontend** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (CSS-first, hand-built design system) · Motion · bespoke SVG data-viz (force graph, geospatial map, gauges).
**AI core (in-repo, runs offline)** weighted classifier + noisy-OR fusion · d3-force graph analytics · counterfeit feature scoring · intelligence-package generation.
**Production target** Python FastAPI agent services · Claude for reasoning agents · Neo4j knowledge graph · vector RAG over regulatory corpora · Kafka signal bus (see [Architecture](docs/ARCHITECTURE.md)).

## Run it

```bash
cd prahari
npm install
npm run dev          # http://localhost:3000
# production:
npm run build && npm start
```

No API keys, no external services — the entire demo runs offline on a seeded, realistic dataset grounded in India's actual fraud geography (Jamtara, Mewat/Nuh, Bharatpur).

**Walkthrough:** `/` overview → `/shield` (press *Play live interception*) → `/graph` (*Generate intelligence package*) → `/command` (map + *Counterfeit lab*). Full script in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Project structure

```
src/
  app/
    page.tsx                 # landing / product overview
    (console)/               # the product shell (left rail + status strip)
      shield/  graph/  command/
    api/triage/route.ts      # scam classifier endpoint
  components/
    brand/  ui/              # logo + hand-built primitives (no component lib)
    landing/ graph/ command/ # RadarHero, ForceGraph, IndiaMap, CounterfeitPanel
  lib/intel/                 # domain model, seeded dataset, classifier, dossier
docs/                        # architecture + demo script
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system, data-flow & agent-mesh diagrams; production topology.
- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) — 90-second demo script, speaker notes, judge Q&A.

---

<div align="center"><sub>Prahari · प्रहरी — the sentinel. Built for ET AI Hackathon 2026.</sub></div>
