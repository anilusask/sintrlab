const B=o=>{o.door={x:o.x+Math.floor(o.w/2)-1,y:o.y+o.h-1};return o;};
export const BUILDINGS=[
 B({id:'dock',name:'Dock',sign:'DOCK',abbr:'DOCK',color:'#c9ced6',x:3,y:3,w:9,h:7,
  plan:'Receiving and shipping in one place. You will collect your tray, lab notebook and stock here, and finish by packing and shipping the batch.'}),
 B({id:'design',name:'Design office',sign:'DESIGN\nOFFICE',abbr:'DESIGN',color:'#b79cff',x:16,y:3,w:9,h:7,
  plan:'Choose the ornament pattern or load your own STL file, check the mesh, and read the work order.'}),
 B({id:'print',name:'Print shop',sign:'PRINT SHOP',abbr:'PRINT',color:'#05d9e8',x:29,y:3,w:9,h:7,
  plan:'Two printers: a wax-type filament printer (FFF) and a wax-type resin printer. Hint: the resin printer gives better resolution. Everything you print with comes from the dock.'}),
 B({id:'foundry',name:'Foundry',sign:'FOUNDRY',abbr:'FOUNDRY',color:'#ff9f1c',x:42,y:3,w:11,h:7,
  plan:'Two casting rooms, sand and investment, and a melt deck. Carry the ingot to the furnace, ready the mold, pour, and take the casting to the test lab.'}),
 B({id:'forming',name:'Forming shop',sign:'FORMING\nSHOP',abbr:'FORMING',color:'#4da3ff',x:3,y:15,w:9,h:8,
  plan:'Bending, extrusion, rolling and forging.'}),
 B({id:'testlab',name:'Test lab',sign:'TEST LAB',abbr:'TEST LAB',color:'#ffd319',x:16,y:15,w:22,h:8,
  plan:'Tensile machine, hardness tester, density balance, roughness and dimension checks, and a microscope. Every shop has a door here.'}),
 B({id:'heat',name:'Heat treat shop',sign:'HEAT TREAT\nSHOP',abbr:'HEAT TREAT',color:'#ff2a6d',x:42,y:15,w:11,h:8,
  plan:'Furnaces, a quench tank and an aging oven. Test coupons ride in the same basket as the parts.'}),
 B({id:'instructor',name:'Instructor office',sign:'INSTRUCTOR',abbr:'INSTR.',color:'#9aa4b2',x:3,y:28,w:9,h:7,
  plan:'A locked room for demo tools.'}),
 B({id:'powder',name:'Powder shop',sign:'POWDER\nMETALLURGY',abbr:'POWDER',color:'#5ee6c8',x:16,y:28,w:9,h:7,
  plan:'Press and sinter metal powders, and sinter ceramics, including spark plasma sintering.'}),
 B({id:'weld',name:'Weld and fit',sign:'WELD AND FIT',abbr:'WELD',color:'#ffb3d1',x:29,y:28,w:9,h:7,
  plan:'Bolted joints, welds and the tolerance stack-up.'}),
 B({id:'machining',name:'Machine shop',sign:'MACHINE\nSHOP',abbr:'MACHINE',color:'#7dff7a',x:42,y:28,w:11,h:7,
  plan:'Turn the part to size and finish.'})
];
export const byBuilding=id=>BUILDINGS.find(b=>b.id===id);
