import React from 'react';
import { CONSTANTS } from '../data/species';
import { waComOrigem } from '../lib/links';
import { FileText, Stethoscope, ShieldCheck, Truck, Leaf, HeartHandshake, MessageCircle } from 'lucide-react';

export const Procedencia: React.FC = () => {
  return (
    <div>
      {/* HEADER */}
      <section className="bg-[#FAFBF8] py-14 border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="eyebrow">Procedência & Biossegurança</div>
          <h1 className="sec-title text-3xl sm:text-4xl font-serif font-semibold text-[#4A5D4E]">
            Confiança que acompanha cada ave
          </h1>
          <p className="sec-sub text-lg">
            Procedência não é discurso: é documento, protocolo e rastreabilidade. Veja o que sustenta cada exemplar da Aves Arca.
          </p>
        </div>
      </section>

      {/* 6 CARDS SECTION */}
      <section className="py-16 bg-white">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Nascidos no plantel</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Comercializamos apenas exemplares nascidos e criados aqui, com documentação de origem e rastreabilidade — nunca revenda de origem incerta.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Sanidade comprovada</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Protocolos sanitários, quarentena de entrada e vigilância contínua garantem um plantel saudável e aves prontas para o novo lar.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Biossegurança</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Barreiras físicas, controle de acesso, manejo de água e contingência para influenza aviária protegem o plantel e o comprador.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Legalidade e transporte</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Documentação, nota fiscal e guia de trânsito com respaldo sanitário acompanham a venda, dentro das normas vigentes.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Bem-estar</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Recintos por grupo biológico, água funcional e ambiência de baixo estresse — bem-estar como padrão, não exceção.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Relacionamento</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Orientação de manejo e suporte pós-venda: acompanhamos você depois da compra, não apenas até ela.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <div className="note-callout my-0">
              <strong className="text-[#4A5D4E]">Política de Atendimento e Biossegurança:</strong> Não recebemos visitas presenciais. Por razões de biossegurança e proteção sanitária do plantel, todo o atendimento é 100% digital, com envio de fotos e vídeos atuais dos exemplares e das instalações.
            </div>

            <div className="p-6 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9] font-sans text-xs text-[#5A635C] space-y-2">
              <strong className="block font-serif text-sm text-[#4A5D4E] font-semibold mb-2">
                Dados Cadastrais & Transparência
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="block text-[0.7rem] uppercase tracking-wider text-[#5A635C]">Razão Social</span>
                  <span className="font-semibold text-[#2D3436]">{CONSTANTS.RAZAO_SOCIAL}</span>
                </div>
                <div>
                  <span className="block text-[0.7rem] uppercase tracking-wider text-[#5A635C]">CNPJ</span>
                  <span className="font-semibold text-[#2D3436]">{CONSTANTS.CNPJ}</span>
                </div>
                <div>
                  <span className="block text-[0.7rem] uppercase tracking-wider text-[#5A635C]">Inscrição Estadual</span>
                  <span className="font-semibold text-[#2D3436]">{CONSTANTS.INSCRICAO_ESTADUAL}</span>
                </div>
                <div>
                  <span className="block text-[0.7rem] uppercase tracking-wider text-[#5A635C]">Localização</span>
                  <span className="font-semibold text-[#2D3436]">{CONSTANTS.LOCALIZACAO}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAFBF8] rounded-2xl border border-[#E0E2D9] font-sans text-xs text-[#5A635C] space-y-3">
              <strong className="block font-serif text-sm text-[#4A5D4E] font-semibold mb-2">
                Base legal — a norma, e o que ela não diz
              </strong>
              <p>
                A <strong>Portaria IBAMA nº 93, de 7 de julho de 1998</strong> normatiza a importação e a
                exportação de espécimes vivos, produtos e subprodutos da fauna silvestre brasileira e da
                fauna silvestre exótica. O parágrafo único do seu art. 1º, na redação dada pela{' '}
                <a
                  href="https://www.ibama.gov.br/component/legislacao/?view=legislacao&legislacao=138522"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 text-[#4A5D4E] font-semibold"
                >
                  Portaria IBAMA nº 2.489, de 9 de julho de 2019
                </a>
                , excetua da regra os animais “isentos de controle para fins de operacionalização do
                IBAMA, conforme Anexo I”.
              </p>
              <p>
                As variedades publicadas neste catálogo constam desse Anexo I — cada ficha traz o selo da
                portaria e o link para o texto oficial, para você conferir a linha da sua espécie.{' '}
                <strong>Espécie isenta de controle não exige marcação individual:</strong> é isso, e só
                isso, que a norma federal diz a respeito de anilha.
              </p>
              <p>
                <strong>Duas ressalvas, ditas na frente.</strong> A isenção é <strong>federal</strong> e
                não fala pelo seu estado: o órgão ambiental estadual pode ter exigência própria, e vale
                conferir a regra do seu antes de comprar. E isenção de controle não substitui a
                documentação sanitária de trânsito, que segue acompanhando a venda.
              </p>
              <p>
                O que acompanha o exemplar é a <strong>documentação de origem</strong>: a ave nasceu neste
                plantel, e o registro disso vai junto com ela.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING GREEN BANNER */}
      <section className="sec-green py-16 text-center">
        <div className="wrap">
          <h2 className="sec-title center">Quer conhecer nossas aves?</h2>
          <p className="sec-sub mx-auto max-w-xl">
            Fale conosco no WhatsApp e receba disponibilidade, fotos atuais dos exemplares e a documentação de procedência.
          </p>
          <a
            href={waComOrigem('procedencia')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold text-base px-8 py-3.5"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};