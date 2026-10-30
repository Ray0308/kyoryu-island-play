// Parent collection maintenance; extra development controls require the administrator PIN.
const collectionManagement=document.createElement('details');collectionManagement.id='parent-catalog-management';collectionManagement.innerHTML='<summary>図鑑の管理</summary><p id="parent-catalog-count"></p><button id="reset-catalog" class="secondary" type="button">図鑑をリセット</button><p id="catalog-reset-status" role="status"></p>';parent.append(collectionManagement);
const catalogResetDialog=document.createElement('dialog');catalogResetDialog.id='catalog-reset-dialog';catalogResetDialog.setAttribute('aria-labelledby','catalog-reset-title');catalogResetDialog.innerHTML='<h2 id="catalog-reset-title">図鑑をリセットしますか？</h2><p>通常・シークレット・キラのカードと、出会った回数がすべて０になります。</p><p>自作ステージ・クリア記録・音の設定は残ります。</p><div class="controls"><button id="cancel-catalog-reset" class="secondary" type="button">やめる</button><button id="confirm-catalog-reset" class="danger-button" type="button">図鑑だけリセットする</button></div>';document.body.append(catalogResetDialog);
$('reset-catalog').onclick=()=>{if(!parentUnlocked||!parentsVisible||busy||editing)return;catalogResetDialog.showModal();$('cancel-catalog-reset').focus()};
$('cancel-catalog-reset').onclick=()=>catalogResetDialog.close();
$('confirm-catalog-reset').onclick=()=>{
 if(!parentUnlocked||!parentsVisible||busy||editing||!catalogResetDialog.open)return;
 const empty=cleanCollection({}),nextProgress={...progress,found:[]};
 const original=[collectionKey,progressKey,'dino-test-complete-2026-10-29'].map(k=>[k,localStorage.getItem(k)]);
 try{localStorage.setItem(collectionKey,JSON.stringify(empty));localStorage.setItem(progressKey,JSON.stringify(nextProgress));localStorage.setItem('dino-test-complete-2026-10-29','done')}
 catch{for(const [k,v] of original){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch{}}$('catalog-reset-status').textContent='保存できませんでした。端末の空き容量を確認してください。';catalogResetDialog.close();return}
 collection=empty;progress=nextProgress;currentEgg=rollEgg();cardDetails.hidden=true;saveProgress();saveCollection();updateCounts();draw();$('catalog-reset-status').textContent='図鑑をリセットしました。';catalogResetDialog.close();$('reset-catalog').focus();
};
const adminHeading=document.createElement('h2');adminHeading.textContent='管理者用の確認・設定';developmentTools.prepend(adminHeading);
const adminComplete=document.createElement('button');adminComplete.id='admin-complete-catalog';adminComplete.className='go';adminComplete.textContent='テスト用：全図鑑COMPLETE（通常・キラ）';adminHeading.after(adminComplete);
adminComplete.onclick=()=>{if(!administratorUnlocked||!parentUnlocked||!parentsVisible||busy||editing)return;for(const d of catalog){collection.shiny[d.id]=Math.max(1,collection.shiny[d.id]||0);collection.counts[d.id]=Math.max(collection.counts[d.id]||0,collection.shiny[d.id]+1)}collection.duplicates=0;saveCollection();updateCounts();draw();$('catalog-reset-status').textContent='テスト用に全種類を発見済みにしました。'};
function updateParentManagement(){
 const admin=administratorUnlocked&&parentUnlocked&&parentsVisible;
 if(admin){if(developmentTools.parentNode!==parent)parent.append(developmentTools);developmentTools.hidden=editing;developmentTools.inert=editing;developmentTools.setAttribute('aria-hidden',String(editing))}
 else{developmentTools.hidden=true;developmentTools.inert=true;developmentTools.setAttribute('aria-hidden','true');if(developmentTools.parentNode!==document.body)document.body.append(developmentTools)}
 parent.querySelector('.workshop-title').textContent=admin?'管理者モード':'ステージこうぼう';
 $('parent-catalog-count').textContent='通常 '+ordinary.filter(d=>collection.counts[d.id]).length+' / '+ordinary.length+'種類　ひみつ '+catalogGroup('secret').filter(d=>collection.counts[d.id]).length+' / '+catalogGroup('secret').length+'種類';
 $('reset-catalog').disabled=!parentUnlocked||!parentsVisible||busy||editing;
}
const drawBeforeParentManagement=draw;draw=function(){drawBeforeParentManagement();updateParentManagement()};
const screenBeforeParentManagement=showScreen;showScreen=function(next){if(next==='title'&&catalogResetDialog.open)catalogResetDialog.close();screenBeforeParentManagement(next);updateParentManagement()};
updateParentManagement();
