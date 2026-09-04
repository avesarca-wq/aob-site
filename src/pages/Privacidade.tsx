import React from 'react';
import { CONSTANTS } from '../data/catalogo';

export const Privacidade: React.FC = () => (
  <>
    <section className="sec-escura">
      <div className="wrap py-10 sm:py-14">
        <div className="eyebrow">LGPD</div>
        <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Política de privacidade</h1>
        <p className="sec-sub" style={{ marginBottom: 0 }}>O que guardamos de quem faz um pedido, e para quê.</p>
      </div>
    </section>
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap max-w-3xl font-serif text-[1.02rem] text-[#1E2A24]">
        <h2 className="text-[1.4rem] text-[#1F3B2E]">Quais dados</h2>
        <p>Ao fechar um pedido, pedimos nome, WhatsApp, cidade e, se quiser, e-mail e observações. São os dados mínimos para confirmar o estoque, organizar a rota de entrega e falar com você.</p>
        <h2 className="text-[1.4rem] text-[#1F3B2E]">Para quê</h2>
        <p>Confirmar o pedido no WhatsApp, avisar a data da rota, combinar retirada ou entrega e emitir a documentação da ave quando aplicável. Não vendemos nem cedemos seus dados a terceiros; os criadouros parceiros recebem apenas o necessário para separar as aves do seu pedido.</p>
        <h2 className="text-[1.4rem] text-[#1F3B2E]">Onde ficam</h2>
        <p>O pedido é registrado na plataforma do site (Netlify) e enviado por e-mail à equipe da Aves Ornamentais Brasil. A conversa segue no WhatsApp. O carrinho fica apenas no seu navegador até você enviar.</p>
        <h2 className="text-[1.4rem] text-[#1F3B2E]">Seus direitos</h2>
        <p>Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo WhatsApp {CONSTANTS.WHATSAPP_DISPLAY} ou pelo e-mail {CONSTANTS.EMAIL}.</p>
        <h2 className="text-[1.4rem] text-[#1F3B2E]">Cookies e medição</h2>
        <p>Usamos medição de audiência sem cookies de terceiros para saber de onde vêm as visitas. Se anúncios em redes sociais forem ativados, o site passa a informar um aviso de cookies antes de qualquer medição de terceiros.</p>
        <p className="font-sans text-[0.78rem] text-[#5B6B5B]">Última atualização: setembro de 2026.</p>
      </div>
    </section>
  </>
);
