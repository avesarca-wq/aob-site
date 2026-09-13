# Aves Ornamentais Brasil — site

Vitrine e pedidos de aves ornamentais **à pronta entrega** de três criadouros parceiros
(Aves Arca, Stima Aves, Criadouro Aliança), com rota de entrega organizada a partir de São Paulo.
Publicado em **https://avesornamentaisbrasil.com.br**. Encomenda / pré-reserva continua no avesarca.com.br.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera dist/
npm run lint     # tsc --noEmit
```

Node 22. Vite + React 19 + TypeScript + Tailwind 4.

## Publicar

A Netlify constrói a partir deste repositório (branch `main`): commit = publicação. `netlify.toml` traz build, funções e cabeçalhos.
Formulário `pedido` = Netlify Forms (precisa existir espelhado no `index.html`). O aviso por e-mail sai pela função
`netlify/functions/pedido-email.mts` (variável `RESEND_API_KEY`).

## Dados (v0.1)

- `src/data/aves.ts` — lotes da lista de 03/09/2026 (gerado a partir do PDF da lista). Na v0.2 vem do Supabase.
- `src/data/catalogo.ts` — categorias, criadouros, calendário de rotas, WhatsApp, constantes.
- `src/data/cidades.ts` + `zonas.ts` — malha de cidades e zonas de frete (herdadas do site Aves Arca).

## Uma base, quatro marcas (12/09/2026)

O mesmo repositório serve o AOB (a rede) e os sites de cada criadouro. A marca
é escolhida no build pela variável `VITE_MARCA`:

| VITE_MARCA | Site                      | Catálogo                     |
|------------|---------------------------|------------------------------|
| `aob` (padrão) | avesornamentaisbrasil.com.br | todos os criadores        |
| `stima`    | stimaaves.com.br          | criador `stima` + `parceiros` |
| `alianca`  | criadouroalianca.com.br   | criador `alianca` + `parceiros` |

Tudo o que varia (nome, domínio, WhatsApp, Umami, frase) está em `src/marcas.ts`.
Na Netlify, cada projeto aponta para este repositório e define a sua
`VITE_MARCA` em *Environment variables*; o build é o mesmo `npm run build`.

Enquanto as aves de parceiro estiverem marcadas como `parceiros` em
`src/data/aves.ts`, Stima e Aliança mostram o mesmo grupo. Quando cada linha
receber o criador certo (`stima` ou `alianca`), o filtro separa sozinho.
