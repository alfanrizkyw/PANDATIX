/* shell login + header untuk halaman internal */
const Shell={
  me:null,
  async boot({roles,roleLabel,sub,onReady,idPrefix}){
    this.cfg={roles,roleLabel,sub,onReady,idPrefix};
    try{this.me=await api('/api/me')}catch(e){this.me=null}
    if(!this.me)return this.login();
    if(!(this.me.role==='admin'||roles.includes(this.me.role)))return this.denied();
    this.render();
  },
  login(msg){
    document.body.innerHTML=`<div class="login"><form class="card" id="lf"><div><div class="logo">PANDATIX</div><p style="margin-top:6px">Masuk sebagai ${this.cfg.roleLabel}</p></div>
    <div class="field"><label for="u">Username</label><input class="inp" id="u" autocomplete="username" autocapitalize="none" required></div>
    <div class="field"><label for="p">Kata sandi</label><input class="inp" id="p" type="password" autocomplete="current-password" required></div>
    <span class="errtxt" id="le" ${msg?'':'hidden'}>${esc(msg||'')}</span><button class="btn block" id="lb">Masuk</button></form></div>`;
    $('#lf').onsubmit=async e=>{e.preventDefault();const b=$('#lb');b.disabled=true;
      try{await api('/api/login',{method:'POST',body:{username:$('#u').value,password:$('#p').value}});location.reload()}
      catch(x){$('#le').textContent=x.message;$('#le').hidden=false;b.disabled=false;$('.login .card').style.animation='shake .4s'}};
    $('#u').focus();
  },
  denied(){document.body.innerHTML=`<div class="login"><div class="card"><div class="logo">PANDATIX</div><h3>Akses ditolak</h3><p>Akun <b>${esc(this.me.username)}</b> tidak punya akses ke halaman ${this.cfg.roleLabel}.</p><button class="btn block" onclick="Shell.logout()">Keluar</button></div></div>`},
  async logout(){try{await api('/api/logout',{method:'POST',body:{}})}catch(e){}location.reload()},
  render(){
    const {roleLabel,sub,idPrefix}=this.cfg,u=this.me,ini=u.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
    const root=document.createElement('div');
    root.innerHTML=`<header class="sh"><div class="wrap"><div class="sh-l"><div class="row"><span class="logo">PANDATIX</span><span class="role">${roleLabel}</span></div><small>Lembah Pandawa, Pandaan</small></div>
    <div class="sh-r"><span class="live" id="live"><i></i><span id="clk">Live</span></span><span class="sh-sep"></span><div class="usr"><div><b>${esc(u.name)}</b><small>ID #${(idPrefix||u.role.toUpperCase())}-${esc(u.username.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(-2)||'01')}</small></div><span class="av">${ini}</span></div>
    <button class="out" onclick="Shell.logout()">${ico('out',16,2)}Keluar</button></div></div></header><main class="main" id="main"></main>`;
    document.body.innerHTML='';document.body.appendChild(root);
    const tick=()=>{const n=Date.now();$('#clk').textContent='Live '+fTime(n)+' WIB'};tick();setInterval(tick,5000);
    this.cfg.onReady($('#main'),u);
  },
  stream(handlers){
    return listen('/api/stream',handlers,ok=>{const l=$('#live');if(!l)return;l.classList.toggle('off',!ok);if(!ok)$('#clk').textContent='Terputus…';else{const n=Date.now();$('#clk').textContent='Live '+fTime(n)+' WIB';if(handlers._reconnect)handlers._reconnect()}});
  }
};
const debounce=(f,ms=250)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}};
