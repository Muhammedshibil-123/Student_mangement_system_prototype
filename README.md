# Vidya Sethu

**Vidya Sethu (വിദ്യാ സേതു)** connects students, families, schools and community support (NGOs, CSR partners) in one mobile app.

This repository is the front-end app (React + Vite + Tailwind CSS). There is no server: all data is fictional sample data kept in the browser (`localStorage`), so the app can be opened anywhere and demonstrated to schools and partners.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build          # static site in dist/ (any static host)
npm run build:single   # one self-contained file: dist-single/index.html
```

Opening the app goes straight to **Sign in**.

## Sign in (password for every account: `1234`)

Tap the username field to see suggested accounts, or type a username:

| Account | Username | App |
|---|---|---|
| Ananya Rajesh (Class 9) | `ananya` | Student app |
| Aarav Rajesh (Class 4) | `aarav` | Student app, simplified for young children |
| Rajesh Kumar | `rajesh` | Parent app |
| Shaji Varghese | `shaji` | Bus driver app |
| Fathima Nasrin | `fathima` | Teacher workspace |
| Dr. Mini Thomas | `principal` | School admin |
| Nila Shiksha Foundation | `ngo` | NGO / CSR partner |
| Dr. Lakshmi Prabha | `counselor` | Counsellor |
| Programme Admin | `admin` | District admin |

**Family phone** tab: one shared phone with a private, PIN-protected profile for each family member (Rajesh, Sreeja, Ananya, Aarav). PIN: `1234`.

Log out from the **Account** sheet (tap your avatar, top right) or the **More** tab.

## Design

- Phone-first: full screen with safe areas, frosted tab bar, bottom sheets, screen transitions. On a computer the mobile apps open in an app-sized window, and the staff workspaces use a sidebar.
- Light and dark themes (Account → Appearance → Auto / Light / Dark), built on semantic colour tokens.
- English, Malayalam and Hindi, with read-aloud voice prompts.
- Built with the project's design skills in `.claude/skills/`: Tailwind tokens, beautiful-shadows elevation, progressive blur behind the bars, gradient borders on hero cards, alpha-masked scrolling chips, scroll-reveal animation, and a GSAP sign-in entrance. The WebGL skills (Three.js, globes, Vanta, Unicorn Studio, Matter.js) are not used, to keep the app light on low-cost phones and mobile data.

## Things to try (actions sync between roles and browser tabs)

1. Teacher → *Notices* → submit a notice. Principal → *Verify* → approve it. The parent sees it with a Verified badge.
2. Driver → *Report delay*. The parent's Bus Radar shows the delay.
3. Press **SOS** in the parent, student or driver app. The principal's overview shows a red alert.
4. Parent → Account → Malayalam → *Listen to today's summary*.
5. Student → Coins & Store → redeem an item. In a teacher chat, try sending a phone number (the safety filter blocks it).
6. AI Tutor → switch *Explain for* between Class 4 and Class 9.

**Account → Reset app data** restores the original sample data.

## Code map

```
src/
  data/seed.js          sample data (people, notices, bus route, marks, scholarships…)
  store/Store.jsx       shared state, theme, localStorage persistence, cross-tab sync
  i18n.js               English / Malayalam / Hindi strings
  components/           UI kit, phone app shell, staff workspace shell, SVG bus map
  features/             shared modules: BusRadar, NoticeBoard, SecureChat, HelpDesk, Wellbeing…
  pages/                Login, student/, parent/, driver/, teacher/, school/, ngo/, counselor/, admin/
```

## Notes

- Voice uses the browser's Web Speech API. Malayalam voices depend on the device (Chrome on Android has them).
- Bus GPS is simulated: a 45-minute route plays in about 6 minutes so movement and arrival times are visible.
- All names, schools, phone numbers and organisations are fictional.
