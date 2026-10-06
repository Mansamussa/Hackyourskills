"""Generate Dutch pages from the authored English pages and reviewed copy."""
import json, re
from html import escape
from html.parser import HTMLParser
from pathlib import Path

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
english = json.loads((root / 'translations/en.json').read_text())
numbered = dict(line.split('|', 1) for line in (root / 'translations/nl.txt').read_text().splitlines() if line)
assert set(numbered) == {str(i) for i in range(len(english))}, 'Incomplete translation catalog'
words = {en: numbered[str(i)] for i, en in enumerate(english)}
words.update({
    "Send Me Your Funnel — I'll Find One Leak and Rebuild It": 'Stuur mij je funnel — ik vind één lek en herstel het',
    'Original': 'Origineel', 'No website yet': 'Nog geen website',
    'Your funnel has been received. Your Conversion Fix will be delivered within 24-48 hours.': 'Je funnel is ontvangen. Je ontvangt je conversieverbetering binnen 24–48 uur.',
    'Terms of Service | Hack Your Skills': 'Algemene voorwaarden | Hack Your Skills',
    'Terms of Service for Hack Your Skills. Read our terms and conditions for using our funnel diagnosis and optimisation services.': 'Algemene voorwaarden van Hack Your Skills voor onze funneldiagnose- en optimalisatiediensten.',
})
words.update(json.loads((root / 'translations/remediation.json').read_text()))
for brand in ['BLKKA', 'Monks Safari', 'Hack Your Skills']:
    words[f'No website yet. {brand} started from a blank page.'] = f'Nog geen website. {brand} begon met een leeg canvas.'

pages = sorted(p for p in dist.glob('*.html') if not p.name.startswith('nl-'))
names = {p.name for p in pages}
missing = set()
def translate(value):
    key = value.strip()
    if key in words:
        return value[:len(value)-len(value.lstrip())] + words[key] + value[len(value.rstrip()):]
    if any(c.isalpha() for c in key): missing.add(key)
    return value

class Dutch(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []; self.raw = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'): self.raw += 1
        for k, v in attrs:
            if v is None: continue
            if k in ('alt','placeholder','aria-label','title','data-before-state','data-after-state','data-before-caption','data-after-caption'):
                a[k] = translate(v)
            if tag == 'meta' and k == 'content' and (a.get('name') == 'description' or a.get('property','') in ('og:title','og:description') or a.get('name','') in ('twitter:title','twitter:description')):
                a[k] = translate(v)
            if k in ('href', 'action') and v.split('#')[0].split('?')[0] in names:
                a[k] = 'nl-' + v
        if tag == 'html': a['lang'] = 'nl'
        self.out.append('<'+tag+''.join(' '+k+(('="'+escape(v,quote=True)+'"') if v is not None else '') for k,v in a.items())+'>')
    def handle_endtag(self,tag):
        self.out.append('</'+tag+'>')
        if tag in ('script','style'):self.raw -= 1
    def handle_data(self,data):
        if self.raw:
            data = data.replace('Something went wrong. Please try again.', 'Er ging iets mis. Probeer het opnieuw.').replace('✓ Skipped — your Conversion Fix is still on its way.', '✓ Overgeslagen — je conversieverbetering is nog steeds onderweg.')
            self.out.append(data)
        else: self.out.append(escape(translate(data),quote=False))
    def handle_entityref(self,name):self.out.append('&'+name+';')
    def handle_charref(self,name):self.out.append('&#'+name+';')
    def handle_comment(self,data):self.out.append('<!--'+data+'-->')
    def handle_decl(self,data):self.out.append('<!'+data+'>')

def controls(html, name, lang):
    en = name; nl = 'nl-'+name
    active = lambda code: ' aria-current="true"' if lang == code else ''
    bar = f'<div class="language-switch" role="group" aria-label="{"Taal kiezen" if lang=="nl" else "Choose language"}"><a href="{nl}" lang="nl" hreflang="nl" data-language="nl" aria-label="Nederlands"{active("nl")}>NL</a><a href="{en}" lang="en" hreflang="en" data-language="en" aria-label="English"{active("en")}>EN</a></div>'
    html = re.sub(r'(<body\b[^>]*>)',r'\1'+bar,html,count=1)
    head = f'<link rel="stylesheet" href="language.css"><link rel="alternate" hreflang="en" href="{en}"><link rel="alternate" hreflang="nl" href="{nl}">'
    return html.replace('</head>',head+'</head>').replace('<head>','<head><!-- language-start --><script src="language.js"></script><!-- language-end -->',1)

for p in pages:
    source = p.read_text()
    source = re.sub(r'<script type="application/ld\+json" id="hys-structured-data">.*?</script>', '', source, flags=re.S)
    source = re.sub(r'<meta[^>]*property="og:locale"[^>]*>', '', source)
    source = re.sub(r'<!-- language-start -->.*?<!-- language-end -->','',source,flags=re.S)
    source = re.sub(r'<div class="language-switch".*?</div>','',source,flags=re.S)
    source = re.sub(r'<link rel="(?:stylesheet|alternate)"[^>]*(?:language\.css|hreflang=)[^>]*>','',source)
    parser = Dutch(); parser.feed(source)
    translated = ''.join(parser.out).replace('€1,250','€1.250')
    (dist / ('nl-'+p.name)).write_text(controls(translated,p.name,'nl'))
    p.write_text(controls(source,p.name,'en'))
if missing:
    raise SystemExit('Missing translations: '+json.dumps(sorted(missing),ensure_ascii=False))
print(f'Generated {len(pages)} Dutch pages; all copy covered.')
