// Make a plan visible before asking a child to execute it.
const coach=document.createElement('div');coach.id='journey-coach';coach.setAttribute('role','status');
coach.innerHTML='<span class="coach-face" aria-hidden="true">🦕</span><span id="coach-text"></span>';
playPanel.prepend(coach);stepHint.hidden=true;
const repair=document.createElement('button');repair.id='repair-command';repair.className='secondary';repair.hidden=true;repair.textContent='✂ とまった やじるしを けす';
$('status').after(repair);
repair.onclick=()=>{if(busy||failedCommand<0)return;queue.splice(failedCommand,1);failedCommand=-1;pos=[...levels[level].s];$('status').textContent='やじるしを なおして、もういちど！';draw()};
const actor=document.createElement('div');actor.id='walking-dino';actor.textContent='🦕';actor.setAttribute('aria-hidden','true');
const resetJourney=reset;reset=function(){failedCommand=-1;resetJourney()};$('clear').onclick=reset;
function plannedRoute(){const l=levels[level],route=[];let p=[...l.s];for(let i=0;i<queue.length;i++){const d=dirs[queue[i]],n=[p[0]+d[0],p[1]+d[1]];if(n.some(v=>v<0||v>4)||l.r.some(r=>same(r,n)))return {route,blocked:i,end:p};route.push({p:n,i,arrow:d[2]});p=n;if(same(p,l.g))break}return {route,blocked:-1,end:p}}
const beforeJourneyDraw=draw;
draw=function(){beforeJourneyDraw();repair.hidden=failedCommand<0||busy||editing;coach.hidden=editing;
  if(editing){actor.remove();return}
  const route=plannedRoute(),first=level===0&&!won;
  $('board').classList.toggle('walking',busy);$('board').classList.toggle('goal-reached',won);
  actor.style.setProperty('--col',pos[0]);actor.style.setProperty('--row',pos[1]);actor.classList.toggle('happy',won);$('board').append(actor);
  $('board').setAttribute('aria-label','恐竜を矢印でたまごまで案内する、５行５列の盤面');
  const cells=$('board').querySelectorAll('.cell');
  if(!busy&&!won){for(const step of route.route){const cell=cells[step.p[1]*5+step.p[0]],mark=document.createElement('span');mark.className='route-mark';mark.textContent=String(step.i+1);mark.setAttribute('aria-hidden','true');cell.append(mark);cell.classList.add('planned-cell')}
    if(queue.length){const cell=cells[route.end[1]*5+route.end[0]];cell.classList.add('planned-end')}
  }
  for(const [i,b] of [...$('queue').children].entries()){b.classList.toggle('failed-command',i===failedCommand);b.setAttribute('aria-label',`${i+1}ばんめ ${dirs[queue[i]][3]}を けす${i===failedCommand?'。ここで とまったよ':''}`);const old=b.onclick;b.onclick=()=>{failedCommand=-1;pos=[...levels[level].s];old()}}
  const up=$('arrows').querySelector('[aria-label="うえ"]');up.classList.toggle('hint-button',first&&!busy&&queue.length<2&&queue.every(d=>d==='up'));
  $('run').classList.toggle('hint-button',first&&!busy&&queue.length===2&&queue.every(d=>d==='up'));
  let message=busy?'じゅんばんに うごくよ。みていてね！':won?'たまごを みつけた！ やったね！':failedCommand>=0?'あかい やじるしで とまったよ。けして なおそう！':first&&!queue.length?'たまごは うえ！ ⬆ を ２かい おしてみよう':first&&queue.length===1&&queue[0]==='up'?'いいね！ もう１かい ⬆ を おしてみよう':first&&queue.length===2&&queue.every(d=>d==='up')?'みちが できた！ きいろい「うごかす」を おそう':queue.length?'すうじが すすむ じゅんばん。うごかして ためそう！':'たまごまで どう いこう？ やじるしを ならべよう';
  $('coach-text').textContent=message;
};
// A compact directional pad makes the arrows correspond to the board.
Object.entries(dirs).forEach(([key,d])=>{const b=$('arrows').querySelector(`[aria-label="${d[3]}"]`);b.dataset.direction=key;const old=b.onclick;b.onclick=()=>{failedCommand=-1;pos=[...levels[level].s];chime();old()}});
$('queue').setAttribute('aria-label','命令の列。押すとその矢印を消せます');
draw();
