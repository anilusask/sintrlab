export function makeCamera(){return{x:0,y:0,init:false};}
export function follow(cam,view,px,py,sw,sh,dt,smooth){
  const tx=px-view.w/2,ty=py-view.h/2-10,mx=sw-view.w,my=sh-view.h;
  const cx=mx<=0?mx/2:Math.max(0,Math.min(mx,tx)),cy=my<=0?my/2:Math.max(0,Math.min(my,ty));
  if(!cam.init||!smooth){cam.x=cx;cam.y=cy;cam.init=true;}
  else{const a=1-Math.pow(0.001,dt);cam.x+=(cx-cam.x)*a;cam.y+=(cy-cam.y)*a;}
}
