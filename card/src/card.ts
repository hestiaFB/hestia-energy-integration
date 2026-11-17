import {LitElement,html,nothing,unsafeCSS,type TemplateResult} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import charte from './ui/hestia-charte.css';
import energy from './energy.css';
import './editor';
import {follow,type Connection} from './stream';

/* Hestia Énergie's card, after the cards' mock-up 2 (docs/maquette-cartes-2.html, validated by Frank on 8 Nov. 2026):
   1 · the tile: « Énergie · en ce moment », one sentence, one figure (card: tuile)
   2 · the full card: the banner, then one period per section (En ce moment · Aujourd'hui · Ce mois-ci), then « En détail »
       (card: complete, by default)
   3 · the detail cards, over the page from « En détail » or alone (card: soleil | chauffage | veille | eau | appareils |
       pointe | contrat): the answer header (SUBJECT · period / the answer with its figure in bold / why), one period
       per card, then the panels (a title in plain words, a sentence with a figure, a drawing).
   Every figure comes from the integration (hestia_energy/view): the card only puts it into words. */

type Hass={callWS:<T>(msg:Record<string,unknown>)=>Promise<T>;states:Record<string,{last_updated:string}>;connection:Connection};
type Banner={id:string;couleur:string;pastille:string;titre:string;pourquoi:string};
type Period={euros:number|null;euros_energie:number|null;kwh_achetes:number;soleil_kwh:number|null;revendu_kwh:number|null;revendu_euros:number|null;soleil_couvre:number|null;soleil_garde:number|null;heures_inconnues:number;debut:string};
type Hour={h:number;achat:number|null;soleil:number|null;revente:number|null};
type Running={nom:string;type:string;w:number};
type Direct={achat_w:number|null;revente_w:number|null;soleil_w:number|null;maison_w:number|null;periode:string|null;prix:number|null;
 prochain_changement:{a:string;periode:string}|null;en_marche:Running[];bandeau:Banner;fuite:{minutes:number|null;debit:number};
 chauffage?:{pieces:{nom:string;w:number|null}[];w:number|null;euros_de_l_heure:number|null;sans_puissance:string[];poele:boolean}|null};
type Heat={kwh:number;eur:number|null;jours:number};
type Stove={mois:{kg:number;eur:number|null}|null;saison:{kg:number;eur:number|null};prix_kg:number|null;sac_kg:number|null;stock_kg?:number|null;jours_restants?:number|null};
type View={pret:boolean;palier:number;equipement:{direct?:boolean;soleil?:boolean;appareils?:boolean};direct?:Direct;
 jour?:Period;hier?:Period;mois?:Period;mois_an_dernier?:Period;projection:number|null;
 jusqu_ici?:{euros:number|null;kwh:number;hier_euros:number|null;hier_kwh:number;jusqu_a:string}|null;
 dernier_jour?:(Period&{jour:string})|null;
 pistes?:Piste[];
 veille:{w:number;euros_par_an:number|null;nuits:number;
  nuit?:{appareils:{nom:string;w:number;euros_par_an:number|null}[];mesure_w:number;sans_prise_w:number|null;sans_prise_euros_par_an:number|null}|null;
  evolution?:{debut_w:number;debut:string;ecart_w:number;ecart_euros_par_an:number|null}|null}|null;
 veille_historique:{jour:string;w:number}[];
 heures_creuses:[string,string][]|null;
 contrat:{option:string;kva:number;prix:Record<string,number>;revente:number|null;prix_hp?:number|null;prix_hc?:number|null;prix_base?:number|null;
  abonnement_mois?:number|null;part_hc?:number|null;base_euros?:number|null;seuil_hc?:number|null;a_confirmer?:string[]};
 heures:{aujourdhui:Hour[];hier:Hour[]};
 eau:{jour_l:number;mois_l:number;mois_euros:number|null;prix_m3:number|null;jours?:{jour:string;l:number|null}[];
  plus_gros?:{jour:string;l:number;euros:number|null}|null;l_par_jour?:number|null;euros_100_l?:number|null}|null;
 panneaux?:{hier:{nom:string;kwh:number}[];en_retrait:{nom:string;pourcent_de_moins:number}[];onduleur_muet_min:number|null}|null;
 soleil_jour?:{plus_fort:{h:number;kwh:number}|null;prix_evite:number|null;groupes:{nom:string;kwh:number}[]};
 appareils_jour?:{appareils:{nom:string;kwh:number;euros:number|null}[];mesure_kwh:number;maison_kwh:number;sans_prise_kwh:number|null;prix_moyen:number|null}|null;
 pointe?:{h:number;kw:number;part:number|null}|null;
 chauffage?:{etat:string;mois?:Heat|null;saison?:(Heat&{du:string})|null;euros_par_degre?:number|null;poele?:Stove|null}};
type Config={type:string;card?:string;name?:string};

const RUBRICS=['soleil','chauffage','veille','eau','appareils','pointe','contrat'] as const;
/** Advice « à froid » (maquette des cartes 3): a gesture, why, and the euros at stake a year or a winter. */
type Piste={id:string;titre:string;pourquoi:string;euros_an:number|null;unite:string|null;rubrique:string|null};
const PISTE_LOOK:Record<string,[string,string]>={veille_haute:['moon','--nw-watch'],chauffage_degre:['flame','--nw-heat'],contrat_base:['doc','--nw-ok'],
 jour_inhabituel:['home','--nw-home'],budget_mois:['doc','--nw-home']};
type Rubric=typeof RUBRICS[number];

/* Icons of the mock-up, drawn at the stroke (constants: never built from data). */
const I:Record<string,string>={
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>',
 grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 21 11 3h2l3 18"/><path d="M5 7h14M6.5 12h11M9.5 16.5l5-4.5M14.5 16.5l-5-4.5"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/></svg>',
 drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3s6.5 7 6.5 11.2A6.5 6.5 0 0 1 5.5 14.2C5.5 10 12 3 12 3z"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',
 plug:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0z"/><path d="M12 17v4"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16.5h7"/></svg>',
 flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4.5-4-6.5-4.5-11-2.5 2-4 4.5-4 7-1-.5-2-1.8-2.2-3C6.5 9.8 5.5 12.3 5.5 15a6.5 6.5 0 0 0 6.5 6.5z"/></svg>',
 chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
};
const icon=(k:string)=>unsafeHTML(I[k]??I.bolt);

/* Numbers in the family's words (PHRASES.md rule 7, C10): kW and kWh to 0.1, € to the cent under 10 €, to the euro
   above and for a yearly amount (to ten euros from 100 €: « environ 330 € par an »). */
// Grouped by hand: French leaves 4-digit numbers ungrouped (« 1749 ») and not every browser knows useGrouping « always »;
// the family reads « 1 749 ».
const num=(v:number,d=1)=>{const t=v.toLocaleString('fr-FR',{maximumFractionDigits:d,minimumFractionDigits:0,useGrouping:false});
 const [i,f]=t.split(',');return i.replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f')+(f?','+f:'');};
const cents=(v:number)=>v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
const kw=(w:number|null|undefined)=>w==null?'—':num(w/1000,1);
const eur=(v:number|null|undefined)=>v==null?'—':Math.abs(v)<10?cents(v):num(v,0);
const bill=(v:number|null|undefined)=>v==null?'—':cents(v);          // a bill so far, to the cent (the mock-up's 29,89 €)
const year=(v:number|null|undefined)=>v==null?'—':num(Math.abs(v)>=100?Math.round(v/10)*10:Math.round(v),0);
const kwh=(v:number|null|undefined)=>v==null?'—':num(v,Math.abs(v)<20?1:0);
const price=(v:number|null|undefined)=>v==null?'—':cents(v);          // a price a kWh: always to the cent (0,21 €)
const DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
/** « hier », « avant-hier », else the weekday (« samedi »): the day a figure is about, from an ISO date. */
const dayName=(iso?:string|null)=>{if(!iso)return 'hier';const d=new Date(iso+'T12:00'),t=new Date();t.setHours(12,0,0,0);
 const k=Math.round((t.getTime()-d.getTime())/864e5);return k===1?'hier':k===2?'avant-hier':DAYS[d.getDay()];};
const cap=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);
/** A link to the hub's page, opened inside Home Assistant (no reload). */
const toHub=(e:MouseEvent)=>{e.preventDefault();history.pushState(null,'',(e.currentTarget as HTMLAnchorElement).getAttribute('href')??'/hestia/energie');
 window.dispatchEvent(new CustomEvent('location-changed',{bubbles:true,composed:true}));};
const MONTHS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const SHORT=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const LEVEL:Record<string,string>={bleu:'ok',vert:'benefit',orange:'action',rouge:'urgent'};
const TONE:Record<string,string>={bleu:'--nw-ok',vert:'--nw-benefit',orange:'--nw-act',rouge:'--nw-alert'};
const BANNER_ICON:Record<string,string>={fuite_eau:'drop',disjoncteur:'bolt',chauffe_eau_reseau:'drop',soleil_en_trop:'sun',soleil_machine_ok:'sun',
 soleil_chaleur:'sun',machines_ensemble:'plug',machine_sans_soleil:'sun',machine_heures_pleines:'clock',oublie:'plug',rien_hc:'clock',rien_hc_bientot:'clock',
 rien_soleil_juste:'sun',rien_soleil_petit:'sun',rien_soleil_plus_tard:'sun',rien:'home'};
/** An hour said as a clock: « 11 h », « midi », « minuit ». */
const hour=(h:number)=>h===12?'midi':h===0||h===24?'minuit':`${h} h`;
/** An hour of the contract (« 0 h 14 ») kept on one line. */
const nb=(t:string)=>t.replace(/ /g,' ');
const clock=(d:Date)=>d.getHours()+' h '+String(d.getMinutes()).padStart(2,'0');
const noon=(iso:string)=>new Date(iso+'T12:00:00');
const dayOf=(iso:string)=>{const d=noon(iso).getDate();return d===1?'1er':String(d);};
const dayMonth=(iso:string)=>`${dayOf(iso)} ${MONTHS[noon(iso).getMonth()]}`;
/** A share in words (« un quart », « la moitié »), for the peak and the off-peak saving. */
const part=(x:number)=>x<=.3?'un quart':x<=.4?'un tiers':x<=.58?'la moitié':x<=.7?'deux tiers':x<=.85?'trois quarts':'presque tout';
/** The off-peak ranges in minutes of the day, from « 0 h 14 » – « 8 h 19 ». */
const minutes=(t:string)=>{const m=t.match(/(\d+) h(?: (\d+))?/);return m?Number(m[1])*60+(m[2]?Number(m[2]):0):0;};
function offpeak(ranges:[string,string][]|null):[number,number][]{
 return (ranges??[]).flatMap(([a,b])=>{const x=minutes(a),y=minutes(b);return y>x?[[x,y] as [number,number]]:[[x,1440] as [number,number],[0,y] as [number,number]];});
}
/** All off-peak hours at night (between 20 h and 9 h 30): then « la nuit » says it; else « en heures creuses ». */
const atNight=(r:[number,number][])=>r.length>0&&r.every(([a,b])=>(a>=20*60||b<=9*60+30));

/* ── Small drawings of the mock-up, all in CSS ── */
type Bar={n:string;v:number;txt:string;sub?:string;live?:string;dash?:boolean;muted?:boolean;soft?:boolean};
/** Lying bars: a name, a bar, a value, a small grey value (the hand-made review's bars). */
function hb(rows:Bar[],c:string):TemplateResult{
 const top=Math.max(...rows.map(r=>r.v),0)||1;
 return html`<div class="hb" style="--c:var(${c})">${rows.map(r=>html`<span class="n${r.muted?' muted':''}"><span>${r.n}</span>${r.live?html`<span class="live">${r.live}</span>`:nothing}</span>
  <span class="t${r.dash?' dash':''}"><i class=${r.soft?'soft':''} style="width:${Math.max(1,r.v/top*100)}%"></i></span>
  <span class="v${r.muted?' muted':''}">${r.txt}${r.sub?html`<small>${r.sub}</small>`:nothing}</span>`)}</div>`;
}
/** C5: at most five lines (and those running now), then « Et N autres : X ». */
function top5(rows:Bar[],fmt:(x:number)=>string):Bar[]{
 const shown=rows.filter((r,i)=>i<5||r.live),rest=rows.filter(r=>!shown.includes(r));
 if(rest.length<2)return rows;
 const total=rest.reduce((s,r)=>s+r.v,0);
 return [...shown,{n:`Et ${rest.length} autres`,v:total,txt:fmt(total),muted:true,soft:true}];
}
/** Standing bars: the highest carries its value; off-peak bands behind; a dashed limit. */
function cols(vals:(number|null)[],c:string,o:{pin?:(v:number)=>string;part?:number;bands?:(i:number)=>boolean;max?:number;limit?:number;limitLabel?:string;tall?:boolean}={}):TemplateResult{
 const top=Math.max(...vals.map(v=>v??0),0),max=o.max??(top*1.15||1),im=top>0?vals.indexOf(top):-1,n=vals.length;
 return html`<div class="cols${o.tall?' tall':''}" style="--c:var(${c})">${vals.map((v,i)=>{const h=v==null?2:Math.max(2,v/max*100);
  return html`<div class="c${o.bands?.(i)?' band':''}">${i===im&&o.pin?html`<span class="pin ${i<2?'l':i>n-3?'r':''}" style="bottom:${h}%">${o.pin(v!)}</span>`:nothing}<i class="${v==null?'none':''}${o.part===i?' part':''}" style="height:${h}%"></i></div>`;})}
  ${o.limit?html`<div class="limit" style="bottom:${o.limit/max*100}%"><span>${o.limitLabel}</span></div>`:nothing}</div>`;
}
const H_TICKS=html`<div class="ticks"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></div>`;

class HestiaEnergyCard extends LitElement {
 static styles=[unsafeCSS(charte),unsafeCSS(energy)];
 static properties={_view:{state:true},_open:{state:true},_folded:{state:true},_error:{state:true}};
 declare _view?:View;declare _open?:Rubric;declare _folded:Set<string>;declare _error?:string;
 private _hass?:Hass;private _config:Config={type:'custom:hestia-energy-card',card:'complete'};private _stop?:()=>void;private _again?:number;
 constructor(){super();this._folded=new Set();}

 static getStubConfig(){return {card:'complete'};}
 static getConfigElement(){return document.createElement('hestia-energy-card-editor');}
 setConfig(config:Config){
  const card=config.card??'complete';
  if(card!=='complete'&&card!=='tuile'&&card!=='conseils'&&!RUBRICS.includes(card as Rubric))throw new Error(`card: ${card} ? (complete, tuile, conseils, ${RUBRICS.join(', ')})`);
  this._config={...config,card};
 }
 getCardSize(){return this._config.card==='tuile'?2:8;}
 // Like Hestia Weather: the full card (and the advice) take the whole width of the view; the others a section's.
 getGridOptions(){const c=this._config.card;return c==='complete'||c==='conseils'?{columns:'full',rows:'auto'}:{columns:12,rows:'auto',min_columns:6};}
 // The view comes from one subscription shared by every Énergie card of the page (stream.ts): whole once, then only
 // what changed, as soon as it changes. The card never recomputes anything, and never asks on its own.
 set hass(hass:Hass){
  const other=this._hass?.connection!==hass.connection;
  this._hass=hass;
  if(other||!this._stop)this._follow();
 }
 connectedCallback(){super.connectedCallback();this._follow();}
 disconnectedCallback(){super.disconnectedCallback();this._unfollow();}
 private _unfollow(){this._stop?.();this._stop=undefined;window.clearTimeout(this._again);}
 private _follow(){
  this._unfollow();
  if(!this._hass||!this.isConnected)return;
  this._stop=follow(this._hass.connection,v=>{this._view=v as unknown as View;this._error=undefined;},
   e=>{this._stop=undefined;this._error=e.message??'Hestia Énergie ne répond pas.';this._again=window.setTimeout(()=>this._follow(),30000);},
   // Hestia Énergie reloaded: the new one is followed a moment later.
   ()=>{this._stop=undefined;this._again=window.setTimeout(()=>this._follow(),2000);});
 }

 render(){
  const v=this._view;
  if(this._error&&!v)return html`<ha-card><div class="empty">${this._error}</div></ha-card>`;
  if(!v||!v.pret)return html`<ha-card><div class="empty">Hestia Énergie lit la page Énergie…</div></ha-card>`;
  const card=this._config.card;
  if(card==='tuile')return this._tile(v);
  if(card==='conseils')return this._advice(v);
  if(card!=='complete')return html`<ha-card>${this._detail(v,card as Rubric,false)}</ha-card>`;
  return html`${this._full(v)}${this._open?html`<div class="ov" @click=${(e:Event)=>{if(e.target===e.currentTarget)this._open=undefined;}}
   @keydown=${(e:KeyboardEvent)=>{if(e.key==='Escape')this._open=undefined;}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(v,this._open,true)}</ha-card></div>`:nothing}`;
 }

 private _name(){return this._config.name??'Maison';}
 private _live(v:View){return !!(v.equipement.direct&&v.direct?.maison_w!=null);}
 /** « en heures pleines » / « en heures creuses » / nothing on Base. */
 private _when(d?:Direct){return d?.periode==='hc'?'en heures creuses':d?.periode==='hp'?'en heures pleines':'';}

 /* What the home draws now, in one sentence (the tile, « En ce moment »). */
 private _nowSay(v:View,withHome:boolean){
  const d=v.direct!,home=d.maison_w??0,sun=Math.min(d.soleil_w??0,home),bought=d.achat_w??0,sold=d.revente_w??0;
  const when=this._when(d),cost=d.prix!=null?html`<b>${eur(bought/1000*d.prix)} € de l'heure</b>${when?`, ${when}`:''}`:null;
  const lead=withHome?html`La maison consomme <b>${kw(home)} kW</b>. `:nothing;
  if(v.equipement.soleil&&sold>=30&&bought<30)return html`${lead}Le soleil couvre tout, et <b>${kw(sold)} kW</b> partent au réseau.`;
  if(v.equipement.soleil&&sun>=30){
   if(withHome)return html`${lead}Le soleil en couvre <b>${Math.round(sun/home*100)} %</b>, le reste vient du réseau${cost?html` : ${cost}`:''}.`;
   return html`Le soleil en donne <b>${kw(sun)} kW</b> ; le reste vient du réseau${cost?html` : ${cost}`:''}.`;}
  return cost?html`${lead}Tout vient du réseau : ${cost}.`:lead;
 }

 /* ── 1 · The tile ── */
 private _tile(v:View){
  const b=v.direct?.bandeau,c=b?TONE[b.couleur]??'--nw-ok':'--nw-ok',live=this._live(v);
  const pill:[string,string]|undefined=b?[b.pastille,c]:undefined,head={ic:'home',c:'--nw-home',subject:'Énergie',pill,over:false};
  // Nothing to do now: the tile gives the advice « à froid » worth the most (maquette des cartes 3).
  const best=(v.pistes??[]).find(p=>p.euros_an!=null);
  if(live)return html`<ha-card class="tile">${this._ans({...head,period:'en ce moment',val:kw(v.direct!.maison_w),unit:'kW',cap:'pour toute la maison',
   why:b?.couleur==='bleu'&&best?html`Rien à faire maintenant. ${this._saySave(best)}`:this._nowSay(v,false)})}</ha-card>`;
  // The latest whole day: yesterday, or the day before while Enedis has not sent yesterday (HA Linky, palier 0).
  const y=v.dernier_jour,day=dayName(y?.jour);
  if(!y)return html`<ha-card class="tile">${this._ans({...head,period:'',msg:'Les premiers jours arrivent',why:'Enedis envoie chaque journée le lendemain.'})}</ha-card>`;
  return html`<ha-card class="tile">${this._ans({...head,period:day,...(y.euros!=null?{val:eur(y.euros),unit:'€'}:{val:kwh(y.kwh_achetes),unit:'kWh'}),
   cap:'pour toute la maison',why:best?this._saySave(best):y.euros!=null?html`<b>${kwh(y.kwh_achetes)} kWh</b> achetés au réseau${y.soleil_couvre!=null?html` ; le soleil a couvert <b>${y.soleil_couvre} %</b> de la maison`:''}.`:'Le prix sera connu avec le contrat.'})}</ha-card>`;
 }

 /* ── 2 · The full card ── */
 private _full(v:View){
  const b=v.direct?.bandeau,now=new Date();
  const when=now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+' · '+clock(now);
  const secs=[this._nowSection(v),this._todaySection(v),this._monthSection(v)].filter(s=>s!==nothing);
  return html`<ha-card>
   <div class="head"><div style="min-width:0"><div class="nw-label">Énergie</div><div class="nw-title">${this._name()}</div></div><div class="when">${when}</div></div>
   ${b&&this._live(v)?html`<div class="nw-band nw-glass" data-level=${LEVEL[b.couleur]??'ok'}><div class="nw-band-row"><span class="nw-band-pic box">${icon(BANNER_ICON[b.id]??'home')}</span>
    <div class="nw-band-text"><p class="nw-band-kicker">En ce moment</p><p class="nw-band-title">${b.titre}</p>${b.pourquoi||this._periodSay(v)?html`<p class="nw-band-line">${b.pourquoi||this._periodSay(v)}</p>`:nothing}</div></div></div>`:nothing}
   <div class="periods${secs.length===2?' two':''}">${secs}</div>
   ${v.pistes?.length?this._section('save','Pour économiser','à froid, en euros',html`<div class="pistes">${v.pistes.slice(0,3).map(p=>this._piste(p))}</div>`):nothing}
   ${this._section('more','En détail','touchez pour ouvrir',html`<div class="more">${this._goes(v)}</div>`)}
  </ha-card>`;
 }
 /** « Heures pleines jusqu'à 0 h 14, puis heures creuses jusqu'à 8 h 19. »: under a banner that says nothing more. */
 private _periodSay(v:View){
  const d=v.direct,next=d?.prochain_changement;
  if(!next||(d?.periode!=='hp'&&d?.periode!=='hc'))return '';
  const at=new Date(next.a),now=d.periode==='hp'?'Heures pleines':'Heures creuses';
  const start=at.getHours()*60+at.getMinutes(),range=(v.heures_creuses??[]).find(([a])=>minutes(a)===start);
  const then=next.periode==='hc'&&range?`, puis heures creuses jusqu'à ${nb(range[1])}`:'';
  return `${now} jusqu'à ${clock(at)}${then}.`;
 }
 private _section(id:string,title:string,sum:string,body:unknown){
  const open=!this._folded.has(id);
  return html`<div class="sec"><button class="nw-fold-head" aria-expanded=${String(open)} @click=${()=>{const f=new Set(this._folded);if(open)f.add(id);else f.delete(id);this._folded=f;}}>
   <span class="nw-title">${title}</span><span class="nw-sum">${sum}</span><span class="nw-chevron">${icon('chev')}</span></button>${open?body:nothing}</div>`;
 }
 private _flow(v:View){
  const d=v.direct!;const node=(ic:string,c:string,val:string,l:string)=>html`<div class="node" style="--c:var(${c})"><span class="dot">${icon(ic)}</span><span class="nv">${val}</span><span class="nl">${l}</span></div>`;
  const link=(c:string,state:string)=>html`<span class="link ${state}" style="--c:var(${c})"><i></i></span>`;
  const buying=(d.achat_w??0)>=30,selling=!buying&&(d.revente_w??0)>=30;
  if(!v.equipement.soleil)return html`<div class="flow two">${node('home','--nw-home',`${kw(d.maison_w)} kW`,'Maison')}${link('--nw-grid','rev')}${node('grid','--nw-grid',`${kw(d.achat_w)} kW`,'Réseau')}</div>`;
  return html`<div class="flow">${node('sun','--nw-sun',`${kw(d.soleil_w)} kW`,'Soleil')}${link('--nw-sun',(d.soleil_w??0)>=30?'':'off')}${node('home','--nw-home',`${kw(d.maison_w)} kW`,'Maison')}${link('--nw-grid',buying?'rev':selling?'':'off')}${node('grid','--nw-grid',`${kw(buying?d.achat_w:selling?d.revente_w:0)} kW`,selling?'Revendu':'Réseau')}</div>`;
 }
 private _nowSection(v:View){
  const d=v.direct;
  if(!d)return nothing;
  if(!this._live(v)){
   // No live power (a Linky read the day after): the price of the moment still says something, unless the option is only
   // supposed (palier 0 before the household said it: a price that may be wrong is not said).
   if(d.prix==null||(v.contrat?.a_confirmer??[]).includes('option'))return nothing;
   const next=d.prochain_changement?` jusqu'à ${clock(new Date(d.prochain_changement.a))}`:'';
   return this._section('now','En ce moment',this._when(d),html`<div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-grid)">${icon('clock')}</span>
    <span>Le kWh coûte <b>${price(d.prix)} €</b>${this._when(d)?` ${this._when(d)}`:''}${next}.</span></div></div>`);
  }
  const heat=d.chauffage,running=[...d.en_marche].sort((a,b)=>b.w-a.w);
  const chips=[...(heat?.poele?[html`<span class="chip">Poêle <b>allumé</b></span>`]:[]),
   ...(heat?.pieces??[]).map(r=>html`<span class="chip">Chauffage ${r.nom}${r.w!=null?html` <b>${kw(r.w)} kW</b>`:nothing}</span>`),
   ...running.slice(0,5).map(r=>html`<span class="chip">${r.nom} <b>${kw(r.w)} kW</b></span>`)];
  return this._section('now','En ce moment',`${kw(d.maison_w)} kW pour toute la maison`,html`${this._flow(v)}
   <div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-home)">${icon('home')}</span><span>${this._nowSay(v,true)}</span></div>
    ${chips.length?html`<div class="chips"><span class="nw-label">En marche</span>${chips}</div>`:nothing}</div>`);
 }
 private _todaySection(v:View){
  const s=v.jusqu_ici;
  if(s){
   const h=new Date(s.jusqu_a).getHours(),euros=s.euros!=null&&s.hier_euros!=null;
   const a=euros?s.euros!:s.kwh,b=euros?s.hier_euros!:s.hier_kwh,gap=a-b,small=euros?Math.abs(gap)<0.1:Math.abs(gap)<0.5;
   const unit=euros?'€':'kWh',fmt=(x:number)=>euros?eur(x):kwh(x);
   return this._section('today','Aujourd\'hui','depuis minuit',html`<div class="big"><b>${fmt(a)} ${unit}</b><span>${euros?'dépensés':'consommés'} depuis minuit</span></div>
    <p class="say">${small?html`Comme hier à la même heure.`:html`<b>${fmt(Math.abs(gap))} ${unit} de ${gap>0?'plus':'moins'}</b> qu'hier à la même heure.`}</p>
    ${hb([{n:'Aujourd\'hui',v:a,txt:`${fmt(a)} ${unit}`},{n:`Hier à ${hour(h)}`,v:b,txt:`${fmt(b)} ${unit}`,muted:true,soft:true}],'--nw-home')}`);
  }
  const y=v.dernier_jour;
  if(!y)return nothing;
  // The statistics come the day after (HA Linky): yesterday, whole, is the latest day known.
  return this._section('today',cap(dayName(y.jour)),'toute la journée',html`<div class="big"><b>${y.euros!=null?`${eur(y.euros)} €`:`${kwh(y.kwh_achetes)} kWh`}</b><span>${y.euros!=null?'pour toute la journée':'achetés au réseau'}</span></div>
   ${y.euros!=null?html`<p class="say"><b>${kwh(y.kwh_achetes)} kWh</b> achetés au réseau${y.soleil_couvre!=null?html` ; le soleil a couvert <b>${y.soleil_couvre} %</b> de la maison`:''}.</p>`:nothing}`);
 }
 private _monthSection(v:View){
  const m=v.mois;
  if(!m)return nothing;
  const now=new Date(),value=m.euros??m.euros_energie,last=v.mois_an_dernier,p=v.projection;
  const lastSay=last?.euros!=null?` L'an dernier, ${MONTHS[now.getMonth()]} avait coûté ${eur(last.euros)} €.`:'';
  return this._section('month','Ce mois-ci',`depuis le 1er ${MONTHS[now.getMonth()]}`,html`<div class="big"><b>${value!=null?`${bill(value)} €`:`${kwh(m.kwh_achetes)} kWh`}</b><span>${value==null?'achetés au réseau':m.euros!=null?'abonnement compris':'sans l\'abonnement'}</span></div>
   ${p!=null?html`<p class="say">Au même rythme, <b>environ ${eur(p)} €</b> à la fin du mois.${lastSay}</p>
    <div><div class="track" style="--c:var(--nw-ok)"><i style="width:${Math.min(100,(value??0)/p*100)}%"></i></div>
     <div class="track-l"><span>déjà <b>${eur(value)} €</b></span><span>fin du mois <b>${eur(p)} €</b></span></div></div>`
    :lastSay?html`<p class="say">${lastSay.trim()}</p>`:nothing}`);
 }

 /* « En détail »: each one says its subject AND its period, one value, one sentence; touched, it opens its card. */
 private _go(key:Rubric,ic:string,c:string,label:string,val:string,unit:string,say:string){
  // The subject in plain words, its period in grey under it: never a label cut over three lines (maquette des cartes 4).
  const [subject,period]=label.split(' · ');
  return html`<button class="go" style="--c:var(${c})" @click=${()=>{this._open=key;}}><span class="g-h"><span class="ico">${icon(ic)}</span><span class="g-t">${subject}<small>${period}</small></span><span class="ar">›</span></span>
   <span class="g-v">${val}<small>${unit}</small></span><span class="g-s">${say}</span></button>`;
 }
 private _goes(v:View){
  const out:TemplateResult[]=[];
  const j=v.jour;
  if(v.equipement.soleil&&j?.soleil_kwh!=null)out.push(this._go('soleil','sun','--nw-sun','Soleil · aujourd\'hui',kwh(j.soleil_kwh),'kWh produits',
   j.soleil_garde!=null?`La maison en a gardé ${j.soleil_garde} %.`:'Rien encore aujourd\'hui.'));
  const heat=this._heatSum(v);
  if(heat)out.push(this._go('chauffage','flame','--nw-heat','Chauffage · depuis le 1er octobre',heat.val,heat.unit,heat.say));
  if(v.veille)out.push(this._go('veille','moon','--nw-watch','Veille · chaque nuit',String(v.veille.w),'W quand tout dort',
   v.veille.euros_par_an!=null?`Environ ${year(v.veille.euros_par_an)} € par an.`:'Ce que tire la maison quand tout dort.'));
  const e=v.eau,leak=v.direct?.fuite?.minutes;
  if(e)out.push(this._go('eau','drop','--nw-water','Eau · ce mois-ci',e.mois_euros!=null?bill(e.mois_euros):num(e.mois_l,0),e.mois_euros!=null?'€':'litres',
   `${e.mois_euros!=null?`${num(e.mois_l,0)} litres. `:''}${leak?`L'eau coule depuis ${Math.round(leak)} min.`:'Pas de fuite.'}`));
  const a=v.appareils_jour?.appareils?.[0];
  if(a)out.push(this._go('appareils','plug','--nw-home','Appareils · aujourd\'hui',kwh(a.kwh),`kWh · ${a.nom}`,'Celui qui a le plus consommé.'));
  const p=v.pointe;
  if(p)out.push(this._go('pointe','bolt','--nw-grid','Pointe · aujourd\'hui',kw(p.kw*1000),'kW au plus fort',
   v.contrat?.kva?`Sur ${v.contrat.kva} kVA : ${p.part!=null&&p.part>=.7?'près de la limite':'de la marge'}.`:'L\'heure la plus chargée.'));
  const c=v.contrat;
  if(c?.option==='hphc'&&c.part_hc!=null)out.push(this._go('contrat','doc','--nw-ok','Contrat · ce mois-ci',String(Math.round(c.part_hc*100)),
   atNight(offpeak(v.heures_creuses))?'% la nuit':'% en heures creuses','de vos achats en heures creuses.'));
  else if(c)out.push(this._go('contrat','doc','--nw-ok','Contrat · ce mois-ci',c.option==='tempo'?'Tempo':c.option==='hphc'?'HP / HC':'Base',c.kva?` · ${c.kva} kVA`:'',
   c.option==='base'&&c.prix_base!=null?`${price(c.prix_base)} € le kWh à toute heure.`:'Vos prix et vos heures.'));
  return out;
 }
 /** The heating season in one figure: stove and radiators together, or the one known. */
 private _heatSum(v:View):{val:string;unit:string;say:string;both:boolean}|null{
  const h=v.chauffage,el=h?.etat==='pret'?h.saison:null,st=h?.poele?.saison;
  if(el?.eur!=null&&st?.eur!=null)return {val:eur(el.eur+st.eur),unit:'€',say:`Poêle ${eur(st.eur)} €, radiateurs ${eur(el.eur)} €.`,both:true};
  if(st)return {val:st.eur!=null?eur(st.eur):num(st.kg,0),unit:st.eur!=null?'€':'kg',say:`Poêle : ${num(st.kg,0)} kg de granulés.`,both:false};
  if(el)return {val:el.eur!=null?eur(el.eur):kwh(el.kwh),unit:el.eur!=null?'€':'kWh',say:'Radiateurs, estimés d\'après le froid.',both:false};
  if(h?.etat==='peu_lie')return {val:'—',unit:'',say:'Vous chauffez sans doute avec une autre énergie.',both:false};
  return null;
 }

 /* ── Advice « à froid »: one line each, the gesture and what it brings; a touch opens its detail card ── */
 private _saySave(p:Piste){return html`Pour économiser : ${p.titre.charAt(0).toLowerCase()+p.titre.slice(1)}, <b>${num(p.euros_an!,0)} € ${p.unite??'par an'}</b>.`;}
 private _piste(p:Piste){
  const [ic,c]=PISTE_LOOK[p.id]??['home','--nw-home'],key=p.rubrique&&(RUBRICS as readonly string[]).includes(p.rubrique)?p.rubrique as Rubric:undefined;
  const body=html`<span class="ico" style="--c:var(${c})">${icon(ic)}</span><span class="pt">${p.titre}</span><span class="pw">${p.pourquoi}</span>
   ${p.euros_an!=null?html`<span class="pe"><b>${num(p.euros_an,0)} €</b><small>${p.unite??'par an'}</small></span>`:nothing}`;
  return key?html`<button class="piste" style="--c:var(${c})" @click=${()=>{this._open=key;}}>${body}</button>`:html`<div class="piste" style="--c:var(${c})">${body}</div>`;
 }
 /** What one more piece of equipment, or one word in Réglages, would bring: dashed, never counted as advice. */
 private _ups(v:View){
  const out:[string,string,string][]=[];
  if((v.contrat?.a_confirmer??[]).includes('option'))out.push(['doc','Un conseil sur votre contrat ?','Dites votre option et vos heures creuses dans les Réglages : Hestia vous dira si elles rapportent.']);
  if(!v.equipement.direct)out.push(['bolt','Les gestes au bon moment','Un module sur la prise du Linky : heures creuses, disjoncteur, le prix de l’heure.']);
  else if(!v.equipement.appareils)out.push(['plug','Savoir ce qui consomme','Une prise mesurée sur le frigo ou le chauffe-eau : la veille appareil par appareil, l’appareil oublié.']);
  return out.map(([ic,t,w])=>html`<div class="piste up"><span class="ico">${icon(ic)}</span><span class="pt">${t}</span><span class="pw">${w}</span></div>`);
 }
 /* ── 4 · Conseils: the advice « à froid » alone, the most euros first (card: conseils) ── */
 private _advice(v:View){
  const all=v.pistes??[],year=all.filter(p=>p.unite==='par an').reduce((a,p)=>a+(p.euros_an??0),0);
  const hero=year>0?{val:num(year,0),unit:'€',cap:'par an à gagner, au plus'}:all.length?{val:String(all.length),cap:`conseil${all.length>1?'s':''} pour vous`}:{msg:'Rien à changer pour l’instant'};
  const why=all.length?`${all.length>1?`${all.length} conseils tirés`:'Un conseil tiré'} de vos 12 derniers mois, du plus rentable au moins rentable.`:'Hestia regarde chaque jour vos habitudes et votre contrat ; un conseil apparaîtra ici dès qu’il vaut la peine.';
  return html`<ha-card>${this._ans({ic:'home',c:'--nw-home',subject:'Pour économiser',period:'à froid, en euros',...hero,why,over:false})}
   <div class="pistes">${all.map(p=>this._piste(p))}${this._ups(v)}</div></ha-card>
   ${this._open?html`<div class="ov" @click=${(e:Event)=>{if(e.target===e.currentTarget)this._open=undefined;}}
    @keydown=${(e:KeyboardEvent)=>{if(e.key==='Escape')this._open=undefined;}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(v,this._open,true)}</ha-card></div>`:nothing}`;
 }

 /* ── 3 · The detail cards: the answer header, then the panels ── */
 /** The header of a card (maquette des cartes 4, 17 Nov. 2026): the subject in a title, its period in grey beside it; then
     the figure big and its words small, as Hestia Weather shows its temperature; then why, in grey. `msg`: no figure yet. */
 private _ans(o:{ic:string;c:string;subject:string;period:string;val?:string;unit?:string;cap?:unknown;msg?:unknown;why?:unknown;pill?:[string,string];over:boolean}){
  return html`<div class="ans-k"><span class="ico" style="--c:var(${o.c})">${icon(o.ic)}</span><span class="nw-title">${o.subject}</span><span class="per">${o.period}</span>
    ${o.pill?html`<span class="pastille" style="--c:var(${o.pill[1]})">${o.pill[0]}</span>`:nothing}
    ${o.over?html`<button class="d-close" aria-label="Fermer" @click=${()=>{this._open=undefined;}}>×</button>`:nothing}</div>
   <div class="ans">${o.val!=null?html`<p class="hero"><b>${o.val}${o.unit?html`<small>${o.unit}</small>`:nothing}</b>${o.cap?html`<span>${o.cap}</span>`:nothing}</p>`
    :o.msg?html`<p class="ans-m">${o.msg}</p>`:nothing}${o.why?html`<p class="ans-w">${o.why}</p>`:nothing}</div>`;
 }
 private _enc(title:string,say:unknown,body?:unknown,o:{wide?:boolean;aside?:unknown;foot?:unknown}={}){
  return html`<div class="nw-panel${o.wide?' wide':''}"><div class="nw-panel-head"><h3><span>${title}</span></h3>${o.aside?html`<span class="aside">${o.aside}</span>`:nothing}</div>
   ${say?html`<p class="say">${say}</p>`:nothing}${body??nothing}${o.foot?html`<div class="foot">${o.foot}</div>`:nothing}</div>`;
 }
 /** « aujourd'hui, jusqu'à 17 h »: the statistics' last whole hour today. */
 private _until(v:View){const s=v.jusqu_ici;return s?`aujourd'hui, jusqu'à ${hour(new Date(s.jusqu_a).getHours())}`:'aujourd\'hui';}
 private _detail(v:View,key:Rubric,over:boolean):TemplateResult{
  switch(key){
   case 'soleil':return this._sun(v,over);
   case 'chauffage':return this._heat(v,over);
   case 'veille':return this._night(v,over);
   case 'eau':return this._water(v,over);
   case 'appareils':return this._devices(v,over);
   case 'pointe':return this._peak(v,over);
   default:return this._contract(v,over);
  }
 }

 private _sun(v:View,over:boolean){
  const j=v.jour,s=v.soleil_jour,head={ic:'sun',c:'--nw-sun',subject:'Soleil',period:this._until(v),over};
  if(!v.equipement.soleil||j?.soleil_kwh==null)return this._ans({...head,period:'aujourd\'hui',msg:'Pas de panneaux dans la page Énergie',why:'Ajoutez leur production dans la page Énergie de Home Assistant : Hestia la lira.'});
  if(j.soleil_kwh<0.05)return this._ans({...head,msg:'Les panneaux n\'ont encore rien produit',why:'Le soleil arrive : cette carte se remplit au fil des heures.'});
  const sold=j.revendu_kwh??0,kept=Math.max(0,j.soleil_kwh-sold);
  const top=s?.plus_fort,hours=(v.heures?.aujourdhui??[]).map(h=>h.soleil);
  const p=v.panneaux,groups=s?.groupes??[];
  const health=p?.onduleur_muet_min?html`L'onduleur ne répond plus depuis <b>${p.onduleur_muet_min<120?`${p.onduleur_muet_min} min`:`${Math.round(p.onduleur_muet_min/60)} h`}</b>.`
   :p?.en_retrait?.length?html`<b>${p.en_retrait[0].nom}</b> produit ${p.en_retrait[0].pourcent_de_moins} % de moins que d'habitude : à regarder.`
   :html`Les <b>${groups.length} groupes</b> ont produit comme d'habitude : aucun ne faiblit.`;
  return html`${this._ans({...head,val:kwh(j.soleil_kwh),unit:'kWh',cap:'produits par les panneaux',
    why:j.soleil_garde!=null?html`La maison en a gardé <b>${j.soleil_garde} %</b>.${sold>=0.05?html` Le reste, ${kwh(sold)} kWh, est parti au réseau${j.revendu_euros!=null?html` pour <b>${eur(j.revendu_euros)} €</b>`:''}.`:''}`:nothing})}
   <div class="encs">
    ${this._enc('Heure par heure',top?html`Le soleil a donné le plus entre <b>${hour(top.h)} et ${hour(top.h+1)} : ${kwh(top.kwh)} kWh</b>. C'est à ces heures-là qu'une machine tourne au soleil.`:nothing,
     html`${cols(hours,'--nw-sun',{pin:x=>`${kwh(x)} kWh`})}${H_TICKS}`,{wide:true})}
    ${this._enc('Où est parti le soleil',s?.prix_evite!=null&&v.contrat?.revente!=null?html`Le garder vaut mieux que le vendre : il évite <b>${price(s.prix_evite)} €</b> le kWh, la revente n'en paie que <b>${price(v.contrat.revente)} €</b>.`
     :html`La maison en a gardé <b>${kwh(kept)} kWh</b>.`,
     html`<div><div class="split"><i style="width:${kept/j.soleil_kwh*100}%;--c:var(--nw-benefit)"></i><i style="width:${sold/j.soleil_kwh*100}%;--c:var(--nw-sun)"></i></div>
      <div class="split-l"><span>gardé <b>${kwh(kept)} kWh</b></span><span>vendu <b>${kwh(sold)} kWh${j.revendu_euros!=null?` · ${eur(j.revendu_euros)} €`:''}</b></span></div></div>`)}
    ${groups.length?this._enc('Chaque groupe de panneaux',health,hb(top5(groups.map(g=>({n:g.nom,v:g.kwh,txt:`${kwh(g.kwh)} kWh`})),x=>`${kwh(x)} kWh`),'--nw-sun')):nothing}
   </div>`;
 }

 private _heat(v:View,over:boolean){
  const h=v.chauffage,st=h?.poele,stove=st?.saison,el=h?.etat==='pret'?h.saison:null,sum=this._heatSum(v);
  const head={ic:'flame',c:'--nw-heat',subject:'Chauffage',period:'depuis le 1er octobre',over};
  const why:Record<string,string>={sans_meteo:'Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : ajoutez Hestia Météo.',
   meteo_ancienne:'Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : mettez Hestia Météo à jour.',
   meteo_incompatible:'Hestia Météo n\'a pas la même version qu\'Énergie : mettez les deux à jour ensemble.',
   meteo_sans_lieu:'Pour estimer les radiateurs, ajoutez votre maison dans Hestia Météo.',
   meteo_sans_donnees:'Hestia Météo ne donne pas le froid des jours passés : choisissez un capteur de température dans ses réglages.',
   apprend:'Il faut quelques semaines de froid pour estimer les radiateurs. Revenez cet hiver.',
   peu_lie:'Votre électricité varie peu avec le froid : vous chauffez sans doute surtout avec une autre énergie.'};
  const how='Radiateurs : estimés en comparant chaque jour votre électricité au froid qu\'il a fait.';
  let val='',unit='',cap='',answer:unknown;
  if(sum?.both){val=sum.val;unit='€';cap='pour se chauffer';answer=html`Le poêle <b>${eur(stove!.eur)} €</b> de granulés, les radiateurs électriques <b>environ ${eur(el!.eur)} €</b>.`;}
  else if(stove){[val,unit,cap]=stove.eur!=null?[eur(stove.eur),'€','de granulés pour le poêle']:[num(stove.kg,0),'kg','de granulés brûlés'];
   answer=html`${stove.eur!=null?html`<b>${num(stove.kg,0)} kg</b> de granulés. `:''}${el?html`Les radiateurs, <b>environ ${el.eur!=null?`${eur(el.eur)} €`:`${kwh(el.kwh)} kWh`}</b>.`:why[h?.etat??'']??''}`;}
  else if(el){[val,unit,cap]=el.eur!=null?[eur(el.eur),'€','de radiateurs, environ']:[kwh(el.kwh),'kWh','de radiateurs, environ'];answer=how;}
  else return this._ans({...head,msg:h?.etat==='peu_lie'?'Une autre énergie chauffe la maison':'Le chauffage n\'est pas encore estimé',why:why[h?.etat??'']??'Ajoutez Hestia Météo, ou le suivi de votre poêle.'});
  const share=sum?.both&&el?.eur!=null&&stove?.eur!=null?stove.eur/(stove.eur+el.eur):null;
  const who=share==null?nothing:this._enc('Qui chauffe',share>=.4&&share<=.6?html`Le poêle et les radiateurs font <b>chacun la moitié</b> de la dépense.`
    :html`${share>.6?'Le poêle fait':'Les radiateurs font'} <b>${Math.round((share>.6?share:1-share)*100)} %</b> de la dépense.`,
   hb([{n:'Poêle',v:stove!.eur!,txt:`${eur(stove!.eur)} €`,sub:`${num(stove!.kg,0)} kg`},{n:'Radiateurs',v:el!.eur!,txt:`${eur(el!.eur)} €`,sub:`${kwh(el!.kwh)} kWh`}],'--nw-heat'),{foot:how});
  const deg=h?.euros_par_degre;
  const cold=deg!=null&&el?this._enc('Le froid fait la facture',html`Chaque degré de froid en plus coûte <b>environ ${cents(deg)} € par jour</b> de radiateurs.`,nothing,
   {foot:html`Exemple : un jour à 5 °C au lieu de 10 °C, <b>${eur(deg*5)} €</b> de plus.`}):nothing;
  const stock=st?.stock_kg;
  const bags=stock!=null&&st?.sac_kg?Math.round(stock/st.sac_kg*10)/10:null;
  const pellets=stock!=null&&stove?this._enc('Granulés en stock',stock<=0?html`<b>Plus de granulés</b> en stock.`
    :html`Il reste <b>${bags!=null?`${num(bags,1)} sac${bags>1?'s':''} (${num(stock,0)} kg)`:`${num(stock,0)} kg`}</b>${st?.jours_restants!=null?html` : au rythme de cette saison, <b>environ ${st.jours_restants} jours</b> de poêle`:''}.`,
   html`<div><div class="track" style="--c:var(--nw-heat)"><i style="width:${stove.kg+stock>0?stove.kg/(stove.kg+stock)*100:0}%"></i></div>
    <div class="track-l"><span>brûlés <b>${num(stove.kg,0)} kg</b></span><span>en stock <b>${num(stock,0)} kg</b></span></div></div>`):nothing;
  return html`${this._ans({...head,val,unit,cap,why:answer})}<div class="encs">${who}${cold}${pellets}</div>`;
 }

 private _night(v:View,over:boolean){
  const w=v.veille,hist=v.veille_historique??[],head={ic:'moon',c:'--nw-watch',subject:'Veille',over};
  if(!w)return this._ans({...head,period:'les dernières nuits',msg:'La veille n\'est pas encore connue',why:'Il faut deux semaines de nuits mesurées heure par heure.'});
  const n=w.nuit,e=w.evolution;
  const rows:Bar[]=(n?.appareils??[]).map(r=>({n:r.nom,v:r.w,txt:`${r.w} W`,sub:r.euros_par_an!=null?`${year(r.euros_par_an)} € par an`:undefined}));
  if(n?.sans_prise_w)rows.push({n:'Sans prise mesurée',v:n.sans_prise_w,txt:`${n.sans_prise_w} W`,sub:n.sans_prise_euros_par_an!=null?`${year(n.sans_prise_euros_par_an)} € par an`:undefined,dash:true});
  rows.sort((a,b)=>b.v-a.v);
  const what=n&&rows.length?this._enc('Ce qui tourne la nuit',n.sans_prise_w?html`Les prises mesurées expliquent <b>${n.mesure_w} W</b>. Les <b>${n.sans_prise_w} W</b> qui restent viennent d'appareils sans prise mesurée : c'est là qu'il faut chercher.`
    :html`Les prises mesurées expliquent toute la veille : <b>${n.mesure_w} W</b>.`,hb(top5(rows,x=>`${Math.round(x)} W`),'--nw-watch'),{wide:true,aside:'au plus calme de la nuit'}):nothing;
  const since=e?dayMonth(e.debut):'';
  const drift=hist.length>1?this._enc('Nuit après nuit',e&&Math.abs(e.ecart_w)>=10?html`Elle est passée de <b>${e.debut_w} W à ${w.w} W</b> depuis le ${since}${e.ecart_euros_par_an!=null?html` : <b>environ ${year(Math.abs(e.ecart_euros_par_an))} € par an</b> de ${e.ecart_w<0?'moins':'plus'}`:''}.`
    :html`Elle reste autour de <b>${w.w} W</b> depuis le ${since}.`,
   html`${cols(hist.map(x=>x.w),'--nw-watch',{pin:x=>`${x} W`,max:Math.max(...hist.map(x=>x.w))*1.09})}<div class="ticks"><span>${dayOf(hist[0].jour)} ${SHORT[noon(hist[0].jour).getMonth()]}</span><span>cette nuit</span></div>`,{wide:true}):nothing;
  return html`${this._ans({...head,period:`les ${hist.length>1?hist.length:w.nuits} dernières nuits`,val:String(w.w),unit:'W',cap:'quand tout dort',
    why:w.euros_par_an!=null?html`La maison les tire jour et nuit, même sans rien allumer : <b>environ ${year(w.euros_par_an)} € par an</b>.`:'Ce fond tourne jour et nuit, même sans rien allumer.'})}
   <div class="encs">${what}${drift}</div>`;
 }

 private _water(v:View,over:boolean){
  const e=v.eau,now=new Date(),leak=v.direct?.fuite?.minutes,head={ic:'drop',c:'--nw-water',subject:'Eau',over};
  if(!e)return this._ans({...head,period:'ce mois-ci',msg:'Pas de compteur d\'eau',why:'Ajoutez-le dans la page Énergie de Home Assistant : Hestia le lira.'});
  const days=e.jours??[],month=MONTHS[now.getMonth()];
  const pill:[string,string]=leak?[`L'eau coule depuis ${Math.round(leak)} min`,leak>=60?'--nw-alert':'--nw-act']:['Pas de fuite','--nw-ok'];
  const big=e.plus_gros;
  const ticks=days.map((d,i)=>i===days.length-1?'auj.':days.length<=12||[0,7,14,21,28].includes(i)?String(noon(d.jour).getDate()):'');
  return html`${this._ans({...head,period:`${month}, du 1er au ${now.getDate()}`,pill,
    val:num(e.mois_l,0),unit:'litres',cap:e.mois_euros!=null?html`soit <b>${bill(e.mois_euros)} €</b>`:nothing,
    why:html`${e.l_par_jour!=null?html`Environ <b>${num(e.l_par_jour,0)} litres par jour</b>. `:''}${e.prix_m3!=null?html`L'eau coûte ${price(e.prix_m3)} € le m³, soit <b>${price(e.euros_100_l)} € les 100 litres</b>.`:''}`})}
   ${days.length?html`<div class="encs">${this._enc('Jour par jour',big?html`Le plus gros jour : <b>le ${dayMonth(big.jour)}, ${num(big.l,0)} litres</b>${big.euros!=null?`, soit ${eur(big.euros)} €`:''}. Un jour qui sort du lot se voit tout de suite.`:nothing,
    html`${cols(days.map(d=>d.l),'--nw-water',{pin:x=>`${num(x,0)} L`,part:days.length-1})}<div class="ticks days">${ticks.map(t=>html`<span>${t}</span>`)}</div>`,{wide:true})}</div>`:nothing}`;
 }

 private _devices(v:View,over:boolean){
  const a=v.appareils_jour,running=v.direct?.en_marche??[],head={ic:'plug',c:'--nw-home',subject:'Appareils',period:this._until(v),over};
  if(!a||!a.appareils.length)return this._ans({...head,msg:'Aucun appareil mesuré',why:'Ajoutez vos prises mesurées dans la page Énergie de Home Assistant (consommation individuelle).'});
  const live=new Map(running.map(r=>[r.nom,r.w])),top=a.appareils[0];
  const rows:Bar[]=a.appareils.map(r=>({n:r.nom,v:r.kwh,txt:`${kwh(r.kwh)} kWh`,sub:r.euros!=null?`${eur(r.euros)} €`:undefined,live:live.has(r.nom)?`${kw(live.get(r.nom)!)} kW`:undefined}));
  // A device that runs now but has nothing counted yet today still shows, with its live power.
  for(const r of running)if(!rows.some(x=>x.n===r.nom))rows.push({n:r.nom,v:0,txt:'0 kWh',live:`${kw(r.w)} kW`});
  const shown=rows.filter((r,i)=>i<5||r.live),rest=rows.filter(r=>!shown.includes(r)),restKwh=rest.reduce((s,r)=>s+r.v,0);
  const plural=rest.length>1?'s':'';
  const foot=rest.length||a.sans_prise_kwh?html`${rest.length?html`Et ${rest.length} autre${plural} appareil${plural} mesuré${plural} : <b>${kwh(restKwh)} kWh</b>. `:''}${a.sans_prise_kwh?html`Les ${kwh(a.sans_prise_kwh)} kWh restants viennent d'appareils sans prise mesurée.`:''}`:nothing;
  return html`${this._ans({...head,val:kwh(top.kwh),unit:'kWh',cap:html`<b>${top.nom}</b>, le plus gros`,
    why:html`Les appareils mesurés font <b>${kwh(a.mesure_kwh)} kWh</b> sur les ${kwh(a.maison_kwh)} kWh de la maison.`})}
   <div class="encs">${this._enc('Appareil par appareil',top.euros!=null?html`Ce que chacun a coûté depuis minuit, soleil déduit : ${top.nom} <b>${eur(top.euros)} €</b>.`:'Ce que chacun a consommé depuis minuit.',
    hb(shown,'--nw-home'),{wide:true,aside:running.length?html`<span class="live">en marche</span>`:nothing,foot})}</div>`;
 }

 private _peak(v:View,over:boolean){
  const p=v.pointe,kva=v.contrat?.kva,hours=(v.heures?.aujourdhui??[]).map(h=>h.achat),head={ic:'bolt',c:'--nw-grid',subject:'Pointe',period:'aujourd\'hui',over};
  if(!p)return this._ans({...head,msg:'Pas encore d\'heure mesurée aujourd\'hui',why:'La pointe se lit heure par heure : il faut le compteur heure par heure.'});
  const high=p.part!=null&&p.part>=.7;
  const ranges=offpeak(v.heures_creuses),band=(i:number)=>ranges.some(([a,b])=>i*60+30>=a&&i*60+30<b);
  const far=p.part==null?'':p.part<.5?'vous en êtes loin':p.part<.8?'il reste de la marge':'vous en êtes tout près';
  return html`${this._ans({...head,pill:kva?(high?['Près de la limite','--nw-act']:['De la marge','--nw-ok']):undefined,
    val:kw(p.kw*1000),unit:'kW',cap:`pris au réseau entre ${hour(p.h)} et ${hour(p.h+1)}`,
    why:html`${kva?html` Le compteur coupe au-delà de <b>${kva} kVA</b> (environ ${kva} kW) : ${far}.`:'L\'heure la plus chargée de la journée.'}`})}
   <div class="encs">${this._enc('Heure par heure',p.part!=null?html`La barre la plus haute reste à <b>${part(p.part)} de la limite</b> : ${high?'deux gros appareils de plus pourraient faire couper le compteur':'rien ne risque de faire couper le compteur'}.`:nothing,
    html`${cols(hours,'--nw-grid',{pin:x=>`${kw(x*1000)} kW`,bands:ranges.length?band:undefined,tall:true,...(kva?{max:kva*1.07,limit:kva,limitLabel:`limite ${kva} kVA`}:{})})}${H_TICKS}
     <div class="nw-legend"><span><i style="--c:var(--nw-grid)"></i>pris au réseau, en moyenne sur l'heure</span>${ranges.length?html`<span><i style="--c:color-mix(in oklab, var(--nw-cold) 40%, transparent)"></i>heures creuses</span>`:nothing}</div>`,{wide:true})}</div>`;
 }

 private _contract(v:View,over:boolean){
  const c=v.contrat,now=new Date(),head={ic:'doc',c:'--nw-ok',subject:'Contrat',period:'ce mois-ci',over};
  const ranges=offpeak(v.heures_creuses),night=atNight(ranges);
  const supposed=c?.a_confirmer??[];
  const kvaSay=html`${c?.kva?`Puissance : ${c.kva} kVA${supposed.includes('kva')?' (supposée)':''}.`:''}${supposed.length?html` <a class="to-hub" href="/hestia/energie/reglages" @click=${toHub}>${supposed.includes('option')?(supposed.length>1?'Option et puissance':'Option'):'Puissance'} à confirmer dans les Réglages ›</a>`:nothing}`;
  const lines:[string,number|null|undefined,string][]=[
   ...(c?.option==='hphc'?[['Heures pleines',c.prix_hp,'le kWh'],['Heures creuses',c.prix_hc,'le kWh']] as [string,number|null|undefined,string][]
    :c?.option==='base'?[['Le kWh',c.prix_base,'à toute heure']] as [string,number|null|undefined,string][]:[]),
   [`Abonnement${c?.kva?` ${c.kva} kVA`:''}`,c?.abonnement_mois,'par mois'],['Revente du soleil',c?.revente,'le kWh']];
  const prices=this._enc('Vos prix',c?.abonnement_mois!=null?html`L'abonnement, <b>${eur(c.abonnement_mois)} € par mois</b>, se paie même sans rien consommer.`:nothing,
   html`<div class="hb list">${lines.filter(r=>r[1]!=null).map(([n,x,u])=>html`<span class="n">${n}</span><span class="v">${u==='par mois'?eur(x):price(x)} €<small>${u}</small></span>`)}</div>`);
  if(c?.option!=='hphc'){
   const base=c?.option==='base';
   return html`${this._ans({...head,...(base&&c?.prix_base!=null?{val:price(c.prix_base),unit:'€',cap:`le kWh à toute heure, option Base${supposed.includes('option')?' (supposée)':''}`}:{msg:`Option ${c?.option==='tempo'?'Tempo':'Base'}`}),why:kvaSay})}
    <div class="encs">${prices}</div>`;
  }
  const label=v.heures_creuses?.length?v.heures_creuses.map(([a,b])=>`${nb(a)} à ${nb(b)}`).join(' et de '):null;
  const nowMin=now.getHours()*60+now.getMinutes(),off=c.prix_hp&&c.prix_hc?1-c.prix_hc/c.prix_hp:null;
  const share=c.part_hc,seuil=c.seuil_hc,mois=v.mois?.euros,gain=c.base_euros!=null&&mois!=null?c.base_euros-mois:null;
  const pays=share!=null&&seuil!=null?this._enc('Les heures creuses rapportent-elles ?',html`Ce mois-ci, <b>${Math.round(share*100)} %</b> de vos achats sont tombés ${night?'la nuit':'en heures creuses'}. Elles rapportent à partir de <b>${Math.round(seuil*100)} %</b>${gain!=null?html` : sans elles (option Base), vous auriez payé <b>${eur(Math.abs(gain))} € de ${gain<0?'moins':'plus'}</b>`:''}.`,
   html`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${share*100}%"></i><span class="mark" style="left:${Math.min(100,seuil*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(share*100)} %</b></span><span>rentable dès <b>${Math.round(seuil*100)} %</b></span></div></div>`):nothing;
  const first=v.heures_creuses?.[0];void label;
  return html`${this._ans({...head,...(first?{val:`${nb(first[0])} – ${nb(first[1])}`,cap:v.heures_creuses!.length>1?`heures creuses, et de ${v.heures_creuses!.slice(1).map(([a,b])=>`${nb(a)} à ${nb(b)}`).join(', ')}`:'les heures creuses'}:{msg:'Heures pleines et heures creuses'}),
    why:html`${c.prix_hc!=null&&c.prix_hp!=null?html`${night?'La nuit':'En heures creuses'}, le kWh coûte <b>${price(c.prix_hc)} €</b> au lieu de <b>${price(c.prix_hp)} €</b>${night?' le jour':''}. `:''}${kvaSay}`})}
   <div class="encs">
    ${ranges.length?this._enc('Votre journée',off!=null?html`En bleu, les heures creuses : tout ce qui peut attendre y coûte <b>${part(off)} de moins</b>.`:'En bleu, les heures creuses.',
     html`<div><div class="day">${ranges.map(([a,b])=>html`<i style="left:${a/14.4}%;width:${(b-a)/14.4}%"></i>`)}<span class="now" style="left:${nowMin/14.4}%"></span></div>${H_TICKS}</div>`,
     {wide:true,aside:`il est ${clock(now)}`}):nothing}
    ${prices}${pays}
   </div>`;
 }
}

if(!customElements.get('hestia-energy-card'))customElements.define('hestia-energy-card',HestiaEnergyCard);
const w=window as unknown as {customCards?:unknown[]};
w.customCards=w.customCards??[];
if(!w.customCards.some(c=>(c as {type?:string}).type==='hestia-energy-card'))
 w.customCards.push({type:'hestia-energy-card',name:'Hestia Énergie',description:'Le conseiller énergie de la maison : tuile, carte complète, cartes de détail.',preview:true});
