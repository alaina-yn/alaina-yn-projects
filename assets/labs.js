'use strict';
const LABS=['audit','vendor','ai'];
const cache={};
function entry(name){return Object.fromEntries(new FormData(document.getElementById(name+'-form')).entries());}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function render(name) {
  const inputs=entry(name), result=window.ASSURANCE_LOGIC[name](inputs);cache[name]={type:name,illustrative_only:true,generated_at:new Date().toISOString(),inputs,result};
  document.getElementById(name+'-result').innerHTML=`<div class="eyebrow">${escapeHtml(result.tier)} / Sample interpretation</div><div class="metric">${escapeHtml(result.metric)}</div><h3>${escapeHtml(result.decision)}</h3>${result.gaps.length?'<p><strong>Gaps to resolve</strong></p><ul>'+result.gaps.map(g=>'<li>'+escapeHtml(g)+'</li>').join('')+'</ul>':'<p><strong>No blocking evidence flags in this sample.</strong> Formal review still required.</p>'}<div class="hr"></div><strong>How this result is calculated</strong><ul>${result.explanation.map(v=>'<li>'+escapeHtml(v)+'</li>').join('')}</ul>`;
}
function selectLab(name){if(!LABS.includes(name))name='audit';LABS.forEach(n=>{const active=n===name;const button=document.getElementById('tab-'+n);button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;document.getElementById('lab-'+n).classList.toggle('hidden',!active);});history.replaceState(null,'','#'+name);}
LABS.forEach(name=>{
 document.getElementById(name+'-form').addEventListener('submit',e=>{e.preventDefault();try{render(name)}catch(err){document.getElementById(name+'-result').textContent='Invalid input; please review the selections.'}});
 document.querySelector(`[data-reset="${name}"]`).addEventListener('click',()=>{document.getElementById(name+'-form').reset();render(name)});
 document.querySelector(`[data-export="${name}"]`).addEventListener('click',()=>{
   render(name);const data=JSON.stringify(cache[name],null,2);const blob=new Blob([data],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`moriom-${name}-illustrative-review.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
 });
 document.getElementById('tab-'+name).addEventListener('click',()=>selectLab(name));render(name);
});
document.querySelector('[role="tablist"]').addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();const current=LABS.indexOf(document.activeElement.dataset.lab||'audit');const next=e.key==='Home'?0:e.key==='End'?LABS.length-1:(current+(e.key==='ArrowRight'?1:-1)+LABS.length)%LABS.length;selectLab(LABS[next]);document.getElementById('tab-'+LABS[next]).focus();
});
selectLab(decodeURIComponent(location.hash.replace(/^#/,'')));
