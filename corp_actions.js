// Corporate action normalization layer (verified through 2026-10-08)
window.CORP_ACTION_AUDIT = {
  FISV:[
    {type:'티커 변경',date:'2025-11-11',text:'Fiserv가 NYSE의 FI에서 Nasdaq의 FISV로 복귀. 현재 메인 티커는 FISV.'},
    {type:'과거 티커',date:'2023-06-07',text:'Fiserv가 Nasdaq FISV에서 NYSE FI로 이전했으나 2025년 다시 FISV로 변경.'}
  ],
  CLF:[{type:'티커 정정',date:'현재',text:'Cleveland-Cliffs의 현재 NYSE 티커는 CLF. 기존 CLFS 항목은 중복/오표기로 CLF에 통합.'}],
  DVN:[{type:'합병',date:'2026-05-07',text:'Devon Energy와 Coterra Energy 합병 완료. 결합회사는 Devon Energy, 현재 NYSE 티커 DVN. 과거 CTRA 이력은 DVN에 통합.'}],
  PANW:[{type:'인수',date:'2026-02-11',text:'Palo Alto Networks가 CyberArk 인수 완료. 미국 상장 메인 티커는 PANW이며, 과거 CYBR 이력은 PANW에 통합.'}],
  BKR:[{type:'인수',date:'2026-07-16',text:'Baker Hughes가 Chart Industries 인수 완료. 과거 GTLS 이력은 BKR에 통합.'}],
  SNPS:[{type:'인수',date:'2025-07-17',text:'Synopsys가 Ansys 인수 완료. ANSS는 Nasdaq 거래 종료, 관련 과거 이력은 SNPS 기준으로 해석.'}],
  BNY:[{type:'티커 변경',date:'2026-05-21',text:'Bank of New York Mellon이 BK에서 BNY로 티커 변경. 현재 NYSE 티커는 BNY.'}],
  MRSH:[{type:'티커 변경',date:'2026-01-14',text:'Marsh McLennan이 MMC에서 MRSH로 티커 변경. 현재 NYSE 티커는 MRSH.'}],
  ECHO:[{type:'티커 변경',date:'2026-06-24',text:'EchoStar가 SATS에서 ECHO로 티커 변경. 현재 Nasdaq 티커는 ECHO.'}]
};

(function(){
  const aliases={FI:'FISV',CLFS:'CLF',CTRA:'DVN',CYBR:'PANW',GTLS:'BKR',ANSS:'SNPS',BK:'BNY',MMC:'MRSH',SATS:'ECHO'};
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function addLegacyText(x,old){
    const tag=`과거 티커/기업: ${old}`;
    if(!String(x.r||'').includes(tag)) x.r=[x.r,tag].filter(Boolean).join(' · ');
  }
  function mergeHistory(target,old,oldTicker){
    target.g=uniq([...(target.g||[]),...(old.g||[])]);
    const oldHist=(old.h||[]).map(h=>({
      ...h,
      group:(h.group||h.source||'원본 이력')+` · 과거 ${oldTicker}`,
      reason:[h.reason||h.role||'',`기업행동 전 원래 티커 ${oldTicker} 기준 이력`].filter(Boolean).join(' · ')
    }));
    target.h=[...(target.h||[]),...oldHist];
    target.ac=(target.h||[]).length;
    if(!(target.f||[]).length && (old.f||[]).length) target.f=old.f;
    if(!target.q && old.q) target.q=old.q;
    if(!target.s && old.s) target.s=old.s;
    addLegacyText(target,oldTicker);
  }
  function removeTicker(t){
    const i=D.findIndex(x=>x.t===t); if(i>=0) D.splice(i,1);
  }
  function mergeInto(current,oldTicker){
    const old=D.find(x=>x.t===oldTicker), target=D.find(x=>x.t===current);
    if(!old||!target||old===target) return;
    mergeHistory(target,old,oldTicker); removeTicker(oldTicker);
  }
  function renameTicker(oldTicker,current,name,ko){
    const x=D.find(z=>z.t===oldTicker); if(!x) return;
    x.t=current; if(name)x.n=name; if(ko)x.k=ko; addLegacyText(x,oldTicker);
    if(window.TAGMAP){ window.TAGMAP[current]=window.TAGMAP[oldTicker]||window.TAGMAP[current]||['천연가스·LNG']; }
  }
  function normalize(){
    if(typeof D==='undefined'||!Array.isArray(D)||!D.length){setTimeout(normalize,25);return;}
    if(window.__CORP_ACTIONS_APPLIED) return; window.__CORP_ACTIONS_APPLIED=true;

    mergeInto('FISV','FI');
    mergeInto('CLF','CLFS');
    renameTicker('CTRA','DVN','Devon Energy','데본 에너지');
    mergeInto('PANW','CYBR');
    mergeInto('BKR','GTLS');

    ['SNPS','BNY','MRSH','ECHO'].forEach(t=>{const x=D.find(z=>z.t===t);if(x){
      const olds=Object.entries(aliases).filter(([,cur])=>cur===t).map(([o])=>o); olds.forEach(o=>addLegacyText(x,o));
    }});

    if(window.TAGMAP){
      window.TAGMAP.FISV=window.TAGMAP.FISV||window.TAGMAP.FI||['결제','금융인프라'];
      window.TAGMAP.CLF=window.TAGMAP.CLF||window.TAGMAP.CLFS||['핵심광물·소재'];
      window.TAGMAP.DVN=window.TAGMAP.DVN||window.TAGMAP.CTRA||['천연가스·LNG'];
      delete window.TAGMAP.FI; delete window.TAGMAP.CLFS; delete window.TAGMAP.CTRA; delete window.TAGMAP.CYBR; delete window.TAGMAP.GTLS;
    }

    if(typeof render==='function') render();
  }

  function esc3(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function installDetail(){
    if(typeof window.openD!=='function'){setTimeout(installDetail,25);return;}
    if(window.openD.__corpActionWrapped) return;
    const prev=window.openD;
    const wrapped=function(t){
      const current=aliases[t]||t; prev(current);
      const rows=window.CORP_ACTION_AUDIT[current]||[]; if(!rows.length) return;
      const detail=document.getElementById('detail'); if(!detail) return;
      const old=document.getElementById('corpActionSec'); if(old) old.remove();
      const sec=document.createElement('div'); sec.className='sec'; sec.id='corpActionSec';
      sec.innerHTML='<h3>기업행동 이력 · Corporate Actions</h3>'+rows.map(r=>`<div class="hist"><b>${esc3(r.type)} · ${esc3(r.date)}</b><div>${esc3(r.text)}</div></div>`).join('');
      const source=[...detail.querySelectorAll('.sec')].find(s=>/원본 (등장|연결) 이력/.test((s.querySelector('h3')||{}).textContent||''));
      if(source) source.insertAdjacentElement('beforebegin',sec); else detail.appendChild(sec);
    };
    wrapped.__corpActionWrapped=true; window.openD=wrapped;
  }
  setTimeout(normalize,0); setTimeout(installDetail,0);
})();
