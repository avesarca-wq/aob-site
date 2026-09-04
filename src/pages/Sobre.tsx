import React from 'react';
import { Target, Eye, Award, Shield, Heart, Scale, Lightbulb } from 'lucide-react';
import { TOTAL_VARIEDADES } from '../data/species';

export const Sobre: React.FC = () => {
  return (
    <div>
      {/* HEADER */}
      <section className="bg-[#FAFBF8] py-14 border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="eyebrow">Sobre a Aves Arca</div>
          <h1 className="sec-title text-3xl sm:text-4xl font-serif font-semibold text-[#4A5D4E]">
            O criadouro Aves Arca
          </h1>
          <p className="sec-sub text-lg">
            Um criadouro dedicado à criação de anatídeos ornamentais de alto padrão, onde genética, bem-estar e legalidade caminham juntos.
          </p>
        </div>
      </section>

      {/* CONTENT BODY */}
      <section className="py-16 bg-white">
        <div className="wrap max-w-4xl font-serif text-[1.12rem] text-[#2D3436] leading-relaxed space-y-12">
          {/* NOSSA PROPOSTA */}
          <div>
            <h2 className="sec-title text-2xl font-semibold text-[#4A5D4E] mb-4">Nossa proposta</h2>
            <p className="mb-4">
              A Aves Arca nasceu da paixão por aves aquáticas ornamentais e da convicção de que criar bem é criar com procedência. Mantemos um plantel de referência de 200 casais e {TOTAL_VARIEDADES} variedades — de patos de superfície a gansos e cisnes de coleção.
            </p>
            <p>
              Diferente do mercado informal, comercializamos apenas exemplares nascidos no nosso plantel, com documentação de origem, sanidade e rastreabilidade. Cada ave é fruto de manejo cuidadoso, ambiência adequada e protocolos que protegem o bem-estar e a saúde do plantel.
            </p>
          </div>

          {/* MISSÃO E VISÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 bg-[#FAFBF8] rounded-3xl border border-[#E0E2D9] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#4A5D4E] text-white flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3">Missão</h3>
              <p className="font-serif text-sm text-[#5A635C] leading-relaxed">
                Criar e disponibilizar anatídeos ornamentais de padrão zoológico com procedência garantida, rastreabilidade e rigor sanitário, promovendo a conservação, a educação ambiental e o desenvolvimento sustentável da avicultura ornamental no Brasil.
              </p>
            </div>

            <div className="p-6 bg-[#FAFBF8] rounded-3xl border border-[#E0E2D9] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#D4A373] text-white flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3">Visão</h3>
              <p className="font-serif text-sm text-[#5A635C] leading-relaxed">
                Ser reconhecida nacional e internacionalmente como o centro de excelência referência em criação, genética e conservação de anatídeos, estabelecendo o padrão ouro em biossegurança, bem-estar animal e responsabilidade ambiental.
              </p>
            </div>
          </div>

          {/* VALORES */}
          <div>
            <h2 className="sec-title text-2xl font-semibold text-[#4A5D4E] mb-6">Valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9]">
                <Award className="w-6 h-6 text-[#4A5D4E] mb-2" />
                <h4 className="font-serif font-semibold text-base text-[#4A5D4E] mb-1">
                  Excelência Genética e Sanitária
                </h4>
                <p className="font-serif text-xs text-[#5A635C] leading-relaxed">
                  Compromisso inegociável com a pureza racial, vigor híbrido quando aplicável e saúde impecável de todo o plantel.
                </p>
              </div>

              <div className="p-5 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9]">
                <Scale className="w-6 h-6 text-[#D4A373] mb-2" />
                <h4 className="font-serif font-semibold text-base text-[#4A5D4E] mb-1">
                  Transparência e Ética
                </h4>
                <p className="font-serif text-xs text-[#5A635C] leading-relaxed">
                  Relações comerciais e técnicas pautadas na verdade, sem promessas irrealistas ou ocultação de informações sobre os exemplares.
                </p>
              </div>

              <div className="p-5 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9]">
                <Heart className="w-6 h-6 text-[#4A5D4E] mb-2" />
                <h4 className="font-serif font-semibold text-base text-[#4A5D4E] mb-1">
                  Bem-Estar e Respeito Animal
                </h4>
                <p className="font-serif text-xs text-[#5A635C] leading-relaxed">
                  Instalações e manejos desenhados para expressar o comportamento natural das espécies, priorizando a dignidade e a saúde de cada ave.
                </p>
              </div>

              <div className="p-5 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9]">
                <Shield className="w-6 h-6 text-[#D4A373] mb-2" />
                <h4 className="font-serif font-semibold text-base text-[#4A5D4E] mb-1">
                  Legalidade e Rastreabilidade
                </h4>
                <p className="font-serif text-xs text-[#5A635C] leading-relaxed">
                  Conformidade com órgãos ambientais e sanitários, com documentação de origem e trânsito — nota fiscal e GTA — emitida em nome do comprador.
                </p>
              </div>

              <div className="p-5 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9] sm:col-span-2 lg:col-span-1">
                <Lightbulb className="w-6 h-6 text-[#4A5D4E] mb-2" />
                <h4 className="font-serif font-semibold text-base text-[#4A5D4E] mb-1">
                  Inovação Técnica e Conhecimento
                </h4>
                <p className="font-serif text-xs text-[#5A635C] leading-relaxed">
                  Busca constante pelo aperfeiçoamento de técnicas de incubação, nutrição, manejo e conservação ex situ.
                </p>
              </div>
            </div>
          </div>

          {/* DO INICIANTE AO ESPECIALISTA */}
          <div>
            <h2 className="sec-title text-2xl font-semibold text-[#4A5D4E] mb-4">Do iniciante ao especialista</h2>
            <p>
              O catálogo organiza as {TOTAL_VARIEDADES} variedades em quatro níveis de curadoria. O nível <strong className="text-[#4A5D4E]">Iniciante</strong> reúne variedades de entrada, de beleza marcante e fácil adaptação. O nível <strong className="text-[#4A5D4E]">Intermediário</strong> traz espécies clássicas como mandarins e carolinas. O nível <strong className="text-[#D4A373]">Avançado</strong> concentra aves de alto valor e genéticas selecionadas, como tadornas e mergulhadores. O nível <strong className="text-[#4A5D4E]">Raridades</strong> é o topo da coleção, dedicado a gansos e cisnes de alta exclusividade e prestígio.
            </p>
          </div>

          {/* COMPROMISSO */}
          <div>
            <h2 className="sec-title text-2xl font-semibold text-[#4A5D4E] mb-4">Compromisso</h2>
            <p>
              Trabalhamos com responsabilidade técnica, protocolos operacionais padrão e atenção contínua à biossegurança. Nosso compromisso é entregar aves saudáveis, bem formadas e legalmente documentadas — e um relacionamento de confiança com criadores, especialistas e instituições.
            </p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="sec-green py-14">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="stat-item">
              <b>200</b>
              <span>casais</span>
            </div>
            <div className="stat-item">
              <b>{TOTAL_VARIEDADES}</b>
              <span>variedades</span>
            </div>
            <div className="stat-item">
              <b>4</b>
              <span>níveis</span>
            </div>
            <div className="stat-item">
              <b>SP</b>
              <span>São Paulo — Brasil</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};