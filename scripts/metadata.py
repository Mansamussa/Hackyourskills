"""Generate route-specific bilingual metadata for the current public origin."""
from pathlib import Path
import re,html,json
root=Path(__file__).resolve().parents[1];d=root/'dist'
origin=json.loads((root/'site-config.json').read_text())['publicOrigin'].rstrip('/')
pages=['index','website-design','website-examples','privacy-policy-draft','terms-of-service-draft','thank-you']
def url(name,lang):return origin+('/' if name=='index' and lang=='en' else '/'+('nl-' if lang=='nl' else '')+name)
for name in pages:
 for lang in ['en','nl']:
  p=d/(('nl-' if lang=='nl' else '')+name+'.html');s=p.read_text()
  if name=='terms-of-service-draft':
   title='Algemene voorwaarden | Hack Your Skills' if lang=='nl' else 'Terms of Service | Hack Your Skills'
   desc='Afspraken over de gratis audit en betaalde projecten van Hack Your Skills.' if lang=='nl' else 'How the free audit and paid projects work at Hack Your Skills.'
   s=re.sub(r'<title>.*?</title>','<title>'+title+'</title>',s)
   s=re.sub(r'<meta name="description"[^>]*>','<meta name="description" content="'+desc+'">',s)
  title=html.unescape(re.search(r'<title>(.*?)</title>',s,re.S)[1]);desc=html.unescape(re.search(r'<meta name="description" content="([^"]*)"',s)[1])
  s=re.sub(r'<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>','',s)
  s=re.sub(r'<meta\b[^>]*(?:property="og:(?:title|description|url|locale)"|name="(?:twitter:title|twitter:description|robots)")[^>]*>','',s)
  head=f'<link rel="canonical" href="{url(name,lang)}">'
  for locale in ['en','nl']:head+=f'<link rel="alternate" hreflang="{locale}" href="{url(name,locale)}">'
  head+=f'<link rel="alternate" hreflang="x-default" href="{url(name,"en")}">'
  for prop,val in [('og:title',title),('og:description',desc),('og:url',url(name,lang)),('og:locale','nl_NL' if lang=='nl' else 'en_US')]:head+=f'<meta property="{prop}" content="{html.escape(val,quote=True)}">'
  for prop,val in [('twitter:title',title),('twitter:description',desc)]:head+=f'<meta name="{prop}" content="{html.escape(val,quote=True)}">'
  if name=='thank-you':head+='<meta name="robots" content="noindex,follow">'
  # Keep the existing social image; correct only its known host.
  s=re.sub(r'https://hackyourskills\.com/(?=(?:images/|og-image))',origin+'/',s)
  p.write_text('\n'.join(line.rstrip() for line in s.replace('</head>',head+'</head>').splitlines())+'\n')
urls=[url(n,l) for n in pages if n!='thank-you' for l in ['en','nl']]
(d/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc></url>' for u in urls)+'</urlset>\n')
(d/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml\n')
print('Updated metadata for 12 pages and sitemap for 10 indexable pages.')
