import React, { useState } from 'react';
import { PageRoute } from '../types';
import { CONSTANTS } from '../data/species';
import { CIDADES, Cidade } from '../data/cidades';
import { ZONAS, RETIRADA, zonaDaCidade } from '../data/zonas';
import { Truck, MapPin, Clock, ShieldCheck, MessageCircle, Calendar, ArrowRight, Plane, Search } from 'lucide-react';

interface EntregaProps {
  onNavigate?: (page: PageRoute) => void;
}

export const Entrega: React.FC<EntregaProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const trimmedQuery = searchQuery.trim();
  const normalizedQuery = normalizeText(trimmedQuery);

  const searchResults = trimmedQuery.length >= 2
    ? CIDADES.filter(cidade =>
        normalizeText(cidade.c).includes(normalizedQuery) ||
        normalizeText(cidade.uf).includes(normalizedQuery) ||
        normalizeText(cidade.r).includes(normalizedQuery)
      ).slice(0, 8)
    : [];

  const showNotFound = trimmedQuery.length >= 3 && searchResults.length === 0;

  // Cidades para Entrega rápida (Grande São Paulo) - top 24 por população
  const entregaRapidaCidades = CIDADES
    .filter(c => c.r === 'Entrega rápida (Grande São Paulo)')
    .sort((a, b) => b.p - a.p)
    .slice(0, 24);

  const rotasRegionais = [
    {
      titulo: '1. Rio de Janeiro e Vale do Paraíba',
      regionKey: 'Rio de Janeiro e Vale do Paraíba',
      descricao: 'Atendimento do Vale do Paraíba, Região Serrana, Capital Fluminense e Região dos Lagos.',
    },
    {
      titulo: '2. Sul de Minas e Belo Horizonte',
      regionKey: 'Sul de Minas e Belo Horizonte',
      descricao: 'Cobertura abrangendo o Sul de Minas Gerais, Campo das Vertentes e Região Metropolitana de BH.',
    },
    {
      titulo: '3. Ribeirão Preto e Triângulo',
      regionKey: 'Ribeirão Preto e Triângulo',
      descricao: 'Eixo do Interior Paulista, Alta Mogiana e Triângulo Mineiro.',
    },
    {
      titulo: '4. Centro-Oeste Paulista e Norte do Paraná',
      regionKey: 'Centro-Oeste Paulista e Norte do Paraná',
      descricao: 'Conexão entre o Centro-Oeste do estado de SP e a região Norte do Paraná.',
    },
    {
      titulo: '5. Litoral do Paraná a Santa Catarina',
      regionKey: 'Litoral do Paraná a Santa Catarina',
      descricao: 'Atendimento do Vale do Ribeira, Região de Curitiba, Litoral Norte e Vale do Itajaí em SC.',
    },
  ];

  return (
    <div>
      {/* HEADER HERO */}
      <section className="bg-[#FAFBF8] py-14 border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="eyebrow">Logística e Transporte</div>
          <h1 className="sec-title text-3xl sm:text-4xl font-serif font-semibold text-[#4A5D4E]">
            Onde entregamos — transporte terrestre e aéreo
          </h1>
          <p className="sec-sub text-lg mb-0">
            Atendemos por rota terrestre (SP, MG, RJ, PR e SC) e por frete aéreo para o restante do Brasil, com todo o cuidado no bem-estar da carga viva. As rotas terrestres são programadas conforme os pedidos acumulados em cada região — a data é combinada com você pelo WhatsApp. Também é possível retirar no ponto de encontro oficial.
          </p>
        </div>
      </section>

      {/* SEÇÃO BUSCA DE CIDADE */}
      <section className="py-10 bg-white border-b border-[#E0E2D9]">
        <div className="wrap max-w-3xl mx-auto">
          <div className="bg-[#FAFBF8] p-6 sm:p-8 rounded-2xl border border-[#E0E2D9] shadow-xs">
            <label htmlFor="busca-cidade" className="block font-serif text-xl font-semibold text-[#4A5D4E] mb-2">
              Encontre sua cidade
            </label>
            <p className="font-serif text-sm text-[#5A635C] mb-4">
              Digite o nome da sua cidade para verificar a rota de atendimento terrestre correspondente.
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A635C]">
                <Search className="w-5 h-5 text-[#C1732B]" />
              </div>
              <input
                id="busca-cidade"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: São Paulo, Campinas, Curitiba, Juiz de Fora..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E0E2D9] rounded-xl font-sans text-sm text-[#2D3436] placeholder-[#8C968F] focus:outline-none focus:border-[#4A5D4E] focus:ring-1 focus:ring-[#4A5D4E] transition-all"
              />
            </div>

            {/* RESULTADOS DA BUSCA */}
            {searchResults.length > 0 && (
              <div className="mt-4 bg-white border border-[#E0E2D9] rounded-xl overflow-hidden divide-y divide-[#E0E2D9] shadow-xs">
                {searchResults.map((item, idx) => {
                  const zona = zonaDaCidade(item);
                  return (
                    <div
                      key={`${item.c}-${item.uf}-${idx}`}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAFBF8] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C1732B] shrink-0" />
                        <span className="font-serif font-semibold text-[#4A5D4E] text-base">
                          {item.c}/{item.uf}
                        </span>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-0.5">
                        <span className="px-3 py-1 rounded-full bg-[#C1732B]/10 border border-[#C1732B]/30 text-[#C1732B] font-sans text-xs font-bold uppercase tracking-wider">
                          {zona.rotulo}
                        </span>
                        <span className="font-sans text-xs text-[#5A635C]">
                          Frete {zona.tarifaTexto} · {zona.prazo}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* NÃO ENCONTRADO */}
            {showNotFound && (
              <div className="mt-4 p-5 bg-[#FAFBF8] border border-[#C1732B]/40 rounded-xl text-center">
                <p className="font-serif text-[#4A5D4E] text-base mb-4 leading-relaxed">
                  Não encontramos sua cidade na malha terrestre atual. Podemos avaliar frete aéreo — fale no WhatsApp.
                </p>
                <a
                  href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(`Olá! Não encontrei a cidade ${trimmedQuery} na malha terrestre. Gostaria de consultar sobre frete aéreo ou rotas especiais.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold text-sm px-6 py-2.5 inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TARIFA POR ZONA — decidido em 24/08/2026. Preço por saída, não por km. */}
      <section className="py-12 bg-[#FAFBF8] border-b border-[#E0E2D9]">
        <div className="wrap max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold text-[#4A5D4E] mb-2">Quanto custa a entrega</h2>
          <p className="font-serif text-sm text-[#5A635C] mb-6 max-w-prose">
            Uma tarifa por viagem, não por ave: o mesmo valor leva um casal ou o pedido inteiro.
            Busque sua cidade acima e a zona dela aparece no resultado.
          </p>
          <ul className="list-none p-0 m-0 bg-white border border-[#E0E2D9] rounded-2xl overflow-hidden divide-y divide-[#E0E2D9]">
            {[ZONAS[1], ZONAS[2], ZONAS[3], ZONAS[4]].map((z) => (
              <li key={z.n} className="p-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                <div>
                  <p className="font-serif font-semibold text-[#4A5D4E] text-base m-0">{z.rotulo}</p>
                  <p className="font-sans text-[0.75rem] text-[#5A635C] mt-0.5 mb-0">{z.detalhe}</p>
                  <p className="font-sans text-[0.75rem] text-[#5A635C] mt-0.5 mb-0">{z.prazo}.</p>
                </div>
                <span className="font-sans text-base font-bold text-[#C1732B] whitespace-nowrap">
                  {z.tarifaTexto}
                </span>
              </li>
            ))}
            <li className="p-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
              <div>
                <p className="font-serif font-semibold text-[#4A5D4E] text-base m-0">{RETIRADA.rotulo}</p>
                <p className="font-sans text-[0.75rem] text-[#5A635C] mt-0.5 mb-0">
                  Você retira no ponto de encontro combinado.
                </p>
              </div>
              <span className="font-sans text-base font-bold text-[#C1732B] whitespace-nowrap">
                {RETIRADA.tarifaTexto}
              </span>
            </li>
          </ul>
          <p className="font-serif text-[0.8rem] text-[#5A635C] mt-4 mb-0 leading-relaxed">
            O valor é confirmado na conversa, antes de qualquer pagamento — e o pagamento é sempre
            na entrega, com ave e documentação conferidas.
          </p>
        </div>
      </section>

      {/* SEÇÃO 1: ENTREGA RÁPIDA */}
      <section className="py-12 bg-white border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#C1732B] font-sans font-bold text-xs uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Atendimento Ágil</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#4A5D4E]">
                Entrega rápida (Grande São Paulo e entorno)
              </h2>
              <p className="font-serif text-[#5A635C] text-base mt-1">
                Atendimento em raio de até ~150 km com logística mais rápida e datas flexíveis.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9]">
            <div className="flex flex-wrap gap-2.5 mb-3">
              {entregaRapidaCidades.map((item) => (
                <span
                  key={`${item.c}-${item.uf}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#4A5D4E]/20 text-[#4A5D4E] font-sans text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C1732B]" />
                  {item.c}
                </span>
              ))}
            </div>
            <p className="font-serif text-xs text-[#5A635C] italic mb-0">
              e muitas outras cidades — use a busca acima.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: ROTAS REGIONAIS PROGRAMADAS */}
      <section className="py-14 bg-[#FAFBF8] border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="mb-10">
            <div className="eyebrow">Programação Logística</div>
            <h2 className="sec-title text-2xl md:text-3xl font-serif font-semibold text-[#4A5D4E]">
              Rotas regionais programadas
            </h2>
            <p className="sec-sub text-base mb-0">
              Agrupamos entregas em 5 grandes eixos regionais para viabilizar o transporte seguro com equipe e veículo próprios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rotasRegionais.map((rota) => {
              const cidadesDaRota = CIDADES
                .filter(c => c.r === rota.regionKey)
                .sort((a, b) => b.p - a.p)
                .slice(0, 12);

              return (
                <div key={rota.titulo} className="card-item flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#C1732B] font-sans font-bold text-xs uppercase tracking-wider mb-2">
                      <Truck className="w-4 h-4" />
                      <span>Rota Terrestre</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-2">
                      {rota.titulo}
                    </h3>
                    <p className="font-serif text-sm text-[#5A635C] mb-4 leading-relaxed">
                      {rota.descricao}
                    </p>
                  </div>

                  <div>
                    <div className="border-t border-[#E0E2D9] pt-3 mt-2">
                      <span className="block font-sans text-[0.72rem] uppercase font-bold text-[#4A5D4E] tracking-wider mb-2">
                        Principais Cidades Atendidas:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {cidadesDaRota.map((item) => (
                          <span
                            key={`${item.c}-${item.uf}`}
                            className="px-2.5 py-1 rounded-md bg-[#FAFBF8] border border-[#E0E2D9] text-[#2D3436] font-sans text-xs font-medium"
                          >
                            {item.c}
                          </span>
                        ))}
                      </div>
                      <p className="font-serif text-xs text-[#5A635C] italic mb-0">
                        e muitas outras cidades — use a busca acima.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEÇÃO FRETE AÉREO */}
      <section className="py-14 bg-white border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#C1732B] font-sans font-bold text-xs uppercase tracking-wider mb-1">
                <Plane className="w-4 h-4" />
                <span>Transporte Aéreo Nacional</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#4A5D4E]">
                Frete aéreo — para todo o Brasil
              </h2>
            </div>
          </div>

          <p className="font-serif text-[#5A635C] text-base leading-relaxed mb-6">
            Para destinos fora das nossas rotas terrestres, enviamos por frete aéreo com a GOLLOG (Gol) e a LATAM Cargo (TAM), no modelo aeroporto a aeroporto. A ave viaja em caixa adequada — com água e alimento acessíveis e travas anti-fuga — e acompanhada da documentação: nota fiscal e GTA (Guia de Trânsito Animal).
          </p>

          <div className="bg-[#FAFBF8] border-2 border-[#C1732B] rounded-2xl p-6 mb-6">
            <p className="font-serif text-[#4A5D4E] text-sm sm:text-base leading-relaxed font-medium mb-0">
              Como o frete aéreo tem um custo mínimo por caixa (uma ave por caixa), é a opção mais indicada para exemplares de maior valor e longas distâncias. Para variedades de entrada em destinos distantes, avaliamos juntos a melhor solução — rota terrestre, retirada ou a indicação de um criador de confiança da nossa rede.
            </p>
          </div>

          <div className="space-y-3 font-serif text-sm sm:text-base text-[#5A635C] mb-8">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C1732B] shrink-0 mt-1" />
              <span>
                <strong className="text-[#4A5D4E]">Embarques e Aeroportos:</strong> Embarques a partir de São Paulo (Guarulhos/GRU, apoio em Congonhas/CGH). Destinos com boa conexão em Rio de Janeiro (GIG), Belo Horizonte/Confins (CNF), Curitiba (CWB), Navegantes (NVT) e Goiânia (GYN), entre outros.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#C1732B] shrink-0 mt-1" />
              <span>
                <strong className="text-[#4A5D4E]">Agendamento e Cotação:</strong> O embarque é agendado com antecedência, em dias úteis, e a cotação é feita por rota. Combine tudo pelo WhatsApp.
              </span>
            </div>
          </div>

          <div>
            <a
              href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent('Olá! Gostaria de cotar o frete aéreo para a minha região.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold text-base px-7 py-3.5 inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Cotar frete aéreo no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: RETIRADA PROGRAMADA & NOTA DE ABRANGÊNCIA */}
      <section className="py-14 bg-[#FAFBF8] border-b border-[#E0E2D9]">
        <div className="wrap space-y-8">
          {/* CARD RETIRADA PROGRAMADA */}
          <div className="pay-block text-left bg-white border-2 border-dashed border-[#C1732B] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAFBF8] border border-[#C1732B]/30 flex items-center justify-center text-[#C1732B] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-2">
                  Retirada programada
                </h3>
                <p className="font-serif text-[#5A635C] text-base leading-relaxed mb-3">
                  Prefere retirar pessoalmente? A retirada é em ponto de encontro público, com agendamento prévio pelo WhatsApp — por biossegurança não recebemos no criadouro.
                </p>
                <div className="p-4 bg-[#FAFBF8] rounded-xl border border-[#E0E2D9] font-sans text-xs sm:text-sm text-[#2D3436]">
                  <strong className="block text-[#4A5D4E] font-serif text-sm font-semibold mb-1">
                    Ponto de encontro oficial para retirada:
                  </strong>
                  <span>
                    Estacionamento do Atacadão Parelheiros, Av. Senador Teotônio Vilela, 8030, Parelheiros, São Paulo/SP, CEP 04858-002.
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Atacad%C3%A3o%20Parelheiros%2C%20Av.%20Senador%20Teot%C3%B4nio%20Vilela%2C%208030%2C%20S%C3%A3o%20Paulo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[#14504B] underline font-semibold"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* NOTA EM CAIXA DE DESTAQUE */}
          <div className="note-callout my-0 text-sm sm:text-base leading-relaxed">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C1732B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#4A5D4E]">Abrangência e Modalidades:</strong>{' '}
                Atendemos por rota terrestre (SP, MG, RJ, PR e SC) e por frete aéreo para o restante do Brasil. As datas de cada rota dependem dos pedidos da região; nada de promessa de prazo fixo, combinamos caso a caso.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="sec-green py-16 text-center">
        <div className="wrap">
          <h2 className="sec-title center">Dúvidas sobre a entrega na sua cidade?</h2>
          <p className="sec-sub mx-auto max-w-xl">
            Atendemos por rota terrestre (SP, MG, RJ, PR, SC) e por frete aéreo para o restante do Brasil. Entre em contato conosco via WhatsApp para cotar a melhor opção de logística para o seu endereço.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <a
              href={CONSTANTS.WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold text-base px-8 py-3.5 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Confirmar rota e data no WhatsApp
            </a>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('pre-reserva')}
                className="btn btn-ghost border-white text-white hover:bg-white/10 px-8 py-3.5 w-full sm:w-auto"
              >
                Fazer pré-reserva
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};