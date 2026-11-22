import {input} from './input.js';
import {beep,setSound} from './audio.js';
import {ANIMALS,HATS,getSprite} from '../characters/animals.js';
const $=id=>document.getElementById(id);
const open=[];let S=null,H=null,dlgAfter=null,toastT=0,mapTimer=0;
function refresh(){input.setEnabled(open.length===0);}
function focusFirst(el){const f=el.querySelector('[data-first]')||el.querySelector('button');if(f)f.focus();}
export const ui={
  init(settings,hooks){S=settings;H=hooks;wire();},
  blocking(){return open.length>0;},
  top(){return open[open.length-1];},
  isOpen(id){return open.includes(id);},
  show(id){const el=$(id);el.hidden=false;if(!open.includes(id))open.push(id);refresh();focusFirst(el);},
  hide(id){const el=$(id);el.hidden=true;const i=open.indexOf(id);if(i>=0)open.splice(i,1);refresh();if(id==='mapov')clearInterval(mapTimer);if(!open.length)$('screen').focus();},
  escape(){const t=ui.top();if(!t){ui.toggleMenu();return;}if(t==='select'&&!S.picked)return;if(t==='dialog'){ui.closeDialog();return;}ui.hide(t);},
  where(t){$('where').textContent=t;},
  prompt(t){const p=$('prompt');if(!t){if(!p.hidden)p.hidden=true;return;}if(p.hidden)p.hidden=false;if(p.textContent!==t)p.textContent=t;},
  toast(t,ms=2800){const el=$('toast');el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true;},ms);},
  dialog(title,text,after){$('dlgT').textContent=title;$('dlgX').textContent=text;dlgAfter=after||null;ui.show('dialog');},
  closeDialog(){ui.hide('dialog');const a=dlgAfter;dlgAfter=null;if(a)a();},
  openSelect(){paintCards();ui.show('select');},
  toggleMenu(){if(ui.isOpen('menu'))ui.hide('menu');else{syncMenu();ui.show('menu');}},
  toggleMap(){if(ui.isOpen('mapov')){ui.hide('mapov');return;}H.drawMap($('mapc'));$('mapwhere').textContent=H.whereText();ui.show('mapov');mapTimer=setInterval(()=>H.drawMap($('mapc')),350);},
  toggleFull(){try{if(document.fullscreenElement)document.exitFullscreen();else if(document.fullscreenEnabled)document.documentElement.requestFullscreen();}catch(e){}}
};
function paintCards(){
  document.querySelectorAll('#cards .card').forEach(b=>{
    const cv=b.querySelector('canvas'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,80,80);
    g.drawImage(getSprite(b.dataset.id,'down',0,S.hat),0,0,80,80);
    const on=b.dataset.id===S.character;b.setAttribute('aria-checked',on);b.classList.toggle('on',on);b.tabIndex=on?0:-1;
  });
  document.querySelectorAll('#hats .hat').forEach(b=>{const on=b.dataset.c===S.hat;b.setAttribute('aria-checked',on);b.classList.toggle('on',on);b.tabIndex=on?0:-1;});
}
function syncMenu(){
  $('mSound').textContent='Sound: '+(S.sound?'on':'off');$('mSound').setAttribute('aria-pressed',S.sound);
  $('mHelp').textContent='Helpers: '+(S.helpers?'on':'off');$('mHelp').setAttribute('aria-pressed',S.helpers);
  document.querySelectorAll('#sizes button').forEach(b=>{const on=b.dataset.size===S.size;b.setAttribute('aria-pressed',on);b.classList.toggle('on',on);});
}
function wire(){
  const cards=$('cards'),hats=$('hats');
  ANIMALS.forEach(a=>{const b=document.createElement('button');b.type='button';b.className='card';b.setAttribute('role','radio');b.dataset.id=a.id;
    b.innerHTML='<canvas width="80" height="80"></canvas><b></b><span></span>';b.querySelector('b').textContent=a.name;b.querySelector('span').textContent=a.label;
    b.addEventListener('click',()=>{S.character=a.id;H.save();paintCards();beep('pick');});cards.appendChild(b);});
  HATS.forEach(([n,c])=>{const b=document.createElement('button');b.type='button';b.className='hat';b.setAttribute('role','radio');b.dataset.c=c;b.style.background=c;b.setAttribute('aria-label',n+' hard hat');b.title=n;
    b.addEventListener('click',()=>{S.hat=c;H.save();paintCards();beep('pick');});hats.appendChild(b);});
  cards.addEventListener('keydown',e=>{const k={ArrowRight:1,ArrowLeft:-1,ArrowDown:4,ArrowUp:-4}[e.key];if(!k)return;e.preventDefault();
    const i=ANIMALS.findIndex(a=>a.id===S.character),j=Math.max(0,Math.min(ANIMALS.length-1,i+k));S.character=ANIMALS[j].id;H.save();paintCards();cards.querySelector('.on').focus();});
  $('selGo').addEventListener('click',()=>{S.picked=true;H.save();ui.hide('select');beep('ok');H.onStart();});
  $('btnMenu').addEventListener('click',()=>{ui.toggleMenu();});
  $('btnMap').addEventListener('click',()=>{if(!ui.blocking()||ui.top()==='mapov')ui.toggleMap();});
  $('mClose').addEventListener('click',()=>ui.hide('menu'));
  $('mapClose').addEventListener('click',()=>ui.hide('mapov'));
  $('howOk').addEventListener('click',()=>ui.hide('how'));
  $('dlgOk').addEventListener('click',()=>ui.closeDialog());
  $('mSound').addEventListener('click',()=>{S.sound=!S.sound;setSound(S.sound);H.save();syncMenu();beep('blip');});
  $('mHelp').addEventListener('click',()=>{S.helpers=!S.helpers;H.save();syncMenu();});
  document.querySelectorAll('#sizes button').forEach(b=>b.addEventListener('click',()=>{S.size=b.dataset.size;H.save();H.setSize(S.size);syncMenu();}));
  $('mChar').addEventListener('click',()=>{ui.hide('menu');ui.openSelect();});
  $('mHow').addEventListener('click',()=>{ui.hide('menu');ui.show('how');});
  $('mFull').addEventListener('click',()=>ui.toggleFull());
  if(!document.fullscreenEnabled)$('mFull').hidden=true;
  document.querySelectorAll('#touch [data-k]').forEach(b=>{const k=b.dataset.k;
    b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId);}catch(x){}if(k==='act')input.press('act');else input.hold(k,true);});
    const up=e=>{e.preventDefault();if(k!=='act')input.hold(k,false);};
    b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
    b.addEventListener('contextmenu',e=>e.preventDefault());});
}
