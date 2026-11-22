let ctx=null,on=true;
export function setSound(v){on=!!v;}
export function beep(kind){
  if(!on)return;
  try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  if(ctx.state==='suspended')ctx.resume();
  const seq={door:[[330,.06],[494,.09]],blip:[[760,.05]],ok:[[523,.06],[784,.1]],no:[[180,.12]],pick:[[660,.06],[880,.08]]}[kind]||[];
  let t=ctx.currentTime;
  seq.forEach(n=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';o.frequency.value=n[0];g.gain.setValueAtTime(.04,t);g.gain.exponentialRampToValueAtTime(.001,t+n[1]);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+n[1]);t+=n[1];});
}
