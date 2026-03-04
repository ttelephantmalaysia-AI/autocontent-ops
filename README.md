# AutoContent Ops

**News → Brief → Caption → Publish Pack** for small teams.

AutoContent Ops helps you turn fast-moving news into infographic-ready briefs and social captions in minutes.

## Why this exists

Most SMB teams don’t have a full editorial desk. This tool gives a repeatable content pipeline:

- Fetch relevant stories from trusted feeds
- Generate an infographic-ready brief
- Generate platform-specific captions
- Export a publish-ready content pack with review checklist

## Quickstart (30 seconds)

```bash
git clone https://github.com/ttelephantmalaysia-AI/autocontent-ops.git
cd autocontent-ops
node src/cli.js fetch
node src/cli.js brief
node src/cli.js caption
node src/cli.js pack
```

Outputs are written to `./out`.

## CLI Commands

- `fetch [feedUrls...]` → ingest RSS and normalize to `out/fetched.json`
- `brief` → build structured brief to `out/brief.json`
- `caption` → generate IG/LinkedIn/X captions to `out/captions.json`
- `pack` → create publish pack metadata to `out/pack.json`

## Example templates

See `examples/`:

- `market-news-template.json`
- `local-business-promo-template.json`
- `event-recap-template.json`

## Demo output snapshot

- `out/fetched.json` — normalized source data
- `out/brief.json` — infographic narrative skeleton
- `out/captions.json` — multi-platform captions
- `out/pack.json` — publish-ready checklist + assets

## Roadmap

- [x] v0.1.0 scaffold (CLI + templates + contribution docs)
- [x] v0.1.1 real RSS ingestion and structured outputs
- [ ] v0.2.0 keyword filtering + bilingual captions
- [ ] v0.3.0 plugin system + integrations

## Contributing

PRs and issues are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
