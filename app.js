let horses = [];
function ensureHorse(num){
  num = Number(num); if(!num) return null;
  let h = horses.find(x=>x.num===num);
  if(!h){ h={mark:'',waku:'',num,name:'',r1:'',r2:'',r3:'',odds:'',pop:'',finish:''}; horses.push(h); horses.sort((a,b)=>a.num-b.num); }
  return h;
}
function calcMarks(h){
  const vals=[h.r1,h.r2,h.r3].map(v=>String(v||'').replace(/[^0-9]/g,''));
  if(vals.some(v=>!v||v==='0')) return '';
  const last=vals.map(v=>Number(v.slice(-1)));
  const sum=last.reduce((a,b)=>a+b,0)%10;
  if(last[0]===last[1] && last[1]===last[2]) return last[0]===5?'◎':'◎';
  const pat=last.join('');
  if(['149','146','185','914','814','614','641','941'].includes(pat)) return '◎';
  if(sum===5) return '○';
  if(sum===9) return '▲';
  return '';
}
function calcPopularity(){
  const arr=horses.filter(h=>h.odds && !isNaN(Number(h.odds))).sort((a,b)=>Number(a.odds)-Number(b.odds));
  let rank=1, prev=null;
  arr.forEach((h,i)=>{ if(prev!==null && Number(h.odds)!==prev) rank=i+1; h.pop=rank; prev=Number(h.odds); });
}
function render(){
  calcPopularity(); horses.forEach(h=>h.mark=calcMarks(h));
  const tb=document.querySelector('#raceTable tbody'); tb.innerHTML='';
  horses.forEach(h=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${h.mark||''}</td><td>${h.waku||''}</td><td>${h.num}</td><td>${h.name||''}</td><td>${h.r1||''}</td><td>${h.r2||''}</td><td>${h.r3||''}</td><td>${h.odds||''}</td><td>${h.pop||''}</td><td>${h.finish||''}</td>`; tb.appendChild(tr); });
}
async function checkHealth(){
  const el=document.getElementById('health');
  try{ const r=await fetch('/api/health',{cache:'no-store'}); const t=await r.text(); el.textContent=t; el.className=r.ok?'ok':'ng'; }
  catch(e){ el.textContent=String(e); el.className='ng'; }
}
async function serverOCR(){
  const files=[...document.getElementById('file').files];
  const st=document.getElementById('status');
  if(!files.length){ st.textContent='画像を選択してください'; return; }
  st.textContent='OCR送信中...';
  let all='';
  for(const file of files){
    const fd=new FormData(); fd.append('image', file, file.name);
    const r=await fetch('/api/ocr',{method:'POST',body:fd});
    const txt=await r.text();
    let j; try{ j=JSON.parse(txt); }catch(e){ throw new Error('JSONではありません: '+txt.slice(0,200)); }
    if(!r.ok) throw new Error(j.error||txt);
    all += '\n' + (j.text||'');
  }
  document.getElementById('ocrText').value=all.trim();
  autoApplyText(); st.textContent='OCR反映完了';
}
function autoApplyText(){
  const text=document.getElementById('ocrText').value || '';
  const lines=text.split(/\n+/).map(s=>s.trim()).filter(Boolean);
  for(const line of lines){ parseLine(line); }
  render();
}
function parseLine(line){
  line=line.replace(/[－—]/g,'-').replace(/[→＞>]/g,'→').replace(/　/g,' ');
  let m=line.match(/^(\d+)\s*枠\s*(\d+)\s*番?\s+(.+?)\s+(\d+|中止|取消|除外)\s*→\s*(\d+|中止|取消|除外)\s*→\s*(\d+|中止|取消|除外)/);
  if(m){ const h=ensureHorse(m[2]); h.waku=m[1]; h.name=m[3].trim(); h.r1=m[4]; h.r2=m[5]; h.r3=m[6]; return; }
  m=line.match(/^(\d+)\s+(.+?)\s+(\d+|中止|取消|除外)\s*→\s*(\d+|中止|取消|除外)\s*→\s*(\d+|中止|取消|除外)$/);
  if(m){ const h=ensureHorse(m[1]); h.name=m[2].trim(); h.r1=m[3]; h.r2=m[4]; h.r3=m[5]; return; }
  m=line.match(/^(\d+)\s+(.+?)\s+(\d+(?:\.\d+)?)$/);
  if(m){ const h=ensureHorse(m[1]); h.name=h.name||m[2].trim(); h.odds=m[3]; return; }
  m=line.match(/^([123])着\s+(\d+)\s*(.*)$/);
  if(m){ const h=ensureHorse(m[2]); h.finish=m[1]; if(m[3]) h.name=h.name||m[3].trim(); return; }
  m=line.match(/^(\d+)\s+(.+?)\s+(\d+)\s+(\d+)\s+(\d+)$/);
  if(m){ const h=ensureHorse(m[1]); h.name=m[2].trim(); h.r1=m[3]; h.r2=m[4]; h.r3=m[5]; return; }
}
render();
</script>
