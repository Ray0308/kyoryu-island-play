// Visual layer only: leave the puzzle's coordinates, controls and saved stages intact.
const gameDrawBeforeScenery=draw;
draw=function(){gameDrawBeforeScenery();main.dataset.expeditionState=editing?'editor':won?'found':busy?'walking':'planning';playPanel.dataset.expeditionState=main.dataset.expeditionState;
 for(const cell of $('board').querySelectorAll('.cell.rock'))cell.setAttribute('aria-label','とおれない いわ');
 for(const [i,command] of [...$('queue').children].entries())command.style.setProperty('--command-number',JSON.stringify(String(i+1)));
};
