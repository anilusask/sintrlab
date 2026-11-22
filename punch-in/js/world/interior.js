import {TS} from './consts.js';
import {shade,rnd,text,canvas} from '../engine/draw.js';
const W=26,H=16;
export function buildInterior(b){
  const solid=new Uint8Array(W*H),idx=(x,y)=>y*W+x;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x===0||y<=1||x===W-1||y===H-1)solid[idx(x,y)]=1;
  solid[idx(12,H-1)]=0;solid[idx(13,H-1)]=0;
  const benches=[[3,5,5,2],[18,5,5,2],[3,9,5,2],[18,9,5,2]];
  benches.forEach(([x0,y0,w,h])=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)solid[idx(x,y)]=1;});
  const layer=canvas(W*TS,H*TS),g=layer.getContext('2d');g.imageSmoothingEnabled=false;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){g.fillStyle=((x+y)&1)?'#2a2438':'#2f2942';g.fillRect(x*TS,y*TS,TS,TS);for(let i=0;i<8;i++)if(rnd(x,y,i)>.55){g.fillStyle='#38314c';g.fillRect(x*TS+((rnd(x,y,i+9)*TS)|0),y*TS+((rnd(x,y,i+19)*TS)|0),2,1);}}
  g.fillStyle=shade(b.color,-.7);g.fillRect(0,0,W*TS,2*TS);
  g.fillStyle='#3d3050';for(let j=0;j<2*TS;j+=8)g.fillRect(0,j,W*TS,1);for(let j=0;j<2*TS;j+=8)for(let i=(j/8%2)*16;i<W*TS;i+=32)g.fillRect(i,j,1,8);
  g.fillStyle=b.color;g.fillRect(0,2*TS-8,W*TS,8);g.fillStyle=shade(b.color,-.4);g.fillRect(0,2*TS-2,W*TS,2);
  g.fillStyle='#241d33';g.fillRect(0,2*TS,TS,(H-2)*TS);g.fillRect((W-1)*TS,2*TS,TS,(H-2)*TS);g.fillRect(0,(H-1)*TS,W*TS,TS);
  g.fillStyle=b.color;g.fillRect(TS-3,2*TS,3,(H-3)*TS);g.fillRect((W-1)*TS,2*TS,3,(H-3)*TS);
  g.fillStyle='#14101f';g.fillRect(12*TS-3,(H-1)*TS,2*TS+6,TS);g.fillStyle='#fbe9b0';g.fillRect(12*TS,(H-1)*TS+4,2*TS,TS-4);
  g.fillStyle='#e8c547';for(let i=0;i<2*TS;i+=8)g.fillRect(12*TS+i,(H-2)*TS+22,4,6);
  text(g,'EXIT',13*TS,(H-1)*TS+10,'#14101f',8,'center');
  const lines=b.sign.split('\n');lines.forEach((l,i)=>text(g,l,6*TS,10+i*14,'#ffffff',12,'center'));
  text(g,b.name.toUpperCase(),19.5*TS,14,'#ffffff',10,'center');
  const bx=13*TS-26,by=TS-2;g.fillStyle='#14101f';g.fillRect(bx-2,by-2,56,38);g.fillStyle='#6b4a2a';g.fillRect(bx,by,52,34);g.fillStyle='#e8dcc0';g.fillRect(bx+5,by+5,18,12);g.fillRect(bx+27,by+7,18,10);g.fillRect(bx+9,by+21,30,8);g.fillStyle='#ff2a6d';g.fillRect(bx+12,by+3,3,3);
  benches.forEach(([x0,y0,w,h])=>{const X=x0*TS,Y=y0*TS;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(X+5,Y+8,w*TS,h*TS);g.fillStyle='#14101f';g.fillRect(X-1,Y-1,w*TS+2,h*TS+2);g.fillStyle=shade(b.color,-.45);g.fillRect(X,Y,w*TS,h*TS);g.fillStyle=shade(b.color,-.12);g.fillRect(X,Y,w*TS,TS-6);g.fillStyle='#14101f';g.fillRect(X+6,Y+8,18,10);g.fillRect(X+w*TS-34,Y+10,22,8);g.fillStyle=shade(b.color,-.55);g.fillRect(X,Y+h*TS-6,w*TS,6);});
  const sx=8*TS,sy=12*TS;g.fillStyle='#14101f';g.fillRect(sx-2,sy-2,10*TS+4,TS+4);g.fillStyle='#e8c547';g.fillRect(sx,sy,10*TS,TS);g.save();g.beginPath();g.rect(sx,sy,10*TS,TS);g.clip();g.fillStyle='#14101f';for(let i=-TS;i<10*TS;i+=22){g.beginPath();g.moveTo(sx+i,sy+TS);g.lineTo(sx+i+11,sy+TS);g.lineTo(sx+i+22,sy);g.lineTo(sx+i+11,sy);g.closePath();g.fill();}g.restore();
  g.fillStyle='#14101f';g.fillRect(sx+22,sy+6,10*TS-44,TS-12);text(g,'UNDER CONSTRUCTION',sx+5*TS,sy+11,'#e8c547',8,'center');
  return{id:b.id,name:b.name,w:W,h:H,solid,layer,
    doors:[{x:12*TS,y:(H-1)*TS,w:2*TS,h:TS,to:'outside',arrive:{x:(b.door.x+1)*TS,y:(b.door.y+1)*TS+16}}],
    things:[{x:13*TS,y:3*TS+4,r:48,label:'E: read the board',run:c=>c.ui.dialog(b.name,b.plan+'\n\nThis shop is still being built.')}],
    spawn:{x:13*TS,y:(H-2)*TS+16}};
}
