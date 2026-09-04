# Site institucional da Aves Arca

Criadouro de anatídeos ornamentais de procedência. O site publicado é
**https://avesarca.com.br** e serve a um propósito específico do plano de negócio:
**validar demanda** — descobrir se existe gente disposta a reservar uma ave de
procedência antes de ela nascer.

Não é catálogo decorativo. Cada peça aqui existe para responder a uma pergunta do
protocolo de validação: quem chegou, de onde veio, o que olhou e se pediu.

---

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera dist/
npm run lint     # tsc --noEmit
```

Node 22.

## Como publica

O site é construído pela **Netlify a partir deste repositório**: qualquer alteração
enviada para a branch principal vira uma publicação automática. A configuração está
em `netlify.toml` (build, diretório de funções, cabeçalhos e o fallback de rota do
app de página única).

> **Por que não é mais zip.** Até 07/08/2026 o site subia por Netlify Drop (upload do
> `dist` compactado). Esse caminho **não sobe funções serverless** — a API de deploy por
> zip não suporta. Como o aviso de pedido depende de uma função, a publicação passou a
> ser pelo repositório.

## Estrutura

```
src/
  pages/          Home · Catalog (#especies) · PreReserva (#pre-reserva) · Faq · Privacidade
  components/     GaleriaEspecie · CidadeInput · ListaEspera · AddToCart
  cart/           carrinho (localStorage) — até 10 variedades por pedido
  data/species.ts as variedades do catalogo, níveis e valores de referência
  lib/analytics.ts medição (Umami), captura de UTM e os 15 eventos do funil
netlify/functions/
  pedido-email.mts  aviso de pedido novo, formatado, disparado no evento formSubmitted
```

## Formulários

Dois, ambos gravando em **Netlify > Forms**:

| Formulário | Onde | O que registra |
|---|---|---|
| `pre-reserva` | `#pre-reserva` | o pedido inteiro, com código `PR-DDMM-NNN`, faixa de rota e origem da visita |
| `lista-espera` | fim da `#faq` | quem ainda não compra, mas quer ser avisado |

⚠️ **Armadilha conhecida:** a Netlify só reconhece um formulário que exista no HTML
**lido no momento do deploy**. Como o app é uma página única em React, os dois
formulários existem em versão estática e oculta no `index.html` — **campo novo no React
precisa ser espelhado lá**, senão ele é descartado no envio, em silêncio.

## Variáveis de ambiente

Configuradas em **Netlify → Project configuration → Environment variables**. Nenhuma
delas vai para o repositório.

| Variável | Obrigatória | Para quê |
|---|---|---|
| `RESEND_API_KEY` | sim | chave do provedor que envia o aviso de pedido |
| `EMAIL_DESTINO` | não | destino do aviso. Padrão: `avesarca@gmail.com` |
| `EMAIL_REMETENTE` | não | remetente. Padrão é o de teste do provedor, que **só entrega no e-mail dono da conta** |
| `CONFIRMA_CLIENTE` | não | `1` liga a confirmação por e-mail para o cliente. Só ligar **depois** de verificar o domínio, senão cai em spam |

## Medição

`src/lib/analytics.ts` — Umami Cloud, sem cookie, com os eventos do funil
(`ver_catalogo → add_carrinho → enviar_pedido → pedido_ok`) e a origem da visita
guardada na primeira página aberta. Trocar de ferramenta é preencher uma constante.

## Regras que valem para qualquer alteração

1. **Nunca fingir sucesso.** Se a gravação falhar, a tela avisa e oferece saída — jamais
   mostra confirmação sem registro.
2. **Sem escassez fabricada.** Sem cronômetro, sem "só hoje", sem contador de estoque
   inventado. A disponibilidade informada é a real.
3. **Sem pagamento antecipado.** A pré-reserva é gratuita; o pagamento acontece na
   entrega. Nenhuma tela pode sugerir o contrário.
4. **Foto de ave é dado de biossegurança.** EXIF removido antes de subir — foto com GPS
   entrega a localização do plantel.