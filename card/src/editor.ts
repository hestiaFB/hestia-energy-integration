import {LitElement,html,css,nothing} from 'lit';

/* The card's editor (ha-form for the title: the only field Home Assistant always loads in its card dialog), built like Hestia Confort's but shorter (« jamais une usine à gaz »): one sentence, the formats as
   tiles (an icon, a name, what it shows), an optional title. Everything else is set in the « Énergie » tab. */
type Config={type:string;card?:string;name?:string};
type Hass={language?:string};

/** Each format: its icon, its name, what it shows and over which period (maquette des cartes 2). The order is the mock-up's. */
export const FORMATS:[string,string,string,string][]=[
 ['complete','mdi:page-layout-body','Complète','en ce moment, aujourd’hui, ce mois-ci, puis le détail'],
 ['tuile','mdi:dock-window','Tuile','en ce moment : une phrase, un chiffre'],
 ['conseils','mdi:piggy-bank-outline','Conseils','ce qui ferait économiser, en euros par an'],
 ['soleil','mdi:solar-power-variant','Soleil','ce que les panneaux ont produit aujourd’hui'],
 ['chauffage','mdi:fire','Chauffage','ce qu’a coûté le mois, compté par Hestia Chauffage'],
 ['veille','mdi:weather-night','Veille','ce qui tourne la nuit, les 30 dernières nuits'],
 ['eau','mdi:water','Eau','les litres et les euros du mois'],
 ['gaz','mdi:fire','Gaz','les m³ ou kWh et les euros du mois, abonnement compris'],
 ['appareils','mdi:power-plug','Appareils','ce que chaque appareil a consommé aujourd’hui'],
 ['pointe','mdi:transmission-tower','Pointe','la plus forte puissance prise aujourd’hui'],
 ['contrat','mdi:file-document-outline','Contrat','vos heures creuses et vos prix, ce mois-ci'],
 ['chauffe_eau','mdi:water-boiler','Chauffe-eau','son plan de chauffe et sa réserve d’eau chaude'],
];

const follow=(e:MouseEvent)=>{e.preventDefault();history.pushState(null,'',(e.currentTarget as HTMLAnchorElement).getAttribute('href')??'/hestia/energie');
 window.dispatchEvent(new CustomEvent('location-changed',{bubbles:true,composed:true}));};

export class EnergyEditor extends LitElement {
 static properties={hass:{attribute:false},config:{state:true}};
 hass?:Hass;
 config?:Config;
 static styles=css`.note{color:var(--secondary-text-color);font-size:12px;line-height:1.6;margin:0 0 16px}a{color:var(--primary-color)}
  .formats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:4px 0 16px}
  .formats button{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:12px;cursor:pointer;color:var(--primary-text-color);font-size:12px;line-height:1.45}
  .formats button:hover{border-color:var(--secondary-text-color)}
  .formats button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
  .formats button.on{border:2px solid var(--primary-color);padding:9px 11px}
  .formats ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color)}.formats button.on ha-icon{color:var(--primary-color)}
  .formats b{font-size:14px;font-weight:500}.formats span{color:var(--secondary-text-color)}`;
 setConfig(config:Config){this.config={...config};}
 private set(change:Partial<Config>){
  const next:Config={...this.config!,...change};
  if(!next.name)delete next.name;
  if(next.card==='complete')delete next.card;      // the default format is not written
  this.config=next;
  this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:next},bubbles:true,composed:true}));
 }
 protected render(){
  if(!this.config)return nothing;
  const card=this.config.card??'complete';
  return html`<p class="note">Choisissez ce que montre la carte. Le contrat, les réglages et les extensions se règlent dans
    <a href="/hestia/energie" @click=${follow}>l’onglet Énergie</a>.</p>
   <div class="formats" role="radiogroup" aria-label="Format">${FORMATS.map(([value,icon,name,text])=>html`<button type="button" role="radio" aria-checked=${value===card}
     class=${value===card?'on':''} @click=${()=>{if(value!==card)this.set({card:value});}}><ha-icon icon=${icon}></ha-icon><b>${name}</b><span>${text}</span></button>`)}</div>
   <ha-form .hass=${this.hass} .data=${{name:this.config.name??''}} .schema=${[{name:'name',selector:{text:{}}}]}
     .computeLabel=${()=>'Titre facultatif'} .computeHelper=${()=>'Vide : « Maison ».'}
     @value-changed=${(e:CustomEvent<{value:{name?:string}}>)=>{e.stopPropagation();this.set({name:(e.detail.value.name??'').trim()});}}></ha-form>`;
 }
}
if(!customElements.get('hestia-energy-card-editor'))customElements.define('hestia-energy-card-editor',EnergyEditor);
