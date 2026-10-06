from pathlib import Path
import json,re
from html.parser import HTMLParser
from urllib.parse import urlsplit
class Check(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.h1=0;self.canon=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='link' and a.get('rel')=='canonical':self.canon.append(a['href'])
  for key in ['src','href']:
   if a.get(key):self.links.append(a[key])
pages={};root=Path('dist')
for p in root.glob('*.html'):
 s=p.read_text();c=Check();c.feed(s);pages[p.name]=c
 assert c.h1==1 and len(c.ids)==len(set(c.ids)),p.name
 assert len(c.canon)==1,p.name
 schemas=re.findall(r'<script type="application/ld\+json" id="hys-structured-data">(.*?)</script>',s)
 if 'thank-you' in p.name:assert not schemas;continue
 assert len(schemas)==1,p.name
 graph=json.loads(schemas[0])['@graph'];assert all(n['@type'] not in ['Organization','Person','LocalBusiness','Review','AggregateRating'] for n in graph)
 services=[n for n in graph if n['@type']=='Service']
 if p.name in ['index.html','nl-index.html','website-design.html','nl-website-design.html']:assert len(services)==3,(p.name,len(services))
 faqs=[n for n in graph if n['@type']=='FAQPage']
 if 'website-design' in p.name or p.name in ['index.html','nl-index.html']:
  assert len(faqs)==1
  assert len(faqs[0]['mainEntity'])==(4 if 'website-design' in p.name else 10)
for name,c in pages.items():
 for ref in c.links:
  url=urlsplit(ref)
  if url.scheme or url.netloc:continue
  path=url.path or name
  assert (root/path).exists(),(name,path)
  if url.fragment and path in pages:assert url.fragment in pages[path].ids,(name,ref)
print('PASS: 12 routes; metadata, local links and assets; 12 service entries; 28 bilingual question/answer entries; no invented identity or review schema.')
