// Southern Company (SO) source-theme audit, verified 2026-10-16.
// No direct appearance confirmed in the audited originals; all links below are structural matches.
(function(){
  const rows=[
    {group:'콩콩팥팥 3편 · 구조적 해당 (강)',sourceType:'구조적 해당',reason:'AI 시대의 핵심을 발전량만이 아니라 전기·송전망·냉각·부지·계통접속을 먼저 확보하는 구조로 설명한다. Southern Company의 수직통합 전력 유틸리티와 송배전망 운영은 이 전력접속·이동망 축에 강하게 해당.'},
    {group:'콩콩팥팥 5편 · 구조적 해당 (강)',sourceType:'구조적 해당',reason:'24시간 안정적으로 전력을 공급하고 장기 전력조달·계통접속·전력단가를 관리하는 능력이 AI 데이터센터의 생존조건이라는 구조에 발전·전력구매·송배전 유틸리티로 해당.'},
    {group:'콩콩팥팥 6편 · 구조적 해당',sourceType:'구조적 해당',reason:'변압기·변전소·송전망·배전망의 긴 증설시간이 산업 성장의 시간표를 정한다는 구조와 연결. Southern 계열 유틸리티는 미래 부하를 수용하기 위한 송전·배전 증설의 운영·투자 주체.'},
    {group:'사고흐름 1편 · 구조적 해당 (강)',sourceType:'구조적 해당',reason:'3. 전력 인프라의 생산·이동·저장 통합 시스템과 9. 송전망의 실제 산업 현장까지 전기를 보내는 병목 통로에 정확히 연결.'},
    {group:'사고흐름 1편 · 구조적 해당 · 원전',sourceType:'구조적 해당',reason:'7. 원전과 SMR에서 강조한 24시간 안정 기저전력 자산에 기존 대형 원전 운영으로 연결. Georgia Power의 Vogtle·Hatch와 Southern Nuclear 운영축이며, SMR 개발사라는 의미는 아님.'},
    {group:'사고흐름 1편 · 구조적 해당 · 천연가스',sourceType:'구조적 해당',reason:'8. 천연가스와 LNG에서 재생에너지·원전 사이를 메우는 현실적 브릿지 에너지라는 구조에 Southern Power의 가스발전과 Southern Company Gas의 가스배급·저장·수송계약이 연결.'},
    {group:'초격차 산업지도 2편 · 구조적 해당 (강)',sourceType:'구조적 해당',reason:'11번 차세대 발전설비, 12번 초고압 송전망, 13번 변압기 및 배전망, 14번 원자력의 여러 레이어를 실제 그룹 사업으로 동시에 통과하는 통합 전력 인프라 기업.'}
  ];
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function run(){
    if(typeof D==='undefined'||!Array.isArray(D)||!D.length||!window.__CORP_ACTIONS_APPLIED){setTimeout(run,30);return;}
    if(window.__SO_SOURCE_AUDIT_APPLIED)return;window.__SO_SOURCE_AUDIT_APPLIED=true;
    let x=D.find(z=>z.t==='SO');
    if(!x){
      x={t:'SO',n:'The Southern Company',k:'서던 컴퍼니',l:'미국 직접상장',a:'전력 인프라',b:'발전·송전·배전·가스·원전',c:'통합 전력 유틸리티',r:'Alabama Power·Georgia Power·Mississippi Power의 수직통합 전력 유틸리티, Southern Power의 발전·ESS, Southern Company Gas의 가스배급·저장, Southern Nuclear의 원전 운영을 함께 보유하는 통합 전력 인프라 그룹.',g:[],h:[],ac:0};
      D.push(x);
    }
    x.n='The Southern Company';x.k='서던 컴퍼니';x.l='미국 직접상장';
    x.a='전력 인프라';x.b='발전·송전·배전·가스·원전';x.c='통합 전력 유틸리티';
    x.r='Alabama Power·Georgia Power·Mississippi Power의 수직통합 전력 유틸리티, Southern Power의 발전·ESS, Southern Company Gas의 가스배급·저장, Southern Nuclear의 원전 운영을 함께 보유하는 통합 전력 인프라 그룹.';
    x.h=x.h||[];
    for(const h of rows){const key=(h.group||'')+'|'+(h.reason||'');if(!x.h.some(z=>((z.group||'')+'|'+(z.reason||''))===key))x.h.push(h)}
    x.g=uniq([...(x.g||[]),...rows.map(h=>(h.group||'').split(' · ')[0])]);x.ac=x.h.length;
    if(window.TAGMAP)window.TAGMAP.SO=['발전·유틸리티','전력망·전력장비','원전','천연가스·LNG','에너지저장·배터리'];
    if(typeof render==='function')render();
  }
  setTimeout(run,0);
})();
