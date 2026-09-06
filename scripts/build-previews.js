#!/usr/bin/env node
/**
 * build-previews.js
 * Renders .drawio diagrams → PNG thumbnails for the Atlas gallery.
 *
 * Output: public/previews/<doc-id>.png  (600px wide, 8px border)
 *
 * Uses the local draw.io desktop app CLI (draw.io --export).
 * Only renders if the output PNG is missing or older than the source .drawio file.
 *
 * Usage:
 *   node scripts/build-previews.js           # incremental (skip up-to-date)
 *   node scripts/build-previews.js --force   # re-render everything
 *   node scripts/build-previews.js --dry     # show plan without rendering
 */

const fs           = require('fs');
const path         = require('path');
const { execSync } = require('child_process');

const DRAWIO_CLI  = '/Applications/draw.io.app/Contents/MacOS/draw.io';
const DATA_FILE   = path.join(__dirname, '..', 'data', 'atlas-reference-architectures.json');
const OUT_DIR     = path.join(__dirname, '..', 'public', 'previews');
const BASE        = path.join(__dirname, '..', 'data', 'source', 'docs', 'ref-arch');
const GITHUB_PFX  = 'https://github.com/SAP/architecture-center/tree/main/docs/ref-arch/';

const FORCE = process.argv.includes('--force');
const DRY   = process.argv.includes('--dry');

if (!fs.existsSync(DRAWIO_CLI)) {
  console.error('draw.io CLI not found:', DRAWIO_CLI);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const { documents } = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

let rendered = 0, skipped = 0, failed = 0;

for (const doc of documents) {
  if (!doc.has_diagram) continue;

  const rel       = doc.source_url.replace(GITHUB_PFX, '');
  const drawioDir = path.join(BASE, rel, 'drawio');
  const outFile   = path.join(OUT_DIR, `${doc.id}.png`);

  if (!fs.existsSync(drawioDir)) { skipped++; continue; }

  const drawioFiles = fs.readdirSync(drawioDir)
    .filter(f => f.endsWith('.drawio'))
    .sort(); // deterministic: alphabetical, first wins

  if (drawioFiles.length === 0) { skipped++; continue; }

  const srcFile = path.join(drawioDir, drawioFiles[0]);

  // Skip if output is newer than source (incremental)
  if (!FORCE && fs.existsSync(outFile)) {
    const srcMtime = fs.statSync(srcFile).mtimeMs;
    const outMtime = fs.statSync(outFile).mtimeMs;
    if (outMtime >= srcMtime) { skipped++; continue; }
  }

  if (DRY) {
    console.log(`[DRY] ${doc.id}  ← ${path.relative(process.cwd(), srcFile)}`);
    rendered++;
    continue;
  }

  process.stdout.write(`  ${doc.id} … `);
  try {
    execSync(
      `"${DRAWIO_CLI}" -x -f png --width 1600 -b 16 -o "${outFile}" "${srcFile}"`,
      { stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 }
    );
    const size = Math.round(fs.statSync(outFile).size / 1024);
    console.log(`OK  ${size}KB`);
    rendered++;
  } catch (err) {
    console.log('FAIL');
    console.error('    ', err.message?.split('\n')[0]);
    failed++;
  }
}

console.log(`\nDone. rendered=${rendered}  skipped=${skipped}  failed=${failed}`);
console.log(`Output → ${OUT_DIR}`);
