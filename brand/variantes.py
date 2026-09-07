# -*- coding: utf-8 -*-
"""Variantes das propostas 1 (Três penas) e 2 (Pena na rota)."""
import sys, math, os; sys.path.insert(0,'/home/claude/prop')
from logos import V,O,C,G,VE,FONT_CSS,SERIF,SANS,ITAL,feather,tres_penas,wordmark,arcpath

def svg(vb, body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{body}</svg>'
def colors(dark): return (C if dark else V, V if dark else '#FFFFFF', '#C9D2C9' if dark else VE)

# pena curva (pluma): rachis em arco, barbas acompanhando
def pluma(color, cut, x=0, y=0, rot=0, s=1.0):
    return f'''<g transform="translate({x},{y}) rotate({rot}) scale({s})">
<path fill="{color}" d="M0,0 C-6,-40 -30,-80 -22,-140 C10,-118 26,-60 0,0 Z"/>
<path stroke="{cut}" stroke-width="3" stroke-linecap="round" fill="none" d="M0,-8 C-8,-50 -18,-90 -19,-124"/>
<path stroke="{cut}" stroke-width="2" stroke-linecap="round" fill="none" d="M-4,-36 L-16,-46 M-4,-36 L8,-50 M-9,-60 L-22,-70 M-9,-60 L5,-76 M-14,-84 L-25,-94 M-14,-84 L0,-100"/>
</g>'''

# ---------- 1 · Três penas ----------
def s1a(fg,cut): return tres_penas(fg,cut,100,172,1.0)                       # original
def s1b(fg,cut):                                                              # plumas curvas
    return f'<g transform="translate(100,176)">{pluma(O,cut,0,0,-22)}{pluma(G,cut,0,0,30,0.92)}{pluma(fg,cut,6,0,4,1.04)}</g>'
def s1c(fg,cut):                                                              # penas no aro
    return f'<circle cx="100" cy="100" r="92" fill="none" stroke="{fg}" stroke-width="4"/><circle cx="100" cy="100" r="84" fill="none" stroke="{O}" stroke-width="1.2"/>{tres_penas(fg,cut,100,158,0.72)}'
def s1d(fg,cut):                                                              # asa: penas escalonadas
    return f'<g transform="translate(46,182)">{feather(G,cut,0,0,42,0.84)}{feather(O,cut,30,-4,24,0.96)}{feather(fg,cut,64,-8,6,1.08)}</g>'
def s1e(fg,cut):                                                              # monocromática + rachis ouro
    b=f'<path stroke="{O}" stroke-width="3" stroke-linecap="round" fill="none" d="M0,-10 L0,-122"/>'
    def f(rot,s=1.0): return f'<g transform="translate(100,172) rotate({rot}) scale({s})"><path fill="{fg}" d="M0,0 C-20,-38 -24,-92 0,-140 C24,-92 20,-38 0,0 Z"/>{b}<path stroke="{cut}" stroke-width="2" stroke-linecap="round" fill="none" d="M0,-38 L-12,-52 M0,-38 L12,-52 M0,-62 L-13,-78 M0,-62 L13,-78 M0,-86 L-11,-102 M0,-86 L11,-102"/></g>'
    return f(-34)+f(34)+f(0,1.06)

def h1(sym, dark, vertical=False, tag='criadouros parceiros · pronta entrega'):
    fg,cut,sub=colors(dark)
    if vertical:
        return svg('0 0 520 420', f'<g transform="translate(160,20)">{sym(fg,cut)}</g>'
            f'<text x="260" y="278" text-anchor="middle" font-family="{SANS}" font-weight="600" font-size="20" letter-spacing="6.4" fill="{O}">AVES ORNAMENTAIS</text>'
            f'<text x="260" y="352" text-anchor="middle" font-family="{SERIF}" font-weight="700" font-size="80" fill="{fg}">BRASIL</text>'
            f'<text x="260" y="392" text-anchor="middle" font-family="{ITAL}" font-style="italic" font-weight="500" font-size="24" fill="{sub}">{tag}</text>')
    return svg('0 0 760 220', f'<g transform="translate(10,10)">{sym(fg,cut)}</g>{wordmark(fg,O,230,148,84,21,True,sub)}')

# ---------- 2 · Pena na rota ----------
def pena_ouro(cut, x, y, rot, s=0.72):
    return f'<g transform="translate({x},{y}) rotate({rot})"><path fill="{O}" d="M0,0 C-20,-38 -24,-92 0,-140 C24,-92 20,-38 0,0 Z" transform="translate(0,72) scale({s})"/><path stroke="{cut}" stroke-width="2.5" stroke-linecap="round" fill="none" d="M0,64 L0,-14 M0,42 L-9,32 M0,42 L9,32 M0,24 L-9,13 M0,24 L9,13"/></g>'
def dots(fg, pts, r=7.5): return ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fg}"/>' for x,y in pts)

def s2a(fg,cut):   # original
    return f'<path d="M18,150 C70,150 120,140 150,96 C166,72 176,52 184,34" fill="none" stroke="{fg}" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round"/>{dots(fg,[(18,150),(86,146),(141,108)])}{pena_ouro(cut,184,34,28)}'
def s2b(fg,cut):   # pinos de cidade (anel) + pena
    pins=''.join(f'<circle cx="{x}" cy="{y}" r="8" fill="none" stroke="{fg}" stroke-width="3.5"/><circle cx="{x}" cy="{y}" r="2.6" fill="{fg}"/>' for x,y in [(18,150),(86,146),(141,108)])
    return f'<path d="M18,150 C70,150 120,140 150,96 C166,72 176,52 184,34" fill="none" stroke="{fg}" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round"/>{pins}{pena_ouro(cut,184,34,28)}'
def s2c(fg,cut):   # pena pousando: horizontal, rastro de voo
    return f'<path d="M14,120 C60,120 100,112 150,96" fill="none" stroke="{fg}" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round"/><path d="M30,146 C80,146 120,140 160,124" fill="none" stroke="{fg}" stroke-width="2.5" stroke-dasharray="1 9" stroke-linecap="round" opacity=".6"/>{dots(fg,[(14,120),(30,146)],6)}{pena_ouro(cut,200,58,64,0.78)}'
def s2d(fg,cut):   # pino de mapa com pena dentro
    return f'<path d="M120,178 C86,132 62,108 62,74 A58,58 0 1 1 178,74 C178,108 154,132 120,178 Z" fill="none" stroke="{fg}" stroke-width="9" stroke-linejoin="round"/>{pena_ouro(cut,120,24,0,0.62)}<path d="M40,170 Q120,196 200,170" fill="none" stroke="{fg}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round" opacity=".7"/>'
def s2e(fg,cut):   # três penas nascendo da rota (une 1 e 2)
    return f'<path d="M18,150 C70,150 120,140 150,96" fill="none" stroke="{fg}" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round"/>{dots(fg,[(18,150),(86,146)])}<g transform="translate(150,96)">{feather(G,cut,0,0,34,0.62)}{feather(fg,cut,0,0,-4,0.7)}{feather(O,cut,0,0,-40,0.66)}</g>'

def h2(sym, dark, vertical=False, integrado=False):
    fg,cut,sub=colors(dark)
    if integrado:   # rota passa por baixo de BRASIL e termina na pena
        return svg('0 0 640 240', f'<text x="44" y="64" font-family="{SANS}" font-weight="600" font-size="21" letter-spacing="6.7" fill="{O}">AVES ORNAMENTAIS</text>'
            f'<text x="40" y="146" font-family="{SERIF}" font-weight="700" font-size="84" fill="{fg}">BRASIL</text>'
            f'<path d="M46,204 C150,208 260,214 370,208 C450,204 520,190 566,140" fill="none" stroke="{fg}" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round"/>{dots(fg,[(46,204),(214,210),(400,207)],6.5)}'
            f'{pena_ouro(cut,566,140,30,0.62)}<text x="46" y="178" font-family="{ITAL}" font-style="italic" font-weight="500" font-size="24" fill="{sub}">criadouros parceiros · pronta entrega</text>')
    if vertical:
        return svg('0 0 520 440', f'<g transform="translate(140,10)">{sym(fg,cut)}</g>'
            f'<text x="260" y="278" text-anchor="middle" font-family="{SANS}" font-weight="600" font-size="20" letter-spacing="6.4" fill="{O}">AVES ORNAMENTAIS</text>'
            f'<text x="260" y="352" text-anchor="middle" font-family="{SERIF}" font-weight="700" font-size="80" fill="{fg}">BRASIL</text>'
            f'<text x="260" y="392" text-anchor="middle" font-family="{ITAL}" font-style="italic" font-weight="500" font-size="24" fill="{sub}">a ave chega pela rota</text>')
    return svg('0 0 800 220', f'<g transform="translate(10,25) scale(0.95)">{sym(fg,cut)}</g>{wordmark(fg,O,270,148,84,21,True,sub)}')

VAR1=[
 ('1A','Original (leque)', s1a, 'A base da proposta: três penas retas em leque, ouro no centro-esquerda para a Aves Arca.'),
 ('1B','Plumas curvas', s1b, 'As mesmas três, mas com o rachis em arco — mais orgânico, lembra pluma de faisão e pavão (os parceiros).'),
 ('1C','No aro', s1c, 'As três penas dentro do aro que a marca atual já tem: transição mais suave, vira selo e favicon prontos.'),
 ('1D','Asa (escalonada)', s1d, 'Bases deslocadas, penas sobrepostas como uma asa aberta: mais movimento, mais "ave" e menos "planta".'),
 ('1E','Monocromática, rachis ouro', s1e, 'Um tom só com o eixo dourado: para carimbo, bordado, gravação em madeira e quando as cores não estão disponíveis.'),
]
VAR2=[
 ('2A','Original', s2a, 'Rota pontilhada por três pontos terminando na pena dourada.'),
 ('2B','Pinos de cidade', s2b, 'Os pontos viram pinos de mapa (anel + centro): lê-se "cidades" na hora, mesmo sem legenda.'),
 ('2C','Pena pousando', s2c, 'A pena vem em voo, quase horizontal, com dois rastros pontilhados atrás: entrega chegando, não saindo.'),
 ('2D','Pino com pena', s2d, 'A pena dentro de um pino de localização sobre a rota: o mais literal — "aqui chega ave". Fica quadrado, bom para perfil.'),
 ('2E','Três penas na rota', s2e, 'Une as duas propostas: a rota leva às três penas (os três criadouros). Um símbolo só conta a história inteira.'),
]

if __name__=='__main__':
    os.makedirs('/home/claude/prop/svg2',exist_ok=True)
    for cod,nome,sym,_ in VAR1:
        for dark in (False,True):
            suf='escuro' if dark else 'claro'; fg,cut,_s=colors(dark)
            open(f'/home/claude/prop/svg2/{cod}_horizontal_{suf}.svg','w').write(h1(sym,dark))
            open(f'/home/claude/prop/svg2/{cod}_vertical_{suf}.svg','w').write(h1(sym,dark,True))
            open(f'/home/claude/prop/svg2/{cod}_simbolo_{suf}.svg','w').write(svg('0 0 200 200',sym(fg,cut)))
    for cod,nome,sym,_ in VAR2:
        for dark in (False,True):
            suf='escuro' if dark else 'claro'; fg,cut,_s=colors(dark)
            open(f'/home/claude/prop/svg2/{cod}_horizontal_{suf}.svg','w').write(h2(sym,dark))
            open(f'/home/claude/prop/svg2/{cod}_vertical_{suf}.svg','w').write(h2(sym,dark,True))
            open(f'/home/claude/prop/svg2/{cod}_simbolo_{suf}.svg','w').write(svg('0 0 240 200',sym(fg,cut)))
    for dark in (False,True):
        open(f"/home/claude/prop/svg2/2F_integrado_{'escuro' if dark else 'claro'}.svg",'w').write(h2(s2a,dark,integrado=True))
    print('ok', len(os.listdir('/home/claude/prop/svg2')))
