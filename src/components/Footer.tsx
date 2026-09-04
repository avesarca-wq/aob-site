import React from 'react';
import { PageRoute } from '../types';
import { CONSTANTS, TOTAL_VARIEDADES } from '../data/species';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { LOGO_FOOTER } from '../data/logo';
import { MessageCircle, Mail, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2A382D] text-[#E9EBE2] pt-14 pb-8 font-serif text-[0.98rem]">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* COL 1: BRAND & DESC */}
          <div>
            <img
              src={LOGO_FOOTER}
              alt="Aves Arca"
              className="h-[50px] w-auto object-contain mb-3"
            />
            <p className="font-sans text-[0.88rem] leading-relaxed text-[#A6AB9E] mb-4">
              Criadouro de anatídeos ornamentais de procedência — patos, marrecos, gansos e cisnes nascidos no plantel, com sanidade e legalidade documentadas.
            </p>
            <div className="font-sans text-[0.8rem] text-[#A6AB9E] space-y-1.5">
              <div><strong className="text-white">Localização:</strong> {CONSTANTS.LOCALIZACAO} <span className="opacity-75 text-xs block mt-0.5">(Por biossegurança, não recebemos visitas ao criadouro. Atendimento pelo WhatsApp.)</span></div>
              <div className="text-xs text-[#A6AB9E] font-sans pt-1 border-t border-white/10 space-y-0.5">
                <div><strong>{CONSTANTS.RAZAO_SOCIAL}</strong></div>
                <div>CNPJ: {CONSTANTS.CNPJ} · IE: {CONSTANTS.INSCRICAO_ESTADUAL}</div>
              </div>
            </div>
          </div>

          {/* COL 2: NAVIGATION */}
          <div>
            <h4 className="font-serif text-white text-[1.15rem] font-semibold mb-3 tracking-[0.5px]">
              Navegação
            </h4>
            <nav className="flex flex-col space-y-2 font-sans text-[0.9rem]">
              <a href={CAMINHOS.home} onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-[#D4A373] transition-colors">Início</a>
              <a href={CAMINHOS.especies} onClick={(e) => { e.preventDefault(); onNavigate('especies'); }} className="hover:text-[#D4A373] transition-colors">Espécies (Catálogo {TOTAL_VARIEDADES})</a>
              <a href={CAMINHOS.procedencia} onClick={(e) => { e.preventDefault(); onNavigate('procedencia'); }} className="hover:text-[#D4A373] transition-colors">Procedência & Biossegurança</a>
              <a href={CAMINHOS.entrega} onClick={(e) => { e.preventDefault(); onNavigate('entrega'); }} className="hover:text-[#D4A373] transition-colors">Entrega & Rotas Terrestres</a>
              <a href={CAMINHOS.sobre} onClick={(e) => { e.preventDefault(); onNavigate('sobre'); }} className="hover:text-[#D4A373] transition-colors">Sobre o Criadouro</a>
              <a href={CAMINHOS['pre-reserva']} onClick={(e) => { e.preventDefault(); onNavigate('pre-reserva'); }} className="text-[#D4A373] font-semibold hover:underline">Pré-reserva 2026 (Sem Pagamento Antecipado)</a>
              <a href={CAMINHOS.faq} onClick={(e) => { e.preventDefault(); onNavigate('faq'); }} className="hover:text-[#D4A373] transition-colors">Dúvidas frequentes</a>
              <a href={CAMINHOS.contato} onClick={(e) => { e.preventDefault(); onNavigate('contato'); }} className="hover:text-[#D4A373] transition-colors">Contato</a>
              <a href={CAMINHOS.privacidade} onClick={(e) => { e.preventDefault(); onNavigate('privacidade'); }} className="hover:text-[#D4A373] transition-colors">Privacidade</a>
            </nav>
          </div>

          {/* COL 3: CONTACT */}
          <div>
            <h4 className="font-serif text-white text-[1.15rem] font-semibold mb-3 tracking-[0.5px]">
              Contato & Canais
            </h4>
            <div className="flex flex-col space-y-2.5 font-sans text-[0.9rem]">
              <a
                href={waComOrigem('rodape')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D4A373]" />
                <span>WhatsApp Consultivo</span>
              </a>
              <a
                href={`mailto:${CONSTANTS.EMAIL}`}
                className="inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4A373]" />
                <span>{CONSTANTS.EMAIL}</span>
              </a>
              <a
                href={CONSTANTS.INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#D4A373]" />
                <span>Instagram @avesarca</span>
              </a>
            </div>
            <p className="font-sans text-[0.78rem] text-[#A6AB9E] mt-4 leading-normal">
              Atendimento técnico individualizado para criadores, especialistas e parques ecológicos.
            </p>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 pt-5 text-center md:text-left text-[#A6AB9E] font-sans text-[0.8rem] tracking-[0.2px] leading-relaxed">
          © 2026 Aves Arca. Comercialização apenas de exemplares nascidos no plantel, com documentação de origem. Pré-reserva sem pagamento antecipado — você só paga na entrega, com ave e documentação conferidas. Preços sujeitos a alteração e disponibilidade.
        </div>
      </div>
    </footer>
  );
};