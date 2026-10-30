// The collection is a field journal from the same island as the title.
const journalScreen=$('collection-screen');
const journalHeader=journalScreen.querySelector('.collection-header');
const journalMeter=document.createElement('div');journalMeter.className='journal-meter';journalMeter.setAttribute('role','progressbar');journalMeter.setAttribute('aria-label','通常のなかまの発見数');journalMeter.setAttribute('aria-valuemin','0');journalMeter.setAttribute('aria-valuemax',String(ordinary.length));journalMeter.innerHTML='<span></span>';journalHeader.querySelector('#collection-status').after(journalMeter);
const journalTracks=document.createElement('div');journalTracks.className='journal-tracks';journalTracks.setAttribute('aria-hidden','true');journalTracks.innerHTML=titleTracks.innerHTML;journalScreen.prepend(journalTracks);
const journalBadge=document.createElement('div');journalBadge.id='journal-detail-badge';$('detail-name').before(journalBadge);
function decorateJournal(){
 const found=ordinary.filter(d=>collection.counts[d.id]).length;journalMeter.setAttribute('aria-valuenow',String(found));journalMeter.style.setProperty('--discovered',(found/ordinary.length*100)+'%');
 journalScreen.style.setProperty('--category-accent',categories[activeCategory]?.color||'#c6a365');
 [...$('catalog-tabs').children].forEach(tab=>{const key=tab.dataset.category;if(!key)return;tab.style.setProperty('--tab-accent',categories[key].color)});
 const group=catalogGroup(activeCategory);
 [...$('collection-grid').children].forEach((card,i)=>{const d=group[i];if(!d)return;card.style.setProperty('--card-order',i%6);card.style.setProperty('--card-accent',categories[d.category].color);card.dataset.creature=d.id;
 const stamp=document.createElement('span');stamp.className='journal-card-stamp';stamp.textContent=String(ordinary.findIndex(e=>e.id===d.id)+1).padStart(2,'0');if(d.category==='secret')stamp.textContent='✦';stamp.setAttribute('aria-hidden','true');card.append(stamp);
 });
}
const renderBeforeJournal=renderCatalog;renderCatalog=function(){renderBeforeJournal();decorateJournal()};
const cardBeforeJournal=showCard;showCard=function(d,shiny=false){cardBeforeJournal(d,shiny);const c=categories[d.category];journalBadge.textContent=c.icon+' '+c.label+' ／ '+(d.category==='secret'?categories[d.secretOrigin].label+'・SECRET':String(ordinary.findIndex(e=>e.id===d.id)+1).padStart(2,'0'));cardDetails.style.setProperty('--card-accent',c.color);};
decorateJournal();
