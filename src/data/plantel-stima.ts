// src/data/plantel-stima.ts — O CATÁLOGO-BASE DO STIMA AVES (Waldir Bellati, Itatiba).
//
// Diferente da lista semanal (aves.ts), isto é a criação inteira: as 51 variedades
// que o Waldir cria, com ou sem lote pronto no dia. O site da Stima mostra todas —
// a que tem estoque vira lote com preço e botão de pedido; a que não tem aparece
// como "sob consulta" e o botão vira conversa no WhatsApp.
//
// Nomes revisados em 14/09/2026 (ver Catálogo base do Stima Aves). Preços: os que
// estavam na lista de 13/09 e os que repetem a tabela do Aves Arca; null = a fechar.
// Fotos: public/aves-stima/manifesto.json — ilustrativas da espécie (acervo livre),
// até chegarem as do viveiro de Itatiba. O crédito aparece na ficha.
import { CategoriaId } from '../types';

export interface Variedade {
  id: string;
  nome: string;
  cientifico: string;
  categoria: CategoriaId;
  grupo: string;
  preco: number | null;
  /** null = sem foto aceitável em acervo livre; a ficha mostra a moldura da categoria. */
  foto: string | null;
  foto_credito?: string;
  detalhe?: string;
  resumo: string;
}

const f = (id: string) => `/aves-stima/${id}.webp`;

export const PLANTEL_STIMA: Variedade[] = [
  // ---------------- PAVÕES ----------------
  { id: 'pavao-azul', nome: 'Pavão Azul', cientifico: 'Pavo cristatus', categoria: 'pavoes', grupo: 'Pavões', preco: 800, foto: f('pavao-azul'), foto_credito: 'Foto: Richard Bartz · CC BY-SA 2.5 · Wikimedia Commons',
    resumo: 'O pavão-indiano na forma original: macho de peito azul-cobalto e cauda de leque com os ocelos verdes que fizeram a fama da espécie. Rústico, de gramado, e a porta de entrada da coleção — mas pede espaço aberto e poleiro alto, porque dorme no alto e grita ao amanhecer.' },
  { id: 'pavao-branco', nome: 'Pavão Branco', cientifico: 'Pavo cristatus (mut.)', categoria: 'pavoes', grupo: 'Pavões', preco: 1200, foto: f('pavao-branco'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'Mutação leucística do pavão-azul, inteiramente branca, com os olhos escuros normais. A cauda aberta perde os ocelos coloridos e ganha um rendado de plumas brancas — é o pavão de jardim formal. Mesmo manejo do azul.' },
  { id: 'pavao-arlequim', nome: 'Pavão Arlequim', cientifico: 'Pavo cristatus (mut.)', categoria: 'pavoes', grupo: 'Pavões', preco: 1200, foto: f('pavao-arlequim'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'O pied: manchas brancas irregulares sobre a plumagem azul, diferentes em cada ave. Nenhum arlequim é igual a outro — quem compra escolhe a ave, não a variedade. Mesmo porte e manejo do azul.' },
  { id: 'pavao-ombros-negros', nome: 'Pavão Ombros Negros', cientifico: 'Pavo cristatus nigripennis', categoria: 'pavoes', grupo: 'Pavões', preco: null, foto: null,
    resumo: 'Variedade clássica, não mutação de cor: o macho tem as asas pretas lustrosas em vez de barradas, e a fêmea é quase branca com manchas creme. Descrito no século XIX e criado há gerações; mais raro no Brasil que o azul e o branco.' },
  { id: 'pavao-purple', nome: 'Pavão Purple', cientifico: 'Pavo cristatus (mut.)', categoria: 'pavoes', grupo: 'Pavões', preco: 4500, foto: null,
    resumo: 'Mutação recessiva de cor: o azul do peito vira púrpura-vinho e os ocelos da cauda ganham tom de bronze. Uma das variedades mais valorizadas entre criadores, e a que faz a coleção inteira ser respeitada.' },

  // ---------------- FAISÕES ----------------
  { id: 'faisao-lady-amherst', nome: 'Faisão Lady Amherst', cientifico: 'Chrysolophus amherstiae', categoria: 'faisoes', grupo: 'Faisões', preco: 400, foto: f('faisao-lady-amherst'), foto_credito: 'Foto: Reg Mckenna · CC BY 2.0 · Wikimedia Commons',
    resumo: 'Faisão das montanhas da China e de Mianmar: macho de peito branco, coroa vermelha, colar de escamas brancas orladas de preto e cauda longa barrada. Rústico, tolera frio e é o faisão de entrada mais elegante. Não cruzar com o dourado — os híbridos são férteis e contaminam as duas linhagens.' },
  { id: 'faisao-canario', nome: 'Faisão Canário', cientifico: 'Chrysolophus pictus (mut.)', categoria: 'faisoes', grupo: 'Faisões', preco: 800, foto: null,
    resumo: 'O faisão-dourado na mutação amarela: todo o vermelho vira amarelo-canário e o dourado se mantém. Mesma rusticidade e mesmo manejo do dourado, com o efeito visual de um pássaro de luz no viveiro.' },
  { id: 'faisao-dourado', nome: 'Faisão Dourado', cientifico: 'Chrysolophus pictus', categoria: 'faisoes', grupo: 'Faisões', preco: 800, foto: f('faisao-dourado'), foto_credito: 'Foto: Shahzaib Damn Cruze · CC BY-SA 4.0 · Wikimedia Commons',
    resumo: 'O faisão mais criado do mundo, e por bons motivos: macho de crista dourada, colar laranja e ventre vermelho-vivo; rústico, manso e produtivo em viveiro pequeno. A primeira escolha de quem começa com faisões.' },
  { id: 'faisao-prata', nome: 'Faisão Prata', cientifico: 'Lophura nycthemera', categoria: 'faisoes', grupo: 'Faisões', preco: 800, foto: f('faisao-prata'), foto_credito: 'Foto: MZPlus · CC BY 2.0 · Wikimedia Commons',
    resumo: 'Faisão grande do sudeste asiático: macho branco com finas linhas pretas, ventre preto-azulado e a face vermelha nua. Longevo, forte e territorial — um macho por viveiro, sempre.' },
  { id: 'faisao-venerado', nome: 'Faisão Venerado', cientifico: 'Syrmaticus reevesii', categoria: 'faisoes', grupo: 'Faisões', preco: null, foto: f('faisao-venerado'), foto_credito: 'Foto: Ernst Vikne · CC BY-SA 2.0 · Wikimedia Commons',
    resumo: 'O faisão de cauda mais longa que existe — passa de um metro e meio no macho adulto, dourada e barrada de preto. Cabeça branca com máscara escura. Precisa de viveiro comprido para não quebrar a cauda, e é de temperamento forte.' },
  { id: 'faisao-swinhoe', nome: 'Faisão Swinhoe', cientifico: 'Lophura swinhoii', categoria: 'faisoes', grupo: 'Faisões', preco: 1500, foto: f('faisao-swinhoe'), foto_credito: 'Foto: Charles Lam · CC BY-SA 2.0 · Wikimedia Commons',
    resumo: 'Endêmico das florestas de Taiwan: macho azul-escuro metálico com a nuca branca, ombros castanhos e barbelas vermelhas. Espécie listada na CITES; criada em cativeiro há décadas com boa adaptação a viveiro sombreado.' },
  { id: 'faisao-prelado', nome: 'Faisão Prelado', cientifico: 'Lophura diardi', categoria: 'faisoes', grupo: 'Faisões', preco: 3800, foto: f('faisao-prelado'), foto_credito: 'Foto: cuatrok77 hernandez · CC BY 2.0 · Wikimedia Commons',
    resumo: 'O siamese fireback: macho cinza-azulado de face vermelha, com o dorso dourado e a cauda preta metálica. Mais calmo que os outros Lophura e um dos faisões mais bonitos em viveiro de fundo verde.' },
  { id: 'galo-sonnerat', nome: 'Galo Sonnerat', cientifico: 'Gallus sonneratii', categoria: 'faisoes', grupo: 'Faisões', preco: null, foto: f('galo-sonnerat'), foto_credito: 'Foto: Dr. Raju Kasambe · CC BY-SA 4.0 · Wikimedia Commons',
    resumo: 'O galo-selvagem-cinzento da Índia, ancestral parcial da galinha doméstica. Macho de pescoço com penas cerosas amarelas e pretas, únicas entre as aves. É galiforme como o faisão e vive bem no mesmo tipo de viveiro; fica nesta aba por afinidade de manejo.' },

  // ---------------- PERDIZES E CODORNAS ----------------
  { id: 'perdiz-chukar', nome: 'Perdiz Chukar', cientifico: 'Alectoris chukar', categoria: 'perdizes', grupo: 'Perdizes e codornas', preco: null, foto: f('perdiz-chukar'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'Perdiz de terreno seco e pedregoso, da Grécia à China: cinza-arenosa, com o colar preto e os flancos barrados. Vive em casal ou pequeno grupo, empoleira pouco e gosta de chão com areia para banho. A perdiz verdadeira mais comum na avicultura.' },
  { id: 'codorna-escamada', nome: 'Codorna Escamada', cientifico: 'Callipepla squamata', categoria: 'perdizes', grupo: 'Perdizes e codornas', preco: null, foto: f('codorna-escamada'), foto_credito: 'Foto ilustrativa · CC BY-SA · Wikimedia Commons',
    resumo: 'Codorna do Novo Mundo, do sul dos Estados Unidos e do México: plumagem cinza-azulada com o desenho escamado que dá o nome e um topete branco. O mercado chama de perdiz; é codorna. Vive em casal e gosta de viveiro seco.' },
  { id: 'codorna-california', nome: 'Codorna Califórnia', cientifico: 'Callipepla californica', categoria: 'perdizes', grupo: 'Perdizes e codornas', preco: 1500, foto: f('codorna-california'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'A codorna do topete em forma de gota, símbolo da Califórnia. Macho de face preta contornada de branco e ventre escamado. Sociável e ativa, faz bem em viveiro plantado; um dos galiformes pequenos mais bonitos em coleção.' },

  // ---------------- PSITACÍDEOS ----------------
  { id: 'ring-neck', nome: 'Ring Neck', cientifico: 'Psittacula krameri (mut.)', categoria: 'psitacideos', grupo: 'Psitacídeos', preco: 3500, foto: f('ring-neck'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'O periquito-de-colar, em mutações de cor: lutino, azul, branco, cinza, canela e as combinações. Fala, é longevo e aguenta frio; precisa de viveiro com poleiros de madeira para roer. A ficha lista as cores disponíveis na semana.' },
  { id: 'rosela', nome: 'Rosela', cientifico: 'Platycercus eximius', categoria: 'psitacideos', grupo: 'Psitacídeos', preco: null, foto: f('rosela'), foto_credito: 'Foto: JJ Harrison · CC BY-SA 3.0 · Wikimedia Commons',
    resumo: 'Periquito australiano de cores em blocos: cabeça e peito vermelhos, bochechas brancas, dorso escamado de preto e amarelo. Não é ave de mão — é de viveiro, onde voa e se exibe. Casal por viveiro; briga com outros psitacídeos.' },
  { id: 'neophema', nome: 'Neophema', cientifico: 'Neophema spp.', categoria: 'psitacideos', grupo: 'Psitacídeos', preco: null, foto: null,
    resumo: 'Os periquitos-da-relva australianos — esplêndido, elegante, de Bourke — pequenos, silenciosos e mansos. Ideais para quem tem viveiro pequeno ou vizinhos perto. A ficha diz quais espécies estão no plantel.' },
  { id: 'loris-molucano', nome: 'Lóris Molucano', cientifico: 'Eos bornea', categoria: 'psitacideos', grupo: 'Psitacídeos', preco: 6000, foto: f('loris-molucano'), foto_credito: 'Foto: Andrew Kraker · CC BY 2.0 · Wikimedia Commons',
    resumo: 'O lóris-vermelho das Molucas: vermelho intenso com as asas orladas de azul e preto. Come néctar e fruta, não semente — pede papa própria todos os dias e limpeza redobrada. Brincalhão e barulhento; para quem quer uma ave de personalidade.' },

  // ---------------- POMBAS ----------------
  { id: 'pomba-guine', nome: 'Pomba Guiné', cientifico: 'Columba guinea', categoria: 'pombas', grupo: 'Pombas', preco: 250, foto: f('pomba-guine'), foto_credito: 'Foto: Krigore · CC BY-SA 4.0 · Wikimedia Commons',
    resumo: 'Pomba africana de porte grande, com as asas salpicadas de branco e a pele vermelha ao redor do olho. Rústica e boa reprodutora em viveiro; a entrada da coleção de pombas.' },
  { id: 'pomba-lofote', nome: 'Pomba Lofote', cientifico: 'Ocyphaps lophotes', categoria: 'pombas', grupo: 'Pombas', preco: 750, foto: f('pomba-lofote'), foto_credito: 'Foto: Benjamint444 · CC BY-SA 3.0 · Wikimedia Commons',
    resumo: 'A pomba-de-crista australiana: cinza-clara, com o topete fino e ereto e as asas com painéis verde e púrpura metálicos. As asas assobiam ao voar. Mansa, de chão, boa em viveiro misto com galiformes calmos.' },
  { id: 'pomba-senegal', nome: 'Pomba Senegal', cientifico: 'Spilopelia senegalensis', categoria: 'pombas', grupo: 'Pombas', preco: 800, foto: f('pomba-senegal'), foto_credito: 'Foto: Giles Laurent · CC BY-SA 4.0 · Wikimedia Commons',
    resumo: 'A rola-do-senegal, pequena e rosada, com o colar de manchas pretas e douradas no pescoço. Voz suave, reprodução fácil e temperamento tranquilo — uma das pombas mais agradáveis de se ter perto de casa.' },
  { id: 'pomba-asa-verde', nome: 'Pomba Asa Verde', cientifico: 'Chalcophaps indica', categoria: 'pombas', grupo: 'Pombas', preco: 1500, foto: f('pomba-asa-verde'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'A pomba-esmeralda do sul da Ásia: asas verde-metálicas sobre o corpo rosado, bico vermelho-coral. Pomba de chão e de sombra; vive bem em viveiro plantado e não gosta de sol forte.' },
  { id: 'rolinha-zebrinha', nome: 'Rolinha Zebrinha', cientifico: 'Geopelia striata', categoria: 'pombas', grupo: 'Pombas', preco: null, foto: f('rolinha-zebrinha'), foto_credito: 'Foto: NorbertNagel · CC BY-SA 4.0 · Wikimedia Commons',
    resumo: 'A rola-zebra do sudeste asiático, miúda e barrada de preto e branco no pescoço e nos flancos. Canto suave e repetido; uma das rolinhas mais criadas do mundo. Não confundir com a rolinha-diamante, que é menor e tem o olho orlado de vermelho.' },

  // ---------------- PATOS, MARRECOS E CISNE ----------------
  { id: 'pato-mandarim', nome: 'Pato Mandarim', cientifico: 'Aix galericulata', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 1200, foto: f('pato-mandarim'), foto_credito: 'Foto: Aves Arca',
    resumo: 'O ícone da avicultura ornamental: macho com as velas alaranjadas nas asas, o leque de penas na face e a crista verde-púrpura. De médio porte, nidifica em cavidade e tem isolamento reprodutivo alto, o que mantém a linhagem pura no lago.' },
  { id: 'pato-carolina', nome: 'Pato Carolina', cientifico: 'Aix sponsa', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 1500, foto: f('pato-carolina'), foto_credito: 'Foto: Aves Arca',
    resumo: 'Espécie-irmã do mandarim, da América do Norte, e descrita como o pato mais colorido do continente: crista verde e púrpura com linhas brancas, olho vermelho, peito castanho pontilhado. Nidifica em cavidade e vive 15 a 20 anos.' },
  { id: 'marreco-cool-mosaico', nome: 'Marreco Cool Mosaico', cientifico: 'Anas platyrhynchos', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 400, foto: '/aves/marreco-cool-mosaico.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Seleção de plumagem mosaico da linhagem de marreco. O mallard é o pato de superfície mais difundido do planeta: rústico, plástico e de fácil manejo — a porta de entrada do lago.' },
  { id: 'marreco-cool-arlequim', nome: 'Marreco Cool Arlequim', cientifico: 'Anas platyrhynchos', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 400, foto: '/aves/marreco-cool-arlequim.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Seleção de plumagem arlequim (manchada) da linhagem de marreco: cada ave tem um desenho. Mesma rusticidade do mallard, mesmo manejo simples.' },
  { id: 'marreco-cool-gray', nome: 'Marreco Cool Gray', cientifico: 'Anas platyrhynchos', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 350, foto: '/aves/marreco-cool-gray.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Seleção de cor cinza da linhagem de marreco — o macho mantém a cabeça verde metálica sobre o corpo acinzentado. Rústico e prolífico.' },
  { id: 'marreco-cool-branco', nome: 'Marreco Cool Branco', cientifico: 'Anas platyrhynchos', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 450, foto: '/aves/marreco-cool-branco.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Seleção branca da linhagem de marreco, de bico e patas alaranjados. O contraste com a água escura é o que faz dele o preferido para lago de jardim.' },
  { id: 'marreco-cayuga', nome: 'Marreco Cayuga', cientifico: 'Anas platyrhynchos dom.', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 350, foto: null,
    resumo: 'Raça americana de pato doméstico, preta com reflexo verde-escaravelho que muda com a luz. Calmo, silencioso e bom poedeiro; um dos patos domésticos mais bonitos que existem.' },
  { id: 'marreco-topetudo', nome: 'Marreco Topetudo', cientifico: 'Anas platyrhynchos dom.', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 350, foto: null, detalhe: '5 cores',
    resumo: 'O pato de pompom: um tufo redondo de penas no alto da cabeça, em cinco cores no plantel. Manso, de quintal, e o favorito de quem tem criança em casa. Vendido como marreco de pompom nas feiras.' },
  { id: 'marreco-spotbill', nome: 'Marreco Spotbill', cientifico: 'Anas poecilorhyncha', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: 500, foto: '/aves/spotbill.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Pato de superfície do subcontinente indiano, de plumagem escamada castanha e a mancha amarela na ponta do bico que dá o nome. Cruza com o marreco comum — pede recinto próprio para manter a linhagem pura.' },
  { id: 'cisne-negro', nome: 'Cisne Negro', cientifico: 'Cygnus atratus', categoria: 'aquaticas', grupo: 'Patos, marrecos e cisne', preco: null, foto: f('cisne-negro'), foto_credito: 'Foto: Francis C. Franklin · CC BY-SA 3.0 · Wikimedia Commons',
    resumo: 'O cisne australiano: preto com as rêmiges brancas que só aparecem em voo, e o bico vermelho com a barra branca. Forma casal para a vida e defende o ninho com vigor. Pede lago de verdade — não tanque — e margem gramada para pastar.' },

  // ---------------- TADORNAS E GANSOS ----------------
  { id: 'tadorna-ferruginea', nome: 'Tadorna Ferrugínea', cientifico: 'Tadorna ferruginea', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: null, foto: f('tadorna-ferruginea'), foto_credito: 'Foto: Aves Arca',
    resumo: 'A tadorna laranja-ferrugem da Ásia Central, com a cabeça mais clara e o colar preto fino no macho. Rústica, territorial na reprodução e boa de pasto; um dos anatídeos de meio porte mais fáceis de criar.' },
  { id: 'tadorna-radjah', nome: 'Tadorna Radjah', cientifico: 'Radjah radjah', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: 4000, foto: '/aves/tadorna-radjah.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Tadorna da Austrália e da Nova Guiné: branca com o colar castanho no peito, bico e pernas rosados. De ecologia costeira, tolera água salobra e prefere clima quente — vai bem no interior paulista.' },
  { id: 'tadorna-tricolor', nome: 'Tadorna Tricolor', cientifico: 'Tadorna tadorna', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: 5500, foto: '/aves/tadorna-tricolor.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'A tadorna-comum do Velho Mundo: corpo branco, cabeça verde-escura e a larga faixa castanha no peito, com bico vermelho vivo. Nidifica em toca; rústica e imponente na margem do lago.' },
  { id: 'ganso-do-egito', nome: 'Ganso do Egito', cientifico: 'Alopochen aegyptiaca', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: 900, foto: '/aves/ganso-do-egito-marrom.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Tecnicamente uma tadorna ganso-símile africana: plumagem parda com a mancha castanha ao redor do olho, pernas rosadas. Um dos anseriformes ornamentais mais difundidos do mundo — belo, rústico e territorial; pede espaço na reprodução.' },
  { id: 'ganso-do-egito-branco', nome: 'Ganso do Egito Branco', cientifico: 'Alopochen aegyptiaca (mut.)', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: 1500, foto: '/aves/ganso-do-egito-branco.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'Seleção de plumagem branca do ganso-do-Egito, mantendo o porte e a rusticidade da forma selvagem. Mesmo manejo; contraste forte no gramado.' },
  { id: 'ganso-sinaleiro-buff', nome: 'Ganso Sinaleiro Buff', cientifico: 'Anser cygnoides dom.', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: null, foto: null,
    resumo: 'O ganso chinês, de pescoço longo e calombo na base do bico, na cor buff (creme-dourada). É o ganso que avisa: barulhento com estranhos, e por isso chamado de sinaleiro. Ótimo pastador e bom guarda de sítio.' },
  { id: 'ganso-sinaleiro-splash', nome: 'Ganso Sinaleiro Splash', cientifico: 'Anser cygnoides dom.', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: null, foto: null,
    resumo: 'O ganso sinaleiro na variedade splash — branco salpicado de cinza, cada ave com um desenho. Mesmo porte, mesma voz e o mesmo temperamento de guarda.' },
  { id: 'ganso-toulouse', nome: 'Ganso Toulouse', cientifico: 'Anser anser dom.', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: null, foto: null,
    resumo: 'A raça francesa de ganso pesado, cinza, de peito profundo e barbela. Calmo, lento e de grande porte — ganso de pasto largo, não de lago pequeno. Um dos gansos domésticos mais tradicionais da Europa.' },
  { id: 'ganso-canadense', nome: 'Ganso Canadense', cientifico: 'Branta canadensis', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: null, foto: f('ganso-canadense'), foto_credito: 'Foto: Karrackoo · CC BY-SA 3.0 · Wikimedia Commons',
    resumo: 'O ganso da América do Norte, de cabeça preta com a bochecha branca e corpo pardo. Grande, forte e fiel ao casal; pasta mais do que nada. É a ave que, no áudio do Waldir, faz o cliente confiar no resto do plantel.' },
  { id: 'ganso-do-havai', nome: 'Ganso do Havaí', cientifico: 'Branta sandvicensis', categoria: 'aquaticas', grupo: 'Tadornas e gansos', preco: 7000, foto: '/aves/ganso-do-havai.webp', foto_credito: 'Foto: Aves Arca',
    resumo: 'O nēnē, ganso terrestre endêmico do Havaí e um dos maiores símbolos da conservação de aves — recuperado da beira da extinção por criação em cativeiro. Pescoço com sulcos dourados, pés pouco palmados. Ativo de conservação: pede o mais alto padrão documental.' },

  // ---------------- TURACOS ----------------
  { id: 'turaco-persa', nome: 'Turaco Persa', cientifico: 'Tauraco persa', categoria: 'turacos', grupo: 'Turacos', preco: 15000, foto: f('turaco-persa'), foto_credito: 'Foto: Daniel S. Katz · CC BY 4.0 · Wikimedia Commons',
    resumo: 'O turaco-da-guiné: verde-esmeralda com a crista arredondada, o olho orlado de vermelho e as asas que abrem em carmim. O verde da plumagem é pigmento próprio, a turacoverdina, que não existe em nenhuma outra ave. Frugívoro; vive em viveiro alto e plantado.' },
  { id: 'turaco-violeta', nome: 'Turaco Violeta', cientifico: 'Musophaga violacea', categoria: 'turacos', grupo: 'Turacos', preco: 9000, foto: f('turaco-violeta'), foto_credito: 'Foto: DickDaniels · CC BY-SA 3.0 · Wikimedia Commons',
    resumo: 'Turaco da África Ocidental, violeta-escuro com a coroa carmim e o bico amarelo com a base vermelha. Em voo, as asas mostram o vermelho que só os turacos têm. Ave de casal, de viveiro alto, e de dieta de fruta.' },
  { id: 'turaco-orelha-branca', nome: 'Turaco Orelha-branca', cientifico: 'Tauraco leucotis', categoria: 'turacos', grupo: 'Turacos', preco: 4000, foto: f('turaco-orelha-branca'), foto_credito: 'Foto: Chrumps · CC BY-SA 3.0 · Wikimedia Commons',
    resumo: 'Turaco da Etiópia, verde com a cabeça azul-escura e a mancha branca na orelha que dá o nome. O mais acessível dos turacos e o mais fácil de reproduzir em viveiro; boa entrada para quem quer começar no grupo.' },

  // ---------------- PERUS ----------------
  { id: 'peru', nome: 'Peru', cientifico: 'Meleagris gallopavo dom.', categoria: 'perus', grupo: 'Perus', preco: null, foto: f('peru'), foto_credito: 'Foto: Anil Öztas · CC BY-SA 4.0 · Wikimedia Commons', detalhe: 'Bronze · Branco · Preto · Royal Palm',
    resumo: 'Peru doméstico em quatro cores: Bronze (o mais próximo do selvagem), Branco, Preto e Royal Palm (branco com barras pretas). Ave de quintal e de pasto, vendida por cabeça; fauna doméstica, sem exigência de anilha ou registro.' },

  // ---------------- GALINHAS-D'ANGOLA ----------------
  { id: 'galinha-dangola', nome: 'Galinha-d’angola', cientifico: 'Numida meleagris', categoria: 'angolas', grupo: 'Galinhas-d’angola', preco: null, foto: f('galinha-dangola'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons', detalhe: 'Chita · Branca · Azul · Lilás · Chocolate',
    resumo: 'A galinha-d’angola em cinco cores: chita (a pérola clássica), branca, azul, lilás e chocolate. Vigia do quintal, come carrapato e vive em bando. Fauna doméstica pela Portaria IBAMA 93/1998 — venda livre, sem anilha.' },

  // ---------------- EMU ----------------
  { id: 'emu', nome: 'Emu', cientifico: 'Dromaius novaehollandiae', categoria: 'emu', grupo: 'Emu', preco: null, foto: f('emu'), foto_credito: 'Foto ilustrativa · CC0 · Wikimedia Commons',
    resumo: 'A segunda maior ave do mundo, ratita australiana de pasto. Pede área aberta, cerca alta de 1,8 m e alimentação de ração e pastagem; é dócil quando criada desde filhote. Não confundir com a ema (Rhea americana), que é fauna nativa e segue outra regra.' },
];

/** Índice por id. */
export const VARIEDADE: Record<string, Variedade> = Object.fromEntries(PLANTEL_STIMA.map((v) => [v.id, v]));
