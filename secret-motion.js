// Transparent secret illustrations share the animation stage in cards, details and rewards.
const secretMoves={
 meat:{label:'よろいの ちから！',symbol:'✧',color:'#e3b771'},
 plant:{label:'クリスタル フラッシュ！',symbol:'◇',color:'#b3e6f1'},
 sea:{label:'ぷにっ！ ぼよん！',symbol:'○',color:'#6edcf0'},
 sky:{label:'サンダー ウイング！',symbol:'ϟ',color:'#f3d878'},
 insect:{label:'ギガ アーマー！',symbol:'✦',color:'#a8e0c8'},
 animal:{label:'こおりの いぶき！',symbol:'❄',color:'#c3eaf4'}
};
const secretImages=Object.fromEntries(catalogGroup('secret').map(d=>[d.id,'assets/catalog/'+d.id+'-sprite-v1.png']));
secretImages['secret-4']='assets/catalog/secret-4-gigatitan-v2.png';
const secretBackgrounds=Object.fromEntries(catalogGroup('secret').map(d=>[d.id,'assets/catalog/'+d.id+'-background-v1.png']));
const artBeforeSecretMotion=catalogArt;
catalogArt=function(d){if(d.category!=='secret')return artBeforeSecretMotion(d);const m=secretMoves[d.secretOrigin];return `<div class="secret-stage secret-${d.secretOrigin}" style="--secret-color:${m.color}" data-secret="${d.secretOrigin}"><img class="secret-background" src="${secretBackgrounds[d.id]}" alt="" aria-hidden="true" draggable="false"><div class="secret-scenery-shade" aria-hidden="true"></div><div class="secret-orbit" aria-hidden="true"></div><div class="secret-subject"><img class="secret-creature-image" src="${secretImages[d.id]}" alt="${d.name}" width="1024" height="1024" draggable="false"></div><div class="secret-particles" aria-hidden="true">${Array.from({length:18},(_,i)=>`<i style="--particle:${i%8};--particle-row:${i%3};--burst-x:${Math.cos(i*2.4)*140}px;--burst-y:${Math.sin(i*2.4)*120}px;--burst-delay:${i%4*.07}s">${m.symbol}</i>`).join('')}</div><div class="secret-impact" aria-hidden="true"><b></b><b></b><b></b></div><div class="secret-power-flare" aria-hidden="true"></div><div class="secret-skill-label" aria-hidden="true">${m.label}</div></div>`};
const secretAction=document.createElement('button');secretAction.id='secret-action';secretAction.className='go';secretAction.hidden=true;secretAction.setAttribute('aria-controls','detail-art');$('detail-info').after(secretAction);
const secretHint=document.createElement('small');secretHint.id='secret-motion-hint';secretHint.textContent='ボタンを おして、とくべつな ちからを みよう！';secretHint.hidden=true;secretAction.after(secretHint);
const cardBeforeSecretMotion=showCard;showCard=function(d,shiny=false){cardBeforeSecretMotion(d,shiny);const secret=d.category==='secret';secretAction.hidden=secretHint.hidden=!secret;cardDetails.classList.toggle('secret-detail',secret);if(secret){secretAction.textContent='✦ '+secretMoves[d.secretOrigin].label;secretAction.style.setProperty('--secret-color',secretMoves[d.secretOrigin].color)}};
secretAction.onclick=()=>{const stage=$('detail-art').querySelector('.secret-stage');if(!stage)return;stage.classList.remove('is-performing');void stage.offsetWidth;stage.classList.add('is-performing');chime();};
$('detail-art').addEventListener('animationend',e=>{if(e.animationName==='secret-performance')e.target.classList.remove('is-performing')});
// Parents can inspect every effect without changing the child's discoveries.
const secretPreview=document.createElement('details');secretPreview.id='secret-motion-preview';secretPreview.innerHTML='<summary>ひみつの仲間の演出を確認（保存しない）</summary><select id="secret-preview-select" aria-label="ひみつの仲間"></select><button id="secret-preview-open" class="secondary">見本をひらく</button>';
for(const d of catalogGroup('secret')){const option=document.createElement('option');option.value=d.id;option.textContent=d.name;secretPreview.querySelector('select').append(option)}developmentTools.append(secretPreview);
$('secret-preview-open').onclick=()=>{const d=catalog.find(e=>e.id===$('secret-preview-select').value);showCollection('game');activeCategory='secret';renderCatalog();showCard(d);$('detail-info').textContent='見本：'+d.fact;$('normal-card').disabled=$('shiny-card').disabled=true};
