# Prahari — Demo Script & Pitch Notes

*Total runtime: ~4 minutes (90s live demo + framing). Everything runs offline.*

---

## Cold open (15s)

> "In the time this demo takes, another Indian family will lose their savings to a fake 'CBI officer' on a video call. The warning signs were all there — nobody connected them in time. **Prahari** connects them. Watch one scam die in real time."

Open on `/` — let the radar hero and the "₹1,776 Cr in 9 months" ticker land.

---

## Act 1 — Shield · the scam stopped (30s)

Navigate to **`/shield`** → press **Play live interception**.

Narrate as the markers fire:
> "A 68-year-old in Bengaluru is on a WhatsApp video call. As the caller talks, Prahari is scoring every line — *authority impersonation… the phrase 'digital arrest', which doesn't legally exist… 'transfer funds to verify'*. The risk gauge crosses into **CRITICAL before a single rupee moves.**"

Point at the **orchestrated response** cards:
> "One verdict, five coordinated actions — auto-file to 1930, flag the number to the telecom, freeze the mule account, alert a family member to break the scammer's isolation. In twelve languages."

*(Optional: paste a message into "Try the classifier" to show it generalises.)*

## Act 2 — Graph · the network mapped (30s)

Navigate to **`/graph`**.

> "That one intercepted number doesn't stay one number. Prahari fuses it with every other complaint sharing calling infrastructure, devices and mule accounts — and 214 scattered victims become **one campaign: Op. Chakravyuh.**"

Hover a node to isolate its neighbourhood; click the red **compound** to inspect.
> "The graph ranks the actors by centrality — the handlers, the mule layer, the crypto off-ramp, the cross-border command node."

Press **Generate intelligence package**.
> "And it produces this — a **court-admissible dossier**: executive summary, money trail, applicable statutes under BNS, IT Act and PMLA, and a tamper-evident chain-of-custody digest. Ready for an FIR."

## Act 3 — Command · the response dispatched (25s)

Navigate to **`/command`**.

> "Nationally, the same intelligence becomes a live threat surface — source hubs like Jamtara and Mewat, the metros they target, the cash-out corridors. The interception feed streams live, and Prahari prioritises **where to deploy for maximum disruption.**"

Click a hotspot → **Dispatch nearest cyber cell**. Switch to **Counterfeit lab** → **Run CV authentication**.
> "And when the mule deposits the stolen cash, the bank teller's terminal runs the same fabric — on-device computer vision flags the counterfeit ₹500 in seconds."

## Close (20s)

> "Shield, Graph, Command — one thread from a victim's phone to the national command centre. **Signal to neutralisation in minutes, not months.** The data always existed. Prahari is the intelligence layer that finally acts on it."

---

## Judge Q&A — prepared answers

**Q: Isn't this just a keyword classifier?**
The demo core is a *weighted, calibrated* classifier with **noisy-OR fusion** so no single marker maxes the score — it models compounding evidence. In production the Triage agent adds a Claude reasoning pass for novel scripts and multilingual variants; the contract is identical.

**Q: How do you keep false positives low for citizens?**
The scoring is banded, not binary, and citizen-facing actions only trigger at High/Critical. We target a **sub-1% false-positive rate** — surfaced on the landing page — because a noisy shield gets muted.

**Q: Where does the data come from / is it real?**
The demo runs on a **seeded, deterministic dataset** grounded in India's actual fraud geography and 2024–26 figures. Production ingests telecom CLI signals, bank/UPI rails, NCRB/1930 and OSINT chain analytics over a Kafka signal bus (see Architecture §1).

**Q: Is the graph output actually admissible?**
The package maps evidence to specific statutes and ships a content-addressed integrity digest with a full audit trail. It's designed to *support* an FIR/NCRB submission — a human investigator authorises, Prahari assembles.

**Q: What's autonomous vs. human-approved?**
The Orchestrator executes only pre-approved playbook steps; anything above a defined blast-radius threshold needs human authorisation. Every automated action is logged.

**Q: How does it scale to national volume?**
Stateless surfaces, per-modality autoscaling, Kafka-partitioned ingestion, jurisdiction-sharded graph with cross-shard linking. See Architecture §5.

**Q: Why should agencies trust a startup with this?**
Prahari is an intelligence *layer*, not a data grab — PII is tokenised before entering the graph, on-device where possible, with data minimisation and a gateway audit tap by design.

---

## Business model & go-to-market

- **B2G (agencies / MHA / state cyber cells):** annual platform licence + per-seat Command access; pilot → state → national.
- **B2B (banks, telecoms, UPI PSPs):** API metering on Shield triage + counterfeit CV at the point of contact; priced per protected transaction.
- **B2C (citizen shield):** free (public-good funnel + trust), monetised via bank/telecom distribution partners.
- **Network effect:** every intercepted scam enriches the shared graph, which sharpens detection for every participant — a data moat that compounds.

## Roadmap

1. **Now (hackathon):** three working surfaces, offline demo, court-admissible package.
2. **Pilot (0–6 mo):** one state cyber cell + one bank; live telecom CLI + UPI signal integration; Claude reasoning agents.
3. **Scale (6–18 mo):** multi-state graph federation, deepfake/AI-voice detection, WhatsApp/IVR citizen channels in 12 languages.
4. **Platform (18 mo+):** national fraud fabric, cross-border intelligence sharing, predictive campaign forecasting.
