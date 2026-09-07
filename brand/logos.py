# -*- coding: utf-8 -*-
"""Cinco propostas de logo para Aves Ornamentais Brasil — SVG vetorial, variantes claro/escuro."""
import math, base64, os

V='#1F3B2E'; O='#D2A93C'; C='#F6F1E6'; G='#1E8E5A'; VE='#5B6B5B'
FONT_CSS = """
@font-face{font-family:'Playfair';src:url('file:///tmp/fonts/PlayfairDisplaywght.ttf');font-weight:400 900}
@font-face{font-family:'Cormorant';src:url('file:///tmp/fonts/CormorantGaramondwght.ttf');font-weight:300 700}
@font-face{font-family:'Montserrat';src:url('file:///tmp/fonts/Montserratwght.ttf');font-weight:100 900}
"""
SERIF="Playfair, Georgia, serif"; SANS="Montserrat, Arial, sans-serif"; ITAL="Cormorant, Georgia, serif"

def feather(color, cut, x=0, y=0, rot=0, s=1.0):
    return f'''<g transform="translate({x},{y}) rotate({rot}) scale({s})">
<path fill="{color}" d="M0,0 C-20,-38 -24,-92 0,-140 C24,-92 20,-38 0,0 Z"/>
<path stroke="{cut}" stroke-width="3" stroke-linecap="round" fill="none" d="M0,-10 L0,-122"/>
<path stroke="{cut}" stroke-width="2" stroke-linecap="round" fill="none" d="M0,-38 L-12,-52 M0,-38 L12,-52 M0,-62 L-13,-78 M0,-62 L13,-78 M0,-86 L-11,-102 M0,-86 L11,-102"/>
</g>'''

def tres_penas(fg, cut, x=0, y=0, s=1.0):
    """símbolo: três penas em leque a partir de um ponto — três criadouros, uma marca."""
    return f'<g transform="translate({x},{y}) scale({s})">{feather(O,cut,0,0,-34)}{feather(G,cut,0,0,34)}{feather(fg,cut,0,0,0,1.06)}</g>'

def wordmark(fg, sub, x, y, big=78, small=20, tag=True, tagcolor=None):
    tagcolor = tagcolor or sub
    t = f'<text x="{x}" y="{y+big*0.62}" font-family="{ITAL}" font-style="italic" font-weight="500" font-size="{big*0.3}" fill="{tagcolor}">criadouros parceiros · pronta entrega</text>' if tag else ''
    return f'''<text x="{x}" y="{y-big*0.78}" font-family="{SANS}" font-weight="600" font-size="{small}" letter-spacing="{small*0.32}" fill="{sub}">AVES ORNAMENTAIS</text>
<text x="{x-big*0.04}" y="{y}" font-family="{SERIF}" font-weight="700" font-size="{big}" fill="{fg}">BRASIL</text>{t}'''

# ---------- 1 · Três penas ----------
def logo1(dark=False, symbol_only=False):
    fg, sub, cut = (C, O, V) if dark else (V, O, '#FFFFFF')
    if dark: cut = V
    if symbol_only:
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{tres_penas(fg,cut,100,172,1.0)}</svg>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 220">
{tres_penas(fg,cut,110,190,1.05)}
{wordmark(fg, O if not dark else O, 230, 148, 84, 21, True, VE if not dark else '#C9D2C9')}
</svg>'''

# ---------- 2 · Voo (ave + rota) ----------
def voo(fg, x=0, y=0, s=1.0, cut='#FFFFFF'):
    return f'''<g transform="translate({x},{y}) scale({s})">
<path d="M18,150 C70,150 120,140 150,96 C166,72 176,52 184,34" fill="none" stroke="{fg}" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round"/>
<circle cx="18" cy="150" r="7.5" fill="{fg}"/><circle cx="86" cy="146" r="7.5" fill="{fg}"/><circle cx="141" cy="108" r="7.5" fill="{fg}"/>
<g transform="translate(184,34) rotate(28)"><path fill="{O}" d="M0,0 C-20,-38 -24,-92 0,-140 C24,-92 20,-38 0,0 Z" transform="translate(0,72) scale(0.72)"/><path stroke="{cut}" stroke-width="2.5" stroke-linecap="round" fill="none" d="M0,64 L0,-14 M0,42 L-9,32 M0,42 L9,32 M0,24 L-9,13 M0,24 L9,13" /></g>
</g>'''
def logo2(dark=False, symbol_only=False):
    fg = C if dark else V; cut = V if dark else '#FFFFFF'
    if symbol_only:
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">{voo(fg,0,8,1.0,cut)}</svg>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220">
{voo(fg,10,25,0.95,cut)}
{wordmark(fg, O, 270, 148, 84, 21, True, VE if not dark else '#C9D2C9')}
</svg>'''

# ---------- 3 · Selo ----------
def arcpath(cx,cy,r,a0,a1):
    x0=cx+r*math.cos(math.radians(a0)); y0=cy+r*math.sin(math.radians(a0))
    x1=cx+r*math.cos(math.radians(a1)); y1=cy+r*math.sin(math.radians(a1))
    large = 1 if abs(a1-a0)>180 else 0
    sweep = 1 if a1>a0 else 0
    return f'M{x0:.1f},{y0:.1f} A{r},{r} 0 {large} {sweep} {x1:.1f},{y1:.1f}'
def logo3(dark=False, symbol_only=False):
    fg = C if dark else V; cut = V if dark else '#FFFFFF'
    top = arcpath(150,150,118,182,358)
    bot = arcpath(150,150,112,160,20)      # arco inferior (anti-horário para o texto ficar de pé)
    bot = arcpath(150,150,118,155,25)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs><path id="pt" d="{top}"/><path id="pb" d="M{150+118*math.cos(math.radians(155)):.1f},{150+118*math.sin(math.radians(155)):.1f} A118,118 0 0 0 {150+118*math.cos(math.radians(25)):.1f},{150+118*math.sin(math.radians(25)):.1f}"/></defs>
<circle cx="150" cy="150" r="142" fill="none" stroke="{fg}" stroke-width="3"/>
<circle cx="150" cy="150" r="134" fill="none" stroke="{fg}" stroke-width="1" opacity=".55"/>
<circle cx="150" cy="150" r="92" fill="none" stroke="{O}" stroke-width="1.2" opacity=".9"/>
<text font-family="{SANS}" font-weight="700" font-size="15.5" letter-spacing="3.6" fill="{fg}"><textPath href="#pt" startOffset="50%" text-anchor="middle">AVES ORNAMENTAIS BRASIL</textPath></text>
<text font-family="{SANS}" font-weight="500" font-size="11" letter-spacing="3" fill="{fg}"><textPath href="#pb" startOffset="50%" text-anchor="middle">CRIADOUROS PARCEIROS · SP</textPath></text>
<circle cx="{150+128*math.cos(math.radians(5)):.1f}" cy="{150+128*math.sin(math.radians(5)):.1f}" r="3.2" fill="{O}"/>
<circle cx="{150+128*math.cos(math.radians(175)):.1f}" cy="{150+128*math.sin(math.radians(175)):.1f}" r="3.2" fill="{O}"/>
{tres_penas(fg,cut,150,212,0.62)}
</svg>'''

# ---------- 4 · Monograma AOB ----------
def logo4(dark=False, symbol_only=False):
    fg = C if dark else V; cut = V if dark else '#FFFFFF'
    mono = f'''<text x="8" y="126" font-family="{SERIF}" font-weight="700" font-size="150" fill="{fg}">A</text>
<circle cx="188" cy="76" r="52" fill="none" stroke="{fg}" stroke-width="11"/>
{feather(O, cut if not dark else V, 188, 118, 0, 0.6)}
<text x="256" y="126" font-family="{SERIF}" font-weight="700" font-size="150" fill="{fg}">B</text>'''
    if symbol_only:
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 372 160">{mono}</svg>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220">
<g transform="translate(20,18)">{mono}</g>
<text x="24" y="192" font-family="{SANS}" font-weight="600" font-size="19" letter-spacing="7.2" fill="{O}">AVES ORNAMENTAIS BRASIL</text>
</svg>'''

# ---------- 5 · Ninho ----------
def ninho(fg, x=0, y=0, s=1.0):
    cx,cy,r=100,105,68
    arcs=''
    for i,col in enumerate([O,fg,G]):
        a0=-150+120*i+9; a1=a0+102
        arcs+=f'<path d="{arcpath(cx,cy,r,a0,a1)}" fill="none" stroke="{col}" stroke-width="13" stroke-linecap="round"/>'
    egg=f'<path d="M{cx},{cy-40} C{cx+30},{cy-40} {cx+30},{cy+2} {cx+22},{cy+22} C{cx+16},{cy+38} {cx-16},{cy+38} {cx-22},{cy+22} C{cx-30},{cy+2} {cx-30},{cy-40} {cx},{cy-40} Z" fill="{O}"/>'
    return f'<g transform="translate({x},{y}) scale({s})">{arcs}{egg}</g>'
def logo5(dark=False, symbol_only=False):
    fg = C if dark else V
    if symbol_only:
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{ninho(fg,0,-5)}</svg>'
    sub = VE if not dark else '#C9D2C9'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 220">
{ninho(fg,20,10,0.95)}
<text x="230" y="92" font-family="{ITAL}" font-weight="600" font-size="46" fill="{fg}">Aves Ornamentais</text>
<text x="226" y="160" font-family="{SERIF}" font-weight="700" font-size="82" fill="{fg}">BRASIL</text>
<text x="232" y="198" font-family="{SANS}" font-weight="600" font-size="15" letter-spacing="4.5" fill="{O}">UM NINHO · TRÊS CRIADOUROS · UMA ROTA</text>
</svg>'''

LOGOS = [
 dict(n=1, nome='Três penas', fn=logo1,
      ideia='Três penas em leque a partir de um ponto: três criadouros que saem de um mesmo lugar — a AOB. Ouro para a Aves Arca (âncora), verdes para os parceiros. O wordmark mantém a estrutura atual (AVES ORNAMENTAIS pequeno, BRASIL grande), então a transição é suave.',
      muda='Troca o "broto" atual por penas legíveis como ave; funciona em fundo claro; o símbolo sozinho vira favicon e foto de perfil.',
      pros=['Continuidade: quem já viu a marca reconhece o wordmark.','Símbolo com significado próprio (três criadouros) e legível pequeno.','Vetor simples — escala, borda, monocromia sem perda.'],
      contras=['Pena é um recurso comum em marcas de aves; a distinção vem das três cores, não da forma.']),
 dict(n=2, nome='Pena na rota', fn=logo2,
      ideia='Uma rota pontilhada que sai de três cidades e termina numa pena dourada: a ave chega pela rota. Fala do que a AOB faz de diferente — leva a ave até você — sem dizer uma palavra.',
      muda='Sai o emblema estático; entra movimento. É a proposta que mais conversa com as páginas "Rotas de entrega" e com o argumento de venda.',
      pros=['Conta a proposta de valor (entrega em rota) sem texto.','Muito diferente dos três parceiros — a AOB deixa de parecer "mais um criadouro".','Os três pontos são os três criadouros/cidades: a história se conta sozinha.'],
      contras=['Mais "mapa" do que "ave": em favicon, a pena vira uma folha.','Precisa de respiro: encolhido demais os pontos da rota somem.']),
 dict(n=3, nome='Selo', fn=logo3,
      ideia='Emblema circular com o nome no aro e as três penas no centro — um selo de garantia. Combina com o registro do Aliança (tipografia em faixa) e reforça a promessa de procedência.',
      muda='Aproveita o círculo do ícone atual, mas coloca o nome dentro dele e um símbolo de verdade no meio. Ideal para carimbo em PDF da lista, etiqueta de caixa e selo "criadouro parceiro AOB".',
      pros=['Pronto para usos físicos: etiqueta, GTA, caixa de transporte.','Passa autoridade e curadoria — encaixa no "paga na entrega, com a ave conferida".','Um só bloco: não depende de versão horizontal/vertical.'],
      contras=['No cabeçalho do site fica pequeno demais para o texto do aro — precisaria do símbolo + wordmark ao lado.','Selos circulares são frequentes em marcas rurais/artesanais.']),
 dict(n=4, nome='Monograma AOB', fn=logo4,
      ideia='As iniciais que você já usa no dia a dia (AOB) viram a marca, com o O como um aro que guarda uma pena dourada — o ovo/ninho da rede. Compacto, moderno, direto.',
      muda='É a mudança mais radical: a sigla passa a ser a marca, e "Aves Ornamentais Brasil" vira assinatura embaixo. Excelente para redes sociais, onde o nome completo não cabe.',
      pros=['Quadrado por natureza: perfil de Instagram, WhatsApp, favicon sem adaptação.','Fixa a sigla AOB na cabeça do cliente — a mesma que aparece nos códigos de pedido (AOB-0709-001).','Tipografia forte convive bem com as três logos ilustradas dos parceiros.'],
      contras=['Sigla exige tempo para virar conhecida; hoje ninguém fora da operação sabe o que é AOB.','Menos "ave" à primeira vista — a pena no O é discreta.']),
 dict(n=5, nome='Ninho', fn=logo5,
      ideia='Um ninho feito de três arcos — os três criadouros — em volta de um ovo dourado. Um ninho, três criadouros, uma rota. A assinatura embaixo diz exatamente isso.',
      muda='Substitui o emblema por um símbolo que explica o modelo de negócio em um relance. O wordmark ganha "Aves Ornamentais" em itálico caligráfico, mais quente que o atual em caixa alta.',
      pros=['Único entre os quatro logos da página: ninguém dos parceiros tem forma geométrica.','A história (um ninho, três criadouros) é fácil de repetir no WhatsApp e no Instagram.','Símbolo redondo: perfil, favicon e selo saem sem adaptação; os arcos crescem se entrar um 4º parceiro.'],
      contras=['Os arcos abertos podem lembrar ícone de "carregando"; a cor e o ovo resolvem, mas em monocromia perde um pouco.','Assinatura longa — em tamanhos pequenos fica só símbolo + BRASIL.']),
]

if __name__=='__main__':
    os.makedirs('/home/claude/prop/svg',exist_ok=True)
    for L in LOGOS:
        for dark in (False,True):
            for so in (False,True):
                nm=f"{L['n']}_{L['nome'].lower().replace(' ','-').replace('ê','e')}{'_simbolo' if so else ''}{'_escuro' if dark else '_claro'}.svg"
                open('/home/claude/prop/svg/'+nm,'w',encoding='utf-8').write(L['fn'](dark,so))
    print('svgs ok')
