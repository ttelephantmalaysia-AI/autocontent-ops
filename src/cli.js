#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const cmd = args[0];
const root = process.cwd();
const outDir = path.join(root, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function writeJson(name, data) {
  const p = path.join(outDir, name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  console.log(`✅ wrote ${p}`);
  return p;
}

function fetchCmd() {
  const sample = {
    generatedAt: new Date().toISOString(),
    items: [
      { title: 'Sample market headline', source: 'manual', url: '', summary: 'Replace with real source ingestion.' }
    ]
  };
  writeJson('fetched.json', sample);
}

function briefCmd() {
  const brief = {
    headline: 'Today\'s Market Story',
    subheadline: 'Conflict, chokepoints, and risk repricing',
    points: [
      'Key trigger and timeline',
      'Who is involved',
      'What changed in risk landscape',
      'What to monitor next'
    ],
    disclaimer: 'For informational use only. Not investment advice.'
  };
  writeJson('brief.json', brief);
}

function captionCmd() {
  const captions = {
    instagram: 'Geopolitics moved fast — here\'s the visual breakdown. Save this for your daily briefing. #MarketUpdate #Geopolitics #Trading',
    linkedin: 'A concise conflict-to-market impact brief for operators and founders. Visual summary attached.',
    x: 'Conflict escalation rewired risk assets in hours. Visual brief below. #Markets #Macro #Geopolitics'
  };
  writeJson('captions.json', captions);
}

function packCmd() {
  const pack = {
    assets: {
      image: '/tmp/openclaw/uploads/notebooklm_latest_infographic.png',
      brief: path.join(outDir, 'brief.json'),
      captions: path.join(outDir, 'captions.json')
    },
    checklist: ['Human review', 'Platform policy check', 'Final approval before publish']
  };
  writeJson('pack.json', pack);
}

switch (cmd) {
  case 'fetch': fetchCmd(); break;
  case 'brief': briefCmd(); break;
  case 'caption': captionCmd(); break;
  case 'pack': packCmd(); break;
  default:
    console.log('AutoContent Ops CLI');
    console.log('Usage: autocontent <fetch|brief|caption|pack>');
}
