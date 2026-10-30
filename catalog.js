const categories={meat:{label:'にくしょく',icon:'🍖',color:'#eb8054',pattern:'ギザギザ'},plant:{label:'そうしょく',icon:'🌿',color:'#76b965',pattern:'はっぱ'},sea:{label:'うみの いきもの',icon:'🌊',color:'#5aaed9',pattern:'なみ'},sky:{label:'よくりゅう',icon:'🪽',color:'#ab8ad6',pattern:'はね'},insect:{label:'こだいの むし',icon:'🪲',color:'#bd8e48',pattern:'せつ'},animal:{label:'こだいの どうぶつ',icon:'🐾',color:'#bb876f',pattern:'あしあと'},secret:{label:'ひみつ',icon:'✨',color:'#3b4054',pattern:'きんいろ'}};
const catalogNames={
 meat:['ティラノサウルス','アロサウルス','スピノサウルス','カルノタウルス','ケラトサウルス','ギガノトサウルス','タルボサウルス','アルバートサウルス','アクロカントサウルス','ダスプレトサウルス'],
 plant:['ブラキオサウルス','トリケラトプス','ステゴサウルス','パラサウロロフス','アンキロサウルス','ディプロドクス','アパトサウルス','イグアノドン','パキケファロサウルス','スティラコサウルス'],
 sea:['モササウルス','プレシオサウルス','エラスモサウルス','イクチオサウルス','リオプレウロドン','プリオサウルス','ティロサウルス','クロノサウルス','ショニサウルス','アーケロン','メガロドン'],
 sky:['プテラノドン','ケツァルコアトルス','ランフォリンクス','ディモルフォドン','タペヤラ','トゥパンダクティルス','アンハングエラ','ズンガリプテルス','ニクトサウルス','プテロダクティルス'],
 insect:['メガネウラ','アースロプレウラ','プルモノスコルピウス','イェーケロプテルス','アノマロカリス'],
 animal:['ケナガマンモス','スミロドン','ティタノボア','メガテリウム','ドエディクルス'],
 secret:['アーマーティラノサウルス','クリスタルトリケラトプス','ぷるぷるメガロドン','サンダーケツァルコアトルス','スチールギガティタン','フロストマンモス']
};
const catalog=Object.entries(catalogNames).flatMap(([category,names])=>names.map((name,i)=>({id:category+'-'+i,name,category,original:dinosaurs.find(d=>d.name===name)})));
const secretForms=[
 {origin:'meat',icon:'🦖',fact:'きんぞくの よろいを まとった ティラノサウルス。しまを まもる、ちからもち！'},
 {origin:'plant',icon:'💎',fact:'すいしょうの つのと よろいを もつ トリケラトプス。ひかりを あつめて、かがやくよ！'},
 {origin:'sea',icon:'🦈',fact:'あおい ゼリーの からだを もつ メガロドン。おおきな せびれも、ぷるんと はずむよ！'},
 {origin:'sky',icon:'⚡',fact:'かみなりを まとった ケツァルコアトルス。おおきな つばさで、あらしの そらへ！'},
 {origin:'insect',icon:'🪲',fact:'はがねの よろいを まとった ギガティタン。おおきな はねと、ちからづよい まえあしが じまん！'},
 {origin:'animal',icon:'❄️',fact:'こおりの きばを もつ マンモス。ふぶきの なかでも、どっしり あるくよ！'}
];
for(const [i,form] of secretForms.entries())Object.assign(catalog.find(d=>d.id==='secret-'+i),{secretOrigin:form.origin,secretIcon:form.icon,fact:form.fact});
// Keep the IDs of the current roster stable.
const selectedIds=new Set([...['meat','plant','sky','insect','animal'].flatMap(key=>Array.from({length:5},(_,i)=>key+'-'+i)),...['sea-0','sea-1','sea-3','sea-9','sea-10']]);
for(let i=catalog.length-1;i>=0;i--)if(catalog[i].category!=='secret'&&!selectedIds.has(catalog[i].id))catalog.splice(i,1);
function catalogGroup(key){return catalog.filter(d=>d.category===key)}

const collectionKey='dino-collection-v2';
function cleanCollection(value){const counts={},shiny={};for(const d of catalog){const n=value?.counts?.[d.id],s=value?.shiny?.[d.id];if(Number.isSafeInteger(n)&&n>0)counts[d.id]=n;if(Number.isSafeInteger(s)&&s>0&&counts[d.id])shiny[d.id]=Math.min(s,n)}return {counts,shiny,draws:Number.isSafeInteger(value?.draws)&&value.draws>=0?value.draws:0,duplicates:Math.min(2,Math.max(0,Number.isInteger(value?.duplicates)?value.duplicates:0))}}
let collection;
try{const stored=localStorage.getItem(collectionKey);if(stored)collection=cleanCollection(JSON.parse(stored))}catch{}
if(!collection){collection=cleanCollection({});for(const index of progress.found){const entry=catalog.find(d=>d.name===dinosaurs[index]?.name);if(entry)collection.counts[entry.id]=1}}
if(!Object.keys(collection.counts).length)collection.counts['plant-0']=1;
function saveCollection(){try{localStorage.setItem(collectionKey,JSON.stringify(collection));$('save-warning').textContent=''}catch{$('save-warning').textContent='ずかんを ほぞんできませんでした。パパ・ママに しらせてね。'}}
const ordinary=catalog.filter(d=>d.category!=='secret');
function rollEgg(state=collection,rng=Math.random){
 const found=ordinary.filter(d=>state.counts[d.id]),missing=ordinary.filter(d=>!state.counts[d.id]),secrets=catalog.filter(d=>d.category==='secret'),secretMissing=secrets.filter(d=>!state.counts[d.id]);
 let pool;
 if(found.length>=10&&secretMissing.length===secrets.length)pool=secretMissing;
 else if((state.draws<3||state.duplicates>=2)&&missing.length)pool=missing;
 else if(rng()<.02)pool=secrets;
 else pool=missing.length&&(!found.length||rng()<.7)?missing:found;
 if(!pool.length)pool=ordinary;
 return {id:pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))].id,shiny:rng()<.05};
}
function claimEgg(egg){const entry=catalog.find(d=>d.id===egg.id);if(!entry)throw Error('Unknown egg');const fresh=!collection.counts[egg.id],firstShiny=egg.shiny&&!collection.shiny[egg.id];collection.counts[egg.id]=(collection.counts[egg.id]||0)+1;if(egg.shiny)collection.shiny[egg.id]=(collection.shiny[egg.id]||0)+1;collection.draws++;collection.duplicates=fresh?0:Math.min(2,collection.duplicates+1);saveCollection();return {entry,fresh,firstShiny,count:collection.counts[egg.id]}}
function eggMarkup(egg){const d=catalog.find(d=>d.id===egg.id),c=categories[d.category];return `<span class="colored-egg egg-${d.category}${egg.shiny?' shiny-egg':''}" style="--egg-color:${c.color}" role="img" aria-label="${c.label}の${egg.shiny?'ひかる ':''}たまご"><span aria-hidden="true">${c.icon}</span></span>`}
function catalogArt(d){if(d.original)return art(d.original);return `<div class="catalog-portrait portrait-${d.category}" role="img" aria-label="${d.name}の なかまマーク"><span>${d.secretIcon||{meat:'🦖',plant:'🦕',sea:'🌊',sky:'🪽',insect:'🪲',animal:'🐾',secret:'✨'}[d.category]}</span><small>${d.category==='secret'?categories[d.secretOrigin].label+'の とくべつな すがた':categories[d.category].label}</small></div>`}
let activeCategory='meat',currentEgg=rollEgg();
const tabs=document.createElement('div');tabs.id='catalog-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','ずかんの なかま');$('collection-grid').before(tabs);
const cardDetails=document.createElement('section');cardDetails.id='card-details';cardDetails.hidden=true;cardDetails.innerHTML='<div id="detail-art"></div><div><h3 id="detail-name"></h3><p id="detail-info"></p><div class="controls"><button id="normal-card" class="secondary">ふつう</button><button id="shiny-card" class="go">✨ キラ</button><button id="close-card" class="secondary">とじる</button></div></div>';$('collection-grid').after(cardDetails);
tabs.addEventListener('keydown',e=>{const buttons=[...tabs.children],current=buttons.indexOf(document.activeElement);if(current<0)return;let index;if(e.key==='ArrowRight'||e.key==='ArrowDown')index=(current+1)%buttons.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')index=(current+buttons.length-1)%buttons.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=buttons.length-1;else return;e.preventDefault();buttons[index].click()});
let detailEntry=null;
function showCard(d,shiny=false){detailEntry=d;cardDetails.hidden=false;cardDetails.classList.toggle('shiny-card',shiny);$('detail-art').innerHTML=catalogArt(d);$('detail-name').textContent=d.name;$('detail-info').textContent=`♥ ${collection.counts[d.id]}かい あえた！${collection.shiny[d.id]?'　✨ キラ '+collection.shiny[d.id]+'まい':''}　`+(d.fact||d.original?.fact||(d.category==='secret'?'くうそうの とくべつな なかまだよ！':d.category==='sea'?'むかしの うみに くらした なかまだよ。':d.category==='sky'?'そらを とんだ よくりゅうの なかまだよ。':d.category==='insect'?'むかしの せっそくどうぶつ。こんちゅうとは べつの なかまも いるよ！':d.category==='animal'?'むかしに くらした どうぶつの なかまだよ！':categories[d.category].label+'だよ！'));$('shiny-card').disabled=!collection.shiny[d.id];$('normal-card').disabled=collection.counts[d.id]===(collection.shiny[d.id]||0);$('normal-card').setAttribute('aria-pressed',String(!shiny));$('shiny-card').setAttribute('aria-pressed',String(shiny));}
$('normal-card').onclick=()=>showCard(detailEntry,false);$('shiny-card').onclick=()=>showCard(detailEntry,true);$('close-card').onclick=()=>{cardDetails.hidden=true;document.querySelector('#catalog-tabs [aria-selected="true"]')?.focus()};
updateCounts=function(){const n=ordinary.filter(d=>collection.counts[d.id]).length;document.querySelectorAll('.collection-count').forEach(el=>el.textContent=n+' / '+ordinary.length)};
function renderCatalog(){
 tabs.replaceChildren();for(const [key,c] of Object.entries(categories)){const group=catalogGroup(key);if(!group.length)continue;const found=group.filter(d=>collection.counts[d.id]).length,b=document.createElement('button');b.setAttribute('role','tab');b.setAttribute('aria-selected',String(activeCategory===key));b.dataset.category=key;b.id='category-'+key;b.tabIndex=activeCategory===key?0:-1;b.setAttribute('aria-controls','collection-grid');b.setAttribute('aria-label',c.label+'、'+group.length+'しゅるいのうち'+found+'しゅるい はっけん');b.style.setProperty('--category-progress',(found/group.length*100)+'%');b.innerHTML='<span class="category-icon" aria-hidden="true">'+c.icon+'</span><span class="category-name">'+c.label+'</span><span class="category-count" aria-hidden="true">'+found+' <span>/ '+group.length+'</span></span><span class="category-progress" aria-hidden="true"><i></i></span>';b.onclick=()=>{activeCategory=key;cardDetails.hidden=true;renderCatalog();$('category-'+key).focus({preventScroll:true})};tabs.append(b)}
 $('collection-grid').setAttribute('role','tabpanel');$('collection-grid').setAttribute('aria-labelledby','category-'+activeCategory);$('collection-grid').replaceChildren();for(const d of catalogGroup(activeCategory)){const found=!!collection.counts[d.id],b=document.createElement('button');b.className='collection-card '+(found?'unlocked':'locked')+(collection.shiny[d.id]?' shiny-card':'');b.innerHTML=found?`${catalogArt(d)}<strong>${d.name}</strong><span>♥ ${collection.counts[d.id]}かい${collection.shiny[d.id]?'　✨ キラ':''}</span>`:`<div class="mystery">${eggMarkup({id:d.id,shiny:false})}</div><strong>？？？？？</strong><span>たまごから みつけよう</span>`;b.setAttribute('aria-label',found?d.name+(collection.shiny[d.id]?' キラあり':''):'まだ みつけていない なかま');b.onclick=()=>{if(found){showCard(d,!!collection.shiny[d.id]);chime();say(d.name)}else $('collection-fact').textContent='ぼうけんで たまごを みつけよう！'};$('collection-grid').append(b)}
 const found=ordinary.filter(d=>collection.counts[d.id]).length,secret=catalog.filter(d=>d.category==='secret'&&collection.counts[d.id]).length,shiny=catalog.filter(d=>collection.shiny[d.id]).length;
 $('collection-status').textContent=`${found===ordinary.length?ordinary.length+'しゅるい コンプリート！':found+' / '+ordinary.length+' しゅるい'}　✨ キラ ${shiny}　ひみつ ${secret} / ${catalogGroup('secret').length}`;
}
showCollection=function(from){collectionReturn=from;cardDetails.hidden=true;renderCatalog();$('collection-fact').textContent='なかまを おすと、カードが みられるよ！';showScreen('collection')};
let rewardPreview=false;
const shinyBanner=document.createElement('div');shinyBanner.id='shiny-banner';shinyBanner.hidden=true;shinyBanner.textContent='✨ キラカード！ ✨';$('reward-title').after(shinyBanner);
function renderEggReward(egg,result,preview=false){const {entry:d,fresh,firstShiny,count}=result;$('reward-eyebrow').textContent=egg.shiny?'✨ ひかる たまごから！':d.category==='secret'?'✨ このたまご、なんだか ちがうぞ！':categories[d.category].icon+' '+categories[d.category].label;$('reward-title').textContent=firstShiny?'キラに なった！':fresh?'あたらしい なかま！':'また あえたね！';$('reward-art').classList.toggle('shiny-card',egg.shiny);$('reward-art').innerHTML=catalogArt(d)+'<span class="hatching-egg" aria-hidden="true">'+eggMarkup(egg)+'</span>';$('reward-name').textContent=d.name;$('reward-fact').textContent='♥ '+count+'かい あえた！'+(d.category==='secret'?'　くうそうの とくべつな なかま！':'');const total=ordinary.filter(e=>collection.counts[e.id]).length;$('reward-count').textContent='📖 ずかん '+total+' / '+ordinary.length+' しゅるい';$('reward-next').textContent='つぎの ぼうけんへ →';$('confetti').replaceChildren();for(let i=0;i<30;i++){const p=document.createElement('i');p.style.cssText=`--x:${i*37%100}%;--delay:${i%7*.1}s;--color:${egg.shiny?'#fff1a0':['#ffcb56','#60d9bf','#f5a7b2'][i%3]};--rot:${i*29}deg`;$('confetti').append(p)}$('reward-screen').classList.toggle('shiny-reward',egg.shiny);$('shiny-banner').hidden=!egg.shiny;rewardPreview=preview;$('reward-book').hidden=preview;if(preview){$('reward-eyebrow').textContent='パパ・ママ用：演出の確認';$('reward-fact').textContent='図鑑・出会った回数・抽選には影響しません';$('reward-next').textContent='確認を終えて戻る';}showScreen('reward');chime(true);say(d.name+(fresh?'が なかまになったよ！':'、また あえたね！'))}
celebrate=function(){const key=stageKey();if(!progress.cleared.includes(key))progress.cleared.push(key);saveProgress();renderEggReward(currentEgg,claimEgg(currentEgg))};
const nextAfterReward=$('reward-next').onclick;$('reward-next').onclick=()=>{if(rewardPreview){rewardPreview=false;$('reward-book').hidden=false;showScreen('game');return}nextAfterReward()};
const previewButton=document.createElement('button');previewButton.id='preview-shiny';previewButton.className='go';previewButton.textContent='✨ キラ演出を確認（保存しない）';
previewButton.onclick=()=>{if(busy)return;const entry=catalog.find(d=>d.name==='ティラノサウルス');renderEggReward({id:entry.id,shiny:true},{entry,fresh:false,firstShiny:true,count:collection.counts[entry.id]||0},true)};

const resetBeforeCatalog=reset;reset=function(){currentEgg=rollEgg();resetBeforeCatalog()};$('clear').onclick=reset;
const drawBeforeCatalog=draw;draw=function(){drawBeforeCatalog();if(!editing){const cell=$('board').querySelector('.egg-cell');if(cell){const marks=[...cell.querySelectorAll('.route-mark')];cell.innerHTML=eggMarkup(currentEgg);cell.append(...marks)}}};
const settings=document.createElement('details');settings.id='reward-settings';settings.innerHTML='<summary>たまごと ごほうびの しくみ</summary><p>通常は６カテゴリ各５種類、全30種類＋空想のシークレット６種類（各カテゴリから１種類ずつ）。クリアごとに抽選します。同じステージでも再会回数が増えます。初めの３回は新発見、かぶりが２回続くと次は未発見の通常種（残っている場合）。通常種が10種類になった次のクリアで、最初のシークレットに会えます。</p><p>卵は生き物のカードを発見する「ふしぎな宝箱」という設定です。通常抽選のシークレットは２％。光る卵はカテゴリと別に５％で抽選します。光っても光らなくても、図鑑の同じ枠に記録します。海にはサメや海の爬虫類がいます。翼竜は恐竜とは別の仲間です。「むかしの むし」には、昆虫以外の節足動物も含みます。</p>';developmentTools.append(settings);settings.append(previewButton);
saveCollection();updateCounts();draw();
