// Every full-screen destination offers the same direct route back to the title.
function returnToTitle(){
 if(busy)return;
 cardDetails.hidden=true;rewardPreview=false;$('reward-book').hidden=false;
 for(const openDialog of document.querySelectorAll('dialog[open]'))openDialog.close();
 if(window.speechSynthesis)window.speechSynthesis.cancel();
 showScreen('title');
}
function makeTitleReturn(id){const b=document.createElement('button');b.id=id;b.type='button';b.className='secondary title-return';b.textContent='⌂ タイトルに もどる';b.onclick=returnToTitle;return b}
homeButton.textContent='⌂ タイトルに もどる';homeButton.onclick=returnToTitle;homeButton.classList.add('title-return');
$('reward-screen').append(makeTitleReturn('reward-home'));
const collectionNav=document.createElement('nav');collectionNav.className='collection-navigation';collectionNav.setAttribute('aria-label','ずかんの ナビゲーション');$('close-collection').before(collectionNav);collectionNav.append($('close-collection'),makeTitleReturn('collection-home'));
$('close-card').after(makeTitleReturn('detail-home'));
dialog.append(makeTitleReturn('help-home'));
