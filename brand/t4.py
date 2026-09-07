# -*- coding: utf-8 -*-
"""Variações sobre T4 (Fraunces) com potencial de subir a nota."""
import sys, os, json; sys.path.insert(0,'/home/claude/prop')
from logos import V,O,C,G,VE
from variantes import svg, colors
from refino import FONT_CSS, pena, simbolo, simbolo_svg, X0, X1

M = json.load(open('/home/claude/prop/metrics_t4.json'))
TX = 228   # borda esquerda de tinta
Y  = 150   # baseline de BRASIL
YR = 178   # linha da rota
SUBM = dict(font='Montserrat, sans-serif', w=600, size=21, spacing=6.98, inkLeft=-1)

def txt_brasil(fg, key='f800', var='', hide_i=False, cor_i=None, fs=1.0):
    m=M[key]; x=TX-m['inkLeft']
    parts=[]
    for d,ch in zip(m['dx'],'BRASIL'):
        attr=''
        if hide_i and ch=='I': attr=' fill="none"'
        elif cor_i and ch=='I': attr=f' fill="{cor_i}"'
        parts.append(f'<tspan dx="{d}"{attr}>{ch}</tspan>')
    sp=''.join(parts)
    style=f' style="font-variation-settings:{var}"' if var else ''
    w={'f700':700,'f800':800,'f900':900}[key]
    return f'<text x="{x:.2f}" y="{Y}" font-family="Fraunces, serif" font-weight="{w}" font-size="{m["size"]*fs:.2f}" fill="{fg}"{style}>{sp}</text>'

def sub_m(color=O):
    return f'<text x="{TX-SUBM["inkLeft"]}" y="66" font-family="{SUBM["font"]}" font-weight="{SUBM["w"]}" font-size="{SUBM["size"]}" letter-spacing="{SUBM["spacing"]}" fill="{color}">AVES ORNAMENTAIS</text>'
def sub_f(color=O, key='f800'):
    s=M[key]['subF']
    return f'<text x="{TX-s["inkLeft"]}" y="66" font-family="Fraunces, serif" font-weight="600" font-size="21" letter-spacing="{s["spacing"]}" fill="{color}" style="font-variation-settings:\'opsz\' 9">AVES ORNAMENTAIS</text>'
def rota(fg, x0=X0, x1=X1, y=YR, cores=None, mid=None):
    cores = cores or (O, fg, G); mid = mid if mid is not None else (x0+x1)/2
    return (f'<path d="M{x0},{y} L{x1},{y}" fill="none" stroke="{fg}" stroke-width="3.2" stroke-dasharray="1 9" stroke-linecap="round"/>'
            f'<circle cx="{x0}" cy="{y}" r="7.5" fill="{cores[0]}"/><circle cx="{mid}" cy="{y}" r="7.5" fill="{cores[1]}"/><circle cx="{x1}" cy="{y}" r="7.5" fill="{cores[2]}"/>')

def letter_center(key, ch):
    L=[l for l in M[key]['letters'] if l['ch']==ch][0]; return TX-M[key]['inkLeft']+ (L['inkL']+L['inkR'])/2 + M[key]['inkLeft']  # posições já relativas ao x do texto

# ---------- variações ----------
def base(dark):  # T4 como está
    fg,cut,_=colors(dark); return simbolo(fg,cut,112,192,1.05)+sub_m()+txt_brasil(fg)+rota(fg)
def v1(dark):    # WONK: letras com o "torto" desenhado da própria Fraunces (a do lettering)
    fg,cut,_=colors(dark); return simbolo(fg,cut,112,192,1.05)+sub_m()+txt_brasil(fg,'f800',"'WONK' 1, 'SOFT' 100, 'opsz' 144",fs=0.988)+rota(fg)
def v2(dark):    # a pena central vira o I de BRASIL
    fg,cut,_=colors(dark); m=M['f800']; L=m['letters'][4]; cx=TX-m['inkLeft']+(L['inkL']+L['inkR'])/2
    pen=f'<g transform="translate({cx:.2f},{Y+1}) scale(0.72,0.43)">{pena(fg,cut,0,0,0,1.0)}</g>'
    return simbolo(fg,cut,112,192,1.05)+sub_m()+txt_brasil(fg,hide_i=True)+pen+rota(fg)
def v3(dark):    # sistema todo em Fraunces (AVES ORNAMENTAIS em Fraunces 600, opsz de texto)
    fg,cut,_=colors(dark); return simbolo(fg,cut,112,192,1.05)+sub_f()+txt_brasil(fg,'f800',"'SOFT' 100, 'opsz' 144",fs=0.988)+rota(fg)
def v4(dark):    # ouro no nome: BRASIL em ouro sobre o verde; no claro, o I em ouro
    fg,cut,_=colors(dark)
    if dark: return simbolo(fg,cut,112,192,1.05)+sub_m(C)+txt_brasil(O)+rota(fg,cores=(C,O,G))
    return simbolo(fg,cut,112,192,1.05)+sub_m()+txt_brasil(fg,cor_i=O)+rota(fg)
def v5(dark):    # peso 900 + opsz 144: mais massa, menos contraste com as penas
    fg,cut,_=colors(dark); return simbolo(fg,cut,112,192,1.05)+sub_m()+txt_brasil(fg,'f900',"'SOFT' 50, 'opsz' 144")+rota(fg)
def v6(dark):    # pontos da rota sob B · S · L (a rota "lê" o nome)
    fg,cut,_=colors(dark); m=M['f800']; x=TX-m['inkLeft']
    c=lambda i:(x+(m['letters'][i]['inkL']+m['letters'][i]['inkR'])/2)
    return simbolo(fg,cut,112,192,1.05)+sub_m()+txt_brasil(fg)+rota(fg,c(0),c(5),YR,mid=c(2))


def v7(dark):    # combinação: Wonk + pena no I + rota lendo o nome
    fg,cut,_=colors(dark); m=M['f800']; x=TX-m['inkLeft']
    c=lambda i:(x+(m['letters'][i]['inkL']+m['letters'][i]['inkR'])/2)
    cx=c(4)
    pen=f'<g transform="translate({cx:.2f},{Y+1}) scale(0.72,0.43)">{pena(fg,cut,0,0,0,1.0)}</g>'
    return (simbolo(fg,cut,112,192,1.05)+sub_m()
            +txt_brasil(fg,'f800',"'WONK' 1, 'SOFT' 100, 'opsz' 144",hide_i=True,fs=0.988)+pen
            +rota(fg,c(0),c(5),YR,mid=c(2)))

VARS=[('V0','T4 como está',base,'Referência: Fraunces 800, kerning ótico, larguras iguais.'),
 ('V1','Wonk — o torto desenhado',v1,'A Fraunces tem um eixo "WONK" que inclina hastes e curva terminais como num lettering feito à mão. É o caminho mais curto para "letras próprias" sem desenhar letra por letra.'),
 ('V2','A pena é o I',v2,'A pena central do símbolo entra no lugar do I de BRASIL. Símbolo e nome passam a compartilhar um elemento: o truque clássico das marcas que se reconhecem só pelo nome.'),
 ('V3','Sistema Fraunces',v3,'AVES ORNAMENTAIS também em Fraunces (peso 600, corpo de texto). Uma família só, duas vozes — coerência que se nota no material impresso.'),
 ('V4','Ouro no nome',v4,'Sobre o verde, BRASIL em ouro e AVES ORNAMENTAIS em creme (inverte a hierarquia de cor). No claro, só o I recebe o ouro — um detalhe que pede um segundo olhar.'),
 ('V5','Peso 900',v5,'Mais massa em BRASIL para equilibrar com as três penas; opsz 144 afina as serifas. Melhor em tamanho pequeno e em bordado.'),
 ('V7','Combinação — Wonk + pena no I + rota lendo o nome',v7,'As três ideias que mais somam, juntas: letras com o torto da Fraunces, a pena central ocupando o I e a rota ancorada em B · A · L. É a versão com mais assinatura própria.'),
 ('V6','A rota lê o nome',v6,'Os três pontos ficam exatamente sob o B, o A e o L; a linha vai de um ao outro. A rota deixa de ser um sublinhado e vira parte da tipografia.'),
]

def horiz(fn,dark): return svg('22 34 556 164', fn(dark))
def vert(fn,dark):
    fg,cut,_=colors(dark)
    inner=fn(dark).replace(simbolo(fg,cut,112,192,1.05),'')
    return svg('0 0 520 400', f'<g transform="translate(160,14)">{simbolo(fg,cut,100,174,1.0)}</g><g transform="translate(-135,196)">{inner}</g>')

if __name__=='__main__':
    os.makedirs('/home/claude/prop/svg_t4',exist_ok=True)
    for cod,nome,fn,_ in VARS:
        for dark in (False,True):
            suf='escuro' if dark else 'claro'
            open(f'/home/claude/prop/svg_t4/T4-{cod}_horizontal_{suf}.svg','w').write(horiz(fn,dark))
            open(f'/home/claude/prop/svg_t4/T4-{cod}_vertical_{suf}.svg','w').write(vert(fn,dark))
    print('ok',len(os.listdir('/home/claude/prop/svg_t4')))
