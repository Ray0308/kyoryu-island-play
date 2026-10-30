// A lightweight child gate. Entry exists only on the title screen.
let parentUnlocked=false,administratorUnlocked=false;
const parentEntry=$('parent-toggle');$('title-screen').append(parentEntry);parentEntry.classList.add('title-parent-entry');parentEntry.removeAttribute('aria-pressed');
const parentGate=document.createElement('dialog');parentGate.id='parent-gate';parentGate.setAttribute('aria-labelledby','parent-gate-title');
parentGate.innerHTML='<form id="parent-pin-form"><h2 id="parent-gate-title">パパ・ママモード</h2><p>４桁のPINを入力してください。</p><label for="parent-pin">PIN</label><input id="parent-pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" required pattern="[0-9]{4}" aria-describedby="parent-pin-message"><p id="parent-pin-message" role="status"></p><div class="controls"><button class="secondary" id="cancel-parent-pin" type="button">もどる</button><button class="go" type="submit">ひらく</button></div></form>';
document.body.append(parentGate);
function clearParentPin(){ $('parent-pin').value='';$('parent-pin-message').textContent=''}
parentEntry.onclick=()=>{if(screen!=='title'||busy)return;clearParentPin();parentGate.showModal();$('parent-pin').focus()};
$('cancel-parent-pin').onclick=()=>parentGate.close();parentGate.addEventListener('close',()=>{clearParentPin();if(screen==='title')parentEntry.focus()});
$('parent-pin-form').onsubmit=e=>{e.preventDefault();if(screen!=='title')return;const enteredPin=$('parent-pin').value;if(!['1234','0055'].includes(enteredPin)){$('parent-pin-message').textContent='PINが違います。もう一度入力してください。';$('parent-pin').select();return}parentGate.close();parentUnlocked=true;administratorUnlocked=enteredPin==='0055';parentsVisible=true;draw();showScreen('game');$('stage-select').focus()};
const parentExit=document.createElement('button');parentExit.id='parent-exit';parentExit.className='secondary';parentExit.textContent='🎮 あそぶ画面へ';actions.append(parentExit);
parentExit.onclick=()=>{if(busy)return;parentUnlocked=false;parentsVisible=false;editing=false;$('editor').hidden=true;reset();showScreen('game')};
const beforeGateDraw=draw;
draw=function(){if(parentsVisible&&!parentUnlocked){parentsVisible=false;editing=false;$('editor').hidden=true}beforeGateDraw();if(!parentsVisible){parentUnlocked=false;administratorUnlocked=false}parentEntry.textContent='🔒 パパ・ママ';parentEntry.removeAttribute('aria-pressed');parentExit.hidden=!parentsVisible;parentExit.disabled=busy};
const beforeGateScreen=showScreen;
showScreen=function(next){if(next==='title'){administratorUnlocked=false;parentUnlocked=false;parentsVisible=false;editing=false;$('editor').hidden=true;draw()}beforeGateScreen(next)};
draw();
