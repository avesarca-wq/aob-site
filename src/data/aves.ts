// src/data/aves.ts — AVES À PRONTA ENTREGA (lista de 13/09/2026, 3 criadouros).
// v0.1: dado estático gerado a partir da "Lista de Aves Disponíveis 03/09/26".
// Na v0.2 esta lista passa a vir do Supabase (tabela `aves`), editada pelos criadores no /painel.
// Regra comercial: preço de casal = macho + fêmea. `preco` é o valor da UNIDADE exibida (`unidade`).
// `preco_de` = preço anterior quando há promoção de setembro (só Aves Arca).
import { Ave, CriadorId } from '../types';
import { MARCA_ATUAL } from '../marcas';
import { PLANTEL_STIMA, Variedade } from './plantel-stima';

export const AVES_TODAS: Ave[] = [
  { id: "ganso-do-egito-branco", nome: "Ganso do Egito Branco", cientifico: "Alopochen aegyptiaca", categoria: "aquaticas", grupo: "Gansos", criador: "aves-arca", machos: 14, femeas: 14, unidade: "casal", preco: 1250, preco_de: 1500, preco_casal: 1500, preco_macho: 975, preco_femea: 750, foto: "/aves/ganso-do-egito-branco.webp", detalhe: "", resumo: "Seleção de plumagem branca do ganso-do-Egito. Tecnicamente uma tadorna ganso-símile africana, é um dos anseriformes ornamentais mais difundidos em coleções do mundo — belo, rústico e de fácil manejo. Muito territorial, com esporões nas asas: pede espaço e separação no período reprodutivo." },
  { id: "ganso-do-egito-marrom", nome: "Ganso do Egito Marrom", cientifico: "Alopochen aegyptiaca", categoria: "aquaticas", grupo: "Gansos", criador: "aves-arca", machos: 10, femeas: 0, unidade: "macho", preco: 450, preco_de: 585, preco_casal: 900, preco_macho: 585, preco_femea: 450, foto: "/aves/ganso-do-egito-marrom.webp", detalhe: "", resumo: "Tecnicamente uma tadorna ganso-símile africana: plumagem parda com a mancha ocular castanha característica, mancha escura no ventre, pernas e bico rosados. É um dos anseriformes ornamentais mais difundidos em coleções do mundo — belo, rústico e de fácil manejo. Muito territorial, com esporões nas asas: pede espaço e separação no período reprodutivo." },
  { id: "ganso-da-abissinia", nome: "Ganso da Abissínia", cientifico: "Cyanochen cyanoptera", categoria: "aquaticas", grupo: "Gansos", criador: "aves-arca", machos: 0, femeas: 1, unidade: "femea", preco: 4500, preco_de: null, preco_casal: 9000, preco_macho: 4500, preco_femea: 4500, foto: "/aves/ganso-da-abissinia.webp", detalhe: "", resumo: "Ganso endêmico das terras altas da Etiópia, de plumagem parda-acinzentada e um painel alar azul-claro característico. Classificado como Vulnerável: antes de tudo um ativo de conservação, que pede manejo genético cuidadoso e rastreabilidade absoluta." },
  { id: "ganso-do-havai", nome: "Ganso do Havaí", cientifico: "Branta sandvicensis", categoria: "aquaticas", grupo: "Gansos", criador: "aves-arca", machos: 0, femeas: 1, unidade: "femea", preco: 3500, preco_de: null, preco_casal: 7000, preco_macho: 3500, preco_femea: 3500, foto: "/aves/ganso-do-havai.webp", detalhe: "", resumo: "O nēnē é ganso terrestre endêmico do Havaí e um dos maiores símbolos da conservação de aves — recuperado da beira da extinção por criação em cativeiro. Adaptado à vida em terra, deve ser tratado como ativo de conservação, com o mais alto padrão documental e legal." },
  { id: "ganso-cereopsis", nome: "Ganso Cereopsis", cientifico: "Cereopsis novaehollandiae", categoria: "aquaticas", grupo: "Gansos", criador: "aves-arca", machos: 0, femeas: 2, unidade: "femea", preco: 4000, preco_de: 5000, preco_casal: 10000, preco_macho: 5000, preco_femea: 5000, foto: "/aves/ganso-cereopsis.webp", detalhe: "", resumo: "O ganso Cape Barren é um dos anseriformes mais singulares do mundo — robusto, cinza-claro e com a cera do bico verde-amarelada inconfundível. Essencialmente terrestre, quase não requer água aberta: sua exigência dominante é ampla área de pastagem." },
  { id: "tadorna-radjah", nome: "Tadorna Radjah", cientifico: "Radjah radjah", categoria: "aquaticas", grupo: "Tadornas", criador: "aves-arca", machos: 8, femeas: 5, unidade: "casal", preco: 3500, preco_de: 4000, preco_casal: 4000, preco_macho: 2000, preco_femea: 2000, foto: "/aves/tadorna-radjah.webp", detalhe: "", resumo: "Tadorna (ganso-símile) de grande elegância: plumagem predominantemente branca com colar castanho no peito, bico e pernas rosados. De ecologia costeira, tolera água salobra e prefere clima quente — belo componente de uma coleção de tadornas." },
  { id: "tadorna-tricolor", nome: "Tadorna Tricolor", cientifico: "Tadorna tadorna", categoria: "aquaticas", grupo: "Tadornas", criador: "aves-arca", machos: 1, femeas: 0, unidade: "macho", preco: 2500, preco_de: 2750, preco_casal: 5500, preco_macho: 2750, preco_femea: 2750, foto: "/aves/tadorna-tricolor.webp", detalhe: "", resumo: "A tadorna-comum do Velho Mundo é inconfundível — três cores fortes: corpo branco, cabeça verde-escura e larga faixa peitoral castanha, com bico vermelho vivo (o macho tem protuberância na base). Rústica e de ecologia costeira, tolera bem água salobra e nidifica em tocas e cavidades." },
  { id: "tadorna-australiana", nome: "Tadorna Australiana", cientifico: "Tadorna tadornoides", categoria: "aquaticas", grupo: "Tadornas", criador: "aves-arca", machos: 1, femeas: 0, unidade: "macho", preco: 7500, preco_de: null, preco_casal: 15000, preco_macho: 7500, preco_femea: 7500, foto: "/aves/tadorna-australiana.webp", detalhe: "", resumo: "Tadorna do sul da Austrália, de plumagem escura com colar branco, peito castanho e painel alar verde e branco. Robusta e territorial, nidifica em cavidades — um belo componente de coleções de tadornas." },
  { id: "marreco-cool-mosaico", nome: "Marreco Cool Mosaico", cientifico: "Anas platyrhynchos", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 12, femeas: 26, unidade: "casal", preco: 400, preco_de: null, preco_casal: 400, preco_macho: 200, preco_femea: 260, foto: "/aves/marreco-cool-mosaico.webp", detalhe: "", resumo: "Seleção de plumagem mosaico da linhagem de marreco. O marreco mallard é o pato de superfície mais difundido do planeta e ancestral da maioria das linhagens domésticas. Rústico, plástico e de fácil manejo, é a porta de entrada acessível da criação — base ideal para quem está começando com procedência." },
  { id: "marreco-cool-arlequim", nome: "Marreco Cool Arlequim", cientifico: "Anas platyrhynchos", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 6, femeas: 1, unidade: "casal", preco: 400, preco_de: null, preco_casal: 400, preco_macho: 200, preco_femea: 260, foto: "/aves/marreco-cool-arlequim.webp", detalhe: "", resumo: "Seleção de plumagem arlequim (manchada/pied) da linhagem de marreco. O marreco mallard é o pato de superfície mais difundido do planeta e ancestral da maioria das linhagens domésticas. Rústico, plástico e de fácil manejo, é a porta de entrada acessível da criação — base ideal para quem está começando com procedência." },
  { id: "marreco-cool-mallard-azul", nome: "Marreco Cool Mallard Azul", cientifico: "Anas platyrhynchos", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 4, femeas: 4, unidade: "casal", preco: 400, preco_de: null, preco_casal: 400, preco_macho: 200, preco_femea: 200, foto: null, detalhe: "", resumo: "" },
  { id: "marreco-cool-gray", nome: "Marreco Cool Gray", cientifico: "Anas platyrhynchos", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 1, femeas: 5, unidade: "casal", preco: 350, preco_de: null, preco_casal: 350, preco_macho: 175, preco_femea: 228, foto: "/aves/marreco-cool-gray.webp", detalhe: "", resumo: "Seleção de cor cinza da linhagem de marreco. O marreco mallard é o pato de superfície mais difundido do planeta e ancestral da maioria das linhagens domésticas. Rústico, plástico e de fácil manejo, é a porta de entrada acessível da criação — base ideal para quem está começando com procedência." },
  { id: "marreco-cool-branco", nome: "Marreco Cool Branco", cientifico: "Anas platyrhynchos", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 0, femeas: 2, unidade: "femea", preco: 225, preco_de: 293, preco_casal: 450, preco_macho: 225, preco_femea: 293, foto: "/aves/marreco-cool-branco.webp", detalhe: "", resumo: "Seleção de plumagem branca da linhagem de marreco. O marreco mallard é o pato de superfície mais difundido do planeta e ancestral da maioria das linhagens domésticas. Rústico, plástico e de fácil manejo, é a porta de entrada acessível da criação — base ideal para quem está começando com procedência." },
  { id: "corredor-indiano", nome: "Corredor Indiano", cientifico: "Anas platyrhynchos dom.", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 6, femeas: 9, unidade: "casal", preco: 350, preco_de: 400, preco_casal: 400, preco_macho: null, preco_femea: null, foto: null, detalhe: "", resumo: "" },
  { id: "spotbill", nome: "Spotbill", cientifico: "Anas poecilorhyncha", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 9, femeas: 6, unidade: "casal", preco: 500, preco_de: null, preco_casal: 500, preco_macho: 250, preco_femea: 250, foto: "/aves/spotbill.webp", detalhe: "", resumo: "Pato de superfície do subcontinente indiano, de porte próximo ao do marreco comum, corpo robusto e plumagem de aspecto escamado castanho-pardo, com a mancha no bico que lhe dá o nome. De ecologia flexível, responde bem a recinto estável, desde que a água seja funcional e haja refúgio. Cruza naturalmente com o marreco — pede recinto próprio para manter a linhagem pura." },
  { id: "marreco-de-laysan", nome: "Marreco de Laysan", cientifico: "Anas laysanensis", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 13, femeas: 0, unidade: "macho", preco: 300, preco_de: 400, preco_casal: 600, preco_macho: 300, preco_femea: 300, foto: null, detalhe: "", resumo: "" },
  { id: "marreco-castanha", nome: "Marreco Castanha", cientifico: "Anas castanea", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 2, femeas: 0, unidade: "macho", preco: 1500, preco_de: null, preco_casal: 3000, preco_macho: 1500, preco_femea: 1500, foto: "/aves/marreco-castanha.webp", detalhe: "", resumo: "Pato de superfície australiano de identidade marcante — o macho exibe cabeça verde-escura iridescente e corpo castanho-avermelhado. Beleza distinta com um perfil de manejo que pede decisões objetivas de água e refúgio; não gosta de recintos simplificados." },
  { id: "bahamensis-canela", nome: "Bahamensis Canela", cientifico: "Anas bahamensis", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 2, femeas: 3, unidade: "casal", preco: 1500, preco_de: null, preco_casal: 1500, preco_macho: 750, preco_femea: 750, foto: null, detalhe: "", resumo: "" },
  { id: "bahamensis-prata", nome: "Bahamensis Prata", cientifico: "Anas bahamensis", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 0, femeas: 2, unidade: "femea", preco: 750, preco_de: null, preco_casal: 1500, preco_macho: 750, preco_femea: 750, foto: null, detalhe: "", resumo: "" },
  { id: "ring-teal", nome: "Ring Teal", cientifico: "Callonetta leucophrys", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 10, femeas: 2, unidade: "casal", preco: 1000, preco_de: 1250, preco_casal: 1250, preco_macho: null, preco_femea: null, foto: null, detalhe: "", resumo: "" },
  { id: "bahamensis-azul", nome: "Bahamensis Azul", cientifico: "Anas bahamensis", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 1, femeas: 1, unidade: "casal", preco: 1500, preco_de: null, preco_casal: 1500, preco_macho: 750, preco_femea: 750, foto: null, detalhe: "", resumo: "" },
  { id: "pato-preto", nome: "Pato Preto", cientifico: "Cairina moschata dom.", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "aves-arca", machos: 0, femeas: 1, unidade: "femea", preco: 80, preco_de: null, preco_casal: 160, preco_macho: 80, preco_femea: 80, foto: null, detalhe: "", resumo: "" },
  { id: "pato-mandarim-gray", nome: "Pato Mandarim Gray", cientifico: "Aix galericulata", categoria: "aquaticas", grupo: "Patos de árvore", criador: "aves-arca", machos: 25, femeas: 0, unidade: "macho", preco: 600, preco_de: null, preco_casal: 1200, preco_macho: 600, preco_femea: 600, foto: "/aves/pato-mandarim-gray.webp", detalhe: "", resumo: "O pato-mandarim é o ícone da avicultura ornamental: plumagem exuberante, corte elaborado e nidificação em cavidade. De médio porte e origem no leste asiático, tem isolamento reprodutivo natural alto — o que protege a pureza das linhagens no plantel." },
  { id: "pato-mandarim-branco", nome: "Pato Mandarim Branco", cientifico: "Aix galericulata", categoria: "aquaticas", grupo: "Patos de árvore", criador: "aves-arca", machos: 9, femeas: 3, unidade: "casal", preco: 2500, preco_de: null, preco_casal: 2500, preco_macho: 1625, preco_femea: 1250, foto: "/aves/pato-mandarim-branco.webp", detalhe: "", resumo: "Variação de plumagem branca (leucística) do pato-mandarim. O pato-mandarim é o ícone da avicultura ornamental: plumagem exuberante, corte elaborado e nidificação em cavidade. De médio porte e origem no leste asiático, tem isolamento reprodutivo natural alto — o que protege a pureza das linhagens no plantel." },
  { id: "pato-carolina-branco", nome: "Pato Carolina Branco", cientifico: "Aix sponsa", categoria: "aquaticas", grupo: "Patos de árvore", criador: "aves-arca", machos: 2, femeas: 1, unidade: "casal", preco: 1500, preco_de: null, preco_casal: 1500, preco_macho: 975, preco_femea: 750, foto: "/aves/pato-carolina-branco.webp", detalhe: "", resumo: "Variação de plumagem branca do pato-carolina. Espécie-irmã do mandarim e frequentemente descrita como o pato mais colorido da América do Norte. De médio porte, nidifica em cavidade e figura entre as aves ornamentais mais valorizadas do mundo — clássico de coleção que combina beleza e boa longevidade (15–20 anos)." },
  { id: "pato-carolina-silver", nome: "Pato Carolina Silver", cientifico: "Aix sponsa", categoria: "aquaticas", grupo: "Patos de árvore", criador: "aves-arca", machos: 4, femeas: 2, unidade: "casal", preco: 12500, preco_de: 15000, preco_casal: 15000, preco_macho: 9750, preco_femea: 7500, foto: "/aves/pato-carolina-silver.webp", detalhe: "", resumo: "Variação de plumagem silver (prateada) do pato-carolina — a mais exclusiva da linha Carolina. Espécie-irmã do mandarim e frequentemente descrita como o pato mais colorido da América do Norte. De médio porte, nidifica em cavidade e figura entre as aves ornamentais mais valorizadas do mundo — clássico de coleção que combina beleza e boa longevidade (15–20 anos)." },
  { id: "pato-carolina-blond", nome: "Pato Carolina Blond", cientifico: "Aix sponsa", categoria: "aquaticas", grupo: "Patos de árvore", criador: "aves-arca", machos: 1, femeas: 0, unidade: "macho", preco: 2000, preco_de: null, preco_casal: 4000, preco_macho: 2000, preco_femea: 2000, foto: "/aves/pato-carolina-blond.webp", detalhe: "", resumo: "Variação de plumagem blond (diluída/clara) do pato-carolina. Espécie-irmã do mandarim e frequentemente descrita como o pato mais colorido da América do Norte. De médio porte, nidifica em cavidade e figura entre as aves ornamentais mais valorizadas do mundo — clássico de coleção que combina beleza e boa longevidade (15–20 anos)." },
  { id: "netta-rufino", nome: "Netta Rufino", cientifico: "Netta rufina", categoria: "aquaticas", grupo: "Mergulhões", criador: "aves-arca", machos: 3, femeas: 10, unidade: "casal", preco: 1300, preco_de: 1500, preco_casal: 1300, preco_macho: 650, preco_femea: 650, foto: "/aves/netta-rufino.webp", detalhe: "", resumo: "Pato mergulhador de médio a grande porte: o macho tem cabeça arredondada laranja-ferrugínea e bico vermelho vivo, de alto contraste nupcial. Alimenta-se sob a água e pede lâmina d'água mais profunda — um mergulhador de forte apelo ornamental." },
  { id: "nyroca", nome: "Nyroca", cientifico: "Aythya nyroca", categoria: "aquaticas", grupo: "Mergulhões", criador: "aves-arca", machos: 3, femeas: 1, unidade: "casal", preco: 4500, preco_de: 5000, preco_casal: 5000, preco_macho: 2500, preco_femea: 2500, foto: "/aves/nyroca.webp", detalhe: "", resumo: "Pato mergulhador elegante, de plumagem castanho-avermelhada intensa, ventre branco e um característico olho branco no macho. Status de conservação sensível (Quase Ameaçado) soma apelo ornamental e valor conservacionista; exige água com profundidade para mergulho." },
  { id: "mergus-cuculatus", nome: "Mergus Cuculatus", cientifico: "Lophodytes cucullatus", categoria: "aquaticas", grupo: "Mergulhões", criador: "aves-arca", machos: 2, femeas: 0, unidade: "macho", preco: 3000, preco_de: 4000, preco_casal: 6000, preco_macho: 3000, preco_femea: 3000, foto: "/aves/mergus-cuculatus.webp", detalhe: "", resumo: "O merganso-capuchinho é um mergulhador piscívoro de bico fino serrilhado, inconfundível pela crista do macho — um leque branco orlado de negro que ele ergue em exibição. Predador de peixes, exige água limpa e profunda e caixas-ninho elevadas." },
  { id: "pavao-azul-casal-jovem", nome: "Pavão Azul", cientifico: "Pavo cristatus", categoria: "pavoes", grupo: "Pavões", criador: "stima", machos: 2, femeas: 1, unidade: "casal", preco: 800, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal jovem · 2M 1F", resumo: "", variedade: "pavao-azul" },
  { id: "pavao-azul-adulto-casal-10-casais", nome: "Pavão Azul adulto", cientifico: "Pavo cristatus", categoria: "pavoes", grupo: "Pavões", criador: "stima", machos: 10, femeas: 10, unidade: "casal", preco: 1600, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 10 casais", resumo: "", variedade: "pavao-azul" },
  { id: "pavao-arlequim-casal-jovem", nome: "Pavão Arlequim", cientifico: "Pavo cristatus (mut.)", categoria: "pavoes", grupo: "Pavões", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 1200, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal jovem · 1M 1F", resumo: "", variedade: "pavao-arlequim" },
  { id: "pavao-branco-casal-jovem", nome: "Pavão Branco", cientifico: "Pavo cristatus (mut.)", categoria: "pavoes", grupo: "Pavões", criador: "stima", machos: 3, femeas: 4, unidade: "casal", preco: 1200, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal jovem · 3M 4F", resumo: "", variedade: "pavao-branco" },
  { id: "pavao-branco-casal-adulto", nome: "Pavão Branco", cientifico: "Pavo cristatus (mut.)", categoria: "pavoes", grupo: "Pavões", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 3000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal adulto", resumo: "", variedade: "pavao-branco" },
  { id: "pavao-purple-femea-arlequim", nome: "Pavão Purple", cientifico: "Pavo cristatus (mut.)", categoria: "pavoes", grupo: "Pavões", criador: "stima", machos: 0, femeas: 1, unidade: "femea", preco: 4500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "fêmea arlequim · 1F", resumo: "", variedade: "pavao-purple" },
  { id: "faisao-canario-casal-jovem", nome: "Faisão Canário", cientifico: "Chrysolophus pictus (mut.)", categoria: "faisoes", grupo: "Faisões", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 800, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal jovem", resumo: "", variedade: "faisao-canario" },
  { id: "faisao-prata-casal-jovem", nome: "Faisão Prata", cientifico: "Lophura nycthemera", categoria: "faisoes", grupo: "Faisões", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 800, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal jovem", resumo: "", variedade: "faisao-prata" },
  { id: "faisao-lady-amherst-macho-1m", nome: "Faisão Lady Amherst", cientifico: "Chrysolophus amherstiae", categoria: "faisoes", grupo: "Faisões", criador: "stima", machos: 1, femeas: 0, unidade: "macho", preco: 400, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "macho · 1M", resumo: "", variedade: "faisao-lady-amherst" },
  { id: "faisao-prelatus-casal-adulto", nome: "Faisão Prelado", cientifico: "Lophura diardi", categoria: "faisoes", grupo: "Faisões", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 3800, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal adulto · 1 casal", resumo: "", variedade: "faisao-prelado" },
  { id: "perdiz-california-casal-2m-2f", nome: "Codorna Califórnia", cientifico: "Callipepla californica", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "stima", machos: 2, femeas: 2, unidade: "casal", preco: 1500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 2M 2F", resumo: "", variedade: "codorna-california" },
  { id: "pomba-guine-femea", nome: "Pomba Guiné", cientifico: "Columba guinea", categoria: "pombas", grupo: "Pombas", criador: "stima", machos: 0, femeas: 1, unidade: "femea", preco: 250, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "fêmea · 1F", resumo: "", variedade: "pomba-guine" },
  { id: "pomba-lofote-casal", nome: "Pomba Lofote", cientifico: "Ocyphaps lophotes", categoria: "pombas", grupo: "Pombas", criador: "stima", machos: 2, femeas: 2, unidade: "casal", preco: 750, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 2 casais", resumo: "", variedade: "pomba-lofote" },
  { id: "pomba-senegal-casal-1-casal", nome: "Pomba Senegal", cientifico: "Spilopelia senegalensis", categoria: "pombas", grupo: "Pombas", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 800, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 1 casal", resumo: "", variedade: "pomba-senegal" },
  { id: "pomba-asa-verde-casal-1-casal", nome: "Pomba Asa Verde", cientifico: "Chalcophaps indica", categoria: "pombas", grupo: "Pombas", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 1500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 1 casal", resumo: "", variedade: "pomba-asa-verde" },
  { id: "marreco-cayuga-casal-3-casais", nome: "Marreco Cayuga", cientifico: "Anas platyrhynchos (Cayuga)", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "stima", machos: 3, femeas: 3, unidade: "casal", preco: 350, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 3 casais", resumo: "", variedade: "marreco-cayuga" },
  { id: "marreco-de-pompom-casal-4m-2f", nome: "Marreco Topetudo", cientifico: "Anas platyrhynchos dom.", categoria: "aquaticas", grupo: "Marrecos de superfície", criador: "stima", machos: 4, femeas: 2, unidade: "casal", preco: 350, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal · 4M 2F", resumo: "", variedade: "marreco-topetudo" },
  { id: "ring-neck-lutino-casal-adulto", nome: "Ring Neck Lutino", cientifico: "Psittacula krameri (mut.)", categoria: "psitacideos", grupo: "Psitacídeos", criador: "stima", machos: 1, femeas: 2, unidade: "casal", preco: 3500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal adulto · 1M 2F", resumo: "", variedade: "ring-neck" },
  { id: "loris-molucanos-casal-adulto", nome: "Lóris Molucano", cientifico: "Eos bornea", categoria: "psitacideos", grupo: "Psitacídeos", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 6000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal adulto", resumo: "", variedade: "loris-molucano" },
  { id: "turaco-leucotis-femea", nome: "Turaco Orelha-branca", cientifico: "Tauraco leucotis", categoria: "turacos", grupo: "Turacos", criador: "stima", machos: 0, femeas: 1, unidade: "femea", preco: 4000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "fêmea", resumo: "", variedade: "turaco-orelha-branca" },
  { id: "turaco-violeta-casal", nome: "Turaco Violeta", cientifico: "Musophaga violacea", categoria: "turacos", grupo: "Turacos", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 9000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "", variedade: "turaco-violeta" },
  { id: "turaco-persa-casal", nome: "Turaco Persa", cientifico: "Tauraco persa", categoria: "turacos", grupo: "Turacos", criador: "stima", machos: 1, femeas: 1, unidade: "casal", preco: 15000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "", variedade: "turaco-persa" },
  { id: "pavao-purple-ombros-negros-casal", nome: "Pavão Purple ombros negros", cientifico: "Pavo cristatus (mut.)", categoria: "pavoes", grupo: "Pavões", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 8000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "pavao-opal-casal", nome: "Pavão Opal", cientifico: "Pavo cristatus (mut.)", categoria: "pavoes", grupo: "Pavões", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 12000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "faisao-swinhoe", nome: "Faisão Swinhoe", cientifico: "Lophura swinhoii", categoria: "faisoes", grupo: "Faisões", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 1500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal adulto", resumo: "" },
  { id: "faisao-eperonier-casal-adulto", nome: "Faisão Eperonier", cientifico: "Polyplectron bicalcaratum", categoria: "faisoes", grupo: "Faisões", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 3500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal adulto", resumo: "" },
  { id: "perdiz-arabe", nome: "Perdiz Árabe", cientifico: "Alectoris melanocephala", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 3000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "perdiz-barbara", nome: "Perdiz Bárbara", cientifico: "Alectoris barbara", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 3000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "perdiz-gambel", nome: "Perdiz Gambel", cientifico: "Callipepla gambelii", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 3500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "francolim-de-papo-amarelo", nome: "Francolim de papo amarelo", cientifico: "Pternistis leucoscepus", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 3500, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "perdiz-escamada-branca", nome: "Perdiz Escamada Branca", cientifico: "Callipepla squamata (mut.)", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 8000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
  { id: "sandgrouse", nome: "Sandgrouse", cientifico: "Pterocles sp.", categoria: "perdizes", grupo: "Perdizes, francolim e sandgrouse", criador: "alianca", machos: 1, femeas: 1, unidade: "casal", preco: 12000, preco_de: null, preco_casal: null, preco_macho: null, preco_femea: null, foto: null, detalhe: "casal", resumo: "" },
];

export const LISTA_DATA = '13/09/2026';

/**
 * Catálogo desta marca. A rede (AOB) mostra tudo; o site de um criadouro só
 * mostra as aves dele (ver src/marcas.ts). Todo o resto do código lê AVES e
 * não precisa saber que existe mais de uma marca.
 */
/**
 * Catálogo-base de cada site de criadouro: a criação inteira, com ou sem lote na
 * semana. A rede não tem — o AOB é lista semanal e mostra só o que tem estoque.
 */
const CATALOGO_BASE: Partial<Record<CriadorId, Variedade[]>> = { stima: PLANTEL_STIMA };

const lotesDaMarca: Ave[] =
  MARCA_ATUAL.criadores === 'todos'
    ? AVES_TODAS
    : AVES_TODAS.filter((a) => (MARCA_ATUAL.criadores as CriadorId[]).includes(a.criador));

/**
 * Junta o catálogo-base com os lotes da semana. Variedade com lote vira o(s)
 * lote(s), herdando foto e resumo da variedade quando o lote não tem os seus;
 * variedade sem lote entra com estoque zero e vira "sob consulta" na vitrine.
 */
function juntar(base: Variedade[], lotes: Ave[], criador: CriadorId): Ave[] {
  const porVariedade = new Map<string, Ave[]>();
  lotes.forEach((l) => {
    if (!l.variedade) return;
    porVariedade.set(l.variedade, [...(porVariedade.get(l.variedade) ?? []), l]);
  });
  const usados = new Set<string>();
  const saida: Ave[] = [];
  base.forEach((v) => {
    const ls = porVariedade.get(v.id);
    if (ls && ls.length) {
      ls.forEach((l) => {
        usados.add(l.id);
        saida.push({
          ...l,
          categoria: v.categoria,
          grupo: v.grupo,
          foto: l.foto ?? v.foto,
          foto_credito: l.foto ? undefined : v.foto_credito,
          resumo: l.resumo || v.resumo,
        });
      });
    } else {
      saida.push({
        id: v.id, nome: v.nome, cientifico: v.cientifico, categoria: v.categoria, grupo: v.grupo,
        criador, machos: 0, femeas: 0, unidade: 'casal', preco: v.preco, preco_de: null,
        preco_casal: v.preco, preco_macho: null, preco_femea: null,
        foto: v.foto, foto_credito: v.foto_credito, detalhe: v.detalhe ?? '', resumo: v.resumo, variedade: v.id,
      });
    }
  });
  // lote que não aponta para variedade nenhuma continua aparecendo
  lotes.forEach((l) => { if (!usados.has(l.id) && !l.variedade) saida.push(l); });
  return saida;
}

/** Toda variedade de catálogo-base, por id, para achar a foto pelo campo `variedade`. */
const VARIEDADE_POR_ID = new Map<string, Variedade>(
  Object.values(CATALOGO_BASE).flatMap((base) => (base ?? []).map((v) => [v.id, v] as const)),
);

/**
 * Foto herdada da variedade quando o lote não tem a sua.
 *
 * Na rede os lotes não passam pelo juntar() — ela lista os lotes de todos os
 * criadouros, sem catálogo-base — e por isso os lotes do Stima apareciam com
 * moldura no AOB enquanto a mesma ave tinha foto no stimaaves.com.br. Só a foto
 * e o crédito são herdados: preço, estoque e texto continuam sendo os do lote.
 */
const comFotoDaVariedade = (l: Ave): Ave => {
  if (l.foto || !l.variedade) return l;
  const v = VARIEDADE_POR_ID.get(l.variedade);
  return v?.foto ? { ...l, foto: v.foto, foto_credito: v.foto_credito } : l;
};

/**
 * Catálogo desta marca. A rede (AOB) mostra os lotes de todos; o site de um
 * criadouro mostra o catálogo-base dele com os lotes da semana por cima.
 * Todo o resto do código lê AVES e não precisa saber que existe mais de uma marca.
 */
export const AVES: Ave[] = (() => {
  if (MARCA_ATUAL.criadores === 'todos') return lotesDaMarca.map(comFotoDaVariedade);
  const dono = (MARCA_ATUAL.criadores as CriadorId[]).find((c) => CATALOGO_BASE[c]);
  return dono ? juntar(CATALOGO_BASE[dono]!, lotesDaMarca, dono) : lotesDaMarca;
})();

/** Só o que tem estoque na semana — contagens e pedido. */
export const AVES_EM_ESTOQUE: Ave[] = AVES.filter((a) => a.machos + a.femeas > 0);
export const TOTAL_AVES = AVES_EM_ESTOQUE.reduce((s, a) => s + a.machos + a.femeas, 0);
export const TOTAL_LOTES = AVES_EM_ESTOQUE.length;
/** Variedades do catálogo — nos sites de criadouro inclui as sem estoque. */
export const TOTAL_VARIEDADES = new Set(AVES.map((a) => a.variedade ?? a.id)).size;
export const aveDoId = (id: string) => AVES.find((a) => a.id === id);
