# The Students Hub 🎓

> **Premier British Tuition Academy Website with Interactive 3D WebGL Hero Experience**

Official website for **The Students Hub** — an accredited academic tuition academy providing specialist tuition for 11+ Grammar School entrance, Key Stage 2 & 3, GCSE, and A-Level examinations across Greater London and online.

---

## 📞 Contact Information

- **Website Name:** The Students Hub
- **Admissions Mobile 1:** `+44 7424044851`
- **Admissions Mobile 2:** `07405860115`
- **Centre Landline:** `020 3957 7099`
- **Email:** `admin@thestudents-hub.co.uk`
- **Official Domain:** [thestudents-hub.uk](https://thestudents-hub.uk)

---

## 🌟 Key Features

1. **Interactive 3D WebGL Hero (`index.html`)**:
   - Built with **Three.js** featuring a 3D graduation mortarboard cap, golden achievement icosahedron core, and orbiting subject satellites.
   - Responds to pointer movements, 360° mouse dragging, and interactive subject HUD selectors (`All`, `11+ Grammar`, `Maths`, `Science`, `English`, `Coding`).
2. **Academic Programmes & Courses (`courses.html`)**:
   - 11+ & 13+ Grammar School Preparation (GL & CEM, Verbal/Non-Verbal Reasoning, Maths, English).
   - Key Stage 2 & 3 Foundations (Years 3 to 9, SATS Accelerator).
   - GCSE & IGCSE Grade 9 Accelerator (AQA, Edexcel, OCR Higher Maths & Triple Science).
   - AS & A2 Level Mastery (Mathematics, Further Maths, Sciences, UCAS preparation).
   - Junior Coding & Robotics for Kids (Python, Scratch, micro:bit).
3. **Study Packs & Revision Shop (`shop.html`)**:
   - Interactive catalogue with 8 authentic revision guides and mock test paper packs.
   - Dynamic category filter pills and live keyword search.
   - Slide-over Cart Drawer with real-time quantity controls, subtotal calculations, and `localStorage` persistence.
   - Simulated checkout modal with instant digital PDF access.
4. **Interactive Grade Boost Calculator**:
   - Allows parents to pick their child's current working grade and desired target grade to generate a personalized weekly roadmap.
5. **About Us (`about.html`) & Contact (`contact.html`)**:
   - Explaining the 4-Step Mastery Method, safeguarding (Ofsted-aligned, Enhanced DBS certified), interactive consultation booking form, centre opening hours, and interactive FAQ accordion.

---

## 🚀 Getting Started

### Running Locally

You can run the project using npm:
```bash
npm run dev
# or
npm start
```
This serves the website at `http://localhost:3000`.

Alternatively, with Python:
```bash
npm run serve
# or
python -m http.server 3000
```

---

## 📁 Project Structure

```
Students-hub/
├── index.html              # Homepage with 3D WebGL Canvas & Grade Calculator
├── courses.html            # Academic & Coding Courses curriculum
├── shop.html               # Revision Packs & Study Materials Shop
├── about.html              # Academy Ethos, 4-Step Method & Safeguarding
├── contact.html            # Contact Details, FAQs & Booking Form
├── package.json            # Node scripts (npm run dev)
├── styles/
│   ├── main.css            # Design system, typography & responsive styling
│   └── hero-3d.css         # 3D Canvas HUD controls & glowing aura styles
├── scripts/
│   ├── three-hero.js       # Three.js 3D academic knowledge core & orbits
│   ├── shop.js             # Shopping cart state, filtering & checkout
│   └── main.js             # Navigation, trial modal & grade calculator
└── assets/
    └── images/             # Academy photography & product mockups
```

---

## 📄 License
© 2026 The Students Hub. All rights reserved.
