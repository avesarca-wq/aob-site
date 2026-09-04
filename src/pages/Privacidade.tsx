import React from 'react';
import { PageRoute } from '../types';
import { CONSTANTS } from '../data/species';
import { ShieldCheck, Lock, Mail, MessageCircle, ArrowLeft } from 'lucide-react';

interface PrivacidadeProps {
  onNavigate?: (page: PageRoute) => void;
}

export const Privacidade: React.FC<PrivacidadeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAFBF8]">
      {/* HERO / HEADER */}
      <section className="bg-[#FAFBF8] py-12 border-b border-[#E0E2D9]">
        <div className="wrap max-w-4xl mx-auto">
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#5A635C] hover:text-[#4A5D4E] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </button>
          )}

          <div className="flex items-center gap-2 text-[#C1732B] font-sans font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>LGPD & Proteção de Dados</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A5D4E] mb-4">
            Privacidade e proteção de dados
          </h1>
          <p className="font-serif text-base text-[#5A635C] leading-relaxed max-w-3xl mb-0">
            {CONSTANTS.RAZAO_SOCIAL} (CNPJ {CONSTANTS.CNPJ}) respeita a sua privacidade e trata seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
          <p className="font-sans text-[0.82rem] text-[#8C968F] mt-4 mb-0">
            Última atualização: 21 de agosto de 2026.
          </p>
        </div>
      </section>

      {/* CONTENT BODY */}
      <section className="py-12 bg-white border-b border-[#E0E2D9]">
        <div className="wrap max-w-4xl mx-auto space-y-8 font-serif text-[#2D3436]">
          
          {/* O QUE COLETAMOS */}
          <div className="bg-[#FAFBF8] p-6 sm:p-8 rounded-2xl border border-[#E0E2D9]">
            <h2 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C1732B]" />
              O que coletamos
            </h2>
            <p className="text-[#5A635C] text-base leading-relaxed mb-0">
              Apenas o que você informa nos formulários — nome, telefone/WhatsApp, e-mail, cidade e a variedade de interesse.
            </p>
          </div>

          {/* PARA QUE USAMOS */}
          <div className="bg-[#FAFBF8] p-6 sm:p-8 rounded-2xl border border-[#E0E2D9]">
            <h2 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3">
              Para que usamos
            </h2>
            <p className="text-[#5A635C] text-base leading-relaxed mb-0">
              Exclusivamente para atender seu pedido de reserva ou contato — responder pelo WhatsApp, organizar sua reserva e acompanhar a entrega. Registramos esses dados em nosso sistema interno de atendimento para não perder o seu pedido.
            </p>
          </div>

          {/* O QUE NÃO FAZEMOS */}
          <div className="bg-[#FAFBF8] p-6 sm:p-8 rounded-2xl border border-[#E0E2D9]">
            <h2 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3">
              O que NÃO fazemos
            </h2>
            <p className="text-[#5A635C] text-base leading-relaxed mb-0">
              Não vendemos nem compartilhamos seus dados com terceiros; não enviamos mensagens em massa; não fazemos contato que você não tenha solicitado.
            </p>
          </div>

          {/* SEUS DIREITOS */}
          <div className="bg-[#FAFBF8] p-6 sm:p-8 rounded-2xl border border-[#E0E2D9]">
            <h2 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3">
              Seus direitos
            </h2>
            <p className="text-[#5A635C] text-base leading-relaxed mb-4">
              A qualquer momento você pode pedir acesso, correção ou exclusão dos seus dados — basta escrever para <a href={`mailto:${CONSTANTS.EMAIL}`} className="text-[#4A5D4E] font-semibold underline">{CONSTANTS.EMAIL}</a> ou pelo próprio WhatsApp.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent('Olá! Gostaria de falar sobre meus dados pessoais.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-xs px-5 py-2.5 inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contato via WhatsApp
              </a>
              <a
                href={`mailto:${CONSTANTS.EMAIL}`}
                className="btn btn-ghost text-xs px-5 py-2.5 inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {CONSTANTS.EMAIL}
              </a>
            </div>
          </div>

          {/* COOKIES */}
          <div className="bg-[#FAFBF8] p-6 sm:p-8 rounded-2xl border border-[#E0E2D9]">
            <h2 className="font-serif text-xl font-semibold text-[#4A5D4E] mb-3">
              Cookies
            </h2>
            <p className="text-[#5A635C] text-base leading-relaxed mb-0">
              O Umami, que conta as visitas, não grava nada no seu navegador. Já o Pixel da Meta (Facebook), no ar desde 31 de agosto de 2026, guarda um identificador anônimo no navegador para medir o resultado das nossas publicações e anúncios: a Meta recebe o evento (visita, ave adicionada à pré-reserva, pré-reserva enviada) e o valor de referência — nunca o seu nome, telefone, e-mail ou endereço, nem o que você escreveu no formulário. Bloquear isso nas configurações do navegador não tira nenhuma função do site. Links externos (WhatsApp, Instagram) seguem as políticas das respectivas plataformas.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
