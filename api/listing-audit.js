const fs=require('fs');
const path=require('path');

const ALIASES={FI:'FISV',CLFS:'CLF',CTRA:'DVN',CYBR:'PANW',GTLS:'BKR',ANSS:'SNPS',BK:'BNY',MMC:'MRSH',SATS:'ECHO'};
const EXCLUDED=new Set(['GWH']);
const EXTRA=['DTE','FE','CMS'];

function canon(s){return String(s||'').trim().toUpperCase().replace(/[-/]/g,'.')}
function parseDir(text,kind){
  const lines=text.split(/\r?\n/).filter(Boolean);
  const out=[];
  for(const line of lines.slice(1)){
    if(line.startsWith('File Creation Time')) continue;
    const c=line.split('|');
    if(c.length<2) continue;
    const sym=kind==='nasdaq'?c[0]:(c[0]||c[3]||c[7]);
    if(sym && sym!=='Symbol' && sym!=='ACT Symbol') out.push(canon(sym));
  }
  return out;
}
function archiveTickers(){
  const src=fs.readFileSync(path.join(process.cwd(),'tags.js'),'utf8');
  const keys=[...src.matchAll(/\"([^\"]+)\"\s*:\s*\[/g)].map(m=>m[1]);
  const set=new Set(keys.map(canon));
  EXTRA.forEach(x=>set.add(x));
  for(const [old,cur] of Object.entries(ALIASES)){
    if(set.has(old)){set.delete(old);set.add(cur)}
  }
  EXCLUDED.forEach(x=>set.delete(x));
  return [...set].sort();
}
module.exports=async function handler(req,res){
  try{
    const [n,o]=await Promise.all([
      fetch('https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt',{headers:{'user-agent':'Mozilla/5.0'}}),
      fetch('https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt',{headers:{'user-agent':'Mozilla/5.0'}})
    ]);
    if(!n.ok||!o.ok) throw new Error(`symbol directory fetch failed: ${n.status}/${o.status}`);
    const [nt,ot]=await Promise.all([n.text(),o.text()]);
    const listed=new Set([...parseDir(nt,'nasdaq'),...parseDir(ot,'other')]);
    const archive=archiveTickers();
    const unmatched=archive.filter(t=>!listed.has(canon(t)));
    const matched=archive.filter(t=>listed.has(canon(t)));
    res.setHeader('Cache-Control','no-store');
    res.status(200).json({asOf:new Date().toISOString(),archiveCount:archive.length,matchedCount:matched.length,unmatchedCount:unmatched.length,unmatched,source:{nasdaq:'nasdaqlisted.txt',other:'otherlisted.txt'}});
  }catch(e){res.status(500).json({error:String(e&&e.message||e)})}
}
