"""Derive structured data from the same visible page text, without invented identities or results."""
from pathlib import Path
from html.parser import HTMLParser
import re,json
root=Path(__file__).resolve().parents[1];dist=root/'dist'
class Node:
 def __init__(self,tag='',attrs=()):self.tag=tag;self.attrs=dict(attrs);self.children=[]
 def text(self):return ' '.join(' '.join(c.text() if isinstance(c,Node) else c for c in self.children).split())
 def find(self,predicate):
  out=[]
  for c in self.children:
   if isinstance(c,Node):
    if predicate(c):out.append(c)
    out+=c.find(predicate)
  return out
 def cls(self,name):return name in self.attrs.get('class','').split()
class Tree(HTMLParser):
 def __init__(self):super().__init__();self.root=Node();self.stack=[self.root]
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs);self.stack[-1].children.append(n)
  if tag not in {'meta','link','img','input','br','hr','source','wbr','area','base','embed','param','track','col'}:self.stack.append(n)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):self.stack[-1].children.append(data)
for p in dist.glob('*.html'):
 s=re.sub(r'<script type="application/ld\+json" id="hys-structured-data">.*?</script>','',p.read_text(),flags=re.S)
 if 'thank-you' in p.name:p.write_text(s);continue
 tree=Tree();tree.feed(s);doc=tree.root
 canon=doc.find(lambda n:n.tag=='link' and n.attrs.get('rel')=='canonical')[0].attrs['href']
 lang='nl' if p.name.startswith('nl-') else 'en';origin=canon.split('/',3)[:3];origin='/'.join(origin)
 title=doc.find(lambda n:n.tag=='title')[0].text();description=doc.find(lambda n:n.tag=='meta' and n.attrs.get('name')=='description')[0].attrs['content']
 site={'@type':'WebSite','@id':origin+'/#website','url':origin+'/','name':'Hack Your Skills','inLanguage':['en','nl']}
 page={'@type':'WebPage','@id':canon+'#webpage','url':canon,'name':title,'description':description,'inLanguage':lang,'isPartOf':{'@id':site['@id']}}
 graph=[site,page];services=[]
 for card in doc.find(lambda n:n.cls('design-package') or n.cls('accordion-item')):
  heading=card.find(lambda n:n.tag=='h3' or n.cls('accordion-btn'))
  paras=card.find(lambda n:n.tag=='p' and not n.cls('design-price'))
  if not heading or not paras:continue
  name=re.sub(r'^\d+\s*','',heading[0].text()).replace('▾','').strip()
  service={'@type':'Service','@id':canon+'#service-'+str(len(services)+1),'name':name,'description':paras[0].text(),'url':canon}
  services.append({'@id':service['@id']});graph.append(service)
 if services:page['about']=services
 faqs=[]
 for item in doc.find(lambda n:n.cls('faq-item')):
  buttons=item.find(lambda n:n.cls('faq-toggle'));answers=item.find(lambda n:n.cls('faq-content'))
  if buttons and answers:
   labels=buttons[0].find(lambda n:n.tag=='span');question=labels[0].text() if labels else buttons[0].text()
   faqs.append({'@type':'Question','name':question,'acceptedAnswer':{'@type':'Answer','text':answers[0].text()}})
 if faqs:
  faq={'@type':'FAQPage','@id':canon+'#questions','inLanguage':lang,'mainEntity':faqs};graph.append(faq);page['hasPart']={'@id':faq['@id']}
 schema=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
 p.write_text(s.replace('</head>','<script type="application/ld+json" id="hys-structured-data">'+schema+'</script></head>'))
print('Generated visible-content WebSite, WebPage, Service and FAQ structured data; identity deferred.')
