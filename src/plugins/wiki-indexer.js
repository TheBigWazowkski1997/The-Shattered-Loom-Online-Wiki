import fs from 'fs';
import path from 'path';

export function cleanTarget(target) {
  if (!target) return '';
  return target
    .replace(/\\/g, '/')
    .replace(/^(\.\.\/)+/, '')
    .replace(/^(\.\/)+/, '')
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
    const rel = path.relative(wikiDir, filePath).split(path.sep).join('/');
    const slug = slugify(rel);
    const baseName = path.basename(filePath, '.md');
    const baseSlug = slugify(baseName);
    const lowerRel = rel.replace(/\.md$/, '').toLowerCase();
    const lowerBase = baseName.toLowerCase();

    // Full path keys
    lookup.set(slug, slug);
    lookup.set(lowerRel, slug);
    lookup.set(lowerRel.replace(/[\s_-]+/g, '-'), slug);
    lookup.set(lowerRel.replace(/[^\w\s\/-]/g, ''), slug);
    
    // Basename keys
    lookup.set(baseSlug, slug);
    lookup.set(lowerBase, slug);
    lookup.set(lowerBase.replace(/[^\w\s-]/g, ''), slug);
    lookup.set(lowerBase.replace(/[\s_-]+/g, '-'), slug);
  }

  // Common aliases in homebrew campaign notes
  lookup.set('cosmology/shattered_loom_calendar', 'cosmology/shattered-loom-calendar');
  lookup.set('shattered_loom_calendar', 'cosmology/shattered-loom-calendar');
  lookup.set('shattered-loom-calendar', 'cosmology/shattered-loom-calendar');
  lookup.set('high glutton vorzath', 'npcs/gods/god-of-the-plane-of-infinite-hunger/vorzath-the-maw-eternal');
  lookup.set('void-captain malakor vance', 'npcs/high-glutton-malakor');
  lookup.set('high glutton malakor', 'npcs/high-glutton-malakor');

  return { lookup, allFiles };
}

export function resolveWikiLink(target, lookup, baseUrl = '/The-Shattered-Loom-Online-Wiki') {
  if (!target) return { url: '#', isUnresolved: true, isImage: false };
  const clean = cleanTarget(target);
  const slug = slugify(clean);
  const lower = clean.toLowerCase();
  const baseName = clean.split(/[\\\/]/).pop() || '';
  const baseSlug = slugify(baseName);

  // Check if target is an image file accidentally wrapped in [[...]] instead of ![[...]]
  const ext = clean.split('.').pop().toLowerCase();
  if (['webp', 'jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
    return {
      url: `${baseUrl}/images/${encodeURIComponent(baseName)}`,
      isUnresolved: false,
      isImage: true,
      cleanName: baseName
    };
  }

  const foundSlug = 
    lookup.get(slug) || 
    lookup.get(lower) || 
    lookup.get(baseSlug) || 
    lookup.get(baseName.toLowerCase()) ||
    lookup.get(lower.replace(/[^\w\s\/-]/g, '')) ||
    lookup.get(baseName.toLowerCase().replace(/[^\w\s-]/g, ''));

  if (foundSlug) {
    return {
      url: `${baseUrl}/wiki/${foundSlug.replace(/^\/+/, '')}`,
      isUnresolved: false,
      isImage: false,
      slug: foundSlug
    };
  }

  // Graceful fallback for unwritten lore entries: link to portal search so it NEVER 404s!
  const searchQuery = encodeURIComponent(clean.replace(/\.md$/, ''));
  return {
    url: `${baseUrl}/?q=${searchQuery}`,
    isUnresolved: true,
    isImage: false,
    searchQuery
  };
}

