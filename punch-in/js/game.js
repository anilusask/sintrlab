import {TS} from './world/consts.js';
import {getScene} from './world/index.js';
import {input} from './engine/input.js';
import {makeCamera,follow} from './engine/camera.js';
import {getSprite} from './characters/animals.js';
import {beep} from './engine/audio.js';
import {ui} from './engine/ui.js';
import {saveGame,loadGame} from './engine/store.js';
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
function free(sc,x,y){
  const h=6,pts=[[x-h,y],[x+h,y],[x-h,y-7],[x+h,y-7]];
  for(const[p,q]of pts){const tx=Math.floor(p/TS),ty=Math.floor(q/TS);if(tx<0||ty<0||tx>=sc.w||ty>=sc.h||sc.solid[ty*sc.w+tx])return false;}return true;
}
export function createGame(view,settings){
  const g={view,settings,sceneId:'outside',scene:null,px:0,py:0,dir:'down',moving:false,anim:0,t:0,cam:makeCamera(),trans:null,fade:0,saveT:0};
  function persist(){saveGame({scene:g.sceneId,px:Math.round(g.px),py:Math.round(g.py)});}
  function load(id,x,y){g.sceneId=id;g.scene=getScene(id);g.px=x==null?g.scene.spawn.x:x;g.py=y==null?g.scene.spawn.y:y;g.cam.init=false;g.dir='down';ui.where(g.scene.name.toUpperCase());persist();}
  g.start=(restore)=>{
    const s=restore?loadGame():null;
    if(s&&s.scene){try{const sc=getScene(s.scene);if(sc&&free(sc,s.px,s.py)){load(s.scene,s.px,s.py);return;}}catch(e){}}
    load('outside');
  };
  g.whereText=()=>g.sceneId==='outside'?'You are in the yard.':'You are inside: '+g.scene.name+'.';
  function nearest(){let best=null,bd=1e9;for(const t of g.scene.things||[]){const d=Math.hypot(g.px-t.x,g.py-t.y);if(d<t.r&&d<bd){bd=d;best=t;}}return best;}
  function go(dr){g.trans={t:0,phase:'out',to:dr.to,arrive:dr.arrive};g.moving=false;beep('door');}
  function step(dt){
    const T=g.trans,dur=REDUCE?.01:.2;T.t+=dt/dur;
    if(T.phase==='out'){g.fade=Math.min(1,T.t);if(T.t>=1){const a=T.arrive;load(T.to,a?a.x:null,a?a.y:null);T.phase='in';T.t=0;}}
    else{g.fade=Math.max(0,1-T.t);if(T.t>=1){g.fade=0;g.trans=null;}}
  }
  function move(dt){
    const d=input.dir();g.moving=!!(d.x||d.y);
    if(g.moving){
      const len=Math.hypot(d.x,d.y),sp=(input.running()?150:105)*dt/len,nx=g.px+d.x*sp;
      if(free(g.scene,nx,g.py))g.px=nx;const ny=g.py+d.y*sp;if(free(g.scene,g.px,ny))g.py=ny;
      if(Math.abs(d.x)>=Math.abs(d.y)&&d.x)g.dir=d.x>0?'right':'left';else if(d.y)g.dir=d.y>0?'down':'up';
      g.anim+=dt;
    }else g.anim=0;
    for(const dr of g.scene.doors){if(g.px>=dr.x&&g.px<dr.x+dr.w&&g.py-2>=dr.y&&g.py-2<dr.y+dr.h){go(dr);break;}}
  }
  g.update=dt=>{
    g.t+=dt;
    let ev;while((ev=input.take())){
      if(ev==='menu')ui.escape();
      else if(ev==='map'){if(!ui.blocking()||ui.top()==='mapov')ui.toggleMap();}
      else if(ev==='full')ui.toggleFull();
      else if(ev==='act'&&!ui.blocking()&&!g.trans){const n=nearest();if(n){beep('ok');n.run({ui,game:g});}}
    }
    if(ui.blocking())g.moving=false;else if(g.trans)step(dt);else move(dt);
    follow(g.cam,view,g.px,g.py,g.scene.w*TS,g.scene.h*TS,dt,!REDUCE);
    const n=(ui.blocking()||g.trans)?null:nearest();ui.prompt(n?n.label:null);
    g.saveT+=dt;if(g.saveT>2){g.saveT=0;persist();}
  };
  g.draw=()=>{
    const v=view,ctx=v.ctx;v.begin();
    ctx.fillStyle='#0d0221';ctx.fillRect(0,0,v.w,v.h);
    const cx=Math.round(g.cam.x),cy=Math.round(g.cam.y);
    ctx.drawImage(g.scene.layer,-cx,-cy);
    const n=(ui.blocking()||g.trans)?null:nearest();
    if(n){const bob=Math.floor(g.t*4)%2,ax=Math.round(n.x-cx),ay=Math.round(n.y-cy)-42+bob;ctx.fillStyle='#14101f';ctx.fillRect(ax-6,ay-1,12,3);ctx.fillRect(ax-4,ay+2,8,3);ctx.fillRect(ax-2,ay+5,4,3);ctx.fillStyle='#ffd319';ctx.fillRect(ax-5,ay,10,2);ctx.fillRect(ax-3,ay+2,6,2);ctx.fillRect(ax-1,ay+4,2,2);}
    const frame=[0,1,0,2][Math.floor(g.anim/0.13)%4],pose=g.moving?frame:0;
    const sx=Math.round(g.px)-cx,sy=Math.round(g.py)-cy;
    ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(sx-6,sy-4,12,5);ctx.fillRect(sx-8,sy-3,16,3);
    ctx.drawImage(getSprite(settings.character,g.dir,pose,settings.hat),sx-20,sy-36);
    if(g.fade>0){ctx.fillStyle='rgba(13,2,33,'+g.fade+')';ctx.fillRect(0,0,v.w,v.h);}
  };
  return g;
}
