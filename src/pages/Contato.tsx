import React, { useState } from 'react';
import { CONSTANTS } from '../data/species';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { PageRoute } from '../types';
import { MessageCircle, Mail, Instagram, Send } from 'lucide-react';

interface ContatoProps {
  onNavigate?: (page: PageRoute) => void;
}

export const Contato: React.FC<ContatoProps> = ({ onNavigate }) => {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !contato) {
      alert('Por favor, preencha seu nome e contato.');
      return;
    }
    const text = encodeURIComponent(
      `*MENSAGEM VIA SITE — AVES ARCA*\n\n` +
      `*Nome:* ${nome}\n` +
      `*Contato:* ${contato}\n` +
      `*Mensagem:* ${mensagem || 'Tenho interesse nas variedades de anatídeos.'}`
    );
    window.open(`${CONSTANTS.WHATSAPP_LINK}?text=${text}`, '_blank');
  };

  return (
    <div>
      {/* HEADER */}
      <section className="bg-[#F1EBDD] py-14 border-b border-[#ddd5c4]">
        <div className="wrap">
          <div className="eyebrow">Contato & Atendimento</div>
          <h1 className="sec-title text-3xl sm:text-4xl font-serif font-semibold text-[#14504B]">
            Fale com a Aves Arca
          </h1>
          <p className="sec-sub text-lg">
            O atendimento e a reserva acontecem principalmente pelo WhatsApp, onde enviamos disponibilidade, fotos e vídeos atuais dos exemplares e a documentação.
          </p>
        </div>
      </section>

      {/* 3 CARDS */}
      <section className="py-16 bg-white">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-item flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F1EBDD] flex items-center justify-center text-[#1e7e46] mb-4 border border-[#ddd5c4]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-[1.3rem] text-[#14504B] mb-2 font-semibold">WhatsApp</h3>
                <p className="font-serif text-[1rem] text-[#5c6270] mb-4">
                  Atendimento consultivo, fotos atuais dos exemplares, dúvidas técnicas e fechamento de reserva.
                </p>
              </div>
              <a
                href={waComOrigem('contato')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-xs py-2.5 w-full text-center"
              >
                Abrir conversa no WhatsApp
              </a>
            </div>

            <div className="card-item flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F1EBDD] flex items-center justify-center text-[#C1732B] mb-4 border border-[#ddd5c4]">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-[1.3rem] text-[#14504B] mb-2 font-semibold">E-mail</h3>
                <p className="font-serif text-[1rem] text-[#5c6270] mb-4">
                  <a href={`mailto:${CONSTANTS.EMAIL}`} className="text-[#14504B] underline font-sans text-sm font-semibold">
                    {CONSTANTS.EMAIL}
                  </a>
                </p>
              </div>
              <a
                href={`mailto:${CONSTANTS.EMAIL}`}
                className="btn btn-ghost text-xs py-2.5 w-full text-center"
              >
                Enviar e-mail
              </a>
            </div>

            <div className="card-item flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F1EBDD] flex items-center justify-center text-[#d1863f] mb-4 border border-[#ddd5c4]">
                  <Instagram className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-[1.3rem] text-[#14504B] mb-2 font-semibold">Instagram</h3>
                <p className="font-serif text-[1rem] text-[#5c6270] mb-4">
                  Bastidores do criadouro, acompanhamento dos nascimentos, plumagem e manejo.
                </p>
              </div>
              <a
                href={CONSTANTS.INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-xs py-2.5 w-full text-center"
              >
                @avesarca no Instagram
              </a>
            </div>
          </div>

          <div className="note-callout mt-8 text-xs font-sans text-center">
            Atendimento oficial Aves Arca — WhatsApp: {CONSTANTS.WHATSAPP_DISPLAY} | Instagram: @avesarca
          </div>

          {/* FORM */}
          <div className="max-w-xl mx-auto mt-12 bg-[#F1EBDD]/50 p-8 rounded-2xl border border-[#ddd5c4]">
            <h2 className="sec-title center text-2xl font-semibold mb-6">
              Envie uma mensagem
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold text-[#14504B] uppercase tracking-wider mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#ddd5c4] text-sm bg-white focus:outline-none focus:border-[#C1732B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14504B] uppercase tracking-wider mb-1">
                  Seu e-mail ou telefone
                </label>
                <input
                  type="text"
                  required
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder="E-mail ou WhatsApp"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#ddd5c4] text-sm bg-white focus:outline-none focus:border-[#C1732B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14504B] uppercase tracking-wider mb-1">
                  Qual variedade te interessa?
                </label>
                <textarea
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Digite sua dúvida ou variedade de interesse..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[#ddd5c4] text-sm bg-white focus:outline-none focus:border-[#C1732B]"
                ></textarea>
              </div>

              <p className="text-xs text-[#5c6270] font-sans leading-relaxed">
                Ao enviar, você concorda que a Aves Arca use seus dados (nome, telefone e e-mail) apenas para o atendimento da sua reserva, pelo WhatsApp. Não compartilhamos seus dados com terceiros nem enviamos mensagens sem que você inicie o contato.{' '}
                <a
                  href={CAMINHOS.privacidade}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) {
                      onNavigate('privacidade');
                    } else {
                      window.location.hash = 'privacidade';
                    }
                  }}
                  className="text-[#14504B] font-semibold underline"
                >
                  Saiba mais
                </a>
              </p>

              <button
                type="submit"
                className="btn btn-gold w-full text-sm py-3 justify-center"
              >
                <Send className="w-4 h-4" />
                Enviar mensagem via WhatsApp
              </button>
            </form>

            <p className="font-serif text-center text-xs text-[#5c6270] mt-6">
              Não recebemos visitas presenciais. Por razões de biossegurança e proteção sanitária do plantel, todo o atendimento é 100% digital, com envio de fotos e vídeos atuais dos exemplares e das instalações.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};