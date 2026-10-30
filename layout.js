// Keep the board visible while switching the adjacent panel.
const main=document.querySelector('main');
const header=document.createElement('header');header.className='app-header';
const titleGroup=document.createElement('div');
for(const node of [document.getElementById('stage'),main.querySelector('h1'),main.querySelector('p')])titleGroup.append(node);
header.append(titleGroup);
const actions=document.createElement('div');actions.className='header-actions';
actions.innerHTML='<button class="secondary" id="parent-toggle" aria-pressed="false">🛠 パパ・ママ</button><button class="secondary" id="help-toggle">あそびかた</button>';
header.append(actions);main.prepend(header);
const workspace=document.createElement('div');workspace.className='workspace';
const playPanel=document.querySelector('section[aria-label="めいれい"]');playPanel.classList.add('play-panel');
parent.classList.add('parent-panel');parent.open=true;parent.hidden=true;
parent.querySelector('p').classList.add('parent-intro');
parent.querySelector('label').classList.add('stage-picker');
parent.querySelector('.controls').classList.add('library-actions');
workspace.append($('board'),playPanel,parent);header.after(workspace);
const help=main.querySelector('details:not(.parent-panel)');const dialog=document.createElement('dialog');
const helpTitle=document.createElement('h2');helpTitle.textContent='いっしょに あそぼう';dialog.append(helpTitle);
const childHelp=document.createElement('p');childHelp.textContent='① やじるしを ならべよう。②「うごかす」を おそう。③ たまごに とどくかな？ やじるしを おすと けせるよ。';dialog.append(childHelp);
for(const p of [...help.querySelectorAll('p')])dialog.append(p);
const closeHelp=document.createElement('button');closeHelp.className='go';closeHelp.textContent='とじる';closeHelp.onclick=()=>dialog.close();dialog.append(closeHelp);help.remove();main.append(dialog);
$('help-toggle').onclick=()=>dialog.showModal();
let parentsVisible=false;
function syncLayout(){parent.hidden=!parentsVisible;playPanel.hidden=parentsVisible||editing;parent.classList.toggle('editing',editing);$('parent-toggle').disabled=busy;$('parent-toggle').setAttribute('aria-pressed',String(parentsVisible));$('parent-toggle').textContent=parentsVisible?'🎮 あそぶ画面へ':'🛠 パパ・ママ';}
$('parent-toggle').onclick=()=>{if(busy)return;if(editing){editing=false;$('editor').hidden=true;reset()}parentsVisible=!parentsVisible;syncLayout()};
const drawBeforeLayout=draw;draw=function(){drawBeforeLayout();syncLayout()};
const saveBeforeLayout=$('save-stage').onclick;
$('save-stage').onclick=()=>{saveBeforeLayout();if(!editing){parentsVisible=false;syncLayout()}};
draw();
