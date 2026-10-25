'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = +process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PUB = path.join(__dirname, 'public');
const ADMIN_FEE = 5000, QTY_MAX = 50, PENDING_TTL = 2 * 3600e3;

/* ---------- katalog ---------- */
const WAHANA = [
  {id:'ombak-raksasa',nama:'Roller Coaster Samudra',kategori:'Ekstrem',harga:85000,durasi:'3 mnt',tinggi:'120 cm',favorit:true,desc:'Roller coaster tercepat di Lembah Pandawa, menukik tajam menghadap laut lepas.'},
  {id:'seluncur-naga',nama:'Seluncur Naga',kategori:'Air',harga:65000,durasi:'2 mnt',tinggi:'120 cm',favorit:true,desc:'Perosotan air sepanjang 80 meter dengan tikungan berliku menyerupai tubuh naga.'},
  {id:'bianglala',nama:'Bianglala Cakrawala',kategori:'Santai',harga:45000,durasi:'8 mnt',tinggi:'Semua usia',favorit:true,desc:'Kincir raksasa dengan kabin tertutup, pemandangan pantai dari ketinggian 40 meter.'},
  {id:'kapal-karam',nama:'Kapal Karam',kategori:'Ekstrem',harga:55000,durasi:'10 mnt',tinggi:'130 cm',desc:'Rumah hantu bertema kapal karam dengan efek suara dan visual yang mendebarkan.'},
  {id:'kolam-ombak',nama:'Kolam Ombak Buatan',kategori:'Air',harga:50000,durasi:'Bebas',tinggi:'Semua usia',favorit:true,desc:'Kolam ombak buatan dengan gelombang setiap 15 menit sekali.'},
  {id:'flying-fox',nama:'Flying Fox Camar',kategori:'Ekstrem',harga:70000,durasi:'1 mnt',tinggi:'135 cm',favorit:true,desc:'Meluncur sejauh 250 meter di atas kanopi pantai dengan kecepatan angin laut.'},
  {id:'kereta-mini',nama:'Kereta Mini Pesisir',kategori:'Santai',harga:35000,durasi:'12 mnt',tinggi:'Semua usia',desc:'Kereta wisata yang berkeliling seluruh area Lembah Pandawa.'},
  {id:'dunia-air-cilik',nama:'Dunia Air Cilik',kategori:'Anak',harga:40000,durasi:'Bebas',tinggi:'Maks 120 cm',desc:'Area bermain air khusus anak dengan kedalaman aman.'},
  {id:'rumah-cermin',nama:'Rumah Kaca Cermin',kategori:'Santai',harga:30000,durasi:'5 mnt',tinggi:'Semua usia',desc:'Labirin cermin yang memantulkan cahaya ke segala arah.'},
  {id:'tornado-air',nama:'Tornado Air',kategori:'Air',harga:75000,durasi:'3 mnt',tinggi:'130 cm',favorit:true,desc:'Perosotan berbentuk corong raksasa yang berputar sebelum menjatuhkan pengunjung.'},
  {id:'komidi-putar',nama:'Komidi Putar Bahari',kategori:'Anak',harga:25000,durasi:'6 mnt',tinggi:'Maks 130 cm',desc:'Komidi putar klasik dengan tema makhluk laut.'},
  {id:'bumper-boat',nama:'Bumper Boat',kategori:'Air',harga:45000,durasi:'5 mnt',tinggi:'110 cm',desc:'Perahu kecil yang bisa ditabrakkan satu sama lain di kolam dangkal.'},
  {id:'taman-lumba',nama:'Taman Lumba-Lumba',kategori:'Anak',harga:35000,durasi:'Bebas',tinggi:'Semua usia',desc:'Area interaktif dengan pertunjukan lumba-lumba mini.'}
];
const PAKET = [
  {id:'paket-murah',nama:'Paket Murah',tag:'Murah',kelas:'murah',desc:'Buat yang mau seru-seruan santai tanpa bikin kantong bolong.',wahanaIds:['dunia-air-cilik','komidi-putar'],harga:55000},
  {id:'paket-reguler',nama:'Paket Reguler',tag:'Reguler',kelas:'reguler',desc:'Pilihan seimbang dengan 3 wahana favorit keluarga.',wahanaIds:['kereta-mini','rumah-cermin','komidi-putar'],harga:79000},
  {id:'paket-mahal',nama:'Paket Premium',tag:'Premium',kelas:'premium',desc:'Paling lengkap, 3 wahana seru buat sehari penuh keseruan.',wahanaIds:['kapal-karam','bumper-boat','taman-lumba'],harga:119000}
];
const wById = id => WAHANA.find(w => w.id === id);
const pById = id => PAKET.find(p => p.id === id);
for (const p of PAKET) p.normal = p.wahanaIds.reduce((s, i) => s + wById(i).harga, 0);

/* ---------- util ---------- */
const rnd = n => crypto.randomBytes(n).toString('base64url');
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = n => Array.from(crypto.randomBytes(n), b => ALPHA[b % 32]).join('');
const wib = (d = Date.now()) => new Date(+d + 7 * 3600e3);
const dayKey = d => wib(d).toISOString().slice(0, 10);
const hash = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString('hex');
const same = (a, b) => { a = Buffer.from(a); b = Buffer.from(b); return a.length === b.length && crypto.timingSafeEqual(a, b); };

/* ---------- database: Supabase ---------- */
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Konfigurasi Supabase belum lengkap. Set SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di environment hosting.');
}
let db = { users: [], petugas: [], orders: [], tickets: [], scans: [], sessions: {}, seq: {} };
let saveT = null, saveInFlight = Promise.resolve(), dbReady = false;
const stateUrl = () => `${SUPABASE_URL}/rest/v1/pandatix_state?id=eq.1`;
const sbHeaders = () => ({ 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' });
async function loadDatabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur.');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/pandatix_state?select=data&id=eq.1`, { headers: sbHeaders() });
  if (!r.ok) throw new Error(`Gagal membaca database Supabase (${r.status}): ${await r.text()}`);
  const rows = await r.json();
  if (rows.length) db = Object.assign(db, rows[0].data || {});
  else {
    const create = await fetch(`${SUPABASE_URL}/rest/v1/pandatix_state`, { method: 'POST', headers: { ...sbHeaders(), 'Prefer': 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ id: 1, data: db }) });
    if (!create.ok) throw new Error(`Gagal membuat state Supabase (${create.status}): ${await create.text()}`);
  }
  dbReady = true;
}
function save() {
  if (!dbReady) return;
  if (saveT) clearTimeout(saveT);
  saveT = setTimeout(() => {
    saveT = null;
    const snapshot = JSON.stringify(db);
    saveInFlight = saveInFlight.then(async () => {
      const r = await fetch(stateUrl(), { method: 'PATCH', headers: sbHeaders(), body: JSON.stringify({ data: JSON.parse(snapshot) }) });
      if (!r.ok) console.error('Gagal menyimpan data ke Supabase:', r.status, await r.text());
    }).catch(e => console.error('Gagal menyimpan data ke Supabase:', e.message));
  }, 150);
}
async function flushSave() {
  if (saveT) {
    clearTimeout(saveT); saveT = null;
    const snapshot = JSON.stringify(db);
    saveInFlight = saveInFlight.then(async () => {
      const r = await fetch(stateUrl(), { method: 'PATCH', headers: sbHeaders(), body: JSON.stringify({ data: JSON.parse(snapshot) }) });
      if (!r.ok) console.error('Gagal menyimpan data ke Supabase:', r.status, await r.text());
    });
  }
  await saveInFlight;
}
/* ---------- realtime (SSE) ---------- */
const clients = new Set(); // {res, kind, roles, orderId, petugasId}
function sse(res) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.write('retry: 1000\n\n');
}
function emit(filter, event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of clients) if (filter(c)) { try { c.res.write(msg); } catch (e) {} }
}
setInterval(() => { for (const c of clients) try { c.res.write(': ping\n\n'); } catch (e) {} }, 20000);

/* ---------- domain ---------- */
function nextSeq(name) { db.seq[name] = (db.seq[name] || 0) + 1; return db.seq[name]; }
function expireOrders() {
  const now = Date.now();
  for (const o of db.orders) if (o.status === 'pending' && now - o.createdAt > PENDING_TTL) o.status = 'expired';
}
function ordTickets(o) { return db.tickets.filter(t => t.orderId === o.id); }
function pubTicket(t) {
  return { code: t.code, no: t.no, total: t.total, type: t.type, refId: t.refId, name: t.name, price: t.price, validDate: t.validDate,
    rides: t.rides.map(id => ({ id, nama: wById(id).nama, used: t.usage[id] ? t.usage[id].at : null })) };
}
function pubOrder(o, withTickets = true) {
  const r = { id: o.id, code: o.code, nota: o.nota, nama: o.nama, method: o.method, items: o.items, subtotal: o.subtotal, fee: o.fee, total: o.total,
    status: o.status, createdAt: o.createdAt, confirmedAt: o.confirmedAt || null, confirmedByName: o.confirmedByName || null };
  if (withTickets && o.status === 'confirmed') r.tickets = ordTickets(o).map(pubTicket);
  return r;
}
function createOrder(body) {
  const nama = String(body.nama || '').trim().slice(0, 60);
  if (nama.length < 2) throw err(400, 'Nama lengkap wajib diisi.');
  const method = ['tunai', 'qris', 'kartu', 'ewallet'].includes(body.method) ? body.method : null;
  if (!method) throw err(400, 'Pilih metode pembayaran.');
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 20) throw err(400, 'Keranjang kosong.');
  const items = [];
  for (const it of body.items) {
    const qty = Math.floor(+it.qty);
    if (!(qty >= 1 && qty <= QTY_MAX)) throw err(400, 'Jumlah tiket tidak valid.');
    const ref = it.type === 'paket' ? pById(it.id) : wById(it.id);
    if (!ref) throw err(400, 'Item tidak ditemukan.');
    const ex = items.find(x => x.refId === ref.id);
    if (ex) ex.qty = Math.min(QTY_MAX, ex.qty + qty);
    else items.push({ type: it.type === 'paket' ? 'paket' : 'wahana', refId: ref.id, name: ref.nama, price: ref.harga, qty });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const n = String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
  const d = wib();
  const o = { id: rnd(9), key: rnd(18), code: `PTX-${n.slice(0, 4)}-${n.slice(4)}`, nama, method, items, subtotal, fee: ADMIN_FEE, total: subtotal + ADMIN_FEE,
    status: 'pending', createdAt: Date.now() };
  db.orders.push(o); save();
  emit(c => c.kind === 'staff', 'order', { id: o.id });
  return o;
}
function normCode(s) {
  s = String(s || '').trim();
  try { const u = new URL(s); s = u.searchParams.get('order') || s; } catch (e) {}
  return s.toUpperCase().replace(/\s+/g, '');
}
function findOrderByCode(c) { c = normCode(c); return db.orders.find(o => o.code === c); }
function confirmOrder(o, user) {
  expireOrders();
  if (o.status === 'confirmed') throw err(409, 'Pesanan ini sudah dikonfirmasi sebelumnya.');
  if (o.status !== 'pending') throw err(410, 'Pesanan sudah kedaluwarsa. Minta pelanggan membuat pesanan baru.');
  const now = Date.now(), d = wib(now);
  o.status = 'confirmed'; o.confirmedAt = now; o.confirmedBy = user.id; o.confirmedByName = user.name;
  o.nota = 'PTX' + d.toISOString().slice(2, 10).replace(/-/g, '') + String(nextSeq('nota-' + dayKey(now))).padStart(3, '0');
  const total = o.items.reduce((s, i) => s + i.qty, 0);
  let no = 0;
  for (const it of o.items) {
    const rides = it.type === 'paket' ? pById(it.refId).wahanaIds.slice() : [it.refId];
    for (let k = 0; k < it.qty; k++) {
      let c; do { c = 'PT-' + code(6); } while (db.tickets.some(t => t.code === c));
      db.tickets.push({ code: c, orderId: o.id, no: ++no, total, type: it.type, refId: it.refId, name: it.name, price: it.price, rides, usage: {}, validDate: dayKey(now) });
    }
  }
  save();
  emit(c => c.kind === 'staff', 'order', { id: o.id });
  emit(c => c.kind === 'order' && c.orderId === o.id, 'order', pubOrder(o));
  return o;
}
function redeem(p, rawCode, ip) {
  const c = String(rawCode || '').trim().toUpperCase().replace(/\s+/g, '');
  const w = wById(p.wahanaId);
  const log = (result, reason, t) => {
    const e = { at: Date.now(), code: c, wahanaId: p.wahanaId, petugasId: p.id, petugas: p.name, result, reason, nama: t && (db.orders.find(o => o.id === t.orderId) || {}).nama };
    db.scans.push(e); if (db.scans.length > 20000) db.scans.splice(0, 2000); save();
    emit(x => x.kind === 'staff' || (x.kind === 'scan' && x.petugasId === p.id), 'scan', e);
    return e;
  };
  const t = db.tickets.find(x => x.code === c);
  if (!t) { log('invalid', 'not_found'); return { ok: false, reason: 'not_found', msg: 'Tiket tidak ditemukan.' }; }
  const o = db.orders.find(x => x.id === t.orderId);
  if (!o || o.status !== 'confirmed') { log('invalid', 'unpaid', t); return { ok: false, reason: 'unpaid', msg: 'Tiket belum aktif.' }; }
  if (t.validDate !== dayKey()) { log('invalid', 'expired', t); return { ok: false, reason: 'expired', msg: 'Tiket tidak berlaku hari ini.', nama: o.nama }; }
  if (!t.rides.includes(p.wahanaId)) { log('invalid', 'wrong_ride', t); return { ok: false, reason: 'wrong_ride', msg: 'Tiket ini tidak berlaku untuk wahana ' + w.nama + '.', nama: o.nama }; }
  const u = t.usage[p.wahanaId];
  if (u) { log('invalid', 'used', t); return { ok: false, reason: 'used', msg: 'Tiket sudah dipakai.', usedAt: u.at, nama: o.nama }; }
  t.usage[p.wahanaId] = { at: Date.now(), by: p.id, byName: p.name };
  log('ok', '', t);
  emit(x => x.kind === 'order' && x.orderId === o.id, 'order', pubOrder(o));
  return { ok: true, msg: 'Tiket valid, silakan masuk.', nama: o.nama, ticketNo: t.no, total: t.total, tiket: t.name };
}
function todayStats(p) {
  const k = dayKey();
  const mine = db.scans.filter(s => s.petugasId === p.id && dayKey(s.at) === k);
  return { okCount: mine.filter(s => s.result === 'ok').length, rejected: mine.filter(s => s.result !== 'ok').length,
    recent: mine.slice(-15).reverse() };
}
function report(range) {
  const conf = db.orders.filter(o => o.status === 'confirmed');
  const now = Date.now(), today = dayKey(now), yest = dayKey(now - 864e5), month = today.slice(0, 7);
  const sum = f => { const l = conf.filter(f); return { total: l.reduce((s, o) => s + o.total, 0), trx: l.length, tiket: l.reduce((s, o) => s + ordTickets(o).length, 0) }; };
  const days = [];
  for (let i = 6; i >= 0; i--) { const t = now - i * 864e5; const k = dayKey(t); days.push({ key: k, label: wib(t).getUTCDate(), dow: wib(t).getUTCDay(), month: wib(t).getUTCMonth(), ...sum(o => dayKey(o.confirmedAt) === k) }); }
  const by = {};
  for (const o of conf) { const k = dayKey(o.confirmedAt); (by[k] = by[k] || []).push(o); }
  let keys = Object.keys(by).sort().reverse();
  if (range === 'bulan') keys = keys.filter(k => k.startsWith(month));
  else if (range !== 'semua') keys = keys.filter(k => k >= dayKey(now - 6 * 864e5));
  const rows = keys.map(k => ({ key: k, trx: by[k].length, tiket: by[k].reduce((s, o) => s + ordTickets(o).length, 0), total: by[k].reduce((s, o) => s + o.total, 0),
    ket: [...new Set(by[k].flatMap(o => o.items.map(i => i.name)))].slice(0, 2).join(' & ') + (new Set(by[k].flatMap(o => o.items.map(i => i.name))).size > 2 ? ' +' : '') }));
  return { today: sum(o => dayKey(o.confirmedAt) === today), yesterday: sum(o => dayKey(o.confirmedAt) === yest), month: sum(o => dayKey(o.confirmedAt).startsWith(month)),
    all: sum(() => true), days, rows, todayKey: today, yesterdayKey: yest };
}

/* ---------- http ---------- */
function err(status, msg) { const e = new Error(msg); e.status = status; return e; }
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const send = (res, status, obj, headers = {}) => { const b = JSON.stringify(obj); res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(b); };
const readBody = req => new Promise((ok, no) => { let b = ''; req.on('data', d => { b += d; if (b.length > 1e5) { req.destroy(); no(err(413, 'Terlalu besar')); } }); req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch (e) { no(err(400, 'JSON tidak valid')); } }); });
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').map(s => s.trim().split('=')).filter(a => a[0]).map(a => [a[0], decodeURIComponent(a[1] || '')]));
function sessionUser(req) {
  const s = db.sessions[cookies(req).ptx]; if (!s) return null;
  if (s.exp < Date.now()) { delete db.sessions[cookies(req).ptx]; return null; }
  const u = db.users.find(x => x.id === s.uid); return u && u.active ? u : null;
}
function need(req, ...roles) { const u = sessionUser(req); if (!u || (roles.length && !roles.includes(u.role) && u.role !== 'admin')) throw err(401, 'Silakan masuk terlebih dahulu.'); return u; }
function petugasByToken(t) { const p = db.petugas.find(x => x.token === t && x.active); return p; }
const hits = new Map();
function limit(key, max, ms) { const n = Date.now(), a = (hits.get(key) || []).filter(t => n - t < ms); a.push(n); hits.set(key, a); if (a.length > max) throw err(429, 'Terlalu banyak percobaan, coba sebentar lagi.'); }
const pubUser = u => ({ id: u.id, role: u.role, username: u.username, name: u.name, active: u.active });
const pubPetugas = p => { const w = wById(p.wahanaId); const k = dayKey(); const n = db.scans.filter(s => s.petugasId === p.id && s.result === 'ok' && dayKey(s.at) === k).length;
  return { id: p.id, name: p.name, wahanaId: p.wahanaId, wahana: w ? w.nama : '-', token: p.token, active: p.active, today: n, lastAt: (db.scans.filter(s => s.petugasId === p.id).slice(-1)[0] || {}).at || null }; };

async function api(req, res, u) {
  const m = req.method, p = u.pathname;
  const ip = req.socket.remoteAddress;
  if (m === 'GET' && p === '/api/catalog') return send(res, 200, { wahana: WAHANA, paket: PAKET, fee: ADMIN_FEE, qtyMax: QTY_MAX, today: dayKey() });

  /* pelanggan */
  if (m === 'POST' && p === '/api/orders') { limit('ord' + ip, 30, 60e3); const o = createOrder(await readBody(req)); return send(res, 201, { ...pubOrder(o), key: o.key }); }
  let mm = p.match(/^\/api\/orders\/([\w-]+)(\/stream)?$/);
  if (mm) {
    expireOrders();
    const o = db.orders.find(x => x.id === mm[1]);
    if (!o || !same(o.key, u.searchParams.get('key') || '')) throw err(404, 'Pesanan tidak ditemukan.');
    if (mm[2]) {
      sse(res); const c = { res, kind: 'order', orderId: o.id }; clients.add(c); req.on('close', () => clients.delete(c));
      res.write(`event: order\ndata: ${JSON.stringify(pubOrder(o))}\n\n`); return;
    }
    return send(res, 200, pubOrder(o));
  }

  /* auth */
  if (m === 'POST' && p === '/api/login') {
    limit('login' + ip, 12, 60e3);
    const b = await readBody(req); const usr = db.users.find(x => x.username === String(b.username || '').trim().toLowerCase() && x.active);
    if (!usr || !same(usr.pass, hash(String(b.password || ''), usr.salt))) throw err(401, 'Username atau kata sandi salah.');
    const sid = rnd(24); db.sessions[sid] = { uid: usr.id, exp: Date.now() + 12 * 3600e3 }; save();
    return send(res, 200, pubUser(usr), { 'Set-Cookie': `ptx=${sid}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${12 * 3600}` });
  }
  if (m === 'POST' && p === '/api/logout') { delete db.sessions[cookies(req).ptx]; save(); return send(res, 200, { ok: true }, { 'Set-Cookie': 'ptx=; HttpOnly; Path=/; Max-Age=0' }); }
  if (m === 'GET' && p === '/api/me') { const usr = sessionUser(req); return send(res, 200, usr ? pubUser(usr) : null); }

  if (p === '/api/stream') {
    need(req); sse(res); const c = { res, kind: 'staff' }; clients.add(c); req.on('close', () => clients.delete(c)); return;
  }

  /* kasir */
  if (p === '/api/kasir/lookup' && m === 'GET') {
    need(req, 'kasir'); expireOrders(); const o = findOrderByCode(u.searchParams.get('code'));
    if (!o) throw err(404, 'Kode pesanan tidak ditemukan.'); return send(res, 200, pubOrder(o, false));
  }
  if (p === '/api/kasir/confirm' && m === 'POST') {
    const usr = need(req, 'kasir'); const o = findOrderByCode((await readBody(req)).code);
    if (!o) throw err(404, 'Kode pesanan tidak ditemukan.'); confirmOrder(o, usr); return send(res, 200, pubOrder(o));
  }
  if (p === '/api/kasir/history' && m === 'GET') {
    const usr = need(req, 'kasir'); expireOrders();
    const l = db.orders.filter(o => o.status === 'confirmed' && (usr.role === 'admin' || o.confirmedBy === usr.id)).sort((a, b) => b.confirmedAt - a.confirmedAt).slice(0, 40);
    return send(res, 200, { orders: l.map(o => pubOrder(o, false)), pending: db.orders.filter(o => o.status === 'pending').length });
  }

  /* keuangan */
  if (p === '/api/keuangan/report' && m === 'GET') { need(req, 'keuangan'); return send(res, 200, report(u.searchParams.get('range'))); }
  if (p === '/api/keuangan/export' && m === 'GET') {
    need(req, 'keuangan'); const r = report(u.searchParams.get('range') || 'semua');
    const csv = 'Tanggal,Transaksi,Tiket,Pemasukan\n' + r.rows.map(x => [x.key, x.trx, x.tiket, x.total].join(',')).join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="laporan-pandatix.csv"' }); return res.end(csv);
  }

  /* admin */
  if (p.startsWith('/api/admin/')) {
    need(req, '__admin__');
    if (p === '/api/admin/overview') {
      const k = dayKey();
      return send(res, 200, { wahana: WAHANA.map(w => ({ id: w.id, nama: w.nama, kategori: w.kategori })), petugas: db.petugas.map(pubPetugas), users: db.users.filter(x => x.role !== 'admin').map(pubUser),
        stats: { scansToday: db.scans.filter(s => dayKey(s.at) === k && s.result === 'ok').length, rejectedToday: db.scans.filter(s => dayKey(s.at) === k && s.result !== 'ok').length, pending: db.orders.filter(o => o.status === 'pending').length },
        recent: db.scans.slice(-30).reverse() });
    }
    if (p === '/api/admin/petugas' && m === 'POST') {
      const b = await readBody(req); const name = String(b.name || '').trim().slice(0, 50);
      if (name.length < 2) throw err(400, 'Nama petugas wajib diisi.');
      if (!wById(b.wahanaId)) throw err(400, 'Pilih wahana.');
      if (db.petugas.some(x => x.active && x.wahanaId === b.wahanaId)) throw err(409, 'Wahana ini sudah punya petugas. Satu wahana hanya boleh satu petugas.');
      const pt = { id: rnd(6), name, wahanaId: b.wahanaId, token: rnd(24), active: true, createdAt: Date.now() }; db.petugas.push(pt); save();
      return send(res, 201, pubPetugas(pt));
    }
    mm = p.match(/^\/api\/admin\/petugas\/(\w+)(?:\/(reset|toggle))?$/);
    if (mm) {
      const pt = db.petugas.find(x => x.id === mm[1]); if (!pt) throw err(404, 'Petugas tidak ditemukan.');
      if (m === 'DELETE') { db.petugas.splice(db.petugas.indexOf(pt), 1); save(); emit(c => c.kind === 'scan' && c.petugasId === pt.id, 'revoked', {}); return send(res, 200, { ok: true }); }
      if (mm[2] === 'reset') { pt.token = rnd(24); save(); emit(c => c.kind === 'scan' && c.petugasId === pt.id, 'revoked', {}); return send(res, 200, pubPetugas(pt)); }
      if (mm[2] === 'toggle') {
        if (!pt.active && db.petugas.some(x => x.active && x.wahanaId === pt.wahanaId)) throw err(409, 'Wahana ini sudah punya petugas aktif lain.');
        pt.active = !pt.active; save(); if (!pt.active) emit(c => c.kind === 'scan' && c.petugasId === pt.id, 'revoked', {}); return send(res, 200, pubPetugas(pt));
      }
      if (m === 'PATCH') {
        const b = await readBody(req);
        if (b.name) pt.name = String(b.name).trim().slice(0, 50);
        if (b.wahanaId && b.wahanaId !== pt.wahanaId) {
          if (!wById(b.wahanaId)) throw err(400, 'Wahana tidak valid.');
          if (db.petugas.some(x => x.active && x.id !== pt.id && x.wahanaId === b.wahanaId)) throw err(409, 'Wahana tujuan sudah punya petugas.');
          pt.wahanaId = b.wahanaId; pt.token = rnd(24); emit(c => c.kind === 'scan' && c.petugasId === pt.id, 'revoked', {});
        }
        save(); return send(res, 200, pubPetugas(pt));
      }
    }
    if (p === '/api/admin/users' && m === 'POST') {
      const b = await readBody(req); const un = String(b.username || '').trim().toLowerCase();
      if (!/^[a-z0-9_.]{3,20}$/.test(un)) throw err(400, 'Username 3-20 karakter (huruf kecil, angka, titik, garis bawah).');
      if (!['kasir', 'keuangan'].includes(b.role)) throw err(400, 'Peran tidak valid.');
      if (String(b.password || '').length < 6) throw err(400, 'Kata sandi minimal 6 karakter.');
      if (String(b.name || '').trim().length < 2) throw err(400, 'Nama wajib diisi.');
      if (db.users.some(x => x.username === un)) throw err(409, 'Username sudah dipakai.');
      return send(res, 201, pubUser(addUser(b.role, un, String(b.name).trim().slice(0, 50), String(b.password))));
    }
    mm = p.match(/^\/api\/admin\/users\/(\w+)(?:\/(password|toggle))?$/);
    if (mm) {
      const usr = db.users.find(x => x.id === mm[1] && x.role !== 'admin'); if (!usr) throw err(404, 'Akun tidak ditemukan.');
      if (m === 'DELETE') { db.users.splice(db.users.indexOf(usr), 1); save(); return send(res, 200, { ok: true }); }
      if (mm[2] === 'toggle') { usr.active = !usr.active; save(); return send(res, 200, pubUser(usr)); }
      if (mm[2] === 'password') { const pw = String((await readBody(req)).password || ''); if (pw.length < 6) throw err(400, 'Kata sandi minimal 6 karakter.'); usr.salt = rnd(8); usr.pass = hash(pw, usr.salt); save(); return send(res, 200, { ok: true }); }
    }
    throw err(404, 'Tidak ditemukan');
  }

  /* petugas wahana (scan) */
  if (p.startsWith('/api/scan/')) {
    const pt = petugasByToken(req.headers['x-scan-token'] || u.searchParams.get('t') || '');
    if (!pt) throw err(401, 'Link scan tidak valid atau sudah dinonaktifkan. Hubungi admin.');
    const w = wById(pt.wahanaId);
    if (p === '/api/scan/me') return send(res, 200, { name: pt.name, wahana: { id: w.id, nama: w.nama, kategori: w.kategori }, ...todayStats(pt) });
    if (p === '/api/scan/stream') { sse(res); const c = { res, kind: 'scan', petugasId: pt.id }; clients.add(c); req.on('close', () => clients.delete(c)); return; }
    if (p === '/api/scan/redeem' && m === 'POST') { limit('scan' + pt.id, 120, 60e3); const r = redeem(pt, (await readBody(req)).code, ip); return send(res, 200, { ...r, ...todayStats(pt) }); }
  }
  throw err(404, 'Tidak ditemukan');
}

const PAGES = { '/': 'index.html', '/admin': 'admin.html', '/kasir': 'kasir.html', '/keuangan': 'keuangan.html' };
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x'); let p = decodeURIComponent(u.pathname);
    if (p.startsWith('/api/')) {
      if (req.method !== 'GET' && !String(req.headers['content-type'] || '').includes('json') && req.method !== 'DELETE') throw err(415, 'Content-Type harus JSON');
      return await api(req, res, u);
    }
    let file = PAGES[p.replace(/\/$/, '') || '/'];
    if (/^\/s\/[\w-]{10,}$/.test(p)) file = 'scan.html';
    if (!file) { file = p.slice(1); if (file.includes('..')) throw err(400, 'Bad path'); }
    const fp = path.join(PUB, file);
    if (!fp.startsWith(PUB) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) throw err(404, 'Halaman tidak ditemukan');
    const ext = path.extname(fp);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
    fs.createReadStream(fp).pipe(res);
  } catch (e) {
    if (res.headersSent) return res.end();
    const status = e.status || 500; if (status === 500) console.error(e);
    if (req.url.startsWith('/api/')) send(res, status, { error: e.message }); else { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(e.message); }
  }
});
async function start() {
  await loadDatabase();
  if (!db.users.length) {
    const ap = process.env.ADMIN_PASSWORD || 'admin123';
    addUser('admin', 'admin', 'Administrator', ap);
    addUser('kasir', 'kasir01', 'Hendra Setiawan', 'kasir123');
    addUser('keuangan', 'keuangan01', 'Hendra Setiawan', 'keuangan123');
    console.log('Akun awal dibuat -> admin/' + ap + ' , kasir01/kasir123 , keuangan01/keuangan123 (segera ganti di /admin)');
    await flushSave();
  }
  server.listen(PORT, () => console.log('PANDATIX berjalan di port ' + PORT + ' dengan database Supabase'));
}
process.on('SIGINT', async () => { try { await flushSave(); } catch (e) {} process.exit(0); });
process.on('SIGTERM', async () => { try { await flushSave(); } catch (e) {} process.exit(0); });
start().catch(e => { console.error('Startup gagal:', e.message); process.exit(1); });
