# Clara Product Finance case

An individual interview case by **Nágela Carvalho**, covering research, product reasoning, presentation and a proposed payment experience.

This case explores paying suppliers through Clara using funds held at another bank, while preserving company approvals, bank authorization and traceability.

## Start

Requires Node.js 24+ and npm.

```sh
cd central
npm ci
npm run dev
```

- Case hub: `http://127.0.0.1:5173`
- Design system: `http://127.0.0.1:5173/design-system.html`
- Prototype: `http://127.0.0.1:5173/prototype.html`
- Production verification: `cd central && npm run build`

## Repository structure

| Location | Purpose |
| --- | --- |
| `central/` | React application, walkthrough, shared components and independent DS documentation |
| `docs/clara-as-is/` | Research source, original evidence, source register and labeled reconstructions |
| `central/DS_CONTRACT.md` | Interface rules, public API expectations and validation boundaries |
| `central/src/design-system/registry.ts` | Token and component source of truth |

Authored content is in English. Original Clara screenshots and reference PDFs remain unmodified in their source language. Demo evidence, official documentation, reconstruction and proposal are explicitly distinguished. The prototype includes two interactive money paths with simulated bank responses; examples do not execute real payments.

See [application documentation](central/README.md), [research](docs/clara-as-is/README.md) and [design system contract](central/DS_CONTRACT.md).

## Author

Nágela Carvalho · [nanag-carvalho](https://github.com/nanag-carvalho)

Commit identity: `nagelajaceminitab@gmail.com`.

## Rebuild the standalone research HTML

The application syncs the Markdown automatically. To regenerate the standalone HTML copies, use Python 3 in a virtual environment:

```sh
python3 -m venv .venv
.venv/bin/pip install -r docs/clara-as-is/requirements.txt
.venv/bin/python docs/clara-as-is/build_preview.py
```
