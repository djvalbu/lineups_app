const STATE_KEY='opponentLineup.v2.state';
const SCOUT_KEY='opponentLineup.v2.scouting';
const EVENT_TYPES={GOAL_FOR:'GOAL_FOR',GOAL_AGAINST:'GOAL_AGAINST',YELLOW_CARD:'YELLOW_CARD',YELLOW_ACCUM_4:'YELLOW_ACCUM_4',RED_CARD:'RED_CARD',INJURY:'INJURY',LEFT_CLUB:'LEFT_CLUB',NEW_SIGNING:'NEW_SIGNING'};
const EVENT_META={
  GOAL_FOR:{label:'Goal',icon:'assets/icons/goal_for.png',minute:true,color:'#0433FF'},
  GOAL_AGAINST:{label:'Goal Against',icon:'assets/icons/goal_against.png',minute:true,color:'#FF1900'},
  YELLOW_CARD:{label:'Yellow Card',icon:'assets/icons/yellow_card.png'},
  YELLOW_ACCUM_4:{label:'4 Yellow Accumulation',icon:'assets/icons/yellow_accum_4.png'},
  RED_CARD:{label:'Red Card',icon:'assets/icons/red_card.png'},
  INJURY:{label:'Injury',icon:'assets/icons/injury.png'},
  LEFT_CLUB:{label:'Left Club',icon:'assets/icons/left_club.png'},
  NEW_SIGNING:{label:'New Signing',icon:'assets/icons/new_signing.png'}
};
// Horizontal x values are the FINAL field percentages (no extra compression).
// 2-player lines stay symmetric around 50%; 4-player lines are equally justified.
// 5-player lines use 3-up / 2-down vertical staggering to preserve full PlayerCard size.
const FORMATIONS={
 '1-4-4-2':[{label:'ST',x:37.5,y:8},{label:'ST',x:62.5,y:8},{label:'LM',x:13.5,y:34.7},{label:'CM',x:37.5,y:34.7},{label:'CM',x:62.5,y:34.7},{label:'RM',x:86.5,y:34.7},{label:'LB',x:13.5,y:61.3},{label:'CB',x:37.5,y:61.3},{label:'CB',x:62.5,y:61.3},{label:'RB',x:86.5,y:61.3},{label:'GK',x:50,y:88}],
 '1-4-3-3':[{label:'LW',x:18,y:8},{label:'ST',x:50,y:8},{label:'RW',x:82,y:8},{label:'CM',x:25,y:34.7},{label:'CM',x:50,y:34.7},{label:'CM',x:75,y:34.7},{label:'LB',x:13.5,y:61.3},{label:'CB',x:37.5,y:61.3},{label:'CB',x:62.5,y:61.3},{label:'RB',x:86.5,y:61.3},{label:'GK',x:50,y:88}],
 '1-4-2-3-1':[{label:'ST',x:50,y:8},{label:'LW',x:18,y:28},{label:'CAM',x:50,y:28},{label:'RW',x:82,y:28},{label:'CDM',x:37.5,y:48},{label:'CDM',x:62.5,y:48},{label:'LB',x:13.5,y:68},{label:'CB',x:37.5,y:68},{label:'CB',x:62.5,y:68},{label:'RB',x:86.5,y:68},{label:'GK',x:50,y:88}],
 '1-3-5-2':[{label:'ST',x:37.5,y:8},{label:'ST',x:62.5,y:8},{label:'LWB',x:13.5,y:31.2},{label:'CM',x:31.75,y:38.2},{label:'CM',x:50,y:31.2},{label:'CM',x:68.25,y:38.2},{label:'RWB',x:86.5,y:31.2},{label:'CB',x:22,y:61.3},{label:'CB',x:50,y:61.3},{label:'CB',x:78,y:61.3},{label:'GK',x:50,y:88}],
 '1-5-3-2':[{label:'ST',x:37.5,y:8},{label:'ST',x:62.5,y:8},{label:'CM',x:25,y:34.7},{label:'CM',x:50,y:34.7},{label:'CM',x:75,y:34.7},{label:'LWB',x:13.5,y:57.8},{label:'CB',x:31.75,y:64.8},{label:'CB',x:50,y:57.8},{label:'CB',x:68.25,y:64.8},{label:'RWB',x:86.5,y:57.8},{label:'GK',x:50,y:88}],
 '1-4-1-4-1':[{label:'ST',x:50,y:8},{label:'LM',x:13.5,y:28},{label:'CM',x:37.5,y:28},{label:'CM',x:62.5,y:28},{label:'RM',x:86.5,y:28},{label:'CDM',x:50,y:48},{label:'LB',x:13.5,y:68},{label:'CB',x:37.5,y:68},{label:'CB',x:62.5,y:68},{label:'RB',x:86.5,y:68},{label:'GK',x:50,y:88}],
 '1-3-4-3':[{label:'LW',x:18,y:8},{label:'ST',x:50,y:8},{label:'RW',x:82,y:8},{label:'LM',x:13.5,y:34.7},{label:'CM',x:37.5,y:34.7},{label:'CM',x:62.5,y:34.7},{label:'RM',x:86.5,y:34.7},{label:'CB',x:22,y:61.3},{label:'CB',x:50,y:61.3},{label:'CB',x:78,y:61.3},{label:'GK',x:50,y:88}],
 '1-5-4-1':[{label:'ST',x:50,y:8},{label:'LM',x:13.5,y:34.7},{label:'CM',x:37.5,y:34.7},{label:'CM',x:62.5,y:34.7},{label:'RM',x:86.5,y:34.7},{label:'LWB',x:13.5,y:57.8},{label:'CB',x:31.75,y:64.8},{label:'CB',x:50,y:57.8},{label:'CB',x:68.25,y:64.8},{label:'RWB',x:86.5,y:57.8},{label:'GK',x:50,y:88}]
};
const SUBS_GRID=[{label:'FW',x:13.5,y:8},{label:'FW',x:37.833,y:8},{label:'FW',x:62.167,y:8},{label:'FW',x:86.5,y:8},{label:'AM',x:13.5,y:28},{label:'AM',x:37.833,y:28},{label:'AM',x:62.167,y:28},{label:'AM',x:86.5,y:28},{label:'CM',x:13.5,y:48},{label:'CM',x:37.833,y:48},{label:'CM',x:62.167,y:48},{label:'CM',x:86.5,y:48},{label:'DEF',x:13.5,y:68},{label:'DEF',x:37.833,y:68},{label:'DEF',x:62.167,y:68},{label:'DEF',x:86.5,y:68},{label:'GK',x:50,y:88}];
const RESULT_CN={W:'胜',L:'负',D:'平'};
let state=null;
let ui={view:'dashboard',matchId:null,reportIndex:0,reportMode:'FULL'};
const imageDataCache=new Map();

function uid(prefix='id'){return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function cleanName(name=''){return String(name).replace(/\s*\(U21\)\s*/gi,'').trim()}
function isU21(p){return !!p?.isU21||/\(U21\)/i.test(p?.name||'')}
function footDisplayHtml(foot){
 const f=String(foot||'R').toUpperCase();
 if(f==='BOTH')return '<span class="foot-both"><span class="foot-l">L</span><span class="foot-sep"> </span><span class="foot-r">R</span></span>';
 if(f==='L')return '<span class="foot-l">L</span>';
 return '<span class="foot-r">R</span>';
}
function footDisplayText(foot){return String(foot||'R').toUpperCase()==='BOTH'?'L R':String(foot||'R').toUpperCase()}
function guessedInitials(name=''){
 const words=String(name||'').trim().replace(/[^A-Za-z0-9\s-]+/g,' ').split(/[\s-]+/).filter(Boolean);
 if(!words.length)return'TEAM';if(words.length===1)return words[0].slice(0,4).toUpperCase();
 return words.slice(0,2).map(w=>{const s=w.replace(/[^A-Za-z]/g,'');if(!s)return'';return s.length>=6?(s[0]+s[Math.floor(s.length/2)]).toUpperCase():s[0].toUpperCase()}).join('').slice(0,6)||'TEAM';
}
function reportInitials(){return String(state?.team?.reportInitials||guessedInitials(state?.team?.nameEn||state?.team?.name||'TEAM')).replace(/[^A-Za-z0-9]/g,'').toUpperCase()||'TEAM'}
function filledPreviousMatches(){return state.matches.filter(m=>m.kind==='MATCH'&&(m.positions?.length||m.roundNumber||m.opponentName)).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0))}
function nextMatchdayNumber(){const ms=filledPreviousMatches(),last=ms.at(-1);if(!last)return 1;const nums=String(last.roundNumber||'').match(/\d+/g);return (nums?.length?Number(nums.at(-1)):ms.length)+1}
function fullReportFilename(){return `2026_Lineup Prediction_MD${nextMatchdayNumber()}_${reportInitials()}.pptx`}
function summaryReportFilename(){return `2026_MD${nextMatchdayNumber()}_${reportInitials()}.pptx`}
function matchResultCode(m){const gf=Number(m?.goalsFor||0),ga=Number(m?.goalsAgainst||0);return gf>ga?'W':gf<ga?'L':'D'}
function homeAwayScore(m){const gf=Number(m?.goalsFor||0),ga=Number(m?.goalsAgainst||0);return m?.isHome===false?`${ga}-${gf}`:`${gf}-${ga}`}
function setReportMode(mode){
 ui.reportMode=mode==='SUMMARY'?'SUMMARY':'FULL';ui.reportIndex=0;document.body.dataset.reportMode=ui.reportMode;
 const sel=document.getElementById('reportModeSelect');if(sel)sel.value=ui.reportMode;
 const d=document.getElementById('reportModeDescription');if(d)d.textContent=ui.reportMode==='SUMMARY'?'Two-slide 16:9 summary based on the supplied Keynote template.':'540 × 720 pt golden-master geometry. PPTX remains editable in Keynote.';
 renderReport();
}
function playerById(id){return state.players.find(p=>p.id===id)}
function matchById(id){return state.matches.find(m=>m.id===id)}
function matchTemplate(m){return m?.kind==='SUBS'?SUBS_GRID:(FORMATIONS[m?.formation]||FORMATIONS['1-4-4-2'])}
function matchPositions(m){m.positions=m.positions||[];return m.positions}
function eventsFor(pos,type){return (pos?.events||[]).filter(e=>e.eventType===type)}
function hasEvent(pos,type){return eventsFor(pos,type).length>0}
function minuteString(arr){return `( ${arr.map(e=>String(e.minute||'').replace(/'/g,'').trim()+"'").join(',')} )`}
function minuteLabel(e){return `( ${String(e?.minute||'').replace(/'/g,'').trim()}' )`}
function saveState(){localStorage.setItem(STATE_KEY,JSON.stringify(state))}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
async function loadSeed(){if(window.__SEED__)return JSON.parse(JSON.stringify(window.__SEED__));return fetch('data/seed.json').then(r=>r.json())}
async function init(){
  const stored=localStorage.getItem(STATE_KEY);
  state=stored?JSON.parse(stored):await loadSeed();
  if(!state.schemaVersion)state.schemaVersion=2;
  normalizeState();
  document.getElementById('teamName').textContent=state.team?.nameEn||state.team?.name||'';
  bindGlobal(); renderAll();
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
}
function normalizeState(){
  state.players=state.players||[];state.matches=state.matches||[];
  state.matches.forEach(m=>{m.positions=m.positions||[];m.subGoals=m.subGoals||[];if(m.kind==='MATCH'&&m.isHome==null)m.isHome=true;m.positions.forEach(p=>{p.events=p.events||[]})});
  if(!state.matches.some(m=>m.kind==='EXPECTED'))state.matches.push({id:uid('expected'),kind:'EXPECTED',formation:'1-4-4-2',sortOrder:10,positions:[]});
  if(!state.matches.some(m=>m.kind==='SUBS'))state.matches.push({id:uid('subs'),kind:'SUBS',formation:'SUBS-GRID',sortOrder:11,positions:[]});
  const first=state.matches.find(m=>m.kind==='MATCH');if(!ui.matchId&&first)ui.matchId=first.id;
}
function bindGlobal(){
  document.getElementById('nav').addEventListener('click',e=>{const b=e.target.closest('button[data-view]');if(b)showView(b.dataset.view)});
  document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.jump)));
  document.getElementById('resetBtn').onclick=async()=>{if(confirm('Reset the local demo to the original imported data?')){state=await loadSeed();normalizeState();saveState();renderAll();toast('Demo reset')}};
  document.getElementById('backupBtn').onclick=downloadBackup;document.getElementById('jsonBtn').onclick=downloadBackup;
  document.getElementById('backupInput').onchange=importBackup;
  document.getElementById('addMatchBtn').onclick=addMatch;
  document.getElementById('addPlayerBtn').onclick=()=>openPlayerModal(null);
  document.getElementById('pptxBtn').onclick=exportPptx;
  document.getElementById('pdfBtn').onclick=()=>window.print();
  document.getElementById('scoutingImportBtn').onclick=()=>document.getElementById('scoutingFile').click();
  document.getElementById('scoutingFile').onchange=importScoutingCsv;
  window.addEventListener('resize',fitPreview);
}
function showView(v){ui.view=v;document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===`${v}View`));document.querySelectorAll('#nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===v));document.getElementById('topTitle').textContent=({dashboard:'Dashboard',squad:'Squad',matches:'Previous Matches',expected:'Expected XI',subs:'Main Subs',report:'Report',scouting:'Scouting'})[v]||v;renderView(v);setTimeout(fitPreview,0)}
function renderAll(){['dashboard','squad','matches','expected','subs','report','scouting'].forEach(renderView)}
function renderView(v){if(v==='dashboard')renderDashboard();if(v==='squad')renderSquad();if(v==='matches')renderMatchEditor();if(v==='expected')renderExpected();if(v==='subs')renderSubs();if(v==='report')renderReport();if(v==='scouting')renderScouting()}
function renderDashboard(){
 const filled=state.matches.filter(m=>m.kind==='MATCH'&&m.positions?.length);const exp=state.matches.find(m=>m.kind==='EXPECTED');const subs=state.matches.find(m=>m.kind==='SUBS');
 const eventCount=state.matches.reduce((a,m)=>a+(m.positions||[]).reduce((b,p)=>b+(p.events||[]).length,0),0);
 document.getElementById('metrics').innerHTML=`<div class="metric-card"><span>Squad</span><strong>${state.players.length}</strong><small>players</small></div><div class="metric-card"><span>Previous matches</span><strong>${filled.length}</strong><small>with lineups</small></div><div class="metric-card"><span>Expected XI</span><strong>${exp?.positions?.length||0}/11</strong><small>assigned</small></div><div class="metric-card"><span>Player events</span><strong>${eventCount}</strong><small>goals / cards / injury</small></div>`;
 document.getElementById('matchesCount').textContent=`${filled.length} saved`;
 document.getElementById('dashboardMatches').innerHTML=filled.length?filled.map(m=>`<div class="match-row"><strong>${escapeHtml(m.roundNumber||'—')}</strong><div class="opp">${escapeHtml(m.opponentName||'Opponent')}<small>${escapeHtml(m.opponentNameEn||'')}</small></div><div class="score">${m.goalsFor||0}–${m.goalsAgainst||0}</div><div class="result-pill ${m.result||'D'}">${RESULT_CN[m.result]||'平'} · ${m.result||'D'}</div></div>`).join(''):`<div class="empty-state">No completed match lineups yet.</div>`;
}
function renderSquad(){document.getElementById('squadGrid').innerHTML=state.players.map(p=>`<button class="player-tile" data-player="${p.id}"><span class="num-chip ${isU21(p)?'u21':''}">${p.squadNumber}</span><div class="photo-wrap">${p.photoAsset?`<img src="${p.photoAsset}" alt="">`:''}</div><div class="meta"><b>${escapeHtml(cleanName(p.name))}</b><small>${escapeHtml(p.nameEn||'')} · ${footDisplayHtml(p.foot)} · ${p.height?`${p.height}cm`:'—'}</small></div></button>`).join('');document.querySelectorAll('#squadGrid [data-player]').forEach(b=>b.onclick=()=>openPlayerModal(b.dataset.player))}
function addMatch(){const m={id:uid('match'),analysisId:state.analysis?.id,kind:'MATCH',roundNumber:'',opponentName:'',opponentNameEn:'',goalsFor:0,goalsAgainst:0,result:'D',isHome:true,formation:'1-4-4-2',sortOrder:Math.max(0,...state.matches.filter(x=>x.kind==='MATCH').map(x=>x.sortOrder||0))+1,positions:[],subGoals:[]};state.matches.push(m);ui.matchId=m.id;saveState();renderAll();showView('matches');toast('Match added')}
function renderMatchEditor(){const matches=state.matches.filter(m=>m.kind==='MATCH').sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));if(!matches.length){document.getElementById('matchEditorHost').innerHTML='<div class="empty-state">Add a match to start.</div>';return}if(!matches.some(m=>m.id===ui.matchId))ui.matchId=matches[0].id;document.getElementById('matchEditorHost').innerHTML=editorHtml(matchById(ui.matchId),'match',matches);bindEditor(document.getElementById('matchEditorHost'),matchById(ui.matchId),'match')}
function renderExpected(){const m=state.matches.find(x=>x.kind==='EXPECTED');document.getElementById('expectedEditorHost').innerHTML=editorHtml(m,'expected');bindEditor(document.getElementById('expectedEditorHost'),m,'expected')}
function renderSubs(){const m=state.matches.find(x=>x.kind==='SUBS');document.getElementById('subsEditorHost').innerHTML=editorHtml(m,'subs');bindEditor(document.getElementById('subsEditorHost'),m,'subs')}
function editorX(x){return Math.max(0,Math.min(100,x??50))}
function benchGoalPlayerOptions(m,selectedId=''){
 const starters=new Set((m.positions||[]).map(p=>p.playerId));
 return state.players.filter(p=>!starters.has(p.id)||p.id===selectedId);
}
function benchGoalName(sg){const p=sg?.playerId?playerById(sg.playerId):null;return cleanName(p?.name||sg?.playerName||'');}
function benchGoalNumber(sg){const p=sg?.playerId?playerById(sg.playerId):null;return p?.squadNumber??sg?.squadNumber??'';}
function benchGoalEditorChipHtml(sg,index){
 const name=benchGoalName(sg),num=benchGoalNumber(sg),minute=String(sg?.goalMinute||'').replace(/'/g,'').trim();
 return `<div class="bench-goal-chip" data-subgoal-chip="${index}" style="left:${Math.max(3,Math.min(97,Number(sg?.posX??50)))}%;top:${Math.max(3,Math.min(97,Number(sg?.posY??15)))}%" title="Drag to position this bench scorer">
   <div class="bench-mini-card"><span class="bench-num">${escapeHtml(num||'?')}</span><span class="bench-name">${escapeHtml(name||'Select player')}</span></div>
   <img class="bench-ball" src="${EVENT_META.GOAL_FOR.icon}" alt="">
   ${minute?`<span class="bench-minute">( ${escapeHtml(minute)}' )</span>`:''}
 </div>`;
}
function reportSubGoalHtml(sg){
 const name=benchGoalName(sg),num=benchGoalNumber(sg),minute=String(sg?.goalMinute||'').replace(/'/g,'').trim();
 if(!name&&!num)return'';
 const x=Math.max(3,Math.min(97,Number(sg?.posX??50))),y=Math.max(3,Math.min(97,Number(sg?.posY??15)));
 const small=name.length>9?' small':'';
 return `<div class="report-subgoal" style="left:${x}%;top:${y}%">
   <div class="report-subgoal-card"><span class="num">${escapeHtml(num||'?')}</span><span class="name${small}">${escapeHtml(name||'—')}</span></div>
   <img src="${EVENT_META.GOAL_FOR.icon}" alt="">
   ${minute?`<span class="minute">( ${escapeHtml(minute)}' )</span>`:''}
 </div>`;
}
function rowMap(template){const rows=[...new Set(template.map(x=>x.y))].sort((a,b)=>a-b);const map=new Map();if(!rows.length)return map;const gk=rows.at(-1),other=rows.slice(0,-1);const top=(55/560)+.08175,bottom=(410/560)-.08175,gkOut=Math.min((540/560)-.08175-.006,(410/560)+.025+.08175);if(other.length===1)map.set(other[0],(top+bottom)/2*100);else other.forEach((r,i)=>map.set(r,(top+i/(other.length-1)*(bottom-top))*100));map.set(gk,gkOut*100);return map}
function editorHtml(m,mode,matches=[]){
 const template=matchTemplate(m),rm=rowMap(template);
 const selector=mode==='match'?`<div><label>Match</label><select id="matchSelect">${matches.map(x=>`<option value="${x.id}" ${x.id===m.id?'selected':''}>${escapeHtml(x.roundNumber||'New')} · ${escapeHtml(x.opponentName||'Opponent')}</option>`).join('')}</select></div>`:'';
 const matchFields=mode==='match'?`<div class="form-row three"><div><label>Round</label><input class="input" data-field="roundNumber" value="${escapeHtml(m.roundNumber||'')}"></div><div><label>Opponent (Chinese)</label><input class="input" data-field="opponentName" value="${escapeHtml(m.opponentName||'')}"></div><div><label>Opponent (EN)</label><input class="input" data-field="opponentNameEn" value="${escapeHtml(m.opponentNameEn||'')}"></div></div><div class="form-row three"><div><label>Goals For</label><input class="input" type="number" min="0" data-field="goalsFor" value="${m.goalsFor||0}"></div><div><label>Goals Against</label><input class="input" type="number" min="0" data-field="goalsAgainst" value="${m.goalsAgainst||0}"></div><div><label>Result</label><select data-field="result"><option value="W" ${m.result==='W'?'selected':''}>Win · 胜</option><option value="D" ${m.result==='D'?'selected':''}>Draw · 平</option><option value="L" ${m.result==='L'?'selected':''}>Loss · 负</option></select></div></div><label class="venue-check"><input type="checkbox" data-field="isHome" ${m.isHome!==false?'checked':''}><span><b>Home match</b><small>Checked = Home · unchecked = Away. Summary score is always Home–Away.</small></span></label>`:'';
 const formation=mode==='subs'?`<div><label>Layout</label><input class="input" value="4 × 4 + GK" disabled></div>`:`<div><label>Formation</label><select data-field="formation">${Object.keys(FORMATIONS).map(f=>`<option ${f===m.formation?'selected':''}>${f}</option>`).join('')}</select></div>`;
 const slots=template.map((s,i)=>{const p=(m.positions||[]).find(x=>x.positionIndex===i);return `<div class="editor-slot" data-slot="${i}" style="left:${editorX(s.x)}%;top:${rm.get(s.y)??50}%">${p?miniPlayerHtml(p):`<button class="empty-slot" title="${s.label}">+</button>`}</div>`}).join('');
 const subGoalChips=mode==='match'?(m.subGoals||[]).map((sg,i)=>benchGoalEditorChipHtml(sg,i)).join(''):'';
 const subGoalControls=mode==='match'?`<div class="bench-goals-panel"><div class="bench-goals-head"><div><b>Bench goal scorers</b><small>Substitute who scored after coming on</small></div><button class="btn small" data-add-subgoal>+ Add scorer</button></div>${(m.subGoals||[]).length?`<div class="bench-goal-rows">${(m.subGoals||[]).map((sg,i)=>`<div class="bench-goal-row"><select data-subgoal-player="${i}"><option value="">Choose player</option>${benchGoalPlayerOptions(m,sg.playerId).map(p=>`<option value="${p.id}" ${p.id===sg.playerId?'selected':''}>#${p.squadNumber} · ${escapeHtml(cleanName(p.name))}</option>`).join('')}</select><input class="input" data-subgoal-minute="${i}" value="${escapeHtml(String(sg.goalMinute||''))}" placeholder="Minute"><button class="btn danger small" data-remove-subgoal="${i}">Remove</button></div>`).join('')}</div>`:'<p class="muted bench-empty">No bench scorers added.</p>'}<p class="muted bench-help">On the report only the number + name cells, ball and goal minute are shown. Drag the small scorer card on the pitch to place it exactly where you want.</p></div>`:'';
 return `<div class="editor-layout"><div class="pitch-editor"><div class="pitch-stage"><img class="field-img" src="assets/field_exact_4x.jpg">${subGoalChips}${slots}</div></div><div class="panel editor-controls">${selector}${matchFields}${formation}<div class="legend">${Object.values(EVENT_META).map(e=>`<span class="legend-chip"><img src="${e.icon}">${e.label}</span>`).join('')}</div>${subGoalControls}<button class="btn primary" data-save>Save changes</button>${mode==='match'?'<button class="btn danger" data-delete>Delete match</button>':''}<p class="muted" style="font-size:11px;line-height:1.45">Tap an empty slot to assign a player. Tap an occupied player to edit goals, cards, injury, transfers or player details.</p></div></div>`
}
function miniPlayerHtml(pos){const p=playerById(pos.playerId);if(!p)return '<button class="empty-slot">+</button>';return `<button class="mini-player" data-occupied title="Edit ${escapeHtml(cleanName(p.name))}">${eventStacks(pos,'mini')}${p.photoAsset?`<img src="${p.photoAsset}" alt="">`:''}<div class="mini-card"><div class="r"><span class="num ${isU21(p)?'u21':''}">${p.squadNumber}</span><span class="nm">${escapeHtml(cleanName(p.name))}</span></div><div class="r"><span class="foot">${footDisplayHtml(p.foot)}</span><span class="ht">${p.height?`${p.height}cm`:'—'}</span></div></div></button>`}
function eventStacks(pos,kind='mini'){
 const isGk=pos?.positionLabel==='GK';
 const left=[EVENT_TYPES.NEW_SIGNING,EVENT_TYPES.LEFT_CLUB,EVENT_TYPES.INJURY,EVENT_TYPES.YELLOW_CARD,EVENT_TYPES.YELLOW_ACCUM_4,EVENT_TYPES.RED_CARD].filter(t=>hasEvent(pos,t)).map(t=>`<img src="${EVENT_META[t].icon}" alt="">`).join('');
 const gf=eventsFor(pos,EVENT_TYPES.GOAL_FOR),ga=eventsFor(pos,EVENT_TYPES.GOAL_AGAINST);
 const goalRows=[...gf.map(e=>`<span class="goal-line for"><img src="${EVENT_META.GOAL_FOR.icon}">${minuteLabel(e)}</span>`),...ga.map(e=>`<span class="goal-line against"><img src="${EVENT_META.GOAL_AGAINST.icon}">${minuteLabel(e)}</span>`)].join('');
 return `${left?`<div class="event-stack ${isGk?'gk':''}">${left}</div>`:''}${goalRows?`<div class="goal-stack ${isGk?'gk':''}">${goalRows}</div>`:''}`
}
function bindEditor(host,m,mode){
 host.querySelectorAll('[data-slot]').forEach(el=>el.onclick=e=>{e.stopPropagation();openSlotModal(m.id,Number(el.dataset.slot),mode)});
 host.querySelectorAll('[data-field]').forEach(el=>el.onchange=()=>{let val=el.type==='checkbox'?el.checked:el.value;if(el.type==='number')val=Number(val);m[el.dataset.field]=val;if(el.dataset.field==='formation'){const tpl=matchTemplate(m);m.positions=(m.positions||[]).filter(p=>p.positionIndex<tpl.length).map(p=>({...p,positionLabel:tpl[p.positionIndex]?.label||p.positionLabel}))}saveState();renderView(mode==='expected'?'expected':mode==='subs'?'subs':'matches')});
 const sel=host.querySelector('#matchSelect');if(sel)sel.onchange=()=>{ui.matchId=sel.value;renderMatchEditor()};
 if(mode==='match'){
   const add=host.querySelector('[data-add-subgoal]');if(add)add.onclick=()=>{m.subGoals=m.subGoals||[];m.subGoals.push({id:uid('subgoal'),playerId:'',squadNumber:0,playerName:'',goalMinute:'',posX:50,posY:18});saveState();renderMatchEditor();toast('Bench scorer added')};
   host.querySelectorAll('[data-subgoal-player]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.subgoalPlayer),sg=m.subGoals?.[i];if(!sg)return;const p=playerById(el.value);sg.playerId=p?.id||'';sg.squadNumber=p?.squadNumber||0;sg.playerName=cleanName(p?.name||'');saveState();renderMatchEditor()});
   host.querySelectorAll('[data-subgoal-minute]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.subgoalMinute),sg=m.subGoals?.[i];if(!sg)return;sg.goalMinute=String(el.value||'').replace(/'/g,'').trim();saveState();renderMatchEditor()});
   host.querySelectorAll('[data-remove-subgoal]').forEach(el=>el.onclick=()=>{const i=Number(el.dataset.removeSubgoal);m.subGoals=(m.subGoals||[]).filter((_,j)=>j!==i);saveState();renderMatchEditor();toast('Bench scorer removed')});
   const stage=host.querySelector('.pitch-stage');
   host.querySelectorAll('[data-subgoal-chip]').forEach(chip=>chip.onpointerdown=e=>{e.preventDefault();e.stopPropagation();const i=Number(chip.dataset.subgoalChip),sg=m.subGoals?.[i];if(!sg||!stage)return;chip.setPointerCapture?.(e.pointerId);const move=ev=>{const r=stage.getBoundingClientRect();let x=(ev.clientX-r.left)/r.width*100,y=(ev.clientY-r.top)/r.height*100;x=Math.max(3,Math.min(97,x));y=Math.max(3,Math.min(97,y));sg.posX=Number(x.toFixed(2));sg.posY=Number(y.toFixed(2));chip.style.left=`${sg.posX}%`;chip.style.top=`${sg.posY}%`};const done=()=>{chip.removeEventListener('pointermove',move);saveState();toast('Bench scorer position saved')};chip.addEventListener('pointermove',move);chip.addEventListener('pointerup',done,{once:true});chip.addEventListener('pointercancel',done,{once:true})});
 }
 const save=host.querySelector('[data-save]');if(save)save.onclick=()=>{saveState();renderAll();toast('Saved')};
 const del=host.querySelector('[data-delete]');if(del)del.onclick=()=>{if(confirm('Delete this match?')){state.matches=state.matches.filter(x=>x.id!==m.id);ui.matchId=state.matches.find(x=>x.kind==='MATCH')?.id||null;saveState();renderAll();toast('Match deleted')}}
}
function openSlotModal(matchId,index,mode){const m=matchById(matchId),tpl=matchTemplate(m),pos=(m.positions||[]).find(x=>x.positionIndex===index),currentPlayer=pos?playerById(pos.playerId):null;const selected=currentPlayer?.id||'';const goalFor=pos?eventsFor(pos,EVENT_TYPES.GOAL_FOR).map(x=>x.minute).join(', '):'';const goalAgainst=pos?eventsFor(pos,EVENT_TYPES.GOAL_AGAINST).map(x=>x.minute).join(', '):'';
 const modal=document.getElementById('modal');modal.innerHTML=`<h3>${pos?'Edit player':'Assign player'} · ${tpl[index]?.label||''}</h3><p>Select a squad member and apply the report events. Icons are the approved MD14 v0.9 set.</p><div class="picker-grid">${state.players.map(p=>`<button class="picker-item ${p.id===selected?'selected':''}" data-pick="${p.id}">${p.photoAsset?`<img src="${p.photoAsset}" alt="">`:''}<b>#${p.squadNumber} ${escapeHtml(cleanName(p.name))}</b><small>${footDisplayHtml(p.foot)} · ${p.height?`${p.height}cm`:'—'}</small></button>`).join('')}</div><div style="margin-top:14px" class="event-editor"><div class="event-row"><div class="head"><img src="${EVENT_META.GOAL_FOR.icon}"><b>Goal</b></div><input class="input minute" id="evGF" value="${escapeHtml(goalFor)}" placeholder="78, 90+2"></div><div class="event-row"><div class="head"><img src="${EVENT_META.GOAL_AGAINST.icon}"><b>Goal Against</b></div><input class="input minute" id="evGA" value="${escapeHtml(goalAgainst)}" placeholder="66"></div>${[EVENT_TYPES.YELLOW_CARD,EVENT_TYPES.YELLOW_ACCUM_4,EVENT_TYPES.RED_CARD,EVENT_TYPES.INJURY,EVENT_TYPES.LEFT_CLUB,EVENT_TYPES.NEW_SIGNING].map(t=>`<label class="event-row" style="display:block"><div class="head"><img src="${EVENT_META[t].icon}"><b>${EVENT_META[t].label}</b><input type="checkbox" data-toggle="${t}" ${pos&&hasEvent(pos,t)?'checked':''}></div></label>`).join('')}</div><div class="modal-actions">${pos?'<button class="btn danger" id="removeSlot">Remove</button>':''}<button class="btn" id="cancelModal">Cancel</button><button class="btn primary" id="saveSlot">Save</button></div>`;
 let picked=selected;modal.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{picked=b.dataset.pick;modal.querySelectorAll('[data-pick]').forEach(x=>x.classList.toggle('selected',x===b))});
 openModal();document.getElementById('cancelModal').onclick=closeModal;if(pos)document.getElementById('removeSlot').onclick=()=>{m.positions=m.positions.filter(x=>x.positionIndex!==index);saveState();closeModal();renderAll();renderView(mode==='expected'?'expected':mode==='subs'?'subs':'matches')};
 document.getElementById('saveSlot').onclick=()=>{if(!picked){toast('Select a player');return}m.positions=m.positions.filter(x=>x.positionIndex!==index&&x.playerId!==picked);const events=[];parseMinutes(document.getElementById('evGF').value).forEach((minute,i)=>events.push({id:uid('ev'),matchId:m.id,playerId:picked,eventType:EVENT_TYPES.GOAL_FOR,minute,sortOrder:i}));parseMinutes(document.getElementById('evGA').value).forEach((minute,i)=>events.push({id:uid('ev'),matchId:m.id,playerId:picked,eventType:EVENT_TYPES.GOAL_AGAINST,minute,sortOrder:i}));modal.querySelectorAll('[data-toggle]').forEach(ch=>{if(ch.checked)events.push({id:uid('ev'),matchId:m.id,playerId:picked,eventType:ch.dataset.toggle,minute:null,sortOrder:0})});m.positions.push({id:pos?.id||uid('pos'),matchId:m.id,playerId:picked,positionIndex:index,positionLabel:tpl[index]?.label||'',events});m.positions.sort((a,b)=>a.positionIndex-b.positionIndex);saveState();closeModal();renderAll();renderView(mode==='expected'?'expected':mode==='subs'?'subs':'matches');toast('Player saved')}
}
function parseMinutes(s){return String(s||'').split(',').map(x=>x.trim().replace(/'/g,'')).filter(Boolean)}
function openPlayerModal(id){const p=id?playerById(id):{id:uid('p'),squadNumber:'',name:'',nameEn:'',foot:'R',height:'',isU21:false,photoAsset:null};const isNew=!id;const modal=document.getElementById('modal');modal.innerHTML=`<h3>${isNew?'Add player':`#${p.squadNumber} ${escapeHtml(cleanName(p.name))}`}</h3><p>Player identity used in lineup cards and exported reports.</p><div class="form-row"><div><label>Squad number</label><input class="input" id="pNum" type="number" value="${p.squadNumber??''}"></div><div><label>Foot</label><select id="pFoot"><option value="R" ${p.foot==='R'?'selected':''}>R</option><option value="L" ${p.foot==='L'?'selected':''}>L</option><option value="BOTH" ${p.foot==='BOTH'?'selected':''}>L R</option></select></div></div><div style="margin-top:8px"><label>Name shown on report</label><input class="input" id="pName" value="${escapeHtml(cleanName(p.name))}"></div><div style="margin-top:8px"><label>English / pinyin name</label><input class="input" id="pNameEn" value="${escapeHtml(p.nameEn||'')}"></div><div class="form-row" style="margin-top:8px"><div><label>Height (cm)</label><input class="input" id="pHeight" type="number" value="${p.height??''}"></div><div><label>U21</label><select id="pU21"><option value="false" ${!isU21(p)?'selected':''}>No</option><option value="true" ${isU21(p)?'selected':''}>Yes</option></select></div></div><div style="margin-top:8px"><label>Player photo (optional)</label><input class="input" id="pPhoto" type="file" accept="image/*"></div><div class="modal-actions">${!isNew?'<button class="btn danger" id="deletePlayer">Delete</button>':''}<button class="btn" id="cancelModal">Cancel</button><button class="btn primary" id="savePlayer">Save</button></div>`;openModal();document.getElementById('cancelModal').onclick=closeModal;if(!isNew)document.getElementById('deletePlayer').onclick=()=>{if(confirm('Delete this player and remove them from lineups?')){state.players=state.players.filter(x=>x.id!==p.id);state.matches.forEach(m=>m.positions=(m.positions||[]).filter(x=>x.playerId!==p.id));saveState();closeModal();renderAll();toast('Player deleted')}};document.getElementById('savePlayer').onclick=async()=>{p.squadNumber=Number(document.getElementById('pNum').value)||0;p.name=document.getElementById('pName').value.trim();p.nameEn=document.getElementById('pNameEn').value.trim();p.foot=document.getElementById('pFoot').value;p.height=Number(document.getElementById('pHeight').value)||null;p.isU21=document.getElementById('pU21').value==='true';const photo=document.getElementById('pPhoto').files?.[0];if(photo)p.photoAsset=await fileToDataUri(photo);if(isNew)state.players.push(p);state.players.sort((a,b)=>(a.squadNumber||0)-(b.squadNumber||0));saveState();closeModal();renderAll();toast('Player saved')}}
function openModal(){document.getElementById('modalBackdrop').classList.remove('hidden')}
function closeModal(){document.getElementById('modalBackdrop').classList.add('hidden')}

const summaryImageCache=new Map();
function canvasImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error(`Could not load image: ${src}`));im.src=src})}
function canvasText(ctx,text,x,y,size,color='#000',bold=true,align='center'){ctx.save();ctx.fillStyle=color;ctx.font=`${bold?'700':'500'} ${size}px "PingFang SC","Hiragino Sans GB",Arial,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(text??''),x,y);ctx.restore()}
async function drawCanvasEventIcon(ctx,src,x,y,w,h){try{const im=await canvasImage(src);ctx.drawImage(im,x,y,w,h)}catch(e){console.warn(e)}}
async function drawSnapshotPlayer(ctx,pos,slot){
 const p=playerById(pos.playerId);if(!p)return;const g=reportPlayerGeom(slot),cx=g.left,cy=g.top+76.119;
 if(p.photoAsset){try{const im=await canvasImage(p.photoAsset);ctx.drawImage(im,g.left+22.438,g.top,75,75)}catch(e){console.warn(e)}}
 ctx.fillStyle='#000';ctx.fillRect(cx,cy,30.537,20);ctx.fillStyle='#fff';ctx.fillRect(cx+30.537,cy,89.338,20);ctx.fillRect(cx,cy+20,30.537,16.5);ctx.fillRect(cx+30.537,cy+20,89.338,16.5);
 ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(cx-1,cy-1,121.875,38.5);ctx.beginPath();ctx.moveTo(cx+30.537,cy-1);ctx.lineTo(cx+30.537,cy+37.5);ctx.moveTo(cx-1,cy+20);ctx.lineTo(cx+120.875,cy+20);ctx.stroke();
 canvasText(ctx,p.squadNumber,cx+15.2685,cy+10,15,isU21(p)?'#00cfe8':'#fff',true);const nm=cleanName(p.name);canvasText(ctx,nm,cx+75.206,cy+10,nm.length>9?11:15,'#000',true);
 const fv=String(p.foot||'R').toUpperCase();if(fv==='BOTH'){canvasText(ctx,'L',cx+11,cy+28.25,12,'#ff1900',true);canvasText(ctx,'R',cx+20,cy+28.25,12,'#000',true)}else canvasText(ctx,fv,cx+15.2685,cy+28.25,12,fv==='L'?'#ff1900':'#000',true);
 canvasText(ctx,p.height?`${p.height}cm`:'',cx+75.206,cy+28.25,12,'#000',true);
 let evY=g.top+5;for(const type of [EVENT_TYPES.NEW_SIGNING,EVENT_TYPES.LEFT_CLUB,EVENT_TYPES.INJURY,EVENT_TYPES.YELLOW_CARD,EVENT_TYPES.YELLOW_ACCUM_4,EVENT_TYPES.RED_CARD])if(hasEvent(pos,type)){await drawCanvasEventIcon(ctx,EVENT_META[type].icon,g.left-17,evY,20,20);evY+=22}
 const gf=eventsFor(pos,EVENT_TYPES.GOAL_FOR),ga=eventsFor(pos,EVENT_TYPES.GOAL_AGAINST),isGk=slot.label==='GK';let gy=g.top+(isGk?48:8),gx=g.left+101,tx=g.left+118;
 for(const item of [...gf.map(e=>({e,type:EVENT_TYPES.GOAL_FOR,color:'#0433ff'})),...ga.map(e=>({e,type:EVENT_TYPES.GOAL_AGAINST,color:'#ff1900'}))]){await drawCanvasEventIcon(ctx,EVENT_META[item.type].icon,gx,gy,15,15);canvasText(ctx,minuteLabel(item.e),tx,gy+7.5,9,item.color,true,'left');gy+=16}
}
async function drawSnapshotSubGoal(ctx,sg){
 const name=benchGoalName(sg),num=benchGoalNumber(sg),minute=String(sg?.goalMinute||'').replace(/'/g,'').trim();if(!name&&!num)return;
 const cardW=119.875,cardH=20,ballW=15,gap1=4,gap2=3;const anchorX=Math.max(3,Math.min(97,Number(sg?.posX??50)))/100*540,anchorY=Math.max(3,Math.min(97,Number(sg?.posY??15)))/100*720;const left=anchorX-(cardW+gap1+ballW+gap2+42)/2,top=anchorY-cardH/2;
 ctx.fillStyle='#000';ctx.fillRect(left,top,30.537,cardH);ctx.fillStyle='#fff';ctx.fillRect(left+30.537,top,89.338,cardH);ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(left-1,top-1,121.875,cardH+2);ctx.beginPath();ctx.moveTo(left+30.537,top-1);ctx.lineTo(left+30.537,top+cardH+1);ctx.stroke();
 canvasText(ctx,num||'?',left+15.2685,top+10,15,'#fff',true);canvasText(ctx,name,left+75.206,top+10,name.length>9?11:15,'#000',true);const bx=left+cardW+gap1;await drawCanvasEventIcon(ctx,EVENT_META.GOAL_FOR.icon,bx,top+2.5,ballW,ballW);if(minute)canvasText(ctx,`( ${minute}' )`,bx+ballW+gap2,top+10,9,'#0433ff',true,'left');
}
async function renderLineupSnapshotPng(m){
 const key=`${activeReport()?.id||'r'}_${m?.id||'m'}_${activeReport()?.updatedAt||''}_${(m?.positions||[]).length}_${(m?.subGoals||[]).length}`;if(summaryImageCache.has(key))return summaryImageCache.get(key);
 const canvas=document.createElement('canvas');canvas.width=2160;canvas.height=2880;const ctx=canvas.getContext('2d');ctx.scale(4,4);const field=await canvasImage('assets/field_exact_4x.jpg');ctx.drawImage(field,0,0,540,720);
 const tpl=matchTemplate(m);for(const pos of (m.positions||[])){const slot=tpl[pos.positionIndex];if(slot)await drawSnapshotPlayer(ctx,pos,slot)}if(m.kind==='MATCH')for(const sg of (m.subGoals||[]))await drawSnapshotSubGoal(ctx,sg);
 const data=canvas.toDataURL('image/png');summaryImageCache.set(key,data);return data;
}
function summaryMatches(){return filledPreviousMatches().slice(-3)}
function summaryResultColor(code){return code==='W'?'#ff3b30':code==='L'?'#30b64a':'#d58b00'}
async function renderSummarySlideCanvas(pageIndex){
 const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;const ctx=canvas.getContext('2d');const grad=ctx.createLinearGradient(0,0,0,1080);grad.addColorStop(0,'rgb(115,191,249)');grad.addColorStop(1,'rgb(51,116,182)');ctx.fillStyle=grad;ctx.fillRect(0,0,1920,1080);
 if(pageIndex===0){
   canvasText(ctx,'最近3场首发名单',960,63,42,'#000',true);const ms=summaryMatches(),colW=632,gap=8,startX=4,headerY=126,headerH=52,imgY=190,imgH=846;
   for(let i=0;i<3;i++){const x=startX+i*(colW+gap),m=ms[i];if(!m)continue;const widths=[115,194,170,153];let xx=x;for(const ww of widths){ctx.fillStyle='#fff';ctx.fillRect(xx,headerY,ww,headerH);ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(xx,headerY,ww,headerH);xx+=ww}
     const result=matchResultCode(m);canvasText(ctx,m.roundNumber||'',x+57.5,headerY+26,25,'#111',true);canvasText(ctx,m.opponentName||'',x+212,headerY+16,14,'#111',true);canvasText(ctx,String(m.opponentNameEn||'').toUpperCase(),x+212,headerY+37,14,'#111',true);canvasText(ctx,homeAwayScore(m),x+394,headerY+26,25,'#111',true);canvasText(ctx,`${RESULT_CN[result]} (${result})`,x+555.5,headerY+26,22,summaryResultColor(result),true);
     const im=await canvasImage(await renderLineupSnapshotPng(m));ctx.drawImage(im,x,imgY,colW,imgH);ctx.strokeStyle='#153e64';ctx.lineWidth=2;ctx.strokeRect(x,imgY,colW,imgH)}
 }else{
   const exp=state.matches.find(m=>m.kind==='EXPECTED'),subs=state.matches.find(m=>m.kind==='SUBS');canvasText(ctx,state.settings?.reportTitleExpected||'预计首发名单',480,70,34,'#000',true);canvasText(ctx,state.settings?.reportTitleSubs||'主要替补球员',1440,70,34,'#000',true);
   if(exp){const im=await canvasImage(await renderLineupSnapshotPng(exp));ctx.drawImage(im,205,125,720,960)}if(subs){const im=await canvasImage(await renderLineupSnapshotPng(subs));ctx.drawImage(im,995,125,720,960)}
 }
 return canvas.toDataURL('image/png');
}

function reportPages(){const matches=state.matches.filter(m=>m.kind==='MATCH'&&(m.positions?.length||m.roundNumber||m.opponentName)).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)).slice(-3);const e=state.matches.find(m=>m.kind==='EXPECTED'),s=state.matches.find(m=>m.kind==='SUBS');return [...matches,e,s].filter(Boolean)}
function renderFullReport(){const pages=reportPages();if(ui.reportIndex>=pages.length)ui.reportIndex=0;document.getElementById('reportStrip').innerHTML=pages.map((m,i)=>`<button class="report-thumb ${i===ui.reportIndex?'active':''}" data-page="${i}"><div class="tiny"><div style="font-size:5px;color:#000;padding:4px">${m.kind==='EXPECTED'?'预计首发名单':m.kind==='SUBS'?'主要替补球员':escapeHtml(m.roundNumber||'Match')}</div></div><span>${m.kind==='MATCH'?escapeHtml(m.roundNumber||'Match'):m.kind==='EXPECTED'?'Expected XI':'Main Subs'}</span></button>`).join('');document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{ui.reportIndex=Number(b.dataset.page);renderReport()});document.getElementById('reportPreview').innerHTML=pages.length?reportPageHtml(pages[ui.reportIndex]):'<div class="empty-state">No report pages yet.</div>';const pp=document.getElementById('printPages');if(pp)pp.innerHTML=pages.map(reportPageHtml).join('');fitPreview()}
function reportPageHtml(m){const tpl=matchTemplate(m);let title='';if(m.kind==='EXPECTED')title=state.settings?.reportTitleExpected||'预计首发名单';else if(m.kind==='SUBS')title=state.settings?.reportTitleSubs||'主要替补球员';else title=`${m.roundNumber||''}_ VS ${m.opponentName||''} _ ${m.goalsFor||0}-${m.goalsAgainst||0} (${RESULT_CN[m.result]||'平'})`;
 const players=(m.positions||[]).map(pos=>{const slot=tpl[pos.positionIndex];if(!slot)return'';return reportPlayerHtml(pos,slot)}).join('');const subGoals=m.kind==='MATCH'?(m.subGoals||[]).map(reportSubGoalHtml).join(''):'';return `<div class="report-page"><img class="field-img" src="assets/field_exact_4x.jpg"><div class="report-title">${escapeHtml(title)}</div>${subGoals}${players}</div>`}
function reportXY(slot){return{xPct:Math.max(0,Math.min(100,slot.x??50)),yPct:15.1+.885*(slot.y??50)}}
function reportPlayerHtml(pos,slot){const p=playerById(pos.playerId);if(!p)return'';const xy=reportXY(slot);const anchorX=xy.xPct/100*540,anchorY=xy.yPct/100*720;const left=anchorX-59.9375,top=anchorY-94.369;const nm=cleanName(p.name),small=nm.length>9;const isGk=slot.label==='GK';const leftEvents=[EVENT_TYPES.NEW_SIGNING,EVENT_TYPES.LEFT_CLUB,EVENT_TYPES.INJURY,EVENT_TYPES.YELLOW_CARD,EVENT_TYPES.YELLOW_ACCUM_4,EVENT_TYPES.RED_CARD].filter(t=>hasEvent(pos,t)).map(t=>`<img src="${EVENT_META[t].icon}">`).join('');const gf=eventsFor(pos,EVENT_TYPES.GOAL_FOR),ga=eventsFor(pos,EVENT_TYPES.GOAL_AGAINST);const goalRows=[...gf.map(e=>`<span class="report-goal for"><img src="${EVENT_META.GOAL_FOR.icon}">${minuteLabel(e)}</span>`),...ga.map(e=>`<span class="report-goal against"><img src="${EVENT_META.GOAL_AGAINST.icon}">${minuteLabel(e)}</span>`)].join('');return `<div class="report-player" style="left:${left}px;top:${top}px">${leftEvents?`<div class="report-events ${isGk?'gk':''}">${leftEvents}</div>`:''}${goalRows?`<div class="report-goals ${isGk?'gk':''}">${goalRows}</div>`:''}${p.photoAsset?`<img class="head" src="${p.photoAsset}">`:''}<div class="report-card"><div class="fill-num"></div><div class="fill-name"></div><div class="fill-foot"></div><div class="fill-height"></div><div class="outer"></div><div class="vline"></div><div class="hline"></div><span class="txt txt-num ${isU21(p)?'u21':''}">${p.squadNumber}</span><span class="txt txt-name ${small?'small':''}">${escapeHtml(nm)}</span><span class="txt txt-foot">${footDisplayHtml(p.foot)}</span><span class="txt txt-height">${p.height?`${p.height}cm`:'—'}</span></div></div>`}
async function renderSummaryReport(){
 document.body.dataset.reportMode='SUMMARY';const strip=document.getElementById('reportStrip'),preview=document.getElementById('reportPreview'),pp=document.getElementById('printPages');
 strip.innerHTML=[0,1].map(i=>`<button class="report-thumb summary-thumb ${i===ui.reportIndex?'active':''}" data-summary-page="${i}"><div class="tiny summary-tiny"><span>${i===0?'3 Matches':'XI + Subs'}</span></div><span>Slide ${i+1}</span></button>`).join('');strip.querySelectorAll('[data-summary-page]').forEach(b=>b.onclick=()=>{ui.reportIndex=Number(b.dataset.summaryPage);renderSummaryReport()});
 preview.innerHTML='<div class="summary-loading">Rendering Summary Report…</div>';
 try{const data=await renderSummarySlideCanvas(ui.reportIndex);preview.innerHTML=`<img class="summary-report-page" src="${data}" alt="Summary slide ${ui.reportIndex+1}">`;if(pp){const both=await Promise.all([renderSummarySlideCanvas(0),renderSummarySlideCanvas(1)]);pp.innerHTML=both.map((src,i)=>`<div class="summary-print-slide"><img src="${src}" alt="Summary ${i+1}"></div>`).join('')}}catch(e){console.error(e);preview.innerHTML=`<div class="empty-state">Summary preview error: ${escapeHtml(e.message||e)}</div>`}fitPreview();
}
function renderReport(){const sel=document.getElementById('reportModeSelect');if(sel)sel.value=ui.reportMode||'FULL';document.body.dataset.reportMode=ui.reportMode||'FULL';return ui.reportMode==='SUMMARY'?renderSummaryReport():renderFullReport()}
function fitPreview(){const canvas=document.querySelector('.report-canvas'),summary=document.querySelector('.summary-report-page'),page=document.querySelector('.report-page');if(canvas&&summary){const scale=Math.min(1,(canvas.clientWidth-18)/1024);summary.style.transform=`scale(${scale})`;summary.parentElement.style.height=`${576*scale}px`;summary.parentElement.style.width=`${1024*scale}px`;return}if(canvas&&page&&window.innerWidth<720){const scale=Math.min(1,(canvas.clientWidth-12)/540);page.style.transform=`scale(${scale})`;page.parentElement.style.height=`${720*scale}px`;page.parentElement.style.width=`${540*scale}px`}else if(page){page.style.transform='';if(page.parentElement){page.parentElement.style.height='';page.parentElement.style.width=''}}}

async function urlToDataUri(url){if(!url)throw new Error('Missing image source');if(String(url).startsWith('data:'))return url;if(imageDataCache.has(url))return imageDataCache.get(url);const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`Image load failed (${r.status}): ${url}`);const b=await r.blob();const data=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=()=>rej(fr.error||new Error('Image conversion failed'));fr.readAsDataURL(b)});imageDataCache.set(url,data);return data}
function pt(v){return v/72}

function pptxObjectKey(v){return String(v??'obj').replace(/[^A-Za-z0-9_-]+/g,'_').slice(0,80)}
const PPTX_NS_P='http://schemas.openxmlformats.org/presentationml/2006/main';
const PPTX_NS_A='http://schemas.openxmlformats.org/drawingml/2006/main';
function pptxDirectChild(el,ns,local){for(const c of Array.from(el.children||[]))if(c.namespaceURI===ns&&c.localName===local)return c;return null}
function pptxObjectName(el){
 const nvs=['nvSpPr','nvPicPr','nvGrpSpPr','nvGraphicFramePr','nvCxnSpPr'];
 for(const nvName of nvs){const nv=pptxDirectChild(el,PPTX_NS_P,nvName);if(!nv)continue;const pr=pptxDirectChild(nv,PPTX_NS_P,'cNvPr');if(pr)return pr.getAttribute('name')||''}
 return '';
}
function pptxElementBounds(el){
 let xf=null;
 if(el.localName==='grpSp'){const gp=pptxDirectChild(el,PPTX_NS_P,'grpSpPr');xf=gp?pptxDirectChild(gp,PPTX_NS_A,'xfrm'):null}
 else if(el.localName==='graphicFrame')xf=pptxDirectChild(el,PPTX_NS_P,'xfrm');
 else {const spPr=pptxDirectChild(el,PPTX_NS_P,'spPr');xf=spPr?pptxDirectChild(spPr,PPTX_NS_A,'xfrm'):null}
 if(!xf)return null;
 const off=pptxDirectChild(xf,PPTX_NS_A,'off'),ext=pptxDirectChild(xf,PPTX_NS_A,'ext');
 if(!off||!ext)return null;
 return {x:Number(off.getAttribute('x')||0),y:Number(off.getAttribute('y')||0),cx:Number(ext.getAttribute('cx')||0),cy:Number(ext.getAttribute('cy')||0)};
}
function pptxMakeEl(doc,ns,name,attrs={}){
 const el=doc.createElementNS(ns,name);
 for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
 return el;
}
function pptxGroupDirectElements(doc,spTree,elements,groupName,idRef){
 if(!elements?.length)return null;
 const ordered=elements.slice().sort((a,b)=>Array.from(spTree.children).indexOf(a)-Array.from(spTree.children).indexOf(b));
 const boxes=ordered.map(pptxElementBounds).filter(Boolean);
 if(!boxes.length)return null;
 const minX=Math.min(...boxes.map(b=>b.x)),minY=Math.min(...boxes.map(b=>b.y));
 const maxX=Math.max(...boxes.map(b=>b.x+b.cx)),maxY=Math.max(...boxes.map(b=>b.y+b.cy));
 const cx=Math.max(1,maxX-minX),cy=Math.max(1,maxY-minY);
 const grp=pptxMakeEl(doc,PPTX_NS_P,'p:grpSp');
 const nv=pptxMakeEl(doc,PPTX_NS_P,'p:nvGrpSpPr');
 nv.appendChild(pptxMakeEl(doc,PPTX_NS_P,'p:cNvPr',{id:idRef.value++,name:groupName}));
 nv.appendChild(pptxMakeEl(doc,PPTX_NS_P,'p:cNvGrpSpPr'));
 nv.appendChild(pptxMakeEl(doc,PPTX_NS_P,'p:nvPr'));
 grp.appendChild(nv);
 const grpPr=pptxMakeEl(doc,PPTX_NS_P,'p:grpSpPr');
 const xfrm=pptxMakeEl(doc,PPTX_NS_A,'a:xfrm');
 xfrm.appendChild(pptxMakeEl(doc,PPTX_NS_A,'a:off',{x:minX,y:minY}));
 xfrm.appendChild(pptxMakeEl(doc,PPTX_NS_A,'a:ext',{cx,cy}));
 xfrm.appendChild(pptxMakeEl(doc,PPTX_NS_A,'a:chOff',{x:minX,y:minY}));
 xfrm.appendChild(pptxMakeEl(doc,PPTX_NS_A,'a:chExt',{cx,cy}));
 grpPr.appendChild(xfrm);grp.appendChild(grpPr);
 spTree.insertBefore(grp,ordered[0]);
 for(const el of ordered)grp.appendChild(el);
 return grp;
}
function pptxGroupSlideXml(xml){
 const doc=new DOMParser().parseFromString(xml,'application/xml');
 if(doc.getElementsByTagName('parsererror').length)throw new Error('PPTX slide XML could not be parsed for grouping');
 const spTree=doc.getElementsByTagNameNS(PPTX_NS_P,'spTree')[0];
 if(!spTree)return xml;
 let maxId=1;
 for(const n of Array.from(doc.getElementsByTagNameNS(PPTX_NS_P,'cNvPr')))maxId=Math.max(maxId,Number(n.getAttribute('id')||0));
 const idRef={value:maxId+1};
 const directShapes=()=>Array.from(spTree.children).filter(el=>!['nvGrpSpPr','grpSpPr'].includes(el.localName));
 const prefixes=new Set();
 for(const el of directShapes()){
   const name=pptxObjectName(el);
   const m=name.match(/^((?:PLR|SUB)_.+?)__/);
   if(m)prefixes.add(m[1]);
 }
 for(const prefix of prefixes){
   // First create nested Ball + Minute groups for every goal.
   const goalIds=new Set();
   for(const el of directShapes()){
     const name=pptxObjectName(el);
     if(!name.startsWith(prefix+'__GOAL_'))continue;
     const m=name.slice((prefix+'__GOAL_').length).match(/^(\d+)__/);
     if(m)goalIds.add(Number(m[1]));
   }
   for(const goalId of Array.from(goalIds).sort((a,b)=>a-b)){
     const marker=`${prefix}__GOAL_${goalId}__`;
     const items=directShapes().filter(el=>pptxObjectName(el).startsWith(marker));
     pptxGroupDirectElements(doc,spTree,items,`${prefix}__GOAL_${goalId}`,idRef);
   }
   // Then group the whole player: head + card + statuses + nested goal group(s).
   const playerItems=directShapes().filter(el=>pptxObjectName(el).startsWith(prefix+'__'));
   pptxGroupDirectElements(doc,spTree,playerItems,prefix,idRef);
 }
 return new XMLSerializer().serializeToString(doc);
}
async function pptxCreateGroupedBlob(rawBlob){
 const zip=await JSZip.loadAsync(rawBlob);
 const slidePaths=Object.keys(zip.files).filter(p=>/^ppt\/slides\/slide\d+\.xml$/.test(p));
 for(const path of slidePaths){
   const xml=await zip.file(path).async('string');
   zip.file(path,pptxGroupSlideXml(xml));
 }
 return await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
}
function reportPlayerGeom(slot){const xy=reportXY(slot),anchorX=xy.xPct/100*540,anchorY=xy.yPct/100*720;return{left:anchorX-59.9375,top:anchorY-94.369}}
async function exportFullPptx(){
 const btn=document.getElementById('pptxBtn'),status=document.getElementById('exportStatus');
 btn.disabled=true;status.textContent='Building editable PPTX…';
 try{
   if(typeof JSZip==='undefined')throw new Error('JSZip library not loaded');
   if(typeof PptxGenJS==='undefined')throw new Error('PptxGenJS library not loaded');
   const pages=reportPages();
   if(!pages.length)throw new Error('No report pages to export');
   const pptx=new PptxGenJS();
   pptx.defineLayout({name:'LINEUP_7_5x10',width:7.5,height:10});
   pptx.layout='LINEUP_7_5x10';
   pptx.author='Opponent Lineup App';
   pptx.subject='Opponent lineup prediction';
   pptx.company='';
   pptx.lang='zh-CN';
   pptx.theme={headFontFace:'Arial',bodyFontFace:'Arial',lang:'zh-CN'};
   const field=await urlToDataUri('assets/field_exact_4x.jpg');
   for(const m of pages){
     const slide=pptx.addSlide();
     slide.background={color:'FFFFFF'};
     slide.addImage({data:field,x:0,y:0,w:7.5,h:10,objectName:'REPORT_FIELD'});
     await addPptxTitle(pptx,slide,m);
     const tpl=matchTemplate(m);
     for(const pos of (m.positions||[])){
       const slot=tpl[pos.positionIndex],p=playerById(pos.playerId);
       if(slot&&p)await addPptxPlayer(pptx,slide,p,pos,slot);
     }
     if(m.kind==='MATCH')for(const sg of (m.subGoals||[]))await addPptxSubGoal(pptx,slide,sg);
   }
   const filename=fullReportFilename();
   status.textContent='Creating PPTX objects…';
   const rawBlob=await pptx.write({outputType:'blob',compression:true});
   status.textContent='Grouping players for Keynote…';
   const groupedBlob=await pptxCreateGroupedBlob(rawBlob);
   downloadBlob(groupedBlob,filename);
   status.textContent='PPTX exported · players grouped';
   toast('PPTX ready · each player is grouped');
 }catch(err){
   console.error('PPTX EXPORT ERROR',err);
   const msg=String(err?.message||err||'Unknown export error');
   status.textContent=`Export error: ${msg}`;
   toast('PPTX export failed');
 }finally{btn.disabled=false}
}
async function addSummaryHeader(pptx,slide,m,x,y,w,h){
 const ST=pptx.ShapeType,parts=[.183,.307,.268,.242],ws=parts.map(v=>w*v),result=matchResultCode(m),score=homeAwayScore(m);let xx=x;
 for(const ww of ws){slide.addShape(ST.rect,{x:xx,y,w:ww,h,fill:{color:'FFFFFF'},line:{color:'000000',width:1}});xx+=ww}
 slide.addText(m.roundNumber||'',{x,y,w:ws[0],h,fontFace:'Arial',fontSize:12,bold:true,align:'center',valign:'mid',margin:0,fit:'shrink'});
 slide.addText(m.opponentName||'',{x:x+ws[0],y:y+.015,w:ws[1],h:h*.47,fontFace:'PingFang SC',fontSize:6.8,bold:true,align:'center',valign:'mid',margin:0,fit:'shrink'});
 slide.addText(String(m.opponentNameEn||'').toUpperCase(),{x:x+ws[0],y:y+h*.46,w:ws[1],h:h*.49,fontFace:'Arial',fontSize:6.8,bold:true,align:'center',valign:'mid',margin:0,fit:'shrink'});
 slide.addText(score,{x:x+ws[0]+ws[1],y,w:ws[2],h,fontFace:'Arial',fontSize:12,bold:true,align:'center',valign:'mid',margin:0});
 const color=result==='W'?'FF3B30':result==='L'?'30B64A':'D58B00';slide.addText(`${RESULT_CN[result]} (${result})`,{x:x+ws[0]+ws[1]+ws[2],y,w:ws[3],h,fontFace:'Arial',fontSize:11,bold:true,color,align:'center',valign:'mid',margin:0,fit:'shrink'});
}
async function exportSummaryPptx(){
 const btn=document.getElementById('pptxBtn'),status=document.getElementById('exportStatus');btn.disabled=true;status.textContent='Building Summary Report…';
 try{
   if(typeof PptxGenJS==='undefined')throw new Error('PptxGenJS library not loaded');const matches=summaryMatches();if(!matches.length)throw new Error('No previous matches available');
   const pptx=new PptxGenJS();pptx.defineLayout({name:'SUMMARY_16_9',width:13.333,height:7.5});pptx.layout='SUMMARY_16_9';pptx.author='Opponent Lineup App';pptx.lang='zh-CN';pptx.theme={headFontFace:'Arial',bodyFontFace:'Arial',lang:'zh-CN'};const bg=await urlToDataUri('assets/summary_blue_bg.png');
   let slide=pptx.addSlide();slide.addImage({data:bg,x:0,y:0,w:13.333,h:7.5});slide.addText('最近3场首发名单',{x:0,y:.22,w:13.333,h:.38,fontFace:'PingFang SC',fontSize:18,bold:true,color:'000000',align:'center',margin:0});
   const colW=4.38,gap=.055,start=.005,headY=.84,headH=.36,imgY=1.28,imgH=5.87;
   for(let i=0;i<3;i++){const m=matches[i];if(!m)continue;const x=start+i*(colW+gap);await addSummaryHeader(pptx,slide,m,x,headY,colW,headH);slide.addImage({data:await renderLineupSnapshotPng(m),x,y:imgY,w:colW,h:imgH});slide.addShape(pptx.ShapeType.rect,{x,y:imgY,w:colW,h:imgH,fill:{color:'FFFFFF',transparency:100},line:{color:'173F63',width:.75}})}
   slide=pptx.addSlide();slide.addImage({data:bg,x:0,y:0,w:13.333,h:7.5});const exp=state.matches.find(m=>m.kind==='EXPECTED'),subs=state.matches.find(m=>m.kind==='SUBS');
   slide.addText(state.settings?.reportTitleExpected||'预计首发名单',{x:.3,y:.18,w:6.15,h:.38,fontFace:'PingFang SC',fontSize:17,bold:true,color:'000000',align:'center',margin:0});slide.addText(state.settings?.reportTitleSubs||'主要替补球员',{x:6.88,y:.18,w:6.15,h:.38,fontFace:'PingFang SC',fontSize:17,bold:true,color:'000000',align:'center',margin:0});
   if(exp){slide.addImage({data:await renderLineupSnapshotPng(exp),x:1.0,y:.78,w:4.65,h:6.2});slide.addShape(pptx.ShapeType.rect,{x:1.0,y:.78,w:4.65,h:6.2,fill:{color:'FFFFFF',transparency:100},line:{color:'FFFFFF',width:1}})}
   if(subs){slide.addImage({data:await renderLineupSnapshotPng(subs),x:7.68,y:.78,w:4.65,h:6.2});slide.addShape(pptx.ShapeType.rect,{x:7.68,y:.78,w:4.65,h:6.2,fill:{color:'FFFFFF',transparency:100},line:{color:'FFFFFF',width:1}})}
   const filename=summaryReportFilename();status.textContent='Creating 2-slide PPTX…';await pptx.writeFile({fileName:filename,compression:true});status.textContent='Summary PPTX exported';toast('Summary Report ready for Keynote');
 }catch(err){console.error('SUMMARY PPTX ERROR',err);status.textContent=`Export error: ${String(err?.message||err)}`;toast('Summary export failed')}finally{btn.disabled=false}
}
async function exportPptx(){return ui.reportMode==='SUMMARY'?exportSummaryPptx():exportFullPptx()}

async function addPptxTitle(pptx,slide,m){let text,w;if(m.kind==='EXPECTED'){text=state.settings?.reportTitleExpected||'预计首发名单';w=120.269}else if(m.kind==='SUBS'){text=state.settings?.reportTitleSubs||'主要替补球员';w=120.269}else{text=`${m.roundNumber||''}_ VS ${m.opponentName||''} _ ${m.goalsFor||0}-${m.goalsAgainst||0} (${RESULT_CN[m.result]||'平'})`;w=Math.max(185,Math.min(350,80+text.length*10))}slide.addText(text,{x:pt(10.843),y:pt(16.953),w:pt(w),h:pt(32.2),fontFace:'Arial',fontSize:18,color:'FFFFFF',fill:{color:'000000'},line:{color:'000000',transparency:100},margin:0.03,valign:'mid',breakLine:false,fit:'shrink'})}
async function addPptxSubGoal(pptx,slide,sg){
 const ST=pptx.ShapeType,transparent={color:'FFFFFF',transparency:100};
 const name=benchGoalName(sg),num=benchGoalNumber(sg),minute=String(sg?.goalMinute||'').replace(/'/g,'').trim();
 if(!name&&!num)return;
 const key=`SUB_${pptxObjectKey(sg?.id||`${sg?.playerId||'bench'}_${minute||'goal'}`)}`;
 const cardW=119.875,cardH=20,ballW=15,minuteW=42,gap1=4,gap2=3,totalW=cardW+gap1+ballW+gap2+(minute?minuteW:0);
 const anchorX=Math.max(3,Math.min(97,Number(sg?.posX??50)))/100*540,anchorY=Math.max(3,Math.min(97,Number(sg?.posY??15)))/100*720;
 const left=anchorX-totalW/2,top=anchorY-cardH/2;
 slide.addShape(ST.rect,{x:pt(left),y:pt(top),w:pt(30.537),h:pt(cardH),fill:{color:'000000'},line:{color:'000000',transparency:100},objectName:`${key}__BASE_NUM_FILL`});
 slide.addShape(ST.rect,{x:pt(left+30.537),y:pt(top),w:pt(89.338),h:pt(cardH),fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100},objectName:`${key}__BASE_NAME_FILL`});
 slide.addShape(ST.rect,{x:pt(left-1),y:pt(top-1),w:pt(121.875),h:pt(cardH+2),fill:transparent,line:{color:'000000',width:2},objectName:`${key}__BASE_OUTER`});
 slide.addShape(ST.line,{x:pt(left+30.537),y:pt(top-1),w:0,h:pt(cardH+2),line:{color:'000000',width:2},objectName:`${key}__BASE_DIVIDER`});
 const base={fontFace:'Arial',bold:true,margin:0,align:'center',valign:'mid',breakLine:false,fit:'shrink'};
 slide.addText(String(num||'?'),{...base,x:pt(left),y:pt(top),w:pt(30.537),h:pt(cardH),fontSize:15,color:'FFFFFF',objectName:`${key}__BASE_NUM_TEXT`});
 slide.addText(name||'—',{...base,x:pt(left+30.537),y:pt(top),w:pt(89.338),h:pt(cardH),fontSize:name.length>9?11:15,color:'000000',objectName:`${key}__BASE_NAME_TEXT`});
 const ball=await urlToDataUri(EVENT_META.GOAL_FOR.icon),bx=left+cardW+gap1;
 slide.addImage({data:ball,x:pt(bx),y:pt(top+2.5),w:pt(ballW),h:pt(ballW),objectName:`${key}__GOAL_0__BALL`});
 if(minute)slide.addText(`( ${minute}' )`,{x:pt(bx+ballW+gap2),y:pt(top+1),w:pt(minuteW),h:pt(17),fontFace:'Arial',fontSize:9,bold:true,color:'0433FF',margin:0,fill:transparent,line:{color:'FFFFFF',transparency:100},breakLine:false,fit:'shrink',objectName:`${key}__GOAL_0__MINUTE`});
}
async function addPptxPlayer(pptx,slide,p,pos,slot){
 const g=reportPlayerGeom(slot),cx=g.left,cy=g.top+76.119,ST=pptx.ShapeType;
 const key=`PLR_${pptxObjectKey(pos?.id||`${p?.id||'player'}_${pos?.positionIndex??0}`)}`;
 if(p.photoAsset){
   const img=await urlToDataUri(p.photoAsset);
   slide.addImage({data:img,x:pt(g.left+22.438),y:pt(g.top),w:pt(75),h:pt(75),transparency:0,objectName:`${key}__BASE_HEAD`});
 }
 const transparent={color:'FFFFFF',transparency:100};
 slide.addShape(ST.rect,{x:pt(cx),y:pt(cy),w:pt(30.537),h:pt(20),fill:{color:'000000'},line:{color:'000000',transparency:100},objectName:`${key}__BASE_NUM_FILL`});
 slide.addShape(ST.rect,{x:pt(cx+30.537),y:pt(cy),w:pt(89.338),h:pt(20),fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100},objectName:`${key}__BASE_NAME_FILL`});
 slide.addShape(ST.rect,{x:pt(cx),y:pt(cy+20),w:pt(30.537),h:pt(16.5),fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100},objectName:`${key}__BASE_FOOT_FILL`});
 slide.addShape(ST.rect,{x:pt(cx+30.537),y:pt(cy+20),w:pt(89.338),h:pt(16.5),fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100},objectName:`${key}__BASE_HEIGHT_FILL`});
 slide.addShape(ST.rect,{x:pt(cx-1),y:pt(cy-1),w:pt(121.875),h:pt(38.5),fill:transparent,line:{color:'000000',width:2},objectName:`${key}__BASE_OUTER`});
 slide.addShape(ST.line,{x:pt(cx+30.537),y:pt(cy-1),w:0,h:pt(38.5),line:{color:'000000',width:2},objectName:`${key}__BASE_VLINE`});
 slide.addShape(ST.line,{x:pt(cx-1),y:pt(cy+20),w:pt(121.875),h:0,line:{color:'000000',width:2},objectName:`${key}__BASE_HLINE`});
 const base={fontFace:'Arial',bold:true,margin:0,align:'center',valign:'mid',breakLine:false,fit:'shrink'};
 slide.addText(String(p.squadNumber??''),{...base,x:pt(cx),y:pt(cy),w:pt(30.537),h:pt(20),fontSize:15,color:isU21(p)?'00FDFF':'FFFFFF',objectName:`${key}__BASE_NUM_TEXT`});
 const nm=cleanName(p.name);
 slide.addText(nm,{...base,x:pt(cx+30.537),y:pt(cy),w:pt(89.338),h:pt(20),fontSize:nm.length>9?11:15,color:'000000',objectName:`${key}__BASE_NAME_TEXT`});
 const footValue=String(p.foot||'R').toUpperCase();
 const footPptx=footValue==='BOTH'?
   [{text:'L',options:{color:'FF1900',bold:true}},{text:' ',options:{color:'000000',bold:true}},{text:'R',options:{color:'000000',bold:true}}]:
   footValue;
 slide.addText(footPptx,{...base,x:pt(cx),y:pt(cy+20),w:pt(30.537),h:pt(16.5),fontSize:12,color:footValue==='L'?'FF1900':'000000',objectName:`${key}__BASE_FOOT_TEXT`});
 slide.addText(p.height?`${p.height}cm`:'',{...base,x:pt(cx+30.537),y:pt(cy+20),w:pt(89.338),h:pt(16.5),fontSize:12,color:'000000',objectName:`${key}__BASE_HEIGHT_TEXT`});
 let evY=g.top+5,evIndex=0;
 for(const type of [EVENT_TYPES.NEW_SIGNING,EVENT_TYPES.LEFT_CLUB,EVENT_TYPES.INJURY,EVENT_TYPES.YELLOW_CARD,EVENT_TYPES.YELLOW_ACCUM_4,EVENT_TYPES.RED_CARD]){
   if(!hasEvent(pos,type))continue;
   const data=await urlToDataUri(EVENT_META[type].icon);
   slide.addImage({data,x:pt(g.left-17),y:pt(evY),w:pt(20),h:pt(20),objectName:`${key}__STATUS_${evIndex++}_${type}`});
   evY+=22;
 }
 const gf=eventsFor(pos,EVENT_TYPES.GOAL_FOR),ga=eventsFor(pos,EVENT_TYPES.GOAL_AGAINST),isGk=slot.label==='GK';
 let gy=g.top+(isGk?48:8);
 const gx=g.left+101,tx=g.left+118;
 const goalItems=[...gf.map(e=>({e,type:EVENT_TYPES.GOAL_FOR,color:'0433FF'})),...ga.map(e=>({e,type:EVENT_TYPES.GOAL_AGAINST,color:'FF1900'}))];
 for(let i=0;i<goalItems.length;i++){
   const item=goalItems[i],data=await urlToDataUri(EVENT_META[item.type].icon);
   slide.addImage({data,x:pt(gx),y:pt(gy),w:pt(15),h:pt(15),objectName:`${key}__GOAL_${i}__BALL`});
   slide.addText(minuteLabel(item.e),{x:pt(tx),y:pt(gy-1),w:pt(42),h:pt(17),fontFace:'Arial',fontSize:9,bold:true,color:item.color,margin:0,fill:transparent,line:{color:'FFFFFF',transparency:100},breakLine:false,fit:'shrink',objectName:`${key}__GOAL_${i}__MINUTE`});
   gy+=16;
 }
}
function fileToDataUri(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(file)})}
function downloadBackup(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});downloadBlob(blob,`Opponent_Lineup_Backup_${new Date().toISOString().slice(0,10)}.json`)}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function importBackup(e){const f=e.target.files?.[0];if(!f)return;try{const obj=JSON.parse(await f.text());if(!obj.players||!obj.matches)throw new Error('Invalid backup');state=obj;normalizeState();saveState();renderAll();toast('Backup imported')}catch(err){toast('Invalid backup file')}e.target.value=''}
function importScoutingCsv(e){const f=e.target.files?.[0];if(!f)return;f.text().then(text=>{const lines=text.trim().split(/\r?\n/);const head=(lines.shift()||'').split(',').map(x=>x.trim());const rows=lines.map(line=>{const vals=line.split(',');return Object.fromEntries(head.map((h,i)=>[h,(vals[i]||'').trim()]))});localStorage.setItem(SCOUT_KEY,JSON.stringify({headers:head,rows,importedAt:new Date().toISOString()}));renderScouting();toast(`${rows.length} scouting rows imported`)}).catch(()=>toast('CSV import error'));e.target.value=''}
function renderScouting(){const d=JSON.parse(localStorage.getItem(SCOUT_KEY)||'null');const el=document.getElementById('scoutingStatus');if(el)el.textContent=d?`${d.rows.length} rows imported · ${d.headers.length} fields · ${new Date(d.importedAt).toLocaleString()}`:'No scouting dataset imported.'}

