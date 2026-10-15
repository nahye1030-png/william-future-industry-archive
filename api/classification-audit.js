const fs=require('fs');
const path=require('path');
const vm=require('vm');

module.exports=async function handler(req,res){
  try{
    const src=fs.readFileSync(path.join(process.cwd(),'tags.js'),'utf8');
    const sandbox={window:{}};
    vm.runInNewContext(src,sandbox,{timeout:1000});
    const map=sandbox.window.TAGMAP||{};
    const tickers=['CQP','VG','ACN','AAPL','GRMN','ROP','ITT','NDSN','U','ECHO','CMTL','SGMO','AQB','CTRA'];
    const out={}; for(const t of tickers) out[t]=map[t]||null;
    res.setHeader('Cache-Control','no-store');
    res.status(200).json(out);
  }catch(e){res.status(500).json({error:String(e&&e.message||e)})}
}
