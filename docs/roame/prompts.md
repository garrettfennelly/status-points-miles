# Reusable Roame prompts (ChatGPT `@Roame` / Codex)

Start every session with: **"@Roame show remaining credits and reset date. Estimate the credit cost
before searching and wait for my OK."** Prefer **cached** search first; use **live** only to confirm.
Treat a successful connection as no evidence of award inventory. Report "no availability" plainly.

## 0. Validation search (run once)
@Roame Cached award search, 1 passenger: LAX → Tokyo (HND or NRT), Japan Airlines metal,
Business or First, any date in the next 90 days. For each result list date, flight, cabin, program,
miles required, taxes/fees, seats, and booking link. Don't run more than one search. If the
tool needs exact dates, ask me before splitting the range.

## A. Japan Airlines: West Coast → Tokyo
@Roame Cached search, 1 pax, JAL-operated, Business and First: {LAX, SFO, SEA, SAN} → {HND, NRT},
dates {RANGE}. Group by bookable program (e.g., Alaska Mileage Plan, AA AAdvantage, JAL Mileage
Bank). Show miles + taxes. Flag First separately. Estimate credits first. Use multi-airport
search instead of one search per origin.

## B. Qatar Airways: North America → Goa
@Roame 1 pax, Business, North America (e.g., JFK, IAD, ORD, DFW, MIA, BOS, LAX, SFO, SEA) → Goa (GOI or GOX)
via DOH, dates {RANGE}. Compare programs (Qatar Privilege Club Avios, BA Avios, AA AAdvantage,
Alaska): miles, carrier surcharges, taxes. **Report Qsuite only where the specific flight/aircraft
is confirmed to have Qsuite. Never infer it from "operated by Qatar."** Note the DOH→GOI/GOX leg
separately; it's often a standard business seat, not Qsuite.

## C. Virgin Atlantic: Upper Class
@Roame 1 pax, Upper Class: North America → LHR, dates {RANGE}; and LHR → India (DEL, BOM)
on Virgin. Compare Flying Club vs. partner programs (Delta SkyMiles, Air France/KLM Flying Blue),
including Virgin's carrier surcharges. Show miles + taxes/fees per leg.

## Alerts (approval required before creating)
@Roame List my alerts and remaining slots. Draft (don't create) an alert for {ROUTE/CABIN/DATES}
and show me exactly what you'd submit.
