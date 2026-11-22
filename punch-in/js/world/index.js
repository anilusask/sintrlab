import {buildOutside} from './outside.js';
import {buildInterior} from './interior.js';
import {byBuilding} from './buildings.js';
const cache={};
export function getScene(id){
  if(cache[id])return cache[id];
  cache[id]=id==='outside'?buildOutside():buildInterior(byBuilding(id));   /* later: a shop file can replace buildInterior for its id */
  return cache[id];
}
