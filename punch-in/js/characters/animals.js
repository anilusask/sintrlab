import {shade,canvas} from '../engine/draw.js';
const S=40,DENIM='#3b62a8',DENIMD='#2c4a86',SHIRT='#e4573d',SHIRTD='#b9402b',BOOT='#2a2a33',OUTL='#1a1030',ANTLER='#d6bd86';
export const HATS=[['Yellow','#ffd319'],['White','#f4f4f4'],['Orange','#ff8a1f'],['Red','#e0382f'],['Blue','#2f7de0'],['Green','#35b24a']];
export const ANIMALS=[
 {id:'beaver',name:'Rivet',label:'Beaver',fur:'#8a5a2b',belly:'#d8b27c',nose:'#2a1a10',ear:'round',snout:1,tail:'flat',tailCol:'#4d3118',extra:'teeth'},
 {id:'moose',name:'Flange',label:'Moose',fur:'#5b3a22',belly:'#8c6a4a',nose:'#1f130b',ear:'round',snout:3,tail:'tiny',extra:'antlers'},
 {id:'goose',name:'Cotter',label:'Canada goose',fur:'#1f1f26',belly:'#f4f1e8',nose:'#4a4a55',ear:'none',snout:1,tail:'tiny',hand:'#8b7d6b',tailCol:'#2c2c33',extra:'goose'},
 {id:'wolf',name:'Sprocket',label:'Wolf',fur:'#7b8693',belly:'#d6dbe1',nose:'#18181c',ear:'point',snout:2,tail:'bushy',tip:'#e4e8ec'},
 {id:'polar',name:'Gasket',label:'Polar bear',fur:'#f1f5f9',belly:'#cfdbe6',nose:'#18181c',ear:'round',snout:2,tail:'tiny'},
 {id:'blackbear',name:'Bushing',label:'Black bear',fur:'#2c2c33',belly:'#b48a58',nose:'#0c0c10',ear:'round',snout:2,tail:'tiny'},
 {id:'husky',name:'Dowel',label:'Husky',fur:'#6e7885',belly:'#f1f4f7',nose:'#18181c',ear:'point',snout:2,tail:'curl',tip:'#f1f4f7',mask:true,eyeCol:'#52b4ee'},
 {id:'pelican',name:'Ladle',label:'American white pelican',fur:'#f6f6f0',belly:'#ffffff',nose:'#e9a01b',ear:'none',snout:0,tail:'tiny',tailCol:'#e4e4dc',extra:'pelican',hand:'#f6f6f0'}
];
export const byId=id=>ANIMALS.find(a=>a.id===id)||ANIMALS[0];

function paint(a,dir,pose,hat){
  const c=canvas(S,S),g=c.getContext('2d');
  const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const C=(x,y,w,h)=>g.clearRect(x,y,w,h);
  const D=(cx,cy,r,col)=>{g.fillStyle=col;for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)if(xx*xx+yy*yy<=r*r+r*.6)g.fillRect(cx+xx,cy+yy,1,1);};
  const b=pose?1:0,sw=pose===1?1:pose===2?-1:0;
  const fur=a.fur,fur2=shade(a.fur,-.25),belly=a.belly,hand=a.hand||a.fur,ec=a.eyeCol||'#101018';
  const hatD=shade(hat,-.28),hatL=shade(hat,.4),tc=a.tailCol||a.fur,tip=a.tip||a.belly;
  const hy=6-b;

  function tail(view){
    if(a.tail==='tiny'){ if(view==='up')R(18,28,4,3,tc); if(view==='side')R(11,26,3,3,tc); return; }
    if(view==='down'){
      if(a.tail==='flat')R(14,33,12,3,tc);
      else if(a.tail==='bushy'){R(27,25,6,8,tc);R(28,31,5,3,tip);}
      else if(a.tail==='curl'){D(31,27,3,tc);D(31,25,1,tip);}
    }else if(view==='up'){
      if(a.tail==='flat'){R(14,29,12,6,tc);R(14,31,12,1,shade(tc,-.3));R(14,33,12,1,shade(tc,-.3));R(19,29,1,6,shade(tc,-.3));}
      else if(a.tail==='bushy'){R(15,25,10,10,tc);R(15,31,10,4,tip);}
      else if(a.tail==='curl'){D(20,29,5,tc);D(20,25,2,tip);}
    }else{
      if(a.tail==='flat'){R(3,26,11,5,tc);R(3,28,11,1,shade(tc,-.3));R(8,26,1,5,shade(tc,-.3));}
      else if(a.tail==='bushy'){R(3,20,11,10,tc);R(3,20,5,4,tip);}
      else if(a.tail==='curl'){D(8,24,5,tc);D(7,20,2,tip);}
    }
  }
  function ears(view){
    if(a.extra==='antlers'){
      const L=view==='side'?[12]:[6,30];
      L.forEach(x=>{R(x,hy-6,3,8,ANTLER);R(x-3,hy-7,9,2,ANTLER);R(x-3,hy-10,2,4,ANTLER);R(x+1,hy-10,2,4,ANTLER);R(x+5,hy-10,2,4,ANTLER);R(x,hy-6,1,8,shade(ANTLER,-.2));});
      if(view!=='side'){D(10,hy+1,2,fur);D(29,hy+1,2,fur);}
      return;
    }
    if(a.ear==='round'){
      if(view==='side'){D(17,hy+1,3,fur);D(17,hy+1,1,fur2);}
      else{D(11,hy+1,3,fur);D(28,hy+1,3,fur);D(11,hy+1,1,fur2);D(28,hy+1,1,fur2);}
    }else if(a.ear==='point'){
      const tri=(x0,dx)=>{R(x0,hy-1,5,3,fur);R(x0+dx,hy-3,3,2,fur);R(x0+dx+1,hy-5,1,2,fur);};
      if(view==='side'){tri(14,1);R(15,hy,2,2,'#e8a0a8');}
      else{tri(9,1);tri(26,1);if(view==='down'){R(10,hy,2,2,'#e8a0a8');R(28,hy,2,2,'#e8a0a8');}}
    }
  }
  function hatFront(){R(13,2-b,14,2,hat);R(12,4-b,16,4,hat);R(19,2-b,2,6,hatL);R(12,4-b,16,1,hatL);R(10,8-b,20,2,hatD);}
  function hatSide(){R(13,3-b,14,5,hat);R(14,3-b,9,1,hatL);R(13,7-b,14,1,hatD);R(13,8-b,21,2,hatD);}
  function front(back){
    if(!back)tail('down');
    const l1=29-(sw===1?2:0),l2=29-(sw===-1?2:0);
    R(14,l1,5,4,DENIMD);R(13,l1+4,6,3,BOOT);R(21,l2,5,4,DENIMD);R(21,l2+4,6,3,BOOT);
    R(12,19-b,16,11,DENIM);R(12,19-b,16,4,SHIRT);R(12,22-b,16,1,SHIRTD);R(14,19-b,3,7,DENIM);R(23,19-b,3,7,DENIM);
    if(!back){R(17,24-b,6,4,DENIMD);R(18,25-b,4,1,DENIM);R(15,25-b,1,1,'#f2d56b');R(24,25-b,1,1,'#f2d56b');}
    else R(12,25-b,16,2,DENIMD);
    const aL=sw===1?-1:sw===-1?1:0,aR=-aL;
    R(8,20-b+aL,4,8,SHIRT);R(8,27-b+aL,4,3,hand);R(28,20-b+aR,4,8,SHIRT);R(28,27-b+aR,4,3,hand);
    if(back)tail('up');
    // head
    if(a.extra==='goose'){
      R(14,hy,12,13,fur);C(14,hy,1,1);C(25,hy,1,1);R(16,hy+12,8,3,fur);
      if(!back){R(13,hy+6,3,6,belly);R(24,hy+6,3,6,belly);R(15,hy+3,3,3,'#fff');R(22,hy+3,3,3,'#fff');R(16,hy+4,1,2,'#000');R(23,hy+4,1,2,'#000');R(17,hy+8,6,3,a.nose);R(18,hy+11,4,2,shade(a.nose,-.3));R(18,hy+8,4,1,shade(a.nose,.3));}
    }else if(a.extra==='pelican'){
      R(12,hy,16,12,fur);C(12,hy,1,1);C(27,hy,1,1);C(12,hy+11,1,1);C(27,hy+11,1,1);R(12,hy+11,16,1,shade(fur,-.1));
      if(!back){R(14,hy+4,3,3,'#fff');R(23,hy+4,3,3,'#fff');R(15,hy+5,2,2,'#111');R(23,hy+5,2,2,'#111');R(15,hy+7,10,4,a.nose);R(15,hy+7,10,1,shade(a.nose,.3));R(16,hy+11,8,8,'#f4b53a');R(16,hy+11,8,1,'#c98414');R(17,hy+17,6,1,'#c98414');}
    }else{
      const tall=a.extra==='antlers';
      R(11,hy,18,13,fur);C(11,hy,1,1);C(28,hy,1,1);C(11,hy+12,1,1);C(28,hy+12,1,1);R(11,hy+11,18,2,fur2);
      if(tall){R(13,hy+12,14,4,fur);R(14,hy+12,12,4,fur);}
      if(!back){
        if(a.mask){R(14,hy+3,12,10,belly);C(14,hy+3,1,1);C(25,hy+3,1,1);R(19,hy,2,5,belly);}
        else{R(15,hy+7,10,6,belly);C(15,hy+7,1,1);C(24,hy+7,1,1);if(tall)R(14,hy+10,12,6,belly);}
        R(18,hy+(tall?12:6),4,3,a.nose);
        R(14,hy+4,2,3,ec);R(14,hy+4,1,1,'#fff');R(24,hy+4,2,3,ec);R(24,hy+4,1,1,'#fff');
        if(a.extra==='teeth'){R(19,hy+10,2,3,'#fff');R(20,hy+10,1,3,'#d0d0d0');}
        else R(19,hy+(tall?15:11),2,1,'#101018');
      }
    }
    ears(back?'up':'down');
    hatFront();
  }
  function side(){
    tail('side');
    const fa=sw===-1?2:sw===1?-2:0,fb=-fa,la=29-(sw===-1?2:0),lb=29-(sw===1?2:0);
    R(15+fa,la,5,4,DENIMD);R(14+fa,la+4,7,3,BOOT);R(20+fb,lb,5,4,DENIM);R(19+fb,lb+4,7,3,BOOT);
    R(14,19-b,13,11,DENIM);R(14,19-b,13,4,SHIRT);R(14,22-b,13,1,SHIRTD);R(22,19-b,3,7,DENIMD);
    const ao=sw===1?-2:sw===-1?2:0;
    R(17,20-b+ao,4,8,SHIRT);R(17,27-b+ao,4,3,hand);
    if(a.extra==='goose'){
      R(14,hy,11,12,fur);R(14,hy+11,8,3,fur);R(19,hy+5,4,4,belly);R(21,hy+3,2,3,'#fff');R(22,hy+4,1,2,'#000');R(25,hy+6,8,3,a.nose);R(25,hy+9,6,2,shade(a.nose,-.3));R(25,hy+6,8,1,shade(a.nose,.3));
    }else if(a.extra==='pelican'){
      R(13,hy,13,11,fur);C(13,hy,1,1);R(22,hy+3,3,3,'#fff');R(23,hy+4,2,2,'#111');R(26,hy+6,13,3,a.nose);R(26,hy+6,13,1,shade(a.nose,.3));R(25,hy+9,12,5,'#f4b53a');R(25,hy+9,12,1,'#c98414');
    }else{
      const tall=a.extra==='antlers',L=[0,3,5,7][a.snout];
      R(13,hy,15,13,fur);C(13,hy,1,1);C(27,hy,1,1);C(13,hy+12,1,1);R(13,hy+11,15,2,fur2);
      if(a.mask){R(20,hy+3,8,9,belly);}
      R(28,hy+(tall?4:5),L,tall?8:6,belly);R(28+L-2,hy+(tall?4:5),2,tall?4:3,a.nose);R(28,hy+(tall?11:10),Math.max(1,L-1),1,fur2);
      R(23,hy+3,2,3,ec);R(23,hy+3,1,1,'#fff');
      if(a.extra==='teeth')R(28,hy+10,2,3,'#fff');
    }
    ears('side');
    hatSide();
  }
  if(dir==='right')side();else front(dir==='up');
  return c;
}
function outline(src){
  const t=canvas(S,S),tg=t.getContext('2d');tg.drawImage(src,0,0);tg.globalCompositeOperation='source-in';tg.fillStyle=OUTL;tg.fillRect(0,0,S,S);
  const o=canvas(S,S),g=o.getContext('2d');
  [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]].forEach(d=>g.drawImage(t,d[0],d[1]));
  g.drawImage(src,0,0);return o;
}
const cache=new Map();
export function getSprite(id,dir,pose,hat){
  const key=id+dir+pose+hat;let s=cache.get(key);if(s)return s;
  if(dir==='left'){const r=getSprite(id,'right',pose,hat);s=canvas(S,S);const g=s.getContext('2d');g.translate(S,0);g.scale(-1,1);g.drawImage(r,0,0);}
  else s=outline(paint(byId(id),dir,pose,hat));
  cache.set(key,s);return s;
}
export const SPRITE=S;
