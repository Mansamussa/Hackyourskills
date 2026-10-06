import {defineConfig} from 'vite';
export default defineConfig({
 root:'dist',server:{host:'0.0.0.0',allowedHosts:['terminal.local']},
 plugins:[{name:'responsive-review',configureServer(server){
  server.middlewares.use('/__mobile-review',(req,res)=>{
   const query=new URL(req.url,'http://localhost').searchParams;
   const w=Math.max(320,Math.min(1440,Number(query.get('w'))||390));
   const h=Math.max(280,Math.min(1000,Number(query.get('h'))||844));
   const page=query.get('lang')==='nl'?'nl-index.html':'index.html';
   res.setHeader('Content-Type','text/html');
   res.end(`<!doctype html><html><head><title>Responsive review</title></head><body style="margin:0;background:#444"><div style="position:fixed;right:8px;top:8px;z-index:9"><button onclick="document.querySelector('iframe').contentWindow.scrollBy(0,450)">Scroll 450px</button><button onclick="const f=document.querySelector('iframe');f.contentWindow.scrollTo(0,parseFloat(f.contentDocument.querySelector('.hero').style.getPropertyValue('--hero-scroll-distance')))">Finish hero</button><button onclick="const f=document.querySelector('iframe');const w=f.style.width;f.style.width=f.style.height;f.style.height=w">Rotate</button></div><iframe title="Site preview" src="/${page}" style="display:block;border:0;width:${w}px;height:${h}px"></iframe></body></html>`);
  });
 }}]
});
