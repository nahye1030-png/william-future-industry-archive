// Source-theme audit corrections, verified 2026-10-15.
// Purpose: keep direct appearance separate from structural match and later expansion.
(function(){
 const ADD={
  EXC:{n:'Exelon',k:'엑셀론',l:'미국 직접상장',a:'전력 인프라',b:'송전·배전 유틸리티',c:'계통·전력접속',r:'규제 전력 유틸리티 자회사들을 통해 송전·배전망과 최종 전력공급을 운영.',tags:['전력망·전력장비','발전·유틸리티']},
  SRE:{n:'Sempra',k:'셈프라',l:'미국 직접상장',a:'전력·에너지 인프라',b:'LNG·가스·전력망',c:'에너지 네트워크',r:'LNG·천연가스 인프라와 규제 유틸리티/전력망 자산을 함께 보유하는 에너지 인프라 기업.',tags:['천연가스·LNG','전력망·전력장비','발전·유틸리티']},
  WEC:{n:'WEC Energy Group',k:'WEC 에너지 그룹',l:'미국 직접상장',a:'전력 인프라',b:'전력·가스 유틸리티',c:'송배전·가스배급',r:'전력·천연가스 규제 유틸리티와 관련 송배전 인프라를 운영.',tags:['발전·유틸리티','전력망·전력장비','천연가스·LNG']},
  PPL:{n:'PPL Corporation',k:'PPL',l:'미국 직접상장',a:'전력 인프라',b:'전력·가스 유틸리티',c:'송전·배전',r:'미국 규제 유틸리티를 통해 전력 송배전과 일부 발전·가스 서비스를 제공.',tags:['전력망·전력장비','발전·유틸리티']},
  XEL:{n:'Xcel Energy',k:'엑셀 에너지',l:'미국 직접상장',a:'전력 인프라',b:'전력·가스 유틸리티',c:'발전·송배전',r:'규제 전력·가스 유틸리티로 발전·전력구매·송전·배전과 가스 공급을 수행.',tags:['발전·유틸리티','전력망·전력장비','천연가스·LNG']},
  ES:{n:'Eversource Energy',k:'에버소스 에너지',l:'미국 직접상장',a:'전력 인프라',b:'송전·배전 유틸리티',c:'전력망·가스·물',r:'전력 송전·배전, 천연가스 배급, 물 유틸리티를 운영하는 규제 인프라 기업.',tags:['전력망·전력장비','발전·유틸리티','물']},
  DUK:{n:'Duke Energy',k:'듀크 에너지',l:'미국 직접상장',a:'전력 인프라',b:'발전·송배전 유틸리티',c:'기저전력·전력망',r:'대형 규제 전력 유틸리티로 발전·송전·배전과 천연가스 인프라를 운영.',tags:['발전·유틸리티','전력망·전력장비','원전']},
  PEG:{n:'Public Service Enterprise Group',k:'PSEG',l:'미국 직접상장',a:'전력 인프라',b:'전력·가스 유틸리티·원전',c:'송배전·기저전력',r:'PSE&G 규제 전력·가스 유틸리티와 원자력 발전 자산을 중심으로 운영.',tags:['전력망·전력장비','발전·유틸리티','원전']},
  LAND:{n:'Gladstone Land',k:'글래드스톤 랜드',l:'미국 직접상장',a:'농업·식량 인프라',b:'농지·물권',c:'농업 부동산',r:'미국 농지를 소유·임대하는 농업 REIT로 캘리포니아 물 자산도 보유. 식량 생산의 토지·물 권리 레이어.',tags:['농업·식량','인프라·부동산','물']},
  ROP:{n:'Roper Technologies',k:'로퍼 테크놀로지스',l:'미국 직접상장',a:'산업 소프트웨어',b:'수직형 소프트웨어',c:'물류·산업 워크플로우',r:'수직형 소프트웨어 중심 포트폴리오 기업. DAT freight marketplace/AI 분석, iTradeNetwork 공급망 소프트웨어 등 일부 사업이 산업 AI·스마트물류와 연결.',tags:['AI·소프트웨어','물류·운송']},
  CHRW:{n:'C.H. Robinson Worldwide',k:'C.H. 로빈슨',l:'미국 직접상장',a:'물류·공급망',b:'글로벌 3PL·Lean AI',c:'멀티모달 물류 최적화',r:'트럭·LTL·해상·항공을 아우르는 글로벌 물류기업으로 대규모 운송 데이터와 Lean AI를 공급망 운영에 적용.',tags:['물류·운송','AI·소프트웨어']}
 };
 const H={
  UTIL:[
   {group:'콩콩팥팥 3편 · 구조적 해당',sourceType:'구조적 해당',reason:'AI 성장의 병목을 발전량보다 송전·변전·계통접속과 실제 전력을 받을 수 있는 시간표에서 찾는 구조에 송배전 유틸리티로 해당.'},
   {group:'콩콩팥팥 5편 · 구조적 해당',sourceType:'구조적 해당',reason:'24시간 안정전력·전력계약·송전접속·공급안정성이 데이터센터 가동 조건이 되는 구조에 유틸리티 운영축으로 해당.'},
   {group:'콩콩팥팥 6편 · 구조적 해당',sourceType:'구조적 해당',reason:'변압기·변전소·배전망·계통 연결의 긴 증설기간이 성장 허가권이 되는 구조와 연결.'},
   {group:'사고흐름 1편 · 구조적 해당',sourceType:'구조적 해당',reason:'3. 전력 인프라와 9. 송전망: 송전망·배전장비·전력접속권 및 전기를 실제 수요처까지 보내는 병목 통로라는 원문 구조와 연결.'},
   {group:'초격차 산업지도 2편 · 구조적 해당',sourceType:'구조적 해당',reason:'12번 초고압 송전망(HVDC·변전소·계통 연결)과 13번 변압기·배전망의 운영·수요 주체라는 구조에 해당.'}
  ],
  AQB:[
   {group:'청팀 총정리 2편 · 구조적 해당 (과거 사업)',sourceType:'구조적 해당',reason:'원문의 미래 식량 시스템(해양바이오 등)과 AquaBounty의 과거 GE 연어·육상 순환여과식 양식 모델이 구조적으로 연결. 회사명 직접 등장은 아님. 현재는 연어 농장과 GE 연어 IP를 매각해 연결 강도가 크게 낮아짐.'},
   {group:'초격차 산업지도 5편 · 구조적 해당 (과거 사업)',sourceType:'구조적 해당',reason:'48번 식량·농업기술의 미래 식량 생산축과 과거 육상양식·수산 바이오 사업이 연결. 현재 운영사업이 아니라 과거 사업 기준 이력으로 보존.'}
  ],
  LAND:[
   {group:'콩콩팥팥 1편 · 구조적 해당',sourceType:'구조적 해당',reason:'전력·물·데이터·물류 같은 기반과 함께 물권·토지이용권 등 희소한 미래 통행권을 보는 원리에 농지와 물 자산 소유자로 해당.'},
   {group:'청팀 총정리 2편 · 구조적 해당',sourceType:'구조적 해당',reason:'기후·인구 변화 속 미래 식량 시스템을 가능하게 하는 농지·물 기반자산 레이어로 연결.'},
   {group:'초격차 산업지도 5편 · 구조적 해당',sourceType:'구조적 해당',reason:'48번 식량·농업기술의 종자·관개·농업로봇·저장물류가 작동하기 위한 농지·물 인프라 소유축.'}
  ],
  AUR:[
   {group:'청팀 총정리 2편 · 구조적 해당',sourceType:'구조적 해당',reason:'공급망 리셋의 Smart Logistics·생산/운송 자동화 방향에 상용 자율트럭 운영 기술로 연결.'},
   {group:'콩콩팥팥 23편 · 구조적 해당',sourceType:'구조적 해당',reason:'산업용 AI가 물류망·공급망 최적화와 현장 운영에 들어간다는 구조에 자율트럭 Driver/운영 소프트웨어로 해당.'},
   {group:'콩콩팥팥 24편 · 구조적 해당',sourceType:'구조적 해당',reason:'노동력 부족을 제조·물류 자동화로 메우는 구조에서 장거리 화물운송의 무인화 축에 해당.'},
   {group:'초격차 산업지도 3편 · 구조적 해당',sourceType:'구조적 해당',reason:'25번 자율물류와 26번 자율주행 중 특히 차량용 컴퓨팅·센서·지도·시뮬레이션·규제 기반 자율주행 축에 직접 구조 연결.'}
  ],
  CHRW:[
   {group:'청팀 총정리 2편 · 구조적 해당',sourceType:'구조적 해당',reason:'AI 예측·Smart Logistics를 통해 공급망을 자동화·최적화하는 방향에 글로벌 3PL·운송 데이터 운영자로 연결.'},
   {group:'콩콩팥팥 23편 · 구조적 해당',sourceType:'구조적 해당',reason:'산업용 AI가 물류망·공급망 최적화에서 반복 비용절감을 만든다는 구조와 Lean AI 기반 물류 운영이 연결.'},
   {group:'초격차 산업지도 3편 · 구조적 해당',sourceType:'구조적 해당',reason:'25번 자율물류의 관제·플릿 운영과 인접한 물류 오케스트레이션·운송 데이터 레이어. AMR 제조사가 아니라 운영·데이터축으로 연결.'}
  ],
  ROP:[
   {group:'콩콩팥팥 23편 · 후속 확장 연결',sourceType:'후속 확장 연결',reason:'본문은 산업 AI가 공장·전력망·물류망의 운영체제로 들어가는 구조를 설명. Roper 전체가 pure-play 산업 AI는 아니지만 DAT의 AI 물류분석·freight marketplace와 공급망 소프트웨어가 일부 연결.'},
   {group:'청팀 총정리 2편 · 후속 확장 연결',sourceType:'후속 확장 연결',reason:'Smart Logistics·공급망 리셋에 Roper의 DAT·iTradeNetwork 등 일부 수직형 소프트웨어 사업이 연결되나 그룹 전체 사업을 대표하는 직접 구조 연결은 아님.'}
  ],
  BKR_GTLS:[
   {group:'사고흐름 1편 · 구조적 해당 · 과거 GTLS',sourceType:'구조적 해당',reason:'8. 천연가스와 LNG의 브릿지 에너지 구조에서 과거 Chart Industries의 극저온·액화·가스처리 장비 역량이 핵심 설비 레이어로 연결. 2026-07-16 BKR 인수 완료 후 BKR에 승계.'},
   {group:'초격차 산업지도 2편 · 후속 확장 연결 · 과거 GTLS',sourceType:'후속 확장 연결',reason:'11번 차세대 발전설비의 압축기·발전 EPC 및 에너지 인프라 주변 장비와 Chart의 극저온/가스처리 포트폴리오가 인접. 독립 GTLS가 아니라 현재 BKR 기준으로 보존.'}
  ]
 };
 function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
 function addHist(x,rows){
  x.h=x.h||[];
  for(const h of rows){
   const key=(h.group||'')+'|'+(h.reason||'');
   if(!x.h.some(z=>((z.group||'')+'|'+(z.reason||''))===key)) x.h.push(h);
  }
  x.g=uniq([...(x.g||[]),...rows.map(h=>(h.group||'').split(' · ')[0])]); x.ac=x.h.length;
 }
 function wait(){
  if(typeof D==='undefined'||!Array.isArray(D)||!D.length||!window.__CORP_ACTIONS_APPLIED){setTimeout(wait,30);return;}
  if(window.__SOURCE_CORRECTIONS_APPLIED)return; window.__SOURCE_CORRECTIONS_APPLIED=true;
  for(const [t,v] of Object.entries(ADD)){
   let x=D.find(z=>z.t===t);
   if(!x){x={t,...v,g:[],h:[],ac:0};D.push(x)}
   else {x.n=v.n||x.n;x.k=v.k||x.k;x.l=v.l||x.l;x.a=v.a||x.a;x.b=v.b||x.b;x.c=v.c||x.c;x.r=v.r||x.r}
   if(window.TAGMAP)window.TAGMAP[t]=v.tags;
  }
  const util=['EXC','SRE','WEC','PPL','XEL','ES','FE','DTE','CMS','DUK','PEG'];
  util.forEach(t=>{const x=D.find(z=>z.t===t);if(x)addHist(x,H.UTIL)});
  // Sempra: LNG is an additional strong source link.
  const sre=D.find(z=>z.t==='SRE'); if(sre)addHist(sre,[{group:'사고흐름 1편 · 구조적 해당',sourceType:'구조적 해당',reason:'8. 천연가스와 LNG: 전력수요 급증기에 재생에너지와 원전 사이를 메우는 브릿지 에너지라는 구조에 LNG·가스 인프라 사업으로 직접 구조 연결.'}]);
  // Duke/PSEG: nuclear exposure is conventional baseload; do not imply SMR ownership.
  ['DUK','PEG'].forEach(t=>{const x=D.find(z=>z.t===t);if(x)addHist(x,[{group:'사고흐름 1편 · 구조적 해당',sourceType:'구조적 해당',reason:'7. 원전과 SMR의 핵심 논점인 24시간 안정 기저전력 자산에 기존 원전 운영 노출로 연결. SMR 개발사라는 의미는 아님.'}])});
  const aqb=D.find(z=>z.t==='AQB'); if(aqb){
   aqb.a='농업·식량 (과거 사업 연결)';aqb.b='육상양식·수산바이오 (과거 핵심사업)';aqb.c='잔존 Ohio 양식시설 자산';
   aqb.r='과거 GE 연어·육상 순환여과식 양식(RAS) 사업으로 미래 식량·해양바이오와 연결됐으나, 현재는 연어 농장과 GE 연어 IP를 매각했고 Ohio 프로젝트 자산의 전략적 대안을 추진 중.';
   aqb.h=[];aqb.g=[];addHist(aqb,H.AQB);if(window.TAGMAP)window.TAGMAP.AQB=['농업·식량','인프라·부동산'];
  }
  const land=D.find(z=>z.t==='LAND');if(land)addHist(land,H.LAND);
  const aur=D.find(z=>z.t==='AUR');if(aur){
   // Preserve MASTER-map history, explicitly as later expansion.
   (aur.h||[]).forEach(h=>{if(/MASTER|마스터/i.test(h.group||''))h.sourceType='후속 확장 연결'});addHist(aur,H.AUR);
  }
  const chrw=D.find(z=>z.t==='CHRW');if(chrw)addHist(chrw,H.CHRW);
  const rop=D.find(z=>z.t==='ROP');if(rop)addHist(rop,H.ROP);
  const bkr=D.find(z=>z.t==='BKR');if(bkr)addHist(bkr,H.BKR_GTLS);
  // GTLS must not reappear as an active standalone company after Baker Hughes acquisition.
  const gi=D.findIndex(z=>z.t==='GTLS');if(gi>=0)D.splice(gi,1);
  if(window.TAGMAP)delete window.TAGMAP.GTLS;
  if(typeof render==='function')render();
 }
 setTimeout(wait,0);
})();
