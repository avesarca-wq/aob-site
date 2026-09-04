import React from 'react';
import { MessageCircle } from 'lucide-react';
import { waComOrigem } from '../lib/links';

export const FloatingWhatsApp: React.FC = () => (
  <a
    href={waComOrigem('botao-flutuante')}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar no WhatsApp"
    className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#1E8E5A] hover:bg-[#177347] text-white rounded-full pl-4 pr-5 py-3 shadow-lg font-sans text-[0.85rem] font-bold no-underline transition-transform hover:-translate-y-0.5"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="hidden sm:inline">WhatsApp</span>
  </a>
);
