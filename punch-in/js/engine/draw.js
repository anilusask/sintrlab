export const FONT='"Press Start 2P",ui-monospace,Menlo,Consolas,monospace';
export function shade(hex,a){
  const n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
  const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));
  return '#'+((1<<24)|(f(r)<<16)|(f(g)<<8)|f(b)).toString(16).slice(1);
}
export function rnd(x,y,i=0){let h=(x*374761393+y*668265263+i*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;}
export function text(g,s,x,y,col,size,al='left'){g.font=size+'px '+FONT;g.textBaseline='top';g.textAlign=al;g.fillStyle=col;g.fillText(s,x,y);}
export function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
