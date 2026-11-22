import {BUILDINGS} from './buildings.js';
import {isRoad,OW,OH} from './outside.js';
import {TS} from './consts.js';
export function drawMinimap(cv,info){
  const S=12,g=cv.getContext('2d');cv.width=OW*S;cv.height=OH*S;g.imageSmoothingEnabled=false;
  for(let y=0;y<OH;y++)for(let x=0;x<OW;x++){g.fillStyle=(x===0||y===0||x===OW-1||y===OH-1)?'#241d33':isRoad(x,y)?'#363944':'#aeb3bd';g.fillRect(x*S,y*S,S,S);}
  g.font='bold 15px "Helvetica Neue",Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';
  BUILDINGS.forEach(b=>{g.fillStyle='#14101f';g.fillRect(b.x*S-2,b.y*S-2,b.w*S+4,b.h*S+4);g.fillStyle=b.color;g.fillRect(b.x*S,b.y*S,b.w*S,b.h*S);g.fillStyle='#14101f';g.fillText(b.abbr,(b.x+b.w/2)*S,(b.y+b.h/2)*S);
    g.fillStyle='#fbe9b0';g.fillRect(b.door.x*S,(b.door.y+1)*S-3,2*S,6);});
  const blink=Math.floor(performance.now()/350)%2===0;
  if(info.scene==='outside'){g.fillStyle='#14101f';g.fillRect(info.px/TS*S-9,info.py/TS*S-9,18,18);g.fillStyle=blink?'#ff2a6d':'#ffffff';g.fillRect(info.px/TS*S-7,info.py/TS*S-7,14,14);}
  else{const b=BUILDINGS.find(q=>q.id===info.scene);if(b){const cx=(b.door.x+1)*S,cy=(b.door.y+1)*S+6;g.fillStyle='#14101f';g.beginPath();g.moveTo(cx,cy);g.lineTo(cx-13,cy+26);g.lineTo(cx+13,cy+26);g.closePath();g.fill();g.fillStyle=blink?'#ff2a6d':'#fff';g.beginPath();g.moveTo(cx,cy+3);g.lineTo(cx-9,cy+22);g.lineTo(cx+9,cy+22);g.closePath();g.fill();}}
}
