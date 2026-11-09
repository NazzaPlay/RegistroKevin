// build.js – genera dist/ con whitelist explícita y validación estricta

import { copyFileSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --------- 1️⃣ whitelist de recursos públicos ----------
const PUBLIC = [
  'index.html',
  'manifest.json',
  'sw.js',
  'favicon.ico',
  'logo-patagonia.png',
  'logo-patagonia-texto.png',
  'assets',
  '_routes.json',
  'functions',
];

// --------- 2️⃣ crear / limpiar dist ----------
const DIST = join(__dirname, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

function copyRecursive(src, dest) {
  const stats = statSync(src);
  if (stats.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) {
      copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    copyFileSync(src, dest);
  }
}

// --------- 3️⃣ copiar solo whitelist ----------
let missingRequired = false;
for (const entry of PUBLIC) {
  const srcPath = join(__dirname, entry);
  try {
    copyRecursive(srcPath, join(DIST, entry));
  } catch (e) {
    console.warn(`⚠️  ${entry} no existe → será omitido`);
    if (entry === 'index.html') missingRequired = true;
  }
}

// --------- 4️⃣ validar exclusiones ----------
const FORBIDDEN = [
  /\/src\//,
  /\/test\//,
  /\/docs\//,
  /\/migrations\//,
  /\.env/,
  /\.sqlite$/,
  /node_modules/,
  /\.git/,
];

function scan(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = full.replace(`${DIST}/`, '');
    if (FORBIDDEN.some(pat => pat.test(rel))) {
      console.error(`❌  Archivo prohibido encontrado en dist: ${rel}`);
      process.exit(1);
    }
    if (statSync(full).isDirectory()) scan(full);
  }
}
scan(DIST);

// --------- 5️⃣ comprobar index.html obligatorio ----------
if (missingRequired || !statSync(join(DIST, 'index.html'), { throwIfNoEntry: false })) {
  console.error('❌  index.html es obligatorio y no se encontró');
  process.exit(1);
}

console.log('✅  dist/ creado y verificado');