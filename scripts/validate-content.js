#!/usr/bin/env node

/**
 * Content validation script
 * Checks frontmatter consistency across all content files.
 *
 * Usage:
 *   node scripts/validate-content.js
 *
 * Exit code 0 = all passed, 1 = errors found
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const CONTENT_DIR = join(import.meta.dirname, '..', 'src', 'content');
const COLLECTIONS = ['album', 'daily-classical'];

const errors = [];
const warnings = [];

// ── helpers ──────────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  const data = {};

  // Simple YAML-ish parser (handles our known schemas)
  const lines = raw.split(/\r?\n/);
  let currentKey = null;
  let arrayItems = [];
  let inArray = false;
  let inNestedObj = false;
  let nestedObj = {};

  for (const line of lines) {
    const trimmed = line.trim();

    // Top-level key: value
    const topMatch = trimmed.match(/^(\w+):\s*(.*)/);
    if (topMatch && !line.startsWith(' ') && !line.startsWith('-')) {
      // Save previous array
      if (inArray && currentKey) {
        data[currentKey] = arrayItems;
        arrayItems = [];
        inArray = false;
      }
      if (inNestedObj && currentKey) {
        data[currentKey] = nestedObj;
        nestedObj = {};
        inNestedObj = false;
      }

      currentKey = topMatch[1];
      const val = topMatch[2].trim();

      if (val === '' || val === '[]') {
        // Could be an array or object — look ahead
        inArray = true;
        arrayItems = [];
      } else {
        // Scalar
        data[currentKey] = parseScalar(val);
        inArray = false;
        inNestedObj = false;
      }
      continue;
    }

    // Array item: - key: val
    const arrItemMatch = trimmed.match(/^-\s+(\w+):\s*(.*)/);
    if (arrItemMatch && inArray) {
      const obj = {};
      obj[arrItemMatch[1]] = parseScalar(arrItemMatch[2].trim());
      // Check subsequent indented lines for more keys of this object
      arrayItems.push(obj);
      inNestedObj = true;
      nestedObj = obj;
      continue;
    }

    // Nested key inside array item or object
    const nestedMatch = trimmed.match(/^(\w+):\s*(.*)/);
    if (nestedMatch && inArray && arrayItems.length > 0) {
      const lastItem = arrayItems[arrayItems.length - 1];
      lastItem[nestedMatch[1]] = parseScalar(nestedMatch[2].trim());
      continue;
    }
  }

  // Flush
  if (inArray && currentKey) {
    data[currentKey] = arrayItems;
  }
  if (inNestedObj && currentKey) {
    data[currentKey] = nestedObj;
  }

  return data;
}

function parseScalar(val) {
  if (!val) return '';
  // Remove surrounding quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === '[]') return [];
  return val;
}

function getAllFiles(collection) {
  const dir = join(CONTENT_DIR, collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => join(dir, f));
}

function getExistingSlugs(collection) {
  const slugs = new Set();
  for (const file of getAllFiles(collection)) {
    const text = readFileSync(file, 'utf-8');
    const fm = parseFrontmatter(text);
    if (fm && fm.slug) slugs.add(fm.slug);
  }
  return slugs;
}

function stripParentheses(str) {
  // "Pavarotti（帕華洛帝）" → "Pavarotti"
  return str.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim();
}

function normalizeForComparison(str) {
  return stripParentheses(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ── validation rules ─────────────────────────────────────────────────

function validateFile(filePath, collection) {
  const text = readFileSync(filePath, 'utf-8');
  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push(`${filePath}: No valid frontmatter found`);
    return;
  }

  const fileName = basename(filePath);

  // Rule 1: relatedAlbums with slug must exist
  if (Array.isArray(fm.relatedAlbums)) {
    const allSlugs = getExistingSlugs(collection);

    for (const rel of fm.relatedAlbums) {
      if (rel.slug && !allSlugs.has(rel.slug)) {
        errors.push(`${fileName}: relatedAlbums has slug "${rel.slug}" but no matching article found in ${collection}/`);
      }
      if (!rel.slug && !rel.url) {
        errors.push(`${fileName}: relatedAlbums entry "${rel.title}" has neither slug nor url`);
      }
    }
  }

  // Rule 2: relatedAlbums artist overlap check
  if (Array.isArray(fm.relatedAlbums) && fm.relatedAlbums.length > 0) {
    const currentArtist = normalizeForComparison(fm.artist || '');
    const currentTags = (fm.tags || []).map(t => normalizeForComparison(t));

    for (const rel of fm.relatedAlbums) {
      const relArtist = normalizeForComparison(rel.artist || '');
      // Check if there's ANY overlap between current artist/tags and related artist
      const artistInCurrent = currentArtist.includes(relArtist) || relArtist.includes(currentArtist);
      const artistInTags = currentTags.some(t => relArtist.includes(t) || t.includes(relArtist));

      // For slug-based (internal) links, skip this check — they're editorial choices
      if (!rel.slug && !artistInCurrent && !artistInTags) {
        warnings.push(`${fileName}: relatedAlbums "${rel.title}" by "${rel.artist}" — artist has no overlap with this article's artist "${fm.artist}". Is this intentional?`);
      }
    }
  }

  // Rule 3: slug format — should contain a hyphen (label-number pattern)
  if (fm.slug && !fm.slug.includes('-')) {
    warnings.push(`${fileName}: slug "${fm.slug}" has no hyphen — expected format like "dg-471489" or "decca-4304332"`);
  }

  // Rule 4: locale + slug uniqueness check is handled by Astro, but warn on duplicate slugs
  if (fm.slug && fm.locale) {
    const id = `${fm.locale}-${fm.slug}`;
    // Just check the file naming convention
    if (!fileName.includes(fm.slug)) {
      errors.push(`${fileName}: filename does not contain slug "${fm.slug}"`);
    }
    if (!fileName.includes(fm.locale)) {
      errors.push(`${fileName}: filename does not contain locale "${fm.locale}"`);
    }
  }
}

// ── main ─────────────────────────────────────────────────────────────

console.log('Validating content files...\n');

for (const collection of COLLECTIONS) {
  const files = getAllFiles(collection);
  for (const file of files) {
    validateFile(file, collection);
  }
}

if (warnings.length > 0) {
  console.log(`\x1b[33m⚠  ${warnings.length} warning(s):\x1b[0m`);
  for (const w of warnings) {
    console.log(`  ⚠  ${w}`);
  }
}

if (errors.length > 0) {
  console.log(`\n\x1b[31m✘  ${errors.length} error(s):\x1b[0m`);
  for (const e of errors) {
    console.log(`  ✘  ${e}`);
  }
  console.log('\nContent validation failed.');
  process.exit(1);
} else {
  console.log('\n\x1b[32m✔  All content files passed validation.\x1b[0m');
  process.exit(0);
}
