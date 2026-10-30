// Temporary local playtest seed. Remove this script from index.html before release.
const testCompleteKey='dino-test-complete-2026-10-29';
try{
 if(localStorage.getItem(testCompleteKey)!=='done'){
  for(const d of catalog){collection.shiny[d.id]=Math.max(1,collection.shiny[d.id]||0);collection.counts[d.id]=Math.max(collection.counts[d.id]||0,collection.shiny[d.id]+1)}
  collection.duplicates=0;saveCollection();localStorage.setItem(testCompleteKey,'done');updateCounts();
 }
}catch{}
