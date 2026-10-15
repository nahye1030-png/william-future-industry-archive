const fs=require('fs');
const path=require('path');

const ALIASES={FI:'FISV',CLFS:'CLF',CTRA:'DVN',CYBR:'PANW',GTLS:'BKR',ANSS:'SNPS',BK:'BNY',MMC:'MRSH',SATS:'ECHO',ACLX:'GILD',CFLT:'IBM',EXAS:'ABT',MASI:'DHR',PSTG:'P'};
const EXCLUDED=new Set(['GWH','ABB','SGMO']);
const EXTRA=['DTE','FE','CMS'];
const UA='WilliamFutureIndustryArchive/1.0 contact: archive-audit@example.com';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function canon(s){return String(s||'').trim().toUpperCase().replace(/[-/]/g,'.')}
function archiveTickers(){
  const src=fs.readFileSync(path.join(process.cwd(),'tags.js'),'utf8');
  const keys=[...src.matchAll(/\"([^\"]+)\"\s*:\s*\[/g)].map(m=>m[1]);
  const set=new Set(keys.map(canon)); EXTRA.forEach(x=>set.add(x));
  for(const [old,cur] of Object.entries(ALIASES)){if(set.has(old)){set.delete(old);set.add(cur)}}
  EXCLUDED.forEach(x=>set.delete(x)); return [...set].sort();
}
function rowAt(recent,i){
  const g=k=>Array.isArray(recent[k])?recent[k][i]:undefined;
  return {form:g('form'),date:g('filingDate'),items:g('items')||'',accession:g('accessionNumber'),primary:g('primaryDocument')};
}
async function fetchJson(url){const r=await fetch(url,{headers:{'user-agent':UA,'accept-encoding':'gzip, deflate'}});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json()}
module.exports=async function handler(req,res){
 try{
  const all=archiveTickers(); const offset=Math.max(0,Number(req.query.offset||0)); const limit=Math.min(30,Math.max(1,Number(req.query.limit||25))); const batch=all.slice(offset,offset+limit);
  const map=await fetchJson('https://www.sec.gov/files/company_tickers.json');
  const byTicker={}; for(const v of Object.values(map)){byTicker[canon(v.ticker)]={cik:String(v.cik_str).padStart(10,'0'),title:v.title}}
  const out=[];
  for(let p=0;p<batch.length;p+=5){
    const group=batch.slice(p,p+5);
    const got=await Promise.all(group.map(async t=>{
      const m=byTicker[t]; if(!m)return {ticker:t,status:'REVIEW',reason:'SEC ticker map miss'};
      try{
        const sub=await fetchJson(`https://data.sec.gov/submissions/CIK${m.cik}.json`); const recent=sub.filings&&sub.filings.recent||{}; const n=(recent.form||[]).length; const signals=[];
        for(let i=0;i<n;i++){
          const r=rowAt(recent,i); if(!r.date||r.date<'2025-01-01')continue;
          if(r.form==='25-NSE'||r.form==='25')signals.push({...r,signal:'FORM25_REVIEW'});
          if(r.form==='8-K'&&String(r.items).includes('1.03'))signals.push({...r,signal:'BANKRUPTCY_REVIEW'});
          if(r.form==='8-K'&&String(r.items).includes('3.01'))signals.push({...r,signal:'LISTING_REVIEW'});
          if(/^15-12/.test(r.form||''))signals.push({...r,signal:'DEREGISTRATION_REVIEW'});
        }
        return {ticker:t,title:m.title,status:signals.length?'REVIEW':'ACTIVE_NO_SEC_RED_FLAG',signals:signals.slice(0,8)};
      }catch(e){return {ticker:t,status:'REVIEW',reason:String(e.message||e)}}
    }));
    out.push(...got); if(p+5<batch.length)await sleep(120);
  }
  res.setHeader('Cache-Control','no-store'); res.status(200).json({asOf:new Date().toISOString(),offset,limit,batchCount:batch.length,total:all.length,results:out,note:'SEC Form 25/8-K signals are review flags only until the affected security and actual trading status are verified.'});
 }catch(e){res.status(500).json({error:String(e.message||e)})}
}
