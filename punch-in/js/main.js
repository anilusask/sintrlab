import {createView} from './engine/view.js';
import {loadSettings,saveSettings,clearGame} from './engine/store.js';
import {setSound} from './engine/audio.js';
import {ui} from './engine/ui.js';
import {createGame} from './game.js';
import {byId} from './characters/animals.js';
import {drawMinimap} from './world/minimap.js';
const $=id=>document.getElementById(id);
(async function boot(){
  const settings=loadSettings();
  try{await Promise.race([document.fonts.load('10px "Press Start 2P"'),new Promise(r=>setTimeout(r,1500))]);}catch(e){}
  const view=createView($('screen'));view.size=settings.size;view.resize();setSound(settings.sound);
  const game=createGame(view,settings);
  ui.init(settings,{
    save:()=>saveSettings(settings),
    setSize:s=>{view.size=s;view.resize();},
    drawMap:cv=>drawMinimap(cv,{scene:game.sceneId,px:game.px,py:game.py}),
    whereText:()=>game.whereText(),
    onStart:()=>{game.start(false);if(!settings.seenHow){settings.seenHow=true;saveSettings(settings);ui.show('how');}}
  });
  game.start(settings.picked);
  if(settings.picked)ui.toast('Welcome back, '+byId(settings.character).name+'.');else ui.openSelect();
  if(innerHeight>innerWidth&&innerWidth<600)setTimeout(()=>ui.toast('Turn your phone sideways for a bigger view.',4200),1500);
  let last=performance.now();
  (function loop(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;game.update(dt);game.draw();requestAnimationFrame(loop);})(last);
  if(/[?&]debug=1/.test(location.search))window.__punch={game,ui,settings,reset:()=>{clearGame();localStorage.clear();}};
})();
