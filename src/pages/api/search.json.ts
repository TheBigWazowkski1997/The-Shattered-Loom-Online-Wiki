import { getCollection } from 'astro:content';
import { slugify } from '../../plugins/wiki-indexer.js';

export async function GET() {
  const docs = await getCollection('wiki');

  const searchIndex = docs.map((doc) => {
    // Generate clean title
    const rawTitle = doc.data?.title || doc.id.replace(/\.md$/, '').split('/').pop() || '';
    const cleanTitle = rawTitle.replace(/[_-]/g, ' ');

    // Extract directory category
    const parts = doc.id.split('/');
    const category = parts.length > 1 ? parts.slice(0, -1).join(' > ') : 'General Lore';

    // Create a short excerpt from markdown body
    let excerpt = '';
    if (doc.body) {
      excerpt = doc.body
        .replace(/---[\s\S]*?---/, '') // remove frontmatter
        .replace(/[#*`_\[\]()!>|]/g, '') // strip markdown
        .slice(0, 160)
        .trim();
    }

    return {
      title: cleanTitle,
      slug: slugify(doc.id),
      category,
      excerpt,
    };
  });

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
