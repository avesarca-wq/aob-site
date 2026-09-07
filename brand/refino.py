# -*- coding: utf-8 -*-
"""Refino da R4: penas assimétricas com cálamo, tipografia com caráter, kerning ótico."""
import sys, os, json; sys.path.insert(0,'/home/claude/prop')
from logos import V,O,C,G,VE,SANS
from variantes import svg, colors

FONT_CSS = """
@font-face{font-family:'Playfair';src:url('file:///tmp/fonts/PlayfairDisplaywght.ttf');font-weight:400 900}
@font-face{font-family:'Cormorant';src:url('file:///tmp/fonts/CormorantGaramondwght.ttf');font-weight:300 700}
@font-face{font-family:'Montserrat';src:url('file:///tmp/fonts/Montserratwght.ttf');font-weight:100 900}
@font-face{font-family:'Cinzel';src:url('file:///tmp/fonts/Cinzel.ttf');font-weight:400 900}
@font-face{font-family:'Fraunces';src:url('file:///tmp/fonts/Fraunces.ttf');font-weight:100 900}
@font-face{font-family:'Caslon';src:url('file:///tmp/fonts/LibreCaslonDisplay-Regular.ttf')}
@font-face{font-family:'Marcellus';src:url('file:///tmp/fonts/Marcellus-Regular.ttf')}
@font-face{font-family:'Bodoni';src:url('file:///tmp/fonts/BodoniModa.ttf');font-weight:400 900}
"""

# ---------- pena "de verdade": cálamo nu, lâmina assimétrica, barbas curvas, duas fendas ----------
def pena(color, cut, x=0, y=0, rot=0, s=1.0, cal=None):
    cal = cal or color
    return f'''<g transform="translate({x},{y}) rotate({rot}) scale({s})">
<path fill="{color}" d="M0,-30 C-8,-58 -16,-100 -6,-152 C10,-112 24,-70 8,-30 Z"/>
<path stroke="{cal}" stroke-width="4.2" stroke-linecap="round" fill="none" d="M2,4 L0,-30"/>
<path stroke="{cut}" stroke-width="2.6" stroke-linecap="round" fill="none" d="M0,-30 C-2,-70 -4,-105 -6,-140"/>
<path stroke="{cut}" stroke-width="1.7" stroke-linecap="round" fill="none" d="M-1,-52 C-6,-56 -10,-62 -12,-70 M-2,-72 C-8,-77 -12,-84 -13,-92 M-3,-92 C-8,-98 -11,-104 -12,-112 M-1,-52 C6,-56 12,-62 15,-72 M-2,-72 C5,-78 11,-86 14,-96 M-3,-92 C3,-98 8,-106 10,-116 M-4,-112 C1,-118 4,-124 5,-132"/>
<path fill="{cut}" d="M16,-70 L7,-78 L17,-80 Z"/>
<path fill="{cut}" d="M-14,-96 L-6,-100 L-14,-104 Z"/>
</g>'''

def simbolo(fg, cut, x, y, s=1.0):
    # ouro = Aves Arca (esq.), verde-escuro (centro, um pouco maior), verde (dir.); cálamos convergem
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'{pena(O,cut,-6,0,-30,0.98)}{pena(G,cut,6,0,32,0.94)}{pena(fg,cut,0,-2,1,1.06)}</g>')

# ---------- tipografia ----------
FONTS = {
 'playfair': dict(fam='Playfair, serif', w=700, size=93.4, y=150, kern=[0,0,0,0,0,0], sub='Montserrat', subw=600, subsize=21, tag='Playfair (base atual, kerning ótico)'),
 'cormorant': dict(fam='Cormorant, serif', w=700, size=112, y=152, kern=[0,0,0,0,0,0], sub='Montserrat', subw=600, subsize=21, tag='Cormorant Garamond Bold'),
 'cinzel': dict(fam='Cinzel, serif', w=700, size=88, y=150, kern=[0,0,0,0,0,0], sub='Cinzel', subw=500, subsize=21, tag='Cinzel (capitulares romanas)'),
 'fraunces': dict(fam='Fraunces, serif', w=800, size=92, y=150, kern=[0,0,0,0,0,0], sub='Montserrat', subw=600, subsize=21, tag='Fraunces Black'),
 'caslon': dict(fam='Caslon, serif', w=400, size=96, y=150, kern=[0,0,0,0,0,0], sub='Montserrat', subw=600, subsize=21, tag='Libre Caslon Display'),
 'marcellus': dict(fam='Marcellus, serif', w=400, size=96, y=150, kern=[0,0,0,0,0,0], sub='Marcellus', subw=400, subsize=22, tag='Marcellus (lapidar)'),
}
# kerning ótico de BRASIL (dx por letra, em px do viewBox) — calibrado após medição
MET = json.load(open('/home/claude/prop/metrics.json'))
KFACTOR = 0.6   # 60% da equalização de tinta: corrige RA e SI sem apertar as letras abertas

X0,X1 = 231, 559
def brasil(fg, f, key):
    m=MET[key]; k=[round(v*KFACTOR,2) for v in m['dx']]
    letters=''.join(f'<tspan dx="{k[i]}">{ch}</tspan>' for i,ch in enumerate('BRASIL'))
    return f'<text x="{228-m["inkLeft"]:.2f}" y="{f["y"]}" font-family="{f["fam"]}" font-weight="{f["w"]}" font-size="{m["size"]}" fill="{fg}">{letters}</text>'
def sub(f, key):
    m=MET[key]; spacing=m['spacing']
    return f'<text x="{228-m["subInkLeft"]:.2f}" y="66" font-family="{f["sub"]}, sans-serif" font-weight="{f["subw"]}" font-size="{f["subsize"]}" letter-spacing="{spacing}" fill="{O}">AVES ORNAMENTAIS</text>'
def rota(fg):
    m=(X0+X1)/2; Y=178
    return (f'<path d="M{X0},{Y} L{X1},{Y}" fill="none" stroke="{fg}" stroke-width="3.2" stroke-dasharray="1 9" stroke-linecap="round"/>'
            f'<circle cx="{X0}" cy="{Y}" r="7.5" fill="{O}"/><circle cx="{m}" cy="{Y}" r="7.5" fill="{fg}"/><circle cx="{X1}" cy="{Y}" r="7.5" fill="{G}"/>')

def horiz(key, dark, tight=True):
    f=FONTS[key]; fg,cut,_=colors(dark)
    body=simbolo(fg,cut,112,192,1.05)+sub(f,key)+brasil(fg,f,key)+rota(fg)
    return svg('22 34 556 164' if tight else '0 0 760 220', body)
def vert(key, dark):
    f=FONTS[key]; fg,cut,_=colors(dark)
    body=f'<g transform="translate(160,14)">{simbolo(fg,cut,100,174,1.0)}</g><g transform="translate(-135,196)">{sub(f,key)}{brasil(fg,f,key)}{rota(fg)}</g>'
    return svg('0 0 520 400', body)
def simbolo_svg(dark):
    fg,cut,_=colors(dark); return svg('0 0 200 200', simbolo(fg,cut,100,174,1.0))
