# Marca Aves Ornamentais Brasil — V7 (07/09/2026)

Logotipo **V7**: três penas (ouro = Aves Arca, verde-escuro e verde = criadouros parceiros),
BRASIL em **Fraunces 800 com eixo WONK**, a **pena central no lugar do I** e a **rota pontilhada
ancorada no B, no A e no L**. Sem tagline: a rota é a assinatura.

## Arquivos publicados em `public/`
| arquivo | onde é usado |
|---|---|
| `logo-horizontal.png` | cabeçalho (Header.tsx) — creme, fundo transparente |
| `logo-selo.png` | rodapé (Footer.tsx) e herói da Home — creme, transparente |
| `og-image.png` | compartilhamento (og:image) — 1200×630, fundo verde |
| `icone.svg` | favicon vetorial (só o símbolo) |
| `favicon-32.png`, `favicon-192.png` | favicon e apple-touch-icon |
| `logo-selo-escuro.svg` | `logo` do schema.org em index.html |

`brand/kit/` traz o kit completo (SVG claro/escuro, PNG 2560, perfil 1080, OG, favicons).

## Como reproduzir
Os arquivos são **gerados por código**, não desenhados à mão:

    python3 brand/t4.py     # gera os SVGs de todas as variações

`t4.py` depende de `refino.py` (penas e métricas), `variantes.py` e `logos.py` (paleta e helpers).
`metrics_t4.json` guarda o **kerning ótico** de BRASIL medido letra a letra (vãos de tinta
igualados em 60%) e o tamanho que faz BRASIL, AVES ORNAMENTAIS e a rota terem a mesma largura.
Refazer a medição: `python3` sobre o script em `/tmp/kern2.py` do histórico, ou remedir com o
mesmo método (Canvas `measureText` + `actualBoundingBox`).

## Paleta
- verde-floresta `#1F3B2E` — fundo escuro e traço em fundo claro
- ouro `#D2A93C` — Aves Arca, "AVES ORNAMENTAIS", primeiro ponto da rota
- verde `#1E8E5A` — parceiros, último ponto da rota
- creme `#F6F1E6` — marca sobre fundo escuro

## Tipografia
- **Fraunces** (variável) — BRASIL, peso 800, `WONK 1, SOFT 100, opsz 144`
- **Montserrat** 600 — AVES ORNAMENTAIS, entreletra 6,98
