// scripts/organize-notebooklm.js
// Run after NotebookLM download: node scripts/organize-notebooklm.js

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DOWNLOADS = path.join(process.env.HOME, 'Downloads');
const UPLOAD_DIR = '/tmp/openclaw/uploads';
const DESKTOP = path.join(process.env.HOME, 'Desktop');

function findRecentInfographics() {
  const files = fs.readdirSync(DOWNLOADS);
  const candidates = files
    .filter(f => f.endsWith('.png'))
    .filter(f => /notebooklm|infographic|studio/i.test(f))
    .map(f => ({
      name: f,
      path: path.join(DOWNLOADS, f),
      stat: fs.statSync(path.join(DOWNLOADS, f))
    }))
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 5);
  return candidates;
}

function organize() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const files = findRecentInfographics();
  
  if (files.length === 0) {
    console.log('⚠️ No recent NotebookLM infographics found in Downloads');
    return;
  }

  files.forEach(file => {
    const targetPath = path.join(UPLOAD_DIR, file.name);
    const desktopPath = path.join(DESKTOP, file.name);
    
    fs.copyFileSync(file.path, targetPath);
    fs.copyFileSync(file.path, desktopPath);
    
    console.log(`✅ ${file.name}`);
    console.log(`   → ${UPLOAD_DIR}`);
    console.log(`   → ${DESKTOP}`);
  });

  console.log('\n🎯 Ready for Instagram upload!');
  console.log('   In IG picker: go to Desktop and select the file');
}

organize();
