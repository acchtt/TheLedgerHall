(() => {
  'use strict';

  const UNIT_VALUE_VND = 500000;
  const STORAGE_KEY = 'ledgerHall:original26';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const defaults = {
    wagers: [{ id:'wisla-gks', match:'Wisła Kraków vs GKS Katowice', pick:'GKS Katowice +0.25', odds:1.98, stakeUnits:.25, stakeVnd:125000, status:'Pending' }],
    messages: [
      { who:'You', time:'03:10', text:'G2 is constantly applying pressure and KC is unable to get return kills.', type:'user' },
      { who:'Council', time:'03:11', text:'The raw score understates G2’s control. KC +10.5 is withdrawn until the handicap expands.', type:'council' },
      { who:'Council · Official Bet Candidate', time:'03:19', text:'KC have started generating return kills and the gold lead has narrowed.', bet:'Karmine Corp +12.5 kills @1.886 · Stake: 0.25u', type:'council official' },
      { who:'You', time:'03:22', text:'Confirmed. Karmine Corp +12.5 @1.778 — 0.5u.', type:'user' },
      { who:'Council · Result', time:'Settled', text:'KC +12.5 kills and Over 2.5 maps both won.', bet:'Combined profit: +0.762u / +380,750 VND.', type:'council' }
    ],
    results: [
      ['KC +12.5 kills (vs G2)','W'],['Over 2.5 maps (G2 vs KC)','W'],['Astralis vs HOTU Under 24.5','W'],['Vietnam vs East Timor Over 3.0','L'],['Herediano vs Puntarenas Over 1.75','L']
    ],
    odds: [['KC +12.5 kills','1.886'],['G2 −12.5 kills','1.886'],['Over 29.5 kills','2.389'],['Under 29.5 kills','1.546'],['Over 30.0 min','1.578'],['Under 30.0 min','2.344']],
    battle: [['Gold','38.4k','◆','35.9k'],['Gold diff.','','✦','+2.5k'],['Towers','4','♜','1'],['Dragons','1','♞','1'],['Barons','0','♛','0'],['Inhibitors','0','◉','0']]
  };

  function loadSaved(){
    try{
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        userMessages:Array.isArray(raw.userMessages) ? raw.userMessages : [],
        customWagers:Array.isArray(raw.customWagers) ? raw.customWagers : [],
        theme:raw.theme === 'dusk' ? 'dusk' : 'day',
        hideMoney:Boolean(raw.hideMoney),
        collapsed:raw.collapsed && typeof raw.collapsed === 'object' ? raw.collapsed : {}
      };
    }catch{
      return { userMessages:[], customWagers:[], theme:'day', hideMoney:false, collapsed:{} };
    }
  }

  const saved = loadSaved();
  const state = {
    wagers:[...defaults.wagers, ...saved.customWagers],
    messages:[...defaults.messages, ...saved.userMessages]
  };

  const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  const formatVnd = (value) => `${Math.round(value).toLocaleString('en-US')} VND`;
  const formatUnits = (value) => `${Number(value).toFixed(value < 1 ? 2 : 3).replace(/0+$/,'').replace(/\.$/,'')}u`;
  const el = (tag, className, text) => { const node=document.createElement(tag); if(className) node.className=className; if(text!==undefined) node.textContent=text; return node; };

  function renderWagers(){
    const host = $('#open-wagers'); host.replaceChildren();
    state.wagers.forEach((wager) => {
      const card = el('article','wager-card');
      card.append(el('strong','',wager.match), el('div','selection',`${wager.pick}\n@${Number(wager.odds).toFixed(3)}`));
      card.querySelector('.selection').style.whiteSpace='pre-line';
      const meta=el('div','wager-meta money',`${formatUnits(wager.stakeUnits)} · ${formatVnd(wager.stakeVnd)}`);
      const badge=el('span','badge',wager.status || 'Pending');
      card.append(meta,badge); host.append(card);
    });
    const pending = state.wagers.reduce((sum,w)=>sum+Number(w.stakeUnits||0),0);
    $('#header-pending').textContent = formatUnits(pending);
  }

  function renderTrial(){
    const host=$('#trial-details'); host.replaceChildren();
    [['Wins','3'],['Losses','2'],['Settled P/L','+0.194u','money'],['Pending Exposure',formatUnits(state.wagers.reduce((s,w)=>s+Number(w.stakeUnits||0),0)),'money'],['Min Odds','1.60']].forEach(([label,value,cls])=>{
      host.append(el('dt','',label),el('dd',cls||'',value));
    });
  }

  function renderResults(){
    const host=$('#recent-results'); host.replaceChildren();
    defaults.results.forEach(([name,result])=>{const li=el('li');li.append(el('span','',name),el('b',result==='W'?'result-win':'result-loss',result));host.append(li);});
  }

  function renderOdds(){
    const host=$('#odds-list'); host.replaceChildren();
    defaults.odds.forEach(([market,price])=>{const row=el('div','odds-row');row.append(el('span','',market),el('strong','',price));host.append(row);});
  }

  function renderBattle(){
    const host=$('#battle-table'); host.replaceChildren();
    defaults.battle.forEach(([label,left,icon,right],index)=>{const row=el('div','battle-row');row.append(el('span','',label),el('b','',left),el('i','',icon),el('b',index===1?'positive':'',right));host.append(row);});
  }

  function renderMessage(message){
    const card=el('article',`message ${message.type||'user'}`);
    const meta=el('div','meta');meta.append(el('span','',message.who),el('span','',message.time));card.append(meta,el('div','',message.text));
    if(message.bet) card.append(el('div','bet-line money',message.bet));
    $('#messages').append(card);
  }
  function renderMessages(){const host=$('#messages');host.replaceChildren();state.messages.forEach(renderMessage);}

  function parseStake(text){
    const unit=text.match(/(\d+(?:\.\d+)?)\s*u\b/i); if(unit){const units=Number(unit[1]);return{units,vnd:units*UNIT_VALUE_VND};}
    const money=text.match(/([\d.,]+)\s*(?:VND|₫)\b/i); if(!money) return null;
    const vnd=Number(money[1].replace(/[.,](?=\d{3}(?:\D|$))/g,'').replace(/,/g,''));
    return Number.isFinite(vnd)&&vnd>0?{units:vnd/UNIT_VALUE_VND,vnd}:null;
  }

  function parseWager(text){
    const at=text.lastIndexOf('@'); if(at<2) return null;
    const before=text.slice(0,at).replace(/^\s*(?:confirmed|bet|took|logged)\s*[.:,-]?\s*/i,'').trim();
    const after=text.slice(at+1).trim(); const odds=after.match(/^(\d+(?:\.\d+)?)/); const stake=parseStake(after);
    if(!odds||!stake||before.length<2) return null;
    let match='Council note wager',pick=before;
    const pieces=before.split(/\s*(?:—|–|\||→)\s*/).filter(Boolean);
    if(pieces.length>=2 && /\bvs\.?\b/i.test(pieces[0])){match=pieces.shift();pick=pieces.join(' — ');}
    return{id:`wager-${Date.now()}`,match,pick,odds:Number(odds[1]),stakeUnits:stake.units,stakeVnd:stake.vnd,status:'Pending'};
  }

  function addDetectedWager(text){
    const wager=parseWager(text); if(!wager) return false;
    const duplicate=state.wagers.some(w=>w.pick.toLowerCase()===wager.pick.toLowerCase()&&Math.abs(w.odds-wager.odds)<.0001&&Math.abs(w.stakeUnits-wager.stakeUnits)<.0001);
    if(duplicate) return false;
    state.wagers.push(wager);saved.customWagers.push(wager);persist();renderWagers();renderTrial();$('#current-read').textContent='Wager Logged';return true;
  }

  function applyPreferences(){
    document.body.classList.toggle('theme-dusk',saved.theme==='dusk');
    document.body.classList.toggle('hide-money',saved.hideMoney);
    $('#money-btn').lastChild.textContent=saved.hideMoney?'Show $':'Hide $';
    $$('.wood-section[id]').forEach(section=>{const collapsed=Boolean(saved.collapsed[section.id]);section.classList.toggle('collapsed',collapsed);const button=section.querySelector('.collapse');if(button)button.textContent=collapsed?'+':'−';});
  }

  function wireControls(){
    $('#message-form').addEventListener('submit',(event)=>{
      event.preventDefault(); const input=$('#message-input'); const text=input.value.trim(); if(!text)return;
      const message={who:'You',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false}),text,type:'user'};
      state.messages.push(message);saved.userMessages.push(message);persist();renderMessage(message);addDetectedWager(text);input.value='';$('#messages').scrollTop=$('#messages').scrollHeight;
    });
    $('#theme-btn').addEventListener('click',()=>{saved.theme=saved.theme==='dusk'?'day':'dusk';persist();applyPreferences();});
    $('#money-btn').addEventListener('click',()=>{saved.hideMoney=!saved.hideMoney;persist();applyPreferences();});
    $('#chamber-btn').addEventListener('click',()=>{$('#hero').classList.remove('focus-flash');requestAnimationFrame(()=>$('#hero').classList.add('focus-flash'));});
    $$('.collapse').forEach(button=>button.addEventListener('click',()=>{const section=button.closest('.wood-section');saved.collapsed[section.id]=!section.classList.contains('collapsed');persist();applyPreferences();}));
    $$('.footer-beam button').forEach(button=>button.addEventListener('click',()=>{$$('.footer-beam button').forEach(item=>item.classList.toggle('active',item===button));const target=document.getElementById(button.dataset.target);if(target){target.classList.remove('focus-flash');requestAnimationFrame(()=>target.classList.add('focus-flash'));}}));
    $$('.help').forEach(button=>button.addEventListener('click',()=>window.alert(button.dataset.help||'Ledger information')));
  }

  renderWagers();renderTrial();renderResults();renderOdds();renderBattle();renderMessages();wireControls();applyPreferences();
})();