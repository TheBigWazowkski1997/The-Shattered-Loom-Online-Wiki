# 🌌 The Shattered Loom — Online Player Wiki

A rich, responsive, and thematic digital guide and player-friendly lore wiki for the **Project Shattered Loom** D&D 5e homebrew campaign setting. Built with **Astro** using **Content Collections**.

🌐 **Live Website**: [thebigwazowkski1997.github.io/The-Shattered-Loom-Online-Wiki](https://thebigwazowkski1997.github.io/The-Shattered-Loom-Online-Wiki/)

---

## ⚡ Features

- **Built with Modern Astro**: Blisteringly fast static site generation with zero-JS baseline performance.
- **Astro Content Collections**: All 190+ markdown lore files are managed through type-safe content collections in `src/content/wiki/`.
- **Thematic D&D 5e Aesthetic**:
  - Curated dual themes: **Astral Void** (Dark Mode with celestial gold filaments) & **Illuminated Codex** (Warm aged parchment).
  - Authentic typography powered by **Cinzel** (ancient regal serif) and **Alegreya** (immersive bookish reading).
  - Ambient particle canvas with drifting golden loom filaments.
- **Obsidian Markdown Compatibility**:
  - Resolves Obsidian wikilinks `[[Path/Target|Alias]]` and `[[Target]]` across nested folders.
  - Renders image embeds `![[portrait.jpg]]` and PDF attachments `![[document.pdf]]`.
  - Converts Obsidian callouts (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`, `> [!LORE]`) into custom stylized scroll cards.
- **Full-Text Live Search**: Instant client-side modal search with keyboard shortcuts (`Ctrl+K` / `⌘K` or `/`).
- **Interactive Table of Contents**: Sticky heading spy highlighting reading position on long lore articles.
- **Web Standards & SEO**:
  - `robots.txt` and XML sitemap (`@astrojs/sitemap`).
  - Open Graph & Twitter Cards metadata.
  - Responsive mobile drawer and PWA-ready web manifest.
- **Automated CI/CD**: Seamless GitHub Actions deployment directly to GitHub Pages on every push to `main`.

---

## 🧭 Multiverse Navigation

- **Cosmology**: The Prime Weaver Telara, the shattering of reality, the Mark of Telara, and graphical calendars.
- **Planes of Existence**: The Material Plane, the 4 Elemental Planes, Outer Planes (Divine Shards), and Planar Hubs.
- **The Ten Great Factions**: The Pale Lodge, Cult of the Broken Thread, Keepers of the Sacred Weft, Gilded Caliper, and more.
- **Dramatis Personae**: Over 95 documented NPCs, Primordials, Darklords, and Planar Governors.
- **Campaign Chronicles**: Session logs from Session 0 across Barovia to the infinite Grand Archive.
- **Species & Bestiary**: Lore documents on Hag Dragons, Sorrowsworn, and Corpse Collectors.

---

## 🛠️ Local Development

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### Installation
```bash
git clone https://github.com/TheBigWazowkski1997/The-Shattered-Loom-Online-Wiki.git
cd The-Shattered-Loom-Online-Wiki
npm install
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:4321/The-Shattered-Loom-Online-Wiki/](http://localhost:4321/The-Shattered-Loom-Online-Wiki/) in your browser.

### Build Production Bundle
```bash
npm run build
```

---

## 📜 Content Structure

```
├── public/
│   ├── images/               # 100+ Planar maps, NPC portraits & creature tokens
│   ├── attachments/          # PDF lore documents & artifacts
│   ├── favicon.svg           # Custom celestial spindle icon
│   ├── robots.txt            # Search engine directives
│   └── manifest.webmanifest  # PWA manifest
├── src/
│   ├── content/
│   │   └── wiki/             # 190+ Markdown lore documents
│   │       ├── Cosmology/
│   │       ├── Planes of Existence/
│   │       ├── Factions/
│   │       ├── NPCs/
│   │       ├── Magic/
│   │       ├── Sessions/
│   │       ├── Species/
│   │       └── index.md
│   ├── components/           # Header, Sidebar, SearchModal, TOC, ThemeToggle, Breadcrumbs
│   ├── layouts/              # BaseLayout, WikiLayout
│   ├── pages/                # Homepage (index.astro), Wiki router ([...slug].astro), 404, search API
│   ├── plugins/              # Obsidian syntax & link indexer remark plugin
│   └── styles/               # D&D theme CSS design tokens
└── .github/workflows/        # Automated deployment to GitHub Pages
```

---

*In the beginning, there was only the Loom. Now, we walk the fractured threads.*
