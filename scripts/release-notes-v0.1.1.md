## v0.1.1 — Real Source Ingestion + Content Pipeline

### Added
- Real RSS ingestion with normalization and deduplication
- Structured brief generation from fetched stories
- Multi-platform caption generation (IG/LinkedIn/X)
- Publish pack metadata with review checklist
- Starter template library (market news / local promo / event recap)

### Usage
```bash
node src/cli.js fetch
node src/cli.js brief
node src/cli.js caption
node src/cli.js pack
```

### Output
- `out/fetched.json`
- `out/brief.json`
- `out/captions.json`
- `out/pack.json`
