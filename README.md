# Vidya Sethu: Clickable Prototype

**Vidya Sethu (വിദ്യാ സേതു)** is a socio-educational support bridge that connects students, families, schools and community support (NGOs, CSR partners) on one mobile-first platform.

This repository is a **front-end-only prototype** (React + Vite + Tailwind). There is no server. All data is fictional demo data held in the browser (`localStorage`), so it can be opened anywhere and shown to schools, partners and investors.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build          # static site in dist/ (any static host, e.g. GitHub Pages / Netlify)
npm run build:single   # ONE self-contained file: dist-single/index.html (share by email / WhatsApp)
```

## Demo logins (password for everyone: `123456`)

| Role | Username | What you see |
|---|---|---|
| Student (Class 9) | `ananya` | Mobile app: home, audio pods, AI tutor, bus radar, chat, coins store… |
| Student (Class 4) | `aarav` | Simpler kid mode, grade-based report card, child-level AI answers |
| Parent | `rajesh` | Mobile app: voice summary, child switcher, live bus, verified notices, support |
| Teacher | `fathima` | Web dashboard: attendance, notices, chat hours, gradebook, onboarding |
| School admin | `principal` | Notice verification, emergency broadcast, transport & SOS, NGO verification |
| Bus driver | `shaji` | Trip control, delay reporting, boarding list, safety checklist |
| NGO / CSR partner | `ngo` | School-verified anonymised needs, sponsor, projects, impact report |
| Counsellor | `counselor` | Anonymous question inbox, risk escalation, sessions, trends |
| Platform admin | `admin` | District pilot command centre, exam-crisis desk, revenue calculator, roadmap |

**Family Device mode** (`/family`): one shared phone with PIN-protected profiles (Rajesh, Sreeja, Ananya, Aarav). PIN: `123456`.

## Pages

- `/`: pitch site covering the 10 required points (problem, solution, market opportunity, target market, market research & revenue, competition, change, prototype, go-to-market, roadmap)
- `/login`: role picker + password login, language switch (English / മലയാളം / हिंदी)
- The 4 core screens requested: **Profile gateway**, **Student home & audio hub**, **Live bus radar**, **Parent notice board & community support**

## Things to try (actions sync between roles and browser tabs)

1. Teacher → *Class notices* → submit a notice. Principal → *Verify notices* → publish. Parent sees it with a ✓ Verified badge.
2. Driver → *Report delay*. The parent's Bus Radar shows the delay banner (open the two roles in two tabs).
3. Press **SOS** in the parent, student or driver app. The principal dashboard shows a red alert.
4. Parent → switch language to **മലയാളം** → *Listen to today's summary* (uses the browser's voice).
5. Student → Coins & Store → redeem items. Student chat → try sending a phone number (the safety filter blocks it).
6. AI Tutor → switch "Explain for Class 4 / Class 9" to see age-adaptive answers.

Use **Reset demo** (left panel / sidebar) to restore the original data.

## Code map

```
src/
  data/seed.js          all demo data (people, notices, bus route, marks, scholarships…)
  store/Store.jsx       shared state + localStorage persistence + cross-tab sync
  i18n.js               English / Malayalam / Hindi strings
  components/           UI kit, mobile phone shell, dashboard shell, SVG bus map
  features/             shared modules: BusRadar, NoticeBoard, SecureChat, HelpDesk, Wellbeing…
  pages/                Landing, Login, FamilyGateway, student/, parent/, driver/,
                        teacher/, school/, ngo/, counselor/, admin/
```

## Notes

- Voice playback and voice input use the browser's built-in Web Speech API. Malayalam voices depend on the device (Chrome on Android has them). If speech isn't supported, the UI simulates it.
- The bus "GPS" is simulated: a 45-minute route plays in about 6 minutes so movement and ETAs are visible during a demo.
- Market figures come from the concept deck (IBEF / UDISE+). The research report's corrections are used where it flagged an error (e.g. CSR on education ≈ ₹12,135 Cr / 35%). Revenue numbers are a scenario, not a forecast.
- All names, schools, phone numbers and organisations are fictional demo data.
