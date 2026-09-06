# Architecture Atlas for SAP Architecture Center

A visual companion for exploring, comparing, and discovering SAP reference architectures.

> **Community project. Not an official SAP product.**  
> The [SAP Architecture Center](https://architecture.learning.sap.com/) remains the authoritative source for all architecture content.

---

## What is Architecture Atlas?

The SAP Architecture Center publishes a growing library of reference architectures. Architecture Atlas provides a visual navigation and discovery layer on top of that public content.

It helps architects:

- discover relevant reference architectures across domains and partners
- visually explore architecture diagrams
- understand relationships between architectures
- compare architectures side by side
- navigate directly to the authoritative SAP Architecture Center content

**Typical flow:**

Explore → Understand → Discover Relationships → Compare → Open the authoritative source

---

## Features

### Visual Architecture Gallery
Browse all 118 reference architectures as cards with preview images, domain tags, and partner information.

### Search & Filtering
- Full-text search across titles and descriptions
- Filter by domain (AI & ML, Application Dev., Data & Analytics, Integration, Operations & Security)
- Filter by technology partner (AWS, Azure, GCP, and others)
- Filter by recently updated

### Architecture Detail Panel
Click any architecture to open a detail panel with title, description, domains, partners, tags, contributors, and last update date. Includes a direct link to the authoritative SAP Architecture Center page.

### Fullscreen Diagram Viewer
Open architecture diagrams in a fullscreen viewer with zoom, pan, and fit controls.

### Relationship Explorer
Explore architecture relationships visually. Related architectures are arranged in a ring layout around the selected architecture. Relationships are derived from existing Architecture Center metadata — no AI-generated relationships are introduced.

**Relationship types:**
- **Same RA Group** — architectures in the same reference architecture group
- **Shared Domain** — architectures covering the same domain
- **Shared Partner** — architectures involving the same technology partner
- **Shared Tags** — architectures sharing topic tags

**Interaction:**
- Click a related architecture to open its detail panel
- Double-click to set it as the new center and explore its relationships
- Use the Back button to navigate through your exploration history

### Side-by-Side Comparison
Select up to two architectures and compare them side by side:
- Architecture diagrams
- Title and description
- Domains and partners
- Last updated date
- Direct links to SAP Architecture Center

### Global Deduplicated View
A flat view of all architectures — each architecture appears exactly once, with all its domain assignments shown as chips. Domain cluster views are available when filtering by a specific domain.

---

## Data Source

All architecture content is sourced from the public SAP Architecture Center repository:

- **SAP Architecture Center:** https://architecture.learning.sap.com/
- **Source repository:** https://github.com/SAP/architecture-center

The Atlas dataset is generated from the source repository using `scripts/build-atlas-data.js`. Preview images are rendered from the `.drawio` source files included in the Architecture Center repository.

### Current dataset

| Field | Value |
|---|---|
| Architecture documents | 118 |
| Source branch | main |
| Source commit | `5cf553d6550423801d97dbeb0593a78970cbbc5d` |
| Dataset generated | 2026-09-05 |

Domain breakdown: AI & ML (36) · Application Dev. (58) · Data & Analytics (32) · Integration (37) · Operations & Security (20)

---

## Technical Architecture

Architecture Atlas is a static web application — no backend, no database, no build step required to run it.

- Static HTML, CSS, JavaScript
- Generated JSON metadata (`atlas-reference-architectures.json`)
- Static PNG preview assets (`previews/`)
- Client-side interactions
- All architecture links point to public SAP Architecture Center URLs
- Diagram previews rendered from public draw.io source files

**External dependencies (CDN):**
- [Cytoscape.js](https://cytoscape.org/) — graph rendering for the Relationship Explorer
- [cytoscape-fcose](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose) — layout plugin

---

## Local Development

No build step required. Serve the `public/` directory with any static file server.

```bash
# Clone the repository
git clone https://github.com/adembaykal/architecture-center-atlas.git
cd architecture-center-atlas

# Option A — Python (no dependencies)
python3 -m http.server 3000 --directory public

# Option B — Node.js server (includes data/ routing)
npm install
npm start
```

Open http://localhost:3000 in your browser.

---

## Updating the Dataset

To update the Atlas to a newer version of the SAP Architecture Center:

```bash
# 1. Update the Architecture Center source
cd data/source
git pull

# 2. Rebuild the Atlas dataset
cd ../..
npm run build-atlas
# → writes data/atlas-reference-architectures.json
# → copy to public/ for deployment:
cp data/atlas-reference-architectures.json public/

# 3. Re-render preview images (only needed if .drawio files changed)
npm run build-previews
# → writes public/previews/<id>.png

# 4. Verify locally
python3 -m http.server 3000 --directory public

# 5. Deploy public/ to your static host
```

---

## Deployment

Architecture Atlas is designed for GitHub Pages. All asset paths are relative, so it works correctly under any repository subpath or custom domain.

**GitHub Pages setup:**
1. Push `public/` contents (or configure Pages to serve from `public/`)
2. No further configuration needed
3. Works with custom domains without any code changes

---

## Attribution & Licensing

Architecture Atlas is released under the **Apache License 2.0**.

The architecture content, diagrams, and metadata are sourced from the [SAP Architecture Center repository](https://github.com/SAP/architecture-center), which is also licensed under the Apache License 2.0. See [NOTICE](./NOTICE) for required attribution.

---

## Disclaimer

Architecture Atlas is a community project and is not an official SAP product. It is not affiliated with, endorsed by, or supported by SAP SE.

The SAP Architecture Center at https://architecture.learning.sap.com/ remains the authoritative source for all reference architecture content. Always refer to the official source for the most current and complete information.

---

*Created by Adem Baykal*
