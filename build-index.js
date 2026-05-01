// build-index.js
// Run by GitHub Action whenever CMS saves content.
// Regenerates:
//   - content/news/index.json        (list of filenames)
//   - content/gallery/index.json     (list of filenames)
//   - content/main-cards/index.json  (list of filenames)
//   - content/notifications/index.json
//   - content-index.json             (all data combined, used as fallback)

const fs = require('fs');
const path = require('path');

function readJsonDir(dir) {
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); return []; }
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && f !== 'index.json')
    .map(file => {
      try {
        return { file, data: JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) };
      } catch(e) {
        console.warn(`  Skipping invalid JSON: ${file}`);
        return null;
      }
    })
    .filter(Boolean);
}

function writeIndex(dir, filenames) {
  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(filenames, null, 2));
  console.log(`  index.json updated: [${filenames.join(', ')}]`);
}

const root = __dirname;

// NEWS
const newsDir = path.join(root, 'content', 'news');
const newsItems = readJsonDir(newsDir).sort((a,b) => new Date(b.data.date) - new Date(a.data.date));
writeIndex(newsDir, newsItems.map(i => i.file));

// GALLERY
const galleryDir = path.join(root, 'content', 'gallery');
const galleryItems = readJsonDir(galleryDir).sort((a,b) => (a.data.order||999)-(b.data.order||999));
writeIndex(galleryDir, galleryItems.map(i => i.file));

// MAIN-CARDS
const cardsDir = path.join(root, 'content', 'main-cards');
const cardItems = readJsonDir(cardsDir).sort((a,b) => (a.data.order||999)-(b.data.order||999));
writeIndex(cardsDir, cardItems.map(i => i.file));

// NOTIFICATIONS
const notifsDir = path.join(root, 'content', 'notifications');
const notifItems = readJsonDir(notifsDir).sort((a,b) => new Date(b.data.date) - new Date(a.data.date));
writeIndex(notifsDir, notifItems.map(i => i.file));

// COMBINED content-index.json (fallback / used by notifications checker)
const index = {
  lastUpdated: new Date().toISOString(),
  settings: (() => { try { return JSON.parse(fs.readFileSync(path.join(root,'settings','site.json'),'utf8')); } catch(e){ return null; } })(),
  news:      newsItems.map(i => i.data),
  gallery:   galleryItems.map(i => i.data),
  mainCards: cardItems.map(i => i.data),
  notice:    (() => { try { return JSON.parse(fs.readFileSync(path.join(root,'content','notice.json'),'utf8')); } catch(e){ return null; } })(),
  upcoming:  (() => { try { return JSON.parse(fs.readFileSync(path.join(root,'content','upcoming.json'),'utf8')); } catch(e){ return null; } })(),
};
fs.writeFileSync(path.join(root, 'content-index.json'), JSON.stringify(index, null, 2));

console.log('\n✅ All indexes rebuilt:');
console.log(`   news: ${newsItems.length}, gallery: ${galleryItems.length}, cards: ${cardItems.length}`);
