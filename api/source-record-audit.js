const fs=require('fs');
const path=require('path');
const zlib=require('zlib');
const vm=require('vm');

const TARGETS=['EXC','SRE','WEC','PPL','XEL','ES','FE','DTE','CMS','DUK','PEG','AQB','AGRI','AVX','ROP','LAND','SU','SMG','AUR','CHRW','GTLS','BKR'];
function loadBase(){
 const ctx={window:{__B:''}}; vm.createContext(ctx);
 for(let i=0;i<=12;i++) vm.runInContext(fs.readFileSync(path.join(process.cwd(),`n${String(i).padStart(2,'0')}.js`),'utf8'),ctx);
 return JSON.parse(zlib.gunzipSync(Buffer.from(ctx.window.__B,'base64')).toString('utf8'));
}
function loadExtras(){
 const src=fs.readFileSync(path.join(process.cwd(),'extras.js'),'utf8');
 const a=src.indexOf('window.EXTRA_COMPANIES='); const b=src.indexOf('];',a); if(a<0||b<0)return [];
 const expr=src.slice(a+'window.EXTRA_COMPANIES='.length,b+1);
 return vm.runInNewContext(expr,{});
}
module.exports=async function handler(req,res){
 try{
  const all=[...loadBase(),...loadExtras()];
  const out={};
  for(const t of TARGETS){
   const x=all.find(r=>String(r.t||'').toUpperCase()===t);
   out[t]=x?{t:x.t,n:x.n,k:x.k,l:x.l,a:x.a,b:x.b,c:x.c,r:x.r,g:x.g,h:x.h,ac:x.ac}:null;
  }
  res.setHeader('Cache-Control','no-store'); res.status(200).json(out);
 }catch(e){res.status(500).json({error:String(e&&e.message||e)})}
}
