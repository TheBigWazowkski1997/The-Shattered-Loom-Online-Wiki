import path from 'path';
import { visit } from 'unist-util-visit';
import { buildWikiIndex, resolveWikiLink, slugify, cleanTarget } from './wiki-indexer.js';

let cachedIndex = null;
function getIndex() {
  if (!cachedIndex) {
    const wikiDir = path.resolve(process.cwd(), 'src', 'content', 'wiki');
    cachedIndex = buildWikiIndex(wikiDir);
  }
  return cachedIndex;
}

export { slugify, cleanTarget };

export function remarkObsidian(options = {}) {
  const baseUrl = options.baseUrl || '/The-Shattered-Loom-Online-Wiki';

  return (tree) => {
    const { lookup } = getIndex();

    // 1. Transform callouts in blockquotes using native MDAST hName/hProperties
    visit(tree, 'blockquote', (node) => {
      if (!node.children || node.children.length === 0) return;
      const firstChild = node.children[0];
      if (firstChild.type === 'paragraph' && firstChild.children && firstChild.children.length > 0) {
        const firstText = firstChild.children[0];
        if (firstText.type === 'text') {
          const match = firstText.value.match(/^\[!([A-Za-z_-]+)\](?:\s*(.*))?(\n|$)/);
          if (match) {
            const calloutType = match[1].toLowerCase();
            const customTitle = match[2] ? match[2].trim() : '';
            const title = customTitle || match[1].toUpperCase();

            // Strip the callout marker
            firstText.value = firstText.value.slice(match[0].length);

            const iconMap = {
              note: '📜',
              tip: '✨',
              warning: '⚠️',
              important: '🔔',
              caution: '🔥',
              danger: '☠️',
              quote: '💬',
              info: 'ℹ️',
              lore: '🌌',
              myth: '⚡',
              secret: '🗝️',
              dm: '🛡️'
            };
            const icon = iconMap[calloutType] || '📜';

            // Transform blockquote container into styled div
            node.data = node.data || {};
            node.data.hName = 'div';
            node.data.hProperties = {
              className: ['wiki-callout', `callout-${calloutType}`]
            };

            // Prepend custom callout header
            const headerNode = {
              type: 'paragraph',
              data: {
                hName: 'div',
                hProperties: { className: ['callout-header'] }
              },
              children: [
                {
                  type: 'text',
                  value: `${icon} ${title}`
                }
              ]
            };

            node.children.unshift(headerNode);
          }
        }
      }
    });

    // 2. Transform text nodes containing [[links]] or ![[images]] into native MDAST nodes
    visit(tree, 'paragraph', (paragraphNode) => {
      if (!paragraphNode.children) return;

      const newChildren = [];
      for (const child of paragraphNode.children) {
        if (child.type !== 'text' || (!child.value.includes('[[') && !child.value.includes('!['))) {
          newChildren.push(child);
          continue;
        }

        const raw = child.value;
        const regex = /(!?\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\])/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(raw)) !== null) {
          if (match.index > lastIndex) {
            newChildren.push({
              type: 'text',
              value: raw.slice(lastIndex, match.index)
            });
          }

          const fullMatch = match[0];
          const isEmbed = fullMatch.startsWith('!');
          const target = match[2].trim();
          const hash = match[3] ? match[3].trim() : '';
          const alias = match[4] ? match[4].trim() : '';

          if (isEmbed) {
            const ext = target.split('.').pop().toLowerCase();
            const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
            const cleanName = target.replace(/^.*[\\\/]/, '');

            if (isImg) {
              newChildren.push({
                type: 'image',
                url: `${baseUrl}/images/${encodeURIComponent(cleanName)}`,
                alt: alias || cleanName,
                data: {
                  hProperties: {
                    className: ['wiki-image'],
                    loading: 'lazy'
                  }
                }
              });
            } else {
              // PDF or file attachment
              newChildren.push({
                type: 'link',
                url: `${baseUrl}/attachments/${encodeURIComponent(cleanName)}`,
                data: {
                  hProperties: {
                    className: ['wiki-attachment'],
                    target: '_blank',
                    rel: 'noopener'
                  }
                },
                children: [
                  { type: 'text', value: `📄 ${alias || cleanName}` }
                ]
              });
            }
          } else {
            // Internal Wikilink
            const displayText = alias || target.replace(/^.*[\\\/]/, '').replace(/\.md$/, '');
            const url = resolveWikiLink(target, lookup, baseUrl);
            const hashAnchor = hash ? `#${slugify(hash)}` : '';

            newChildren.push({
              type: 'link',
              url: `${url}${hashAnchor}`,
              data: {
                hProperties: {
                  className: ['wiki-link'],
                  'data-wiki-target': target
                }
              },
              children: [
                { type: 'text', value: displayText }
              ]
            });
          }

          lastIndex = match.index + fullMatch.length;
        }

        if (lastIndex < raw.length) {
          newChildren.push({
            type: 'text',
            value: raw.slice(lastIndex)
          });
        }
      }

      paragraphNode.children = newChildren;
    });

    // Also transform text nodes inside list items and table cells
    visit(tree, ['listItem', 'tableCell'], (containerNode) => {
      if (!containerNode.children) return;

      const newChildren = [];
      for (const child of containerNode.children) {
        if (child.type !== 'text' || (!child.value.includes('[[') && !child.value.includes('!['))) {
          newChildren.push(child);
          continue;
        }

        const raw = child.value;
        const regex = /(!?\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\])/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(raw)) !== null) {
          if (match.index > lastIndex) {
            newChildren.push({
              type: 'text',
              value: raw.slice(lastIndex, match.index)
            });
          }

          const fullMatch = match[0];
          const isEmbed = fullMatch.startsWith('!');
          const target = match[2].trim();
          const hash = match[3] ? match[3].trim() : '';
          const alias = match[4] ? match[4].trim() : '';

          if (isEmbed) {
            const cleanName = target.replace(/^.*[\\\/]/, '');
            newChildren.push({
              type: 'image',
              url: `${baseUrl}/images/${encodeURIComponent(cleanName)}`,
              alt: alias || cleanName,
              data: {
                hProperties: { className: ['wiki-image'], loading: 'lazy' }
              }
            });
          } else {
            const displayText = alias || target.replace(/^.*[\\\/]/, '').replace(/\.md$/, '');
            const url = resolveWikiLink(target, lookup, baseUrl);
            const hashAnchor = hash ? `#${slugify(hash)}` : '';

            newChildren.push({
              type: 'link',
              url: `${url}${hashAnchor}`,
              data: {
                hProperties: {
                  className: ['wiki-link'],
                  'data-wiki-target': target
                }
              },
              children: [
                { type: 'text', value: displayText }
              ]
            });
          }

          lastIndex = match.index + fullMatch.length;
        }

        if (lastIndex < raw.length) {
          newChildren.push({
            type: 'text',
            value: raw.slice(lastIndex)
          });
        }
      }

      containerNode.children = newChildren;
    });
  };
}
