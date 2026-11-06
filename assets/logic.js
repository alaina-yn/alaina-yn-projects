(function(root){'use strict';
const VALID_STATUS=['current','missing','stale','unreviewed'];
function unique(arr){return [...new Set(arr)];}
function num(value,options) {const v=Number(value);if(!Number.isInteger(v)||!options.includes(v))throw Error('Invalid numerical option');return v;}
function check(value,options){if(!options.includes(value))throw Error('Unexpected option');return value;}
function audit(inputs){
  const names=['Identity access review','Security awareness evidence','Incident review record','Vendor reassessment','Backup test evidence'];
  const values=names.map((_,i)=>check(inputs['a'+(i+1)],VALID_STATUS));
  const counts=Object.fromEntries(VALID_STATUS.map(v=>[v,values.filter(x=>x===v).length]));
  const pct=Math.round(100*counts.current/values.length);
  const decision=counts.missing>0?'Evidence gaps: hold readiness conclusion':(counts.stale+counts.unreviewed)>0?'Conditional: evidence requires review':'Evidence present: proceed to control-effectiveness testing';
  const gaps=names.filter((x,i)=>values[i]!=='current').map((name,i)=>name+' — '+values[names.indexOf(name)]);
  return {kind:'audit',metric:pct+'%',score:counts.current,max:values.length,tier:counts.missing?'Not ready':counts.stale+counts.unreviewed?'Conditional':'Evidence coverage complete',decision,counts,gaps,explanation:['Current reviewed evidence / 5 example controls × 100.','Missing evidence blocks evidence-ready status. Stale or unreviewed evidence is conditional.','Even 100% evidence coverage does not establish operating effectiveness or audit readiness.']};
}
function vendor(i){
  const criticality=num(i.criticality,[1,2,3]),data=num(i.data,[0,2,3]),ai=num(i.ai,[0,2]),subprocessors=num(i.subprocessors,[0,1]);
  const security=check(i.security,['verified','pending']),privacy=check(i.privacy,['verified','pending']);
  const score=criticality+data+ai+subprocessors;
  const tier=score>=7?'High':score>=4?'Moderate':'Low';
  const missing=[];if(security!=='verified')missing.push('security assurance evidence');if(privacy!=='verified')missing.push('privacy or contract evidence');
  const decision=missing.length?'Defer: request evidence before disposition':score>=7?'Escalate for enhanced due diligence and accountable approval':'Prepare conditional recommendation for human review';
  return {kind:'vendor',metric:score+' / 9',score,max:9,tier,decision,gaps:missing,explanation:['Illustrative inherent risk = criticality ('+criticality+') + data ('+data+') + AI ('+ai+') + subprocessor ('+subprocessors+').','0–3 low; 4–6 moderate; 7–9 high. These thresholds are local sample rules, not ISO, SOC 2, GDPR or NIST requirements.','Missing security or privacy proof blocks any proceed recommendation.','This is inherent triage, not a validated residual-risk assessment.']};
}
function ai(i){
  const impact=num(i.impact,[1,2,3]), autonomy=num(i.autonomy,[0,2,3]),sensitivity=num(i.sensitivity,[0,2,3]);
  const owner=check(i.owner,['yes','no']),evaluation=check(i.evaluation,['yes','no']);
  const score=impact+autonomy+sensitivity;
  const tier=score>=7?'Elevated':score>=4?'Material':'Lower';
  const gaps=[];if(owner!=='yes')gaps.push('named accountable human reviewer');if(evaluation!=='yes')gaps.push('documented evaluation evidence');
  const decision=gaps.length?'Defer: governance gates are incomplete':score>=7?'Escalate: formal human review and stronger controls needed':'Conditionally route to designated reviewer; no automatic approval';
  return {kind:'ai',metric:score+' / 9',score,max:9,tier,decision,gaps,explanation:['Illustrative context score = impact ('+impact+') + autonomy ('+autonomy+') + sensitivity ('+sensitivity+').','Below 4 lower; 4–6 material; 7–9 elevated. These are portfolio choices, not official NIST thresholds.','No named owner or missing evaluation evidence causes deferral regardless of score.','GOVERN / MAP / MEASURE / MANAGE are NIST AI RMF function names; this scoring model is an independent teaching example.']};
}
const api={audit,vendor,ai};if(typeof module==='object'&&module.exports)module.exports=api;root.ASSURANCE_LOGIC=api;
})(typeof window!=='undefined'?window:globalThis);
