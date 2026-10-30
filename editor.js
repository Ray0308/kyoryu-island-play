// Parent editor and local stage library.
const storageKey='dino-stages-v1';
const clone=value=>JSON.parse(JSON.stringify(value));
const validPoint=p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isInteger(n)&&n>=0&&n<5);
const validStage=l=>l&&validPoint(l.s)&&validPoint(l.g)&&!same(l.s,l.g)&&Array.isArray(l.r)&&l.r.length<=23&&l.r.every(p=>validPoint(p)&&!same(p,l.s)&&!same(p,l.g));
let saved=[];
try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(data))saved=data.filter(l=>validStage(l)&&typeof l.name==='string').slice(0,100)}catch{}
const builtInCount=levels.length;levels.push(...saved);
let editing=false,draft=null,tool='r';
function difficulty(l){
  // Breadth first search: shortest route, then fewest turns on that route.
  let wave=[{p:l.s,last:-1,turns:0}],seen=new Map();
  for(let steps=0;wave.length;steps++){
    const goals=wave.filter(n=>same(n.p,l.g));
    if(goals.length)return {steps,turns:Math.min(...goals.map(n=>n.turns))};
    const next=new Map();
    for(const n of wave)Object.values(dirs).forEach((d,i)=>{
      const p=[n.p[0]+d[0],n.p[1]+d[1]],key=p.join()+':'+i;
      if(!validPoint(p)||l.r.some(r=>same(r,p))||(seen.has(key)&&seen.get(key)<steps+1))return;
      const turns=n.turns+(n.last!==-1&&n.last!==i?1:0);
      if(!next.has(key)||next.get(key).turns>turns)next.set(key,{p,last:i,turns});
      seen.set(key,steps+1);
    });wave=[...next.values()];
  }return null;
}
function describe(l){const d=difficulty(l);if(!d)return '⚠ ゴールにたどり着けません。岩の配置を変えてください。';const label=d.steps<=4&&d.turns<=1?'はじめの一歩':d.steps<=8&&d.turns<=2?'すこし挑戦':'じっくり挑戦';return `${label} ｜ 最短 ${d.steps} 歩・曲がる回数 ${d.turns} 回（最短ルート内の最少）`}
const parent=document.createElement('details');parent.className='panel';parent.style.marginTop='24px';parent.innerHTML=`<summary>パパ・ママの ステージこうぼう</summary><h2 class="workshop-title">ステージこうぼう</h2><p>ステージを選んで遊ぶか、新しいステージをつくれます。</p><p id="difficulty"></p><label>あそぶステージ <select id="stage-select"></select></label><div class="controls" style="margin:16px 0"><button id="new-stage" class="secondary">新しくつくる</button><button id="edit-stage" class="secondary">このステージをコピーして編集</button><button id="delete-stage" class="secondary">選んだ自作ステージを削除</button></div><section id="editor" hidden><h2>ステージをつくる</h2><label>なまえ <input id="stage-name" maxlength="30" value="わたしの ぼうけん"></label><p>置くものを選んで、上のマスを押してください。<br>探検家・たまごのあるマスに岩は置けません。</p><div class="controls" id="tools"></div><p id="draft-difficulty" role="status"></p><div class="controls"><button id="save-stage" class="go">保存して あそぶ</button><button id="cancel-edit" class="secondary">編集をやめる</button></div><p id="save-message" role="status"></p></section><p>つくったステージは「保存して あそぶ」で追加できます。</p>`;
document.querySelector('main').insertBefore(parent,document.querySelector('details'));
const extraStyle=document.createElement('style');extraStyle.textContent='select,input{font:inherit;padding:10px;border:1px solid #aabd9a;border-radius:10px;max-width:100%}#tools button[aria-pressed="true"]{background:#efb963;outline:3px solid #9a6424}.board button.cell{padding:0;min-height:0;width:100%}[hidden]{display:none!important}';document.head.append(extraStyle);
for(const [key,label] of [['s','🧭 探検家'],['g','🥚 たまご'],['r','🪨 岩'],['erase','🧹 消す']]){const b=document.createElement('button');b.className='secondary';b.textContent=label;b.onclick=()=>{tool=key;updateEditor()};b.dataset.tool=key;$('tools').append(b)}
const originalDraw=draw;
draw=function(){originalDraw();$('next').textContent=level===levels.length-1?'もういちど あそぶ ↻':'つぎへ →';$('difficulty').textContent=describe(levels[level]);$('stage').textContent=editing?'🛠 ステージを つくろう':levels[level].name||`ステージ ${level+1} / ${builtInCount}`;
  $('stage-select').replaceChildren();levels.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=i<builtInCount?`ステージ ${i+1}`:l.name;$('stage-select').append(o)});$('stage-select').value=level;
  for(const id of ['stage-select','new-stage','edit-stage'])$(id).disabled=busy||editing;
  $('delete-stage').disabled=busy||editing||level<builtInCount;
  if(editing){$('board').replaceChildren();for(let y=0;y<5;y++)for(let x=0;x<5;x++){const p=[x,y],b=document.createElement('button'),rock=draft.r.some(r=>same(r,p));b.className='cell'+(rock?' rock':'');b.textContent=same(draft.s,p)?'🧭':same(draft.g,p)?'🥚':rock?'🪨':'';b.setAttribute('aria-label',`${y+1}行 ${x+1}列 ${b.textContent||'空きマス'}`);b.onclick=()=>place(p);$('board').append(b)} }
  document.querySelector('section[aria-label="めいれい"]').hidden=editing;
};
function updateEditor(){document.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool)));$('draft-difficulty').textContent=describe(draft);$('save-stage').disabled=!difficulty(draft);draw()}
function place(p){$('save-message').textContent='';if(tool==='s'||tool==='g'){const other=tool==='s'?'g':'s';if(same(draft[other],p)){$('save-message').textContent='探検家とたまごは別々のマスに置いてください。';return}draft[tool]=p;draft.r=draft.r.filter(r=>!same(r,p))}else if(!same(draft.s,p)&&!same(draft.g,p)){draft.r=draft.r.filter(r=>!same(r,p));if(tool==='r')draft.r.push(p)}updateEditor()}
function startEditor(l){draft=clone(l);editing=true;$('stage-name').value=l.name||'わたしの ぼうけん';$('editor').hidden=false;$('save-message').textContent='';updateEditor()}
$('new-stage').onclick=()=>startEditor({s:[0,4],g:[4,0],r:[]});$('edit-stage').onclick=()=>startEditor(levels[level]);
$('cancel-edit').onclick=()=>{editing=false;$('editor').hidden=true;reset()};
$('stage-select').onchange=e=>{level=Number(e.target.value);reset()};
$('save-stage').onclick=()=>{if(!validStage(draft)||!difficulty(draft))return;const l={...clone(draft),name:$('stage-name').value.trim()||'わたしの ぼうけん'};if(saved.length>=100){$('save-message').textContent='保存は100面までです。不要なステージを削除してください。';return}try{localStorage.setItem(storageKey,JSON.stringify([...saved,l]))}catch{$('save-message').textContent='保存できませんでした。ブラウザーの保存設定や空き容量を確認してください。';return}saved.push(l);levels.push(l);level=levels.length-1;editing=false;$('editor').hidden=true;reset()};
$('delete-stage').onclick=()=>{if(level<builtInCount||!confirm('この自作ステージを削除しますか？'))return;const index=level-builtInCount,updated=saved.filter((_,i)=>i!==index);try{localStorage.setItem(storageKey,JSON.stringify(updated))}catch{alert('削除を保存できませんでした。');return}saved=updated;levels.splice(level,1);level=0;reset()};
draw();
