const fs=require('fs');
const path=require('path');
const zlib=require('zlib');
const vm=require('vm');

const ALIASES={FI:'FISV',CLFS:'CLF',CTRA:'DVN',CYBR:'PANW',GTLS:'BKR',ANSS:'SNPS',BK:'BNY',MMC:'MRSH',SATS:'ECHO',ACLX:'GILD',CFLT:'IBM',EXAS:'ABT',MASI:'DHR',PSTG:'P',AGRI:'AVX'};
const EXCLUDED=new Set(['GWH','ABB','SGMO']);
const RUNTIME_ADDED=['EXC','SRE','WEC','PPL','XEL','ES','DUK','PEG','LAND','ROP','CHRW'];
const CHECK=['GILD','ABT','DHR','IBM','P','AQB','DVN',...RUNTIME_ADDED];
const STATUS={
  SGMO:{status:['OTC','BANKRUPTCY'],current:'SGMOQ'},
  GWH:{status:['OTC'],current:'GWHT'},
  ABB:{status:['OTC'],current:'ABBNY'},
  SES:{status:['ACTIVE'],warning:'listing-compliance'},
  QSI:{status:['ACTIVE'],warning:'listing-compliance'},
  LOCL:{status:['ACTIVE'],warning:'listing-compliance'},
  AQB:{status:['ACTIVE'],warning:'listing-risk-history'}
};

function canon(s){return String(s||'').trim().toUpperCase().replace(/[-/]/g,'.')}
function parseDir(text,kind){const lines=text.split(/\r?\n/).filter(Boolean),out=[];for(const line of lines.slice(1)){if(line.startsWith('File Creation Time'))continue;const c=line.split('|');if(c.length<2)continue;const sym=kind==='nasdaq'?c[0]:(c[0]||c[3]||c[7]);if(sym&&sym!=='Symbol'&&sym!=='ACT Symbol')out.push(canon(sym));}return out}
function readExtras(){const s=fs.readFileSync(path.join(process.cwd(),'extras.js'),'utf8');const start=s.indexOf('window.EXTRA_COMPANIES=');const arrStart=s.indexOf('[',start);const end=s.indexOf('\n];',arrStart);if(start<0||arrStart<0||end<0)return[];return JSON.parse(s.slice(arrStart,end+2));}
function rawArchiveTickers(){
  const ctx={window:{__B:''}}; vm.createContext(ctx);
  for(let i=0;i<=12;i++){const f=path.join(process.cwd(),`n${String(i).padStart(2,'0')}.js`);vm.runInContext(fs.readFileSync(f,'utf8'),ctx);}
  const data=JSON.parse(zlib.gunzipSync(Buffer.from(ctx.window.__B,'base64')).toString('utf8')); const extras=readExtras();
  return [...data,...extras].map(x=>canon(x.t)).filter(Boolean);
}
function archiveTickerSet(){const set=new Set(rawArchiveTickers());for(const [old,cur] of Object.entries(ALIASES)){if(set.has(old)){set.delete(old);set.add(cur)}}EXCLUDED.forEach(x=>set.delete(x));RUNTIME_ADDED.forEach(x=>set.add(x));return set}
module.exports=async function handler(req,res){
  try{
    const [n,o]=await Promise.all([
      fetch('https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt',{headers:{'user-agent':'Mozilla/5.0'}}),
      fetch('https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt',{headers:{'user-agent':'Mozilla/5.0'}})
    ]);
    if(!n.ok||!o.ok) throw new Error(`symbol directory fetch failed: ${n.status}/${o.status}`);
    const [nt,ot]=await Promise.all([n.text(),o.text()]); const listed=new Set([...parseDir(nt,'nasdaq'),...parseDir(ot,'other')]); const set=archiveTickerSet(); const archive=[...set].sort(); const unmatched=archive.filter(t=>!listed.has(canon(t))); const matched=archive.filter(t=>listed.has(canon(t))); const check=Object.fromEntries(CHECK.map(t=>[t,{inArchive:set.has(t),currentlyListed:listed.has(t),status:set.has(t)&&listed.has(t)?'ACTIVE':'REVIEW'}]));
    res.setHeader('Cache-Control','no-store'); res.status(200).json({asOf:new Date().toISOString(),archiveCount:archive.length,matchedCount:matched.length,unmatchedCount:unmatched.length,unmatched,knownNonActive:STATUS,check,source:{archive:'n00-n12 + extras.js + source_corrections.js additions',nasdaq:'nasdaqlisted.txt',other:'otherlisted.txt'},statusModel:['ACTIVE','SUSPENDED','DELISTING','OTC','BANKRUPTCY']});
  }catch(e){res.status(500).json({error:String(e&&e.message||e)})}
}
