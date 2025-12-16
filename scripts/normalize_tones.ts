
import fs from 'node:fs';
import path from 'node:path';
import { normalizeToneSheets } from '../lib/brand/tone/normalizeToneSheet';

const tonesPath = path.resolve(process.cwd(), 'tests/tone_style_sheets.v1.json');
const raw = JSON.parse(fs.readFileSync(tonesPath, 'utf-8'));

const normalized = normalizeToneSheets(raw);

fs.writeFileSync(tonesPath, JSON.stringify(normalized, null, 2));
console.log(`Normalized ${normalized.length} tones.`);
