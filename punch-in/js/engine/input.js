const held={up:false,down:false,left:false,right:false,run:false},queue=[];let enabled=true;
const KEYS={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
export const input={
  setEnabled(v){enabled=v;if(!v){for(const k in held)held[k]=false;}},
  dir(){return{x:(held.right?1:0)-(held.left?1:0),y:(held.down?1:0)-(held.up?1:0)};},
  running(){return held.run;},
  take(){return queue.shift()||null;},
  press(n){queue.push(n);},
  hold(n,on){if(n in held&&enabled)held[n]=on;}
};
addEventListener('keydown',e=>{
  const tag=(e.target&&e.target.tagName)||'';
  if(/INPUT|TEXTAREA|SELECT/.test(tag))return;
  const k=e.key;
  if(k==='Escape'){queue.push('menu');return;}
  if((tag==='BUTTON'||tag==='A'||tag==='SUMMARY')&&(k===' '||k==='Enter'))return;
  if(KEYS[k]&&enabled){held[KEYS[k]]=true;e.preventDefault();}
  else if(k==='Shift'){held.run=true;}
  else if((k==='e'||k==='E'||k===' '||k==='Enter')&&enabled){if(!e.repeat)queue.push('act');e.preventDefault();}
  else if(k==='m'||k==='M'){if(!e.repeat)queue.push('map');}
  else if(k==='f'||k==='F'){if(!e.repeat)queue.push('full');}
});
addEventListener('keyup',e=>{if(KEYS[e.key])held[KEYS[e.key]]=false;if(e.key==='Shift')held.run=false;});
addEventListener('blur',()=>{for(const k in held)held[k]=false;});
