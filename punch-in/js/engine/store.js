const SK='punchin.settings.v1',GK='punchin.save.v1';
export const defaults={sound:true,helpers:true,size:'M',character:'beaver',hat:'#ffd319',picked:false,seenHow:false};
export function loadSettings(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(SK)||'{}'));}catch(e){return {...defaults};}}
export function saveSettings(s){try{localStorage.setItem(SK,JSON.stringify(s));}catch(e){}}
export function loadGame(){try{return JSON.parse(localStorage.getItem(GK)||'null');}catch(e){return null;}}
export function saveGame(g){try{localStorage.setItem(GK,JSON.stringify(g));}catch(e){}}
export function clearGame(){try{localStorage.removeItem(GK);}catch(e){}}
