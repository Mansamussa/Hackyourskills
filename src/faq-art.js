import { animate, inView } from 'framer-motion/dom';
import { reduced, bindHover } from './motion.js';

// Precomputed optical flow lets the artwork deform between materials, rather than
// simply replacing one still with another. Motion owns the animation clock.
export function initFaqArt() {
  const frame = document.querySelector('.faq-art');
  if (!frame) return;
  const canvas = frame.querySelector('canvas');
  const button = frame.querySelector('button');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return;
  const shader = (type, source) => {
    const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('FAQ artwork shader failed');
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main(){uv=vec2((p.x+1.0)*.5,1.0-(p.y+1.0)*.5);gl_Position=vec4(p,0.,1.);}'));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `precision mediump float;
    varying vec2 uv; uniform sampler2D a; uniform sampler2D b; uniform sampler2D f; uniform sampler2D r; uniform float t;
    void main(){
      vec2 forward=(texture2D(f,uv).rg*255.0-128.0)/512.0;
      vec2 reverse=(texture2D(r,uv).rg*255.0-128.0)/512.0;
      vec4 first=texture2D(a,clamp(uv-t*forward,0.0,1.0));
      vec4 second=texture2D(b,clamp(uv-(1.0-t)*reverse,0.0,1.0));
      gl_FragColor=mix(first,second,smoothstep(0.0,1.0,t));
    }`));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program,'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const amount = gl.getUniformLocation(program,'t');
  ['a','b','f','r'].forEach((name,i)=>gl.uniform1i(gl.getUniformLocation(program,name),i));
  const texture = async path => {
    const img = new Image(); img.src = path; await img.decode();
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img); return tex;
  };
  let clock, visible=false, paused=false, ready=false;
  const sync = () => {
    const play = ready && visible && !paused && !reduced.matches && !document.hidden;
    if (play) clock.play(); else clock?.pause();
    button.hidden = !ready || reduced.matches;
  };
  Promise.all(Array.from({length:4},(_,i)=>Promise.all([
    texture(`images/faq-${i}.webp`), texture(`images/faq-flow-${i}.png`), texture(`images/faq-reverse-${i}.png`)
  ]))).then(assets => {
    const draw = value => {
      const cycle = value % 4, index = Math.floor(cycle), phase=cycle-index;
      const t = Math.max(0,Math.min(1,(phase-.42)/.58));
      [assets[index][0],assets[(index+1)%4][0],assets[index][1],assets[index][2]].forEach((tex,i)=>{
        gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,tex);
      });
      gl.uniform1f(amount,t); gl.drawArrays(gl.TRIANGLES,0,6);
    };
    draw(0); frame.dataset.ready='true';
    clock=animate(0,4,{duration:28,ease:'linear',repeat:Infinity,onUpdate:draw});
    ready=true; sync();
  }).catch(()=>{ button.hidden=true; });
  inView(frame,()=>{visible=true;sync();return()=>{visible=false;sync();};});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  button.addEventListener('click',()=>{
    paused=!paused;button.textContent=paused?'Play animation':'Pause animation';
    button.setAttribute('aria-pressed',String(paused));sync();
  });
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();clock?.stop();frame.dataset.ready='false';button.hidden=true;});
  bindHover('.faq-art button',element=>[{element,values:{color:'#ADDB66'}}]);
}
