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

// Mouse, finger and pen all leave trails; passive listeners preserve taps and scrolling.
const cursorTracks=document.createElement('div');cursorTracks.className='cursor-tracks';cursorTracks.setAttribute('aria-hidden','true');document.body.append(cursorTracks);
let lastTrack=null,trackSide=1,touchTrailPointer=null;
function clearCursorTracks(){cursorTracks.replaceChildren();lastTrack=null;touchTrailPointer=null}
function canLeaveTracks(){return ['title','collection'].includes(screen)&&!titleMotion?.matches}
function addTrackEffect(effect){effect.addEventListener('animationend',()=>effect.remove(),{once:true});cursorTracks.append(effect);while(cursorTracks.children.length>18)cursorTracks.firstElementChild.remove()}
function stampFootprint(x,y,heading,touch=false){const track=document.createElement('span');track.className='cursor-track'+(touch?' touch-track':'');track.style.left=x+'px';track.style.top=y+'px';track.style.setProperty('--heading',heading+'deg');track.innerHTML=titleTracks.firstElementChild.innerHTML;addTrackEffect(track)}
function beginTouchTrail(e){if(!canLeaveTracks()||e.isPrimary===false||!['touch','pen'].includes(e.pointerType))return;touchTrailPointer=e.pointerId;lastTrack={x:e.clientX,y:e.clientY};trackSide=1;
 stampFootprint(e.clientX-11,e.clientY+9,-18,true);stampFootprint(e.clientX+11,e.clientY-9,18,true);
 const ring=document.createElement('span');ring.className='cursor-tap-ring';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';addTrackEffect(ring);
}
function leaveCursorTrack(e){
 if(!canLeaveTracks()||e.isPrimary===false)return;
 const touch=['touch','pen'].includes(e.pointerType);if(touch&&touchTrailPointer!==e.pointerId)return;
 const x=e.clientX,y=e.clientY;if(!lastTrack){lastTrack={x,y};return}
 const dx=x-lastTrack.x,dy=y-lastTrack.y,distance=Math.hypot(dx,dy);if(distance<(touch?30:34))return;
 const angle=Math.atan2(dy,dx),side=trackSide*(touch?12:9);stampFootprint(x-Math.sin(angle)*side,y+Math.cos(angle)*side,angle*180/Math.PI+90,touch);lastTrack={x,y};trackSide*=-1;
}
function endTouchTrail(e){if(e.pointerId===touchTrailPointer){touchTrailPointer=null;lastTrack=null}}
for(const surface of [$('title-screen'),$('collection-screen')]){surface.addEventListener('pointerdown',beginTouchTrail,{passive:true});surface.addEventListener('pointermove',leaveCursorTrack,{passive:true});surface.addEventListener('pointerup',endTouchTrail,{passive:true});surface.addEventListener('pointercancel',endTouchTrail,{passive:true});surface.addEventListener('pointerleave',()=>{lastTrack=null;touchTrailPointer=null},{passive:true})}
const screenBeforeCursorTracks=showScreen;showScreen=function(next){if(next!==screen)clearCursorTracks();screenBeforeCursorTracks(next)};
titleMotion?.addEventListener('change',clearCursorTracks);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearCursorTracks()});
