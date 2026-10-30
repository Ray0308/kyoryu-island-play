// One visual world for the expedition, game board and field guide.
document.title='きょうりゅうの しま ― たまごを めぐる ぼうけん';
main.querySelector('h1').textContent='きょうりゅうの しま';
header.querySelector('p').textContent='やじるしを ならべて、たまごを さがしに いこう！';
$('collection-screen').querySelector('.eyebrow').textContent='たんけんの きろく';
main.querySelector('footer').textContent='みちを みつけ、たまごを まもり、なかまを ふやそう。';
characterImage.src='assets/player-explorer.png';coachFace.querySelector('img').src=characterImage.src;
// Keep each miniature sprite and expression inside its own board square.
const beforeWorldDraw=draw;draw=function(){beforeWorldDraw();if(actor.dataset.mood==='happy')characterEmote.textContent='✦';if(editing){for(const cell of $('board').querySelectorAll('.cell'))if(cell.textContent==='🧭'){cell.textContent='';const img=document.createElement('img');img.src='assets/player-explorer.png';img.alt='探検家のスタート';img.className='editor-explorer';cell.append(img)}}else{$('board').setAttribute('aria-label','探検家が矢印でたまごを探す、５行５列の盤面');$('board').querySelector('.rabbit')?.setAttribute('aria-label','たんけんか')}};
draw();

document.documentElement.classList.add('app-ready');
