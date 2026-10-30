// A living expedition poster. Keep the first scene in the initial markup so startup never swaps a placeholder.
const titleStage=$('title-screen').querySelector('.title-art');
const titleScenes=[
 {image:'assets/catalog/plant-0-power-v2.png',name:'ブラキオサウルス',place:'もりの おくへ',alt:'岩山と森が広がる島に立つブラキオサウルス'},
 {image:'assets/catalog/meat-0-power-v2.png',name:'ティラノサウルス',place:'きょだいな あしおと',alt:'岩山を背に力強く立つティラノサウルス'},
 {image:'assets/catalog/sea-10-complete.png',name:'メガロドン',place:'あおい うみの そこへ',alt:'古代の海を泳ぐ巨大なサメ、メガロドン'}
];
const firstTitleImage=titleStage.querySelector('.title-dinosaur');
titleStage.querySelector('.sun-label').remove();
let titleSceneIndex=0,pendingTitleScene=null;
const titleMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const titleFrames=titleScenes.map((scene,i)=>{
 const frame=document.createElement('div');frame.className='title-scene'+(i===0?' is-current':'');frame.setAttribute('aria-hidden',String(i!==0));
 const img=i===0?firstTitleImage:new Image();img.className=i===0?'title-dinosaur title-scene-image':'title-scene-image';img.alt=scene.alt;img.width=1024;img.height=1024;
 const markLoaded=()=>{frame.dataset.loaded='true';if(pendingTitleScene===i){pendingTitleScene=null;selectTitleScene(i)}};img.addEventListener('load',markLoaded);if(i)img.src=scene.image;if(img.complete&&img.naturalWidth)markLoaded();
 const caption=document.createElement('div');caption.className='scene-caption';const place=document.createElement('span');place.textContent=scene.place;const name=document.createElement('strong');name.textContent=scene.name;caption.append(place,name);frame.append(img,caption);titleStage.append(frame);return frame;
});
const titleAtmosphere=document.createElement('div');titleAtmosphere.className='title-atmosphere';titleAtmosphere.setAttribute('aria-hidden','true');titleAtmosphere.innerHTML='<i></i><i></i><i></i><i></i><i></i>';titleStage.append(titleAtmosphere);
const titleNavigation=document.createElement('div');titleNavigation.className='title-scene-controls';titleNavigation.setAttribute('role','group');titleNavigation.setAttribute('aria-label','島の風景');
function selectTitleScene(index){if(titleFrames[index].dataset.loaded!=='true'&&index!==titleSceneIndex){pendingTitleScene=index;return}pendingTitleScene=null;titleSceneIndex=index;titleFrames.forEach((frame,i)=>{frame.classList.toggle('is-current',i===index);frame.setAttribute('aria-hidden',String(i!==index))});titleDots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)))}
const titleDots=titleScenes.map((scene,i)=>{const b=document.createElement('button');b.className='title-scene-dot';b.setAttribute('aria-label',scene.name+'の風景');b.setAttribute('aria-pressed',String(i===0));b.innerHTML='<span></span>';b.onclick=()=>{selectTitleScene(i)};titleNavigation.append(b);return b});
titleStage.append(titleNavigation);
window.setInterval(()=>{if(titleMotion?.matches||document.hidden||screen!=='title')return;const next=(titleSceneIndex+1)%titleFrames.length;if(titleFrames[next].dataset.loaded==='true')selectTitleScene(next)},5000);
// Three-toed tracks form a trail behind the invitation, rather than competing with its buttons.
const titleTracks=document.createElement('div');titleTracks.className='title-tracks';titleTracks.setAttribute('aria-hidden','true');
for(let i=0;i<7;i++){const track=document.createElement('span');track.style.setProperty('--track',i);track.innerHTML='<svg viewBox="0 0 80 100"><path d="M35 82C24 88 13 78 18 65L25 50 9 22Q5 9 15 15L34 37 35 7Q39-7 44 8L48 37 65 17Q77 8 71 23L57 53Q67 79 51 83L43 79Z"/></svg>';titleTracks.append(track)}$('title-screen').append(titleTracks);

// Distance-spaced alternating footprints follow the mouse, without intercepting clicks.
const cursorTracks=document.createElement('div');cursorTracks.className='cursor-tracks';cursorTracks.setAttribute('aria-hidden','true');document.body.append(cursorTracks);
let lastTrack=null,trackSide=1;
function clearCursorTracks(){cursorTracks.replaceChildren();lastTrack=null}
function leaveCursorTrack(e){
 if(!['title','collection'].includes(screen)||e.pointerType==='touch'||titleMotion?.matches)return;
 const x=e.clientX,y=e.clientY;
 if(!lastTrack){lastTrack={x,y};return}
 const dx=x-lastTrack.x,dy=y-lastTrack.y,distance=Math.hypot(dx,dy);
 if(distance<34)return;
 const angle=Math.atan2(dy,dx),side=trackSide*9;
 const track=document.createElement('span');track.className='cursor-track';
 track.style.left=(x-Math.sin(angle)*side)+'px';track.style.top=(y+Math.cos(angle)*side)+'px';track.style.setProperty('--heading',(angle*180/Math.PI+90)+'deg');
 track.innerHTML=titleTracks.firstElementChild.innerHTML;
 track.addEventListener('animationend',()=>track.remove(),{once:true});cursorTracks.append(track);
 while(cursorTracks.children.length>18)cursorTracks.firstElementChild.remove();
 lastTrack={x,y};trackSide*=-1;
}
for(const surface of [$('title-screen'),$('collection-screen')]){surface.addEventListener('pointermove',leaveCursorTrack);surface.addEventListener('pointerleave',()=>{lastTrack=null})}
const screenBeforeCursorTracks=showScreen;showScreen=function(next){if(next!==screen)clearCursorTracks();screenBeforeCursorTracks(next)};
titleMotion?.addEventListener('change',clearCursorTracks);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearCursorTracks()});
