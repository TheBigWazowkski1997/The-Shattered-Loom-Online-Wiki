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

  function getAllDirs(dir, dirList = []) {
    if (!fs.existsSync(dir)) return dirList;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        dirList.push(fullPath);
        getAllDirs(fullPath, dirList);
      }
    }
    return dirList;
  }

  const allFiles = getAllFiles(wikiDir);
  const allDirs = getAllDirs(wikiDir);
  const lookup = new Map();

  // 1. Index directories
  for (const dirPath of allDirs) {
    const relDir = path.relative(wikiDir, dirPath).split(path.sep).join('/');
    const dirSlug = slugify(relDir);
    const dirBase = path.basename(dirPath);
    const baseSlug = slugify(dirBase);
    const lowerDir = relDir.toLowerCase();
    const lowerBase = dirBase.toLowerCase();

    lookup.set(dirSlug, dirSlug);
    lookup.set(baseSlug, dirSlug);
    lookup.set(lowerDir, dirSlug);
    lookup.set(lowerBase, dirSlug);
    lookup.set(lowerDir.replace(/[^\w\s\/-]/g, ''), dirSlug);
    lookup.set(lowerBase.replace(/[^\w\s-]/g, ''), dirSlug);
  }

  // 2. Index markdown files
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

    // Parent folder mapping to primary lore note (if not a tactical map)
    const parts = rel.split('/');
    if (parts.length > 1 && !baseName.toLowerCase().startsWith('map of')) {
      const parentFolder = parts[parts.length - 2];
      const parentSlug = slugify(parentFolder);
      const parentLower = parentFolder.toLowerCase();
      lookup.set(parentSlug, slug);
      lookup.set(parentLower, slug);
      lookup.set(parentLower.replace(/[^\w\s-]/g, ''), slug);
    }
  }

  // Outer Planes Hub Aliases
  const outerHub = 'planes-of-existence/outer-planes-divine-shards';
  lookup.set('outer planes', outerHub);
  lookup.set('outer-planes', outerHub);
  lookup.set('outer planes divine shards', outerHub);
  lookup.set('outer-planes-divine-shards', outerHub);
  lookup.set('outer planes: divine shards', outerHub);
  lookup.set('outer planes; divine shards', outerHub);
  lookup.set('divine shards', outerHub);
  lookup.set('divine-shards', outerHub);

  // Outer Planes Direct Aliases
  lookup.set('plane of avarice', 'planes-of-existence/outer-planes-divine-shards/plane-of-avarice/plane-of-avarice-the-gilded-eternity');
  lookup.set('the gilded eternity', 'planes-of-existence/outer-planes-divine-shards/plane-of-avarice/plane-of-avarice-the-gilded-eternity');
  lookup.set('plane of eternal craft', 'planes-of-existence/outer-planes-divine-shards/plane-of-eternal-craft/plane-of-eternal-craft-forgeflame-expanse');
  lookup.set('forgeflame expanse', 'planes-of-existence/outer-planes-divine-shards/plane-of-eternal-craft/plane-of-eternal-craft-forgeflame-expanse');
  lookup.set('plane of fragmented memories', 'planes-of-existence/outer-planes-divine-shards/plane-of-fragmented-memories/plane-of-fragmented-memories-the-shardlands');
  lookup.set('the shardlands', 'planes-of-existence/outer-planes-divine-shards/plane-of-fragmented-memories/plane-of-fragmented-memories-the-shardlands');
  lookup.set('plane of infinite hunger', 'planes-of-existence/outer-planes-divine-shards/plane-of-infinite-hunger/plane-of-infinite-hunger-the-spiral-abyss');
  lookup.set('the spiral abyss', 'planes-of-existence/outer-planes-divine-shards/plane-of-infinite-hunger/plane-of-infinite-hunger-the-spiral-abyss');
  lookup.set('plane of secrets', 'planes-of-existence/outer-planes-divine-shards/plane-of-secrets/plane-of-secrets-ocean-of-whispers');
  lookup.set('ocean of whispers', 'planes-of-existence/outer-planes-divine-shards/plane-of-secrets/plane-of-secrets-ocean-of-whispers');
  lookup.set('plane of shattered law', 'planes-of-existence/outer-planes-divine-shards/plane-of-shattered-law/plane-of-shattered-law-the-fractured-spire');
  lookup.set('the fractured spire', 'planes-of-existence/outer-planes-divine-shards/plane-of-shattered-law/plane-of-shattered-law-the-fractured-spire');
  lookup.set('plane of unity', 'planes-of-existence/outer-planes-divine-shards/plane-of-unity/plane-of-unitythe-woven-citadel');
  lookup.set('the woven citadel', 'planes-of-existence/outer-planes-divine-shards/plane-of-unity/plane-of-unitythe-woven-citadel');
  lookup.set('plane of wild balance', 'planes-of-existence/outer-planes-divine-shards/plane-of-wild-balance/plane-of-wild-balance-verdant-nexus');
  lookup.set('verdant nexus', 'planes-of-existence/outer-planes-divine-shards/plane-of-wild-balance/plane-of-wild-balance-verdant-nexus');

  // Elemental Planes & Echoes Aliases
  lookup.set('plane of air', 'planes-of-existence/elemental-planes/plane-of-air/plane-of-air-the-skybound-expanse');
  lookup.set('the skybound expanse', 'planes-of-existence/elemental-planes/plane-of-air/plane-of-air-the-skybound-expanse');
  lookup.set('plane of fire', 'planes-of-existence/elemental-planes/plane-of-fire/plane-of-fire-the-everblaze-expanse');
  lookup.set('the everblaze expanse', 'planes-of-existence/elemental-planes/plane-of-fire/plane-of-fire-the-everblaze-expanse');
  lookup.set('plane of earth', 'planes-of-existence/elemental-planes/plane-of-earth/plane-of-earth-the-unyielding-depths');
  lookup.set('the unyielding depths', 'planes-of-existence/elemental-planes/plane-of-earth/plane-of-earth-the-unyielding-depths');
  lookup.set('plane of water', 'planes-of-existence/elemental-planes/plane-of-water/plane-of-water-the-azure-expanse');
  lookup.set('the azure expanse', 'planes-of-existence/elemental-planes/plane-of-water/plane-of-water-the-azure-expanse');
  lookup.set('the elemental planes', 'planes-of-existence/elemental-planes/the-elemental-planes');
  lookup.set('elemental planes', 'planes-of-existence/elemental-planes/the-elemental-planes');
  lookup.set('the material plane', 'planes-of-existence/the-material-plane/the-material-plane');
  lookup.set('material plane', 'planes-of-existence/the-material-plane/the-material-plane');
  lookup.set('the feywild', 'planes-of-existence/the-material-plane/feywild');
  lookup.set('feywild', 'planes-of-existence/the-material-plane/feywild');
  lookup.set('the shadowfell', 'planes-of-existence/the-material-plane/shadowfell');
  lookup.set('shadowfell', 'planes-of-existence/the-material-plane/shadowfell');
  lookup.set('the nine hells', 'planes-of-existence/the-nine-hells/the-nine-hells');
  lookup.set('nine hells', 'planes-of-existence/the-nine-hells/the-nine-hells');
  lookup.set('the abyss', 'planes-of-existence/the-abyss/the-abyss');
  lookup.set('abyss', 'planes-of-existence/the-abyss/the-abyss');

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

