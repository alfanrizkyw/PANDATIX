/* ikon (gaya lucide) */
const IC={
search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
right:'<path d="m9 18 6-6-6-6"/>', left:'<path d="m15 18-6-6 6-6"/>',
plusc:'<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>', plus:'<path d="M5 12h14M12 5v14"/>', minus:'<path d="M5 12h14"/>',
timer:'<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
vert:'<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>', ruler:'<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>',
waves:'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
shield:'<path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
checkc:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', check:'<path d="M20 6 9 17l-5-5"/>',
cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
qr:'<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/>',
card:'<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
hourglass:'<path d="M5 22h14M5 2h14"/><path d="M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22"/><path d="M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4A2 2 0 0 0 17 6.2V2"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
pin:'<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
dl:'<path d="M12 15V3M7 10l5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
ticket:'<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
bag:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
cloud:'<path d="M12 2v2M4.9 4.9l1.4 1.4M20 12h2M17.7 6.3l1.4-1.4"/><path d="M15.9 12.2a4 4 0 0 0-7.4-1.3A4.5 4.5 0 0 0 9 20h8a4 4 0 0 0-1.1-7.8z" fill="#fff" stroke="#fff"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
cam:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>', xc:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>',
copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
flash:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
keyboard:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>'
};
const ico=(n,s=18,sw=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${IC[n]||''}</svg>`;
const rp=n=>'Rp '+Math.round(n).toLocaleString('id-ID');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const BF=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const HR=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const HF=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const W=t=>new Date(+t+7*3600e3); // WIB via getUTC*
const fDate=(t,full)=>{const d=W(t);return d.getUTCDate()+' '+(full?BF:BL)[d.getUTCMonth()]+' '+d.getUTCFullYear()};
const fTime=t=>{const d=W(t);return String(d.getUTCHours()).padStart(2,'0')+'.'+String(d.getUTCMinutes()).padStart(2,'0')};
const fTimeS=t=>fTime(t)+'.'+String(W(t).getUTCSeconds()).padStart(2,'0');
async function api(url,opt={}){
  const o={method:opt.method||'GET',headers:{...(opt.headers||{})},cache:'no-store'};
  if(opt.body!==undefined){o.body=JSON.stringify(opt.body);o.headers['Content-Type']='application/json'}
  let r;try{r=await fetch(url,o)}catch(e){throw new Error('Tidak dapat terhubung ke server.')}
  const j=await r.json().catch(()=>({}));
  if(!r.ok){const e=new Error(j.error||'Terjadi kesalahan');e.status=r.status;throw e}
  return j;
}
function toast(msg,bad){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.toggle('bad',!!bad);requestAnimationFrame(()=>t.classList.add('show'));clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2800)}
function qrSvg(text,px,margin=0){
  const q=qrcode(0,'M');q.addData(text);q.make();const n=q.getModuleCount();let d='';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c+margin} ${r+margin}h1v1h-1z`;
  const s=n+margin*2;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${px}" height="${px}" shape-rendering="crispEdges"><path d="${d}" fill="#181C19"/></svg>`;
}
function qrCanvas(ctx,text,x,y,size){
  const q=qrcode(0,'M');q.addData(text);q.make();const n=q.getModuleCount(),m=size/n;ctx.fillStyle='#181C19';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))ctx.fillRect(Math.round(x+c*m),Math.round(y+r*m),Math.ceil(m),Math.ceil(m));
}
/* SSE dengan auto reconnect */
function listen(url,handlers,onState){
  let es,dead=false;
  const open=()=>{if(dead)return;es=new EventSource(url);es.onopen=()=>onState&&onState(true);es.onerror=()=>{onState&&onState(false)};
    for(const k in handlers)es.addEventListener(k,e=>{try{handlers[k](JSON.parse(e.data))}catch(x){}});};
  open();return{close(){dead=true;es&&es.close()}};
}
/* kamera scanner (BarcodeDetector -> fallback jsQR) */
class Scanner{
  constructor(video,onCode){this.v=video;this.on=onCode;this.run=false;this.cv=document.createElement('canvas');this.cx=this.cv.getContext('2d',{willReadFrequently:true});this.last='';this.lastAt=0;this.hold=0}
  async start(){
    this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
    this.v.srcObject=this.stream;this.v.setAttribute('playsinline','');await this.v.play();
    if('BarcodeDetector' in window){try{this.bd=new BarcodeDetector({formats:['qr_code']})}catch(e){this.bd=null}}
    this.run=true;this.loop();
  }
  stop(){this.run=false;if(this.stream)this.stream.getTracks().forEach(t=>t.stop());this.stream=null}
  pause(ms){this.hold=Date.now()+ms}
  async loop(){
    if(!this.run)return;
    if(Date.now()>=this.hold&&this.v.readyState>=2){
      let val=null;
      try{
        if(this.bd){const r=await this.bd.detect(this.v);if(r[0])val=r[0].rawValue}
        else if(window.jsQR){const w=this.v.videoWidth,h=this.v.videoHeight,k=Math.min(1,640/w);this.cv.width=w*k;this.cv.height=h*k;this.cx.drawImage(this.v,0,0,this.cv.width,this.cv.height);
          const id=this.cx.getImageData(0,0,this.cv.width,this.cv.height);const r=jsQR(id.data,id.width,id.height,{inversionAttempts:'dontInvert'});if(r)val=r.data}
      }catch(e){}
      if(val&&(val!==this.last||Date.now()-this.lastAt>3000)){this.last=val;this.lastAt=Date.now();this.on(val)}
    }
    setTimeout(()=>requestAnimationFrame(()=>this.loop()),this.bd?60:90);
  }
}
