#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import https from 'https';

const args = process.argv.slice(2);
const cmd = args[0];
const root = process.cwd();
const outDir = path.join(root, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const defaultFeeds = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
];

function writeJson(name, data) {
  const p = path.join(outDir, name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  console.log(`✅ wrote ${p}`);
  return p;
}

function readJson(name, fallback = null) {
  const p = path.join(outDir, name);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'autocontent-ops/0.1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchText(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => resolve(raw));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
  });
}

function stripCdata(s = '') {
  return s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function parseRssItems(xml) {
  const items = [];
  const chunks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const chunk of chunks) {
    const title = (chunk.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1];
    const link = (chunk.match(/<link>([\s\S]*?)<\/link>/i) || [,''])[1];
    const pubDate = (chunk.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [,''])[1];
    const description = (chunk.match(/<description>([\s\S]*?)<\/description>/i) || [,''])[1];
    if (!title) continue;
    items.push({
      title: stripCdata(title).replace(/<[^>]+>/g, '').trim(),
      url: stripCdata(link),
      publishedAt: stripCdata(pubDate),
      summary: stripCdata(description).replace(/<[^>]+>/g, '').trim().slice(0, 280)
    });
  }
  return items;
}

async function fetchCmd() {
  const feedArgs = args.slice(1);
  const feeds = feedArgs.length ? feedArgs : defaultFeeds;
  const all = [];

  for (const feed of feeds) {
    try {
      const xml = await fetchText(feed);
      const parsed = parseRssItems(xml).slice(0, 8).map((x) => ({ ...x, source: feed }));
      all.push(...parsed);
      console.log(`• ${feed} -> ${parsed.length} items`);
    } catch (e) {
      console.warn(`⚠️ failed ${feed}: ${e.message}`);
    }
  }

  const dedup = new Map();
  for (const item of all) {
    const key = (item.title || '').toLowerCase();
    if (!dedup.has(key)) dedup.set(key, item);
  }

  const normalized = {
    generatedAt: new Date().toISOString(),
    count: dedup.size,
    items: [...dedup.values()].slice(0, 20)
  };

  writeJson('fetched.json', normalized);
}

function briefCmd() {
  const fetched = readJson('fetched.json', { items: [] });
  const top = (fetched.items || []).slice(0, 6);

  const brief = {
    headline: "Today's Market Story",
    subheadline: 'Conflict, chokepoints, and risk repricing',
    sections: {
      trigger: top[0]?.title || 'No source found yet',
      timeline: top.slice(0, 3).map((x) => x.title),
      implications: [
        'Energy route risks may raise volatility',
        'Defensive positioning tends to increase under uncertainty',
        'Cross-asset reactions can diverge from textbook patterns'
      ]
    },
    sourceLinks: top.map((x) => ({ title: x.title, url: x.url, source: x.source })),
    disclaimer: 'For informational use only. Not investment advice.'
  };

  writeJson('brief.json', brief);
}

function captionCmd() {
  const brief = readJson('brief.json', {});
  const headline = brief.headline || 'Market update';
  const sub = brief.subheadline || '';

  const captions = {
    instagram: `${headline}\n\n${sub}\nSwipe for the key trigger, timeline, and what to watch next.\n\n#MarketUpdate #Geopolitics #Macro #Trading #Infographic`,
    linkedin: `${headline} — ${sub}.\n\nThis visual brief summarizes trigger, timeline, and implications in one slide set.`,
    x: `${headline}: ${sub}. Visual breakdown in one thread-style infographic. #Markets #Macro #Geopolitics`
  };

  writeJson('captions.json', captions);
}

function packCmd() {
  const briefPath = path.join(outDir, 'brief.json');
  const captionsPath = path.join(outDir, 'captions.json');
  const pack = {
    generatedAt: new Date().toISOString(),
    assets: {
      imagePrimary: '/tmp/openclaw/uploads/notebooklm_latest_infographic.png',
      imageAlt: '/tmp/openclaw/uploads/2026-03-04-market-news-infographic.png',
      brief: briefPath,
      captions: captionsPath
    },
    checklist: ['Human review', 'Platform policy check', 'Final approval before publish']
  };
  writeJson('pack.json', pack);
}

async function main() {
  switch (cmd) {
    case 'fetch': await fetchCmd(); break;
    case 'brief': briefCmd(); break;
    case 'caption': captionCmd(); break;
    case 'pack': packCmd(); break;
    default:
      console.log('AutoContent Ops CLI');
      console.log('Usage: autocontent <fetch|brief|caption|pack> [feedUrls...]');
  }
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
