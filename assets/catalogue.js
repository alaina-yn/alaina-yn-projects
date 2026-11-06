'use strict';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lineList(items) {return '<ul class="bullet-list">'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';}
async function load() {
  try {
    const response = await fetch('data/projects.json');
    if(!response.ok) throw new Error('Catalog unavailable');
    const all = await response.json();
    if (!Array.isArray(all) || all.length<1) throw new Error('Empty catalog');
    if (document.querySelector('#case-grid')) {
      let category='All', query='';
      const grid=document.querySelector('#case-grid');
      function render() {
        const matches=all.filter(x=>(category==='All'||x.track===category)&&[x.name,x.full,x.type,x.problem,x.track].join(' ').toLowerCase().includes(query));
        document.querySelector('#count').textContent=`${matches.length} of ${all.length} documented cases`;
        grid.innerHTML=matches.map(x=>`<article class="card"><div class="num">${esc(x.num)} / ${esc(x.track.toUpperCase())}</div><div class="badge">${esc(x.type)}</div><h3>${esc(x.name)}</h3><p>${esc(x.problem)}</p><a class="card-link" href="project.html?id=${encodeURIComponent(x.id)}">Read case & decision path →</a></article>`).join('')||'<p class="muted">No cases match. Try a different filter.</p>';
      }
      document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
        category=btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
        render();
      }));
      document.querySelector('#search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render();});
      render();
    }
    if(document.querySelector('#case-head')) {
      const id=new URLSearchParams(location.search).get('id');
      const x=all.find(p=>p.id===id);
      if(!x){ document.querySelector('#case-head').innerHTML='<h1>Case not found</h1><p>Choose an item from the case library.</p>'; document.querySelector('#case-main').innerHTML=''; document.querySelector('#case-meta').innerHTML=''; return; }
      document.title=`${x.name} | Moriom Jahan Madha`;
      document.querySelector('#case-head').innerHTML=`<div class="eyebrow">${esc(x.num)} / ${esc(x.track)} / Portfolio scenario</div><h1>${esc(x.full)}</h1><p>${esc(x.problem)}</p>`;
      document.querySelector('#case-main').innerHTML=`
        <section class="panel"><div class="eyebrow">The review method</div><h2>How the example is assessed</h2>${lineList(x.method)}</section>
        <section class="panel"><div class="eyebrow">Evidence requirements</div><h2>What a reviewer would request</h2>${lineList(x.evidence)}<p class="muted">These are illustrative artifact types, not claims that a third-party organization supplied evidence.</p></section>
        <section class="panel"><div class="eyebrow">Accountable decision</div><h2>The decision to support</h2><p>${esc(x.decision)}</p><p>In a real engagement, the authorized control owner or risk approver would decide after reviewing actual evidence, scope, organizational policies and legal obligations.</p></section>
        <section class="panel"><div class="eyebrow">Limitations</div><h2>What is not being claimed</h2><p>${esc(x.note)}</p></section>`;
      document.querySelector('#case-meta').innerHTML=`<div class="eyebrow">Case notes</div><h3>Review boundary</h3><p>Domain: ${esc(x.track)}</p><p>Approach: ${esc(x.type)}</p><div class="hr"></div><h3>Framework context</h3><div>${x.frameworks.map(f=>'<span class="badge">'+esc(f)+'</span>').join('')}</div><div class="hr"></div><p class="small-kicker">Independent, synthetic portfolio study</p>${x.lab?'<a class="button" href="labs.html#'+encodeURIComponent(x.lab)+'">Try related lab →</a>':''}<p style="margin-top:18px"><a class="back" href="index.html">← All case studies</a></p>`;
    }
  } catch(error) {
    const tgt=document.querySelector('#case-grid')||document.querySelector('#case-head');
    if(tgt) tgt.textContent='Could not load case studies. Please serve this site from a local web server or deploy the static files.';
  }
}
load();
