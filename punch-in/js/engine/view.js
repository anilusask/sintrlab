export function createView(canvas){
  const ctx=canvas.getContext('2d');
  const v={canvas,ctx,w:640,h:360,k:2,scale:2,size:'M',dpr:1};
  v.resize=()=>{
    const dpr=Math.min(window.devicePixelRatio||1,3),cw=window.innerWidth,ch=window.innerHeight;
    let s=Math.max(1,Math.min(Math.round(ch/360),6));
    if(v.size==='S')s-=1;else if(v.size==='L')s+=1;
    s=Math.max(1,Math.min(s,8));
    while(s>1&&cw/s<300)s--;
    const k=Math.max(1,Math.round(s*dpr));
    canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);
    v.dpr=dpr;v.scale=s;v.k=k;v.w=Math.ceil(canvas.width/k);v.h=Math.ceil(canvas.height/k);
  };
  v.begin=()=>{ctx.setTransform(v.k,0,0,v.k,0,0);ctx.imageSmoothingEnabled=false;};
  addEventListener('resize',v.resize);v.resize();return v;
}
