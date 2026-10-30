const randomModes={
  easy:{label:'やさしい',min:2,max:4,minTurns:0,maxTurns:1,rocks:3},
  medium:{label:'ふつう',min:5,max:8,minTurns:1,maxTurns:2,rocks:7},
  hard:{label:'むずかしい',min:9,max:14,minTurns:3,maxTurns:20,rocks:11}
};
function matchesRandomMode(stage,mode){const d=difficulty(stage),m=randomModes[mode];return !!d&&d.steps>=m.min&&d.steps<=m.max&&d.turns>=m.minTurns&&d.turns<=m.maxTurns}
function transformRandomStage(stage,rng){const rotation=Math.floor(rng()*4),mirror=rng()<.5;const point=p=>{let [x,y]=p;if(mirror)x=4-x;for(let i=0;i<rotation;i++)[x,y]=[4-y,x];return [x,y]};return {s:point(stage.s),g:point(stage.g),r:stage.r.map(point)}}
function generateRandomStage(mode,rng=Math.random){
  if(!randomModes[mode])throw Error('Unknown difficulty');
  const m=randomModes[mode],point=()=>[Math.floor(rng()*5),Math.floor(rng()*5)];
  for(let attempt=0;attempt<250;attempt++){
    const s=point(),g=point();if(same(s,g))continue;
    const r=[],probability=(1+Math.floor(rng()*m.rocks))/25;
    for(let y=0;y<5;y++)for(let x=0;x<5;x++){const p=[x,y];if(!same(p,s)&&!same(p,g)&&rng()<probability)r.push(p)}
    const l={s,g,r};if(matchesRandomMode(l,mode))return l;
  }
  // Bounded generation always terminates with a verified solvable template.
  const fallback={easy:{s:[1,2],g:[3,2],r:[[0,0],[4,4]]},medium:{s:[0,0],g:[3,2],r:[[1,3],[3,4]]},hard:{s:[0,0],g:[0,4],r:[[0,1],[1,1],[2,1],[3,1],[1,3],[2,3],[3,3],[4,3]]}};
  return transformRandomStage(fallback[mode],rng);
}
const randomPanel=document.createElement('section');randomPanel.id='random-generator';
randomPanel.innerHTML='<label>🎲 おまかせ生成 <select id="random-difficulty"><option value="easy">やさしい：２〜４歩・曲がる０〜１回</option><option value="medium">ふつう：５〜８歩・曲がる１〜２回</option><option value="hard">むずかしい：９〜14歩・曲がる３回以上</option></select></label><div class="controls"><button id="generate-stage" class="go">🎲 ランダムでつくる</button><button id="undo-generation" class="secondary" hidden>生成前の配置に戻す</button></div><p id="random-message" role="status">ゴールに届く配置を生成します。編集後に「保存して あそぶ」で追加できます。</p>';
$('editor').before(randomPanel);
let beforeGeneration=null;
$('generate-stage').onclick=()=>{
  if(busy)return;const mode=$('random-difficulty').value;
  beforeGeneration=editing?{stage:clone(draft),name:$('stage-name').value}:null;
  const stage=generateRandomStage(mode);stage.name='おまかせ・'+randomModes[mode].label;
  startEditor(stage);$('undo-generation').hidden=!beforeGeneration;
  $('random-message').textContent='生成しました。'+describe(stage)+'。もう一度押すと配置を作り直します。';
};
$('undo-generation').onclick=()=>{if(!beforeGeneration||busy)return;const previous=beforeGeneration;beforeGeneration=null;startEditor(previous.stage);$('stage-name').value=previous.name;$('undo-generation').hidden=true;$('random-message').textContent='生成前の配置に戻しました。'};
const beforeRandomDraw=draw;
draw=function(){beforeRandomDraw();$('generate-stage').disabled=busy;$('random-difficulty').disabled=busy;if(!editing){beforeGeneration=null;$('undo-generation').hidden=true;$('random-message').textContent='ゴールに届く配置を生成します。編集後に「保存して あそぶ」で追加できます。'}};
const randomStyle=document.createElement('style');randomStyle.textContent='#random-generator{background:#edf5e6;border-radius:14px;padding:10px;margin:10px 0}#random-generator label{flex-wrap:wrap}#random-generator .controls{margin-top:8px}#random-generator p{font-size:11px;margin-bottom:0}#random-generator select{font-size:12px}';document.head.append(randomStyle);
draw();
