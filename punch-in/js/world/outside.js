import {TS} from './consts.js';
import {BUILDINGS} from './buildings.js';
import {shade,rnd,text,canvas} from '../engine/draw.js';
export const OW=56,OH=40;
export function isRoad(x,y){
  if(x<1||y<1||x>OW-2||y>OH-2)return false;
  return (y>=11&&y<=13)||(y>=24&&y<=26)||(y>=36&&y<=38)||x===13||x===14||x===26||x===27||x===39||x===40;
}
const TREES=[[1,11],[1,24],[1,36],[53,11],[53,24],[53,36],[20,1],[33,1],[47,1],[7,1]];
const CRATES=[[11,10],[10,14],[11,14]],BARRELS=[[49,10],[50,10],[50,14]];
function ground(g){
  for(let y=0;y<OH;y++)for(let x=0;x<OW;x++){
    const road=isRoad(x,y),X=x*TS,Y=y*TS;
    g.fillStyle=road?'#363944':(((x+y)&1)?'#aeb3bd':'#a9aeb8');g.fillRect(X,Y,TS,TS);
    for(let i=0;i<14;i++){const r=rnd(x,y,i);if(r>.5){g.fillStyle=road?(i%2?'#41444f':'#2e3039'):(i%2?'#b8bcc6':'#9da3ae');g.fillRect(X+((rnd(x,y,i+30)*TS)|0),Y+((rnd(x,y,i+60)*TS)|0),1+(i%3===0?1:0),1);}}
    if(!road){g.fillStyle='#98a0ac';g.fillRect(X+TS-1,Y,1,TS);g.fillRect(X,Y+TS-1,TS,1);}
  }
  g.fillStyle='#e8c547';
  [12,25,37].forEach(y=>{for(let x=1;x<OW-1;x++){if(isRoad(x,y)&&!(x===13||x===14||x===26||x===27||x===39||x===40)&&x%2===0)g.fillRect(x*TS+4,y*TS+TS/2-1,24,2);}});
  [14,27,40].forEach(x=>{for(let y=1;y<OH-1;y++){if(!((y>=11&&y<=13)||(y>=24&&y<=26)||(y>=36&&y<=38))&&y%2===0)g.fillRect(x*TS-1,y*TS+4,2,24);}});
}
function fence(g){
  g.fillStyle='#241d33';g.fillRect(0,0,OW*TS,TS);g.fillRect(0,(OH-1)*TS,OW*TS,TS);g.fillRect(0,0,TS,OH*TS);g.fillRect((OW-1)*TS,0,TS,OH*TS);
  g.fillStyle='#6a5f86';
  for(let x=0;x<OW*TS;x+=6){g.fillRect(x,6,1,20);g.fillRect(x,(OH-1)*TS+6,1,20);}
  for(let y=0;y<OH*TS;y+=6){g.fillRect(6,y,20,1);g.fillRect((OW-1)*TS+6,y,20,1);}
  g.fillStyle='#8f84ad';g.fillRect(0,4,OW*TS,2);g.fillRect(0,(OH-1)*TS+4,OW*TS,2);g.fillRect(4,0,2,OH*TS);g.fillRect((OW-1)*TS+4,0,2,OH*TS);
}
function building(g,b){
  const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,wallH=3*TS,roofH=h-wallH;
  g.fillStyle='rgba(0,0,0,.32)';g.fillRect(x+7,y+9,w,h);
  g.fillStyle=shade(b.color,-.66);g.fillRect(x,y,w,roofH);
  g.fillStyle=shade(b.color,-.56);for(let i=0;i<w;i+=48)g.fillRect(x+i,y,2,roofH);for(let j=0;j<roofH;j+=48)g.fillRect(x,y+j,w,2);
  for(let i=0;i<Math.floor(w/96);i++){const vx=x+30+i*96,vy=y+20+((i*37)%24);g.fillStyle='#262033';g.fillRect(vx,vy,26,18);g.fillStyle='#4a4160';g.fillRect(vx+2,vy+2,22,3);g.fillStyle='#14101f';for(let k=0;k<4;k++)g.fillRect(vx+4,vy+7+k*3,18,1);}
  if(b.id==='testlab'){for(let i=0;i<4;i++){const sx=x+60+i*140;g.fillStyle='#14101f';g.fillRect(sx-2,y+roofH-70,104,52);g.fillStyle='#2d4f7c';g.fillRect(sx,y+roofH-68,100,48);g.fillStyle='#4b7fb8';g.fillRect(sx+4,y+roofH-64,30,6);}}
  g.fillStyle=b.color;g.fillRect(x,y+roofH-7,w,7);g.fillStyle=shade(b.color,-.35);g.fillRect(x,y+roofH-2,w,2);
  g.fillStyle=shade(b.color,-.34);g.fillRect(x,y+roofH,w,wallH);
  g.fillStyle=shade(b.color,-.46);for(let j=0;j<wallH;j+=8)g.fillRect(x,y+roofH+j,w,1);
  for(let j=0;j<wallH;j+=8)for(let i=(j/8%2)*12;i<w;i+=24)g.fillRect(x+i,y+roofH+j,1,8);
  const dx=b.door.x*TS,dy=b.door.y*TS;
  for(let wx=x+22;wx<x+w-40;wx+=70){
    if(wx+30>dx-14&&wx<dx+2*TS+14)continue;
    g.fillStyle='#14101f';g.fillRect(wx-2,y+roofH+34,34,24);g.fillStyle='#1c3558';g.fillRect(wx,y+roofH+36,30,20);g.fillStyle='#3f74b0';g.fillRect(wx+2,y+roofH+38,10,4);g.fillStyle='#14101f';g.fillRect(wx+14,y+roofH+36,2,20);
  }
  g.fillStyle='#14101f';g.fillRect(dx-3,dy-TS-3,2*TS+6,2*TS+3);g.fillStyle=shade(b.color,-.15);g.fillRect(dx,dy-TS,2*TS,2*TS);
  g.fillStyle='#fbe9b0';g.fillRect(dx+4,dy-TS+4,TS-8,2*TS-8);g.fillRect(dx+TS+4,dy-TS+4,TS-8,2*TS-8);g.fillStyle=shade(b.color,-.4);g.fillRect(dx+TS-1,dy-TS,2,2*TS);
  g.fillStyle='#14101f';g.fillRect(dx+8,dy-TS+8,TS-16,10);g.fillRect(dx+TS+8,dy-TS+8,TS-16,10);
  g.fillStyle=b.color;g.fillRect(dx-10,dy-TS-12,2*TS+20,10);g.fillStyle=shade(b.color,-.4);g.fillRect(dx-10,dy-TS-3,2*TS+20,2);
  g.fillStyle='#e8c547';for(let i=0;i<2*TS;i+=8)g.fillRect(dx+i,dy+TS-5,4,5);
  const lines=b.sign.split('\n'),sh=lines.length>1?34:22,sw=Math.min(w-40,Math.max(...lines.map(l=>l.length))*11+24),sx=x+w/2-sw/2,sy=b.id==='testlab'?y+14:y+roofH-14-sh;
  if(sx+sw<dx-6||sx>dx+2*TS+6||true){g.fillStyle='#14101f';g.fillRect(sx-2,sy-2,sw+4,sh+4);g.fillStyle='#0d0221';g.fillRect(sx,sy,sw,sh);g.fillStyle=b.color;g.fillRect(sx,sy,sw,2);g.fillRect(sx,sy+sh-2,sw,2);
    lines.forEach((l,i)=>text(g,l,x+w/2,sy+6+i*13,'#ffffff',10,'center'));}
  g.strokeStyle='#14101f';g.lineWidth=2;g.strokeRect(x+1,y+1,w-2,h-2);
}
function crate(g,tx,ty){const X=tx*TS+2,Y=ty*TS+3;g.fillStyle='#14101f';g.fillRect(X-1,Y-1,30,30);g.fillStyle='#b98443';g.fillRect(X,Y,28,28);g.fillStyle='#8a5f2c';for(let i=0;i<28;i+=7)g.fillRect(X,Y+i,28,1);g.fillRect(X+2,Y+2,3,24);g.fillRect(X+23,Y+2,3,24);g.fillStyle='#d9a566';g.fillRect(X+5,Y+5,18,2);}
function barrel(g,tx,ty){const X=tx*TS+4,Y=ty*TS+2;g.fillStyle='#14101f';g.fillRect(X-1,Y-1,26,30);g.fillStyle='#4aa0d8';g.fillRect(X,Y,24,28);g.fillStyle='#2f78a8';g.fillRect(X,Y+6,24,3);g.fillRect(X,Y+19,24,3);g.fillStyle='#7cc4ee';g.fillRect(X+3,Y+2,4,24);}
function tree(g,tx,ty){const X=tx*TS,Y=ty*TS;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(X+8,Y+46,52,12);g.fillStyle='#5a3a22';g.fillRect(X+26,Y+38,12,22);g.fillStyle='#3c2514';g.fillRect(X+26,Y+38,3,22);
  const disc=(cx,cy,r,col)=>{g.fillStyle=col;for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)if(xx*xx+yy*yy<=r*r)g.fillRect(cx+xx,cy+yy,1,1);};
  disc(X+32,Y+26,26,'#14101f');disc(X+32,Y+26,24,'#a8301f');disc(X+24,Y+20,14,'#c93f2a');disc(X+40,Y+30,12,'#8c2a1c');disc(X+22,Y+18,5,'#e0583f');}
function locker(g,tx,ty){const X=tx*TS,Y=ty*TS;g.fillStyle='#14101f';g.fillRect(X+2,Y,28,32);g.fillStyle='#3a62a8';g.fillRect(X+4,Y+2,24,28);g.fillStyle='#2c4a86';g.fillRect(X+15,Y+2,2,28);g.fillStyle='#8fb0e8';g.fillRect(X+7,Y+6,6,2);g.fillRect(X+19,Y+6,6,2);g.fillStyle='#f2d56b';g.fillRect(X+12,Y+16,2,4);g.fillRect(X+18,Y+16,2,4);text(g,'?',X+16,Y+22,'#fff',8,'center');}
function board(g,tx,ty){const X=tx*TS,Y=ty*TS;g.fillStyle='#14101f';g.fillRect(X+2,Y+2,28,22);g.fillStyle='#6b4a2a';g.fillRect(X+4,Y+4,24,18);g.fillStyle='#e8dcc0';g.fillRect(X+7,Y+7,8,6);g.fillRect(X+17,Y+8,8,5);g.fillRect(X+9,Y+15,12,4);g.fillStyle='#ff2a6d';g.fillRect(X+10,Y+6,2,2);g.fillStyle='#14101f';g.fillRect(X+14,Y+24,4,8);}
export function buildOutside(){
  const solid=new Uint8Array(OW*OH),idx=(x,y)=>y*OW+x,doors=[];
  for(let y=0;y<OH;y++)for(let x=0;x<OW;x++)if(x===0||y===0||x===OW-1||y===OH-1)solid[idx(x,y)]=1;
  BUILDINGS.forEach(b=>{for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)solid[idx(x,y)]=1;
    solid[idx(b.door.x,b.door.y)]=0;solid[idx(b.door.x+1,b.door.y)]=0;
    doors.push({x:b.door.x*TS,y:b.door.y*TS,w:2*TS,h:TS,to:b.id,name:b.name});});
  TREES.forEach(([x,y])=>{for(let j=0;j<2;j++)for(let i=0;i<2;i++)solid[idx(x+i,y+j)]=1;});
  [...CRATES,...BARRELS,[4,10],[9,10]].forEach(([x,y])=>solid[idx(x,y)]=1);
  const layer=canvas(OW*TS,OH*TS),g=layer.getContext('2d');g.imageSmoothingEnabled=false;
  ground(g);fence(g);BUILDINGS.forEach(b=>building(g,b));
  TREES.forEach(([x,y])=>tree(g,x,y));CRATES.forEach(([x,y])=>crate(g,x,y));BARRELS.forEach(([x,y])=>barrel(g,x,y));locker(g,4,10);board(g,9,10);
  const things=[
    {x:4*TS+16,y:11*TS+4,r:44,label:'E: change character',run:c=>c.ui.openSelect()},
    {x:9*TS+16,y:11*TS+4,r:44,label:'E: how to play',run:c=>c.ui.show('how')}
  ];
  return{id:'outside',name:'The yard',w:OW,h:OH,solid,layer,doors,things,spawn:{x:7*TS,y:11*TS+16}};
}
