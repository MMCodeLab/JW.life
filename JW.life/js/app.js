const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DAY=864e5;
function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return []}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
let goals=load('sp_goals'),verses=load('sp_verses'),filter='';
const PN={7:'Settimanale',30:'Mensile',365:'Annuale',0:'Indeterminato'};

window.addEventListener('load',()=>setTimeout(()=>$('#splash').classList.add('hide'),1400));

document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x===b));
  $('#v-goals').hidden=b.dataset.v!=='goals';
  ['verses','meet','bible'].forEach(v=>$('#v-'+v).hidden=b.dataset.v!==v);
});

$('#ga').onclick=()=>{
  const t=$('#gt').value.trim();if(!t)return;
  goals.unshift({id:Date.now(),t,p:+$('#gp').value,s:Date.now(),r:null});
  save('sp_goals',goals);$('#gt').value='';renderGoals();
};
function setGoal(id,r){const g=goals.find(x=>x.id===id);if(g){g.r=r;g.d=Date.now();save('sp_goals',goals);renderGoals()}}
function renewGoal(id){const g=goals.find(x=>x.id===id);if(g){goals.unshift({id:Date.now(),t:g.t,p:g.p,s:Date.now(),r:null});save('sp_goals',goals);renderGoals()}}
function delGoal(id){goals=goals.filter(x=>x.id!==id);save('sp_goals',goals);renderGoals()}

function renderGoals(){
  const now=Date.now();
  const active=goals.filter(g=>!g.r),done=goals.filter(g=>g.r);
  const due=active.filter(g=>g.p&&now>=g.s+g.p*DAY);
  const run=active.filter(g=>!due.includes(g));
  let h='';
  if(due.length){h+='<h3>Da verificare</h3>'+due.map(g=>`<div class="card item due"><button class="del" onclick="delGoal(${g.id})">✕</button><b>${esc(g.t)}</b><span class="pill">${PN[g.p]}</span><p class="mut" style="margin:10px 0">Il periodo è terminato. Lo hai raggiunto?</p><div class="row"><button onclick="setGoal(${g.id},'ok')">✓ Fatto</button><button onclick="setGoal(${g.id},'no')">✗ Non fatto</button></div></div>`).join('')}
  h+='<h3>In corso</h3>';
  h+=run.length?run.map(g=>{
    let info='Senza scadenza',bar='';
    if(g.p){const tot=g.p*DAY,el=Math.min(now-g.s,tot),left=Math.ceil((tot-el)/DAY);info=left+(left===1?' giorno rimasto':' giorni rimasti');bar=`<div class="bar"><i style="width:${el/tot*100}%"></i></div>`}
    return `<div class="card item"><button class="del" onclick="delGoal(${g.id})">✕</button><b>${esc(g.t)}</b><span class="pill">${PN[g.p]}</span>${bar}<div class="mut">${info}</div>${g.p?'':`<div class="row" style="margin-top:10px"><button onclick="setGoal(${g.id},'ok')">✓ Segna come fatto</button></div>`}</div>`}).join(''):'<div class="empty">Nessun obiettivo in corso.<br>Aggiungine uno qui sopra ✨</div>';
  if(done.length){h+='<h3>Completati</h3>'+done.map(g=>`<div class="card item"><button class="del" onclick="delGoal(${g.id})">✕</button><b>${esc(g.t)}</b><span class="${g.r==='ok'?'ok':'no'}">${g.r==='ok'?'✓ Fatto':'✗ Non fatto'}</span> <span class="mut">· ${PN[g.p]}</span>${g.p?`<div class="row" style="margin-top:10px"><button onclick="renewGoal(${g.id})">↻ Riprova</button></div>`:''}</div>`).join('')}
  $('#goals').innerHTML=h;
}

$('#va').onclick=()=>{
  const r=$('#vr').value.trim();if(!r)return;
  verses.unshift({id:Date.now(),r,x:$('#vx').value.trim(),n:$('#vn').value.trim(),g:$('#vg').value.trim()});
  save('sp_verses',verses);['#vr','#vx','#vn','#vg'].forEach(s=>$(s).value='');renderVerses();
};
function delVerse(id){verses=verses.filter(x=>x.id!==id);save('sp_verses',verses);renderVerses()}
function setFilter(g){filter=filter===g?'':g;renderVerses()}

function renderVerses(){
  const gs=[...new Set(verses.map(v=>v.g).filter(Boolean))].sort();
  if(filter&&!gs.includes(filter))filter='';
  $('#groups').innerHTML=gs.map(g=>`<option value="${esc(g)}">`).join('');
  $('#chips').innerHTML=gs.map(g=>`<button class="pill chip ${g===filter?'on':''}" onclick="setFilter(this.dataset.g)" data-g="${esc(g)}">${esc(g)}</button>`).join('');
  const l=verses.filter(v=>!filter||v.g===filter);
  $('#verses').innerHTML=l.length?l.map(v=>`<div class="card item verse"><button class="del" onclick="delVerse(${v.id})">✕</button><b>${esc(v.r)}</b>${v.g?`<span class="pill">${esc(v.g)}</span>`:''}${v.x?`<q>“${esc(v.x)}”</q>`:''}${v.n?`<div class="mut">📝 ${esc(v.n)}</div>`:''}</div>`).join(''):'<div class="empty">Nessun versetto salvato.<br>Aggiungi quelli che ti hanno colpito 📖</div>';
}
renderGoals();renderVerses();


/* ===== ADUNANZE ===== */
let meets=load('sp_meets');
const today=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())};
const diff=d=>Math.round((new Date(d+'T00:00')-today())/DAY);
const fmt=d=>new Date(d+'T00:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
const rel=n=>n===0?'Oggi':n===1?'Domani':'Tra '+n+' giorni';
$('#ma').onclick=()=>{
  const t=$('#mt').value.trim(),d=$('#md').value;if(!t||!d)return;
  meets.push({id:Date.now(),t,d,h:$('#mh').value,r:+$('#mr').value});
  save('sp_meets',meets);$('#mt').value='';renderMeets();
};
function delMeet(id){meets=meets.filter(x=>x.id!==id);save('sp_meets',meets);renderMeets()}
$('#mn').onclick=async()=>{try{const p=await Notification.requestPermission();$('#mn').textContent=p==='granted'?'🔔 Notifiche attive':'Notifiche non consentite'}catch(e){$('#mn').textContent='Notifiche non supportate'}};
function renderMeets(){
  const s=[...meets].sort((a,b)=>(a.d+a.h).localeCompare(b.d+b.h));
  const up=s.filter(m=>diff(m.d)>=0),past=s.filter(m=>diff(m.d)<0);
  const due=up.filter(m=>m.r>=0&&diff(m.d)<=m.r);
  $('#banner').innerHTML=due.map(m=>`<div class="card"><b>🔔 ${rel(diff(m.d))}: ${esc(m.t)}</b><div class="mut">${fmt(m.d)}${m.h?' · '+m.h:''}</div></div>`).join('');
  const card=m=>`<div class="card item ${diff(m.d)<0?'past':''}"><button class="del" onclick="delMeet(${m.id})">✕</button><b>${esc(m.t)}</b><span class="pill">${fmt(m.d)}${m.h?' · '+m.h:''}</span>${diff(m.d)>=0?`<div class="mut" style="margin-top:8px">${rel(diff(m.d))}</div>`:''}</div>`;
  $('#meets').innerHTML=(up.length?'<h3>Prossime parti</h3>'+up.map(card).join(''):'<div class="empty">Nessuna parte in programma 🎤</div>')+(past.length?'<h3>Passate</h3>'+past.map(card).join(''):'');
  try{if(Notification.permission==='granted'&&!window._n){window._n=1;due.forEach(m=>new Notification('JW.life · '+rel(diff(m.d)),{body:m.t}))}}catch(e){}
}

/* ===== BIBBIA ===== */
const BK=`Genesi 50|Esodo 40|Levitico 27|Numeri 36|Deuteronomio 34|Giosuè 24|Giudici 21|Rut 4|1 Samuele 31|2 Samuele 24|1 Re 22|2 Re 25|1 Cronache 29|2 Cronache 36|Esdra 10|Neemia 13|Ester 10|Giobbe 42|Salmi 150|Proverbi 31|Ecclesiaste 12|Cantico di Salomone 8|Isaia 66|Geremia 52|Lamentazioni 5|Ezechiele 48|Daniele 12|Osea 14|Gioele 3|Amos 9|Abdia 1|Giona 4|Michea 7|Naum 3|Abacuc 3|Sofonia 3|Aggeo 2|Zaccaria 14|Malachia 4|Matteo 28|Marco 16|Luca 24|Giovanni 21|Atti 28|Romani 16|1 Corinti 16|2 Corinti 13|Galati 6|Efesini 6|Filippesi 4|Colossesi 4|1 Tessalonicesi 5|2 Tessalonicesi 3|1 Timoteo 6|2 Timoteo 4|Tito 3|Filemone 1|Ebrei 13|Giacomo 5|1 Pietro 5|2 Pietro 3|1 Giovanni 5|2 Giovanni 1|3 Giovanni 1|Giuda 1|Rivelazione 22`.split('|').map(x=>{const i=x.lastIndexOf(' ');return{n:x.slice(0,i),c:+x.slice(i+1)}});
let bible=(()=>{try{return JSON.parse(localStorage.getItem('sp_bible'))||{}}catch(e){return{}}})();
let ob=null,oc=null;
const cnt=b=>Object.values(bible[b]||{}).filter(x=>x.r).length;
function openB(i){ob=i;oc=null;renderBible()}
function togCh(c){const n=BK[ob].n;bible[n]=bible[n]||{};const x=bible[n][c]=bible[n][c]||{};x.r=!x.r;x.d=x.r?Date.now():null;oc=c;save2();renderBible()}
function noteCh(v){const n=BK[ob].n;bible[n][oc].t=v;save2()}
function save2(){try{localStorage.setItem('sp_bible',JSON.stringify(bible))}catch(e){}}
function renderBible(){
  const tot=BK.reduce((a,b)=>a+cnt(b.n),0);
  if(ob===null){
    const row=i=>{const b=BK[i],k=cnt(b.n);return `<button class="card book" onclick="openB(${i})"><b style="display:inline">${b.n}</b> <span class="mut" style="float:right">${k}/${b.c}</span><div class="bar"><i style="width:${k/b.c*100}%"></i></div></button>`};
    $('#bible').innerHTML=`<div class="card"><b>Bibbia completa</b><div class="bar"><i style="width:${tot/1189*100}%"></i></div><div class="mut">${tot} di 1189 capitoli letti</div></div><h3>Scritture Ebraiche</h3>`+BK.slice(0,39).map((_,i)=>row(i)).join('')+'<h3>Scritture Greche</h3>'+BK.slice(39).map((_,i)=>row(i+39)).join('');
    return;
  }
  const b=BK[ob],x=oc&&(bible[b.n]||{})[oc]||{};
  $('#bible').innerHTML=`<button onclick="ob=null;renderBible()">← Libri</button><h3 style="color:var(--tx)">${b.n} <span class="mut">${cnt(b.n)}/${b.c}</span></h3><div class="grid">`+Array.from({length:b.c},(_,i)=>{const c=i+1,y=(bible[b.n]||{})[c]||{};return `<button class="${y.r?'r':''} ${oc===c?'s':''} ${y.t?'hn':''}" onclick="togCh(${c})">${c}</button>`}).join('')+'</div>'+(oc?`<div class="card"><b>${b.n} ${oc}</b> <span class="${x.r?'ok':'mut'}">${x.r?'✓ Letto':'Non letto'}</span><textarea id="bn" placeholder="Nota su questo capitolo…" style="margin-top:10px" oninput="noteCh(this.value)">${esc(x.t||'')}</textarea></div>`:'<p class="mut">Tocca un capitolo per segnarlo come letto e aggiungere una nota.</p>');
}
renderMeets();renderBible();

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
