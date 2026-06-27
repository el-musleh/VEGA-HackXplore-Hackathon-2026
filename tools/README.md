# tools/

Developer utilities for the IoTrees project.

## scripts/

One-off scripts that are **not part of the application bundle**.

| Script | Purpose |
|--------|---------|
| `parse.py` | Parse `tools/data/karlsruhe.pdf` and generate `src/data/trees.json` (Python) |
| `parse.cjs` | Same as above, Node.js version using `pdf-parse` |

### Running

```bash
# From project root
just parse       # Python version
just parse-js    # Node.js version
```

## data/

Raw source data files (binaries, PDFs, CSVs). **Gitignored** — store locally only.

| File | Source |
|------|--------|
| `karlsruhe.pdf` | Karlsruhe urban tree GeoJSON exported as PDF |
