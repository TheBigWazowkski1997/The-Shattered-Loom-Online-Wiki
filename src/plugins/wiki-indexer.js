import fs from 'fs';
import path from 'path';

export function cleanTarget(target) {
  if (!target) return '';
  return target
    .replace(/^(\.\.[\/\\])+/, '')
    .replace(/^(\.[\/\\])+/, '')
    .trim();
}

export function slugify(str) {
  if (!str) return '';
  const cleaned = cleanTarget(str);
  return cleaned
    .replace(/\.md$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\/-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/-+/g, '-');
}

export function buildWikiIndex(wikiDir) {
  function getAllFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList);
      } else if (file.endsWith('.md')) {
        fileList.push(filePath);
      }
    }
    return fileList;
  }

  const allFiles = getAllFiles(wikiDir);
  const lookup = new Map();

  for (const filePath of allFiles) {
    const rel = path.relative(wikiDir, filePath).replace(/\\/g, '/');
    const slug = slugify(rel);
    const baseName = path.basename(filePath, '.md');
    const baseSlug = slugify(baseName);

    // Full path keys
    lookup.set(slug, slug);
    lookup.set(rel.replace(/\.md$/, '').toLowerCase(), slug);
    
    // Basename keys
    lookup.set(baseSlug, slug);
    lookup.set(baseName.toLowerCase(), slug);
  }

  return { lookup, allFiles };
}

export function resolveWikiLink(target, lookup, baseUrl = '/The-Shattered-Loom-Online-Wiki') {
  if (!target) return '#';
  const clean = cleanTarget(target);
  const slug = slugify(clean);
  const lower = clean.toLowerCase();
  const baseName = clean.split(/[\\\/]/).pop() || '';
  const baseSlug = slugify(baseName);

  const foundSlug = 
    lookup.get(slug) || 
    lookup.get(lower) || 
    lookup.get(baseSlug) || 
    lookup.get(baseName.toLowerCase());

  if (foundSlug) {
    return `${baseUrl}/wiki/${foundSlug.replace(/^\/+/, '')}`;
  }
  return `${baseUrl}/wiki/${slug.replace(/^\/+/, '')}`;
}
