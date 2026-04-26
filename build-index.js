const fs = require('fs');
const path = require('path');

// Build content index from all JSON files
function buildIndex() {
  const index = {
    settings: null,
    news: [],
    gallery: [],
    mainCards: [],
    notice: null,
    upcoming: null,
    lastUpdated: new Date().toISOString()
  };
  
  // Load settings
  try {
    const settingsPath = path.join(__dirname, 'settings', 'site.json');
    if (fs.existsSync(settingsPath)) {
      index.settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (error) {
    console.log('No settings found');
  }
  
  // Load news
  try {
    const newsDir = path.join(__dirname, 'content', 'news');
    if (fs.existsSync(newsDir)) {
      const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.json'));
      index.news = files.map(file => {
        const content = JSON.parse(fs.readFileSync(path.join(newsDir, file), 'utf8'));
        return { ...content, _file: file };
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  } catch (error) {
    console.log('No news found');
  }
  
  // Load gallery
  try {
    const galleryDir = path.join(__dirname, 'content', 'gallery');
    if (fs.existsSync(galleryDir)) {
      const files = fs.readdirSync(galleryDir).filter(f => f.endsWith('.json'));
      index.gallery = files.map(file => {
        const content = JSON.parse(fs.readFileSync(path.join(galleryDir, file), 'utf8'));
        return { ...content, _file: file };
      }).sort((a, b) => (a.order || 999) - (b.order || 999));
    }
  } catch (error) {
    console.log('No gallery found');
  }
  
  // Load main cards
  try {
    const cardsDir = path.join(__dirname, 'content', 'main-cards');
    if (fs.existsSync(cardsDir)) {
      const files = fs.readdirSync(cardsDir).filter(f => f.endsWith('.json'));
      index.mainCards = files.map(file => {
        const content = JSON.parse(fs.readFileSync(path.join(cardsDir, file), 'utf8'));
        return { ...content, _file: file };
      }).sort((a, b) => (a.order || 999) - (b.order || 999));
    }
  } catch (error) {
    console.log('No main cards found');
  }
  
  // Load notice
  try {
    const noticePath = path.join(__dirname, 'content', 'notice.json');
    if (fs.existsSync(noticePath)) {
      index.notice = JSON.parse(fs.readFileSync(noticePath, 'utf8'));
    }
  } catch (error) {
    console.log('No notice found');
  }
  
  // Load upcoming
  try {
    const upcomingPath = path.join(__dirname, 'content', 'upcoming.json');
    if (fs.existsSync(upcomingPath)) {
      index.upcoming = JSON.parse(fs.readFileSync(upcomingPath, 'utf8'));
    }
  } catch (error) {
    console.log('No upcoming found');
  }
  
  // Write index file
  fs.writeFileSync(
    path.join(__dirname, 'content-index.json'),
    JSON.stringify(index, null, 2)
  );
  
  console.log('✅ Content index built successfully!');
  console.log(`   - News: ${index.news.length} items`);
  console.log(`   - Gallery: ${index.gallery.length} items`);
  console.log(`   - Main Cards: ${index.mainCards.length} items`);
  console.log(`   - Settings: ${index.settings ? 'loaded' : 'none'}`);
  console.log(`   - Notice: ${index.notice ? 'loaded' : 'none'}`);
  console.log(`   - Upcoming: ${index.upcoming ? 'loaded' : 'none'}`);
}

buildIndex();