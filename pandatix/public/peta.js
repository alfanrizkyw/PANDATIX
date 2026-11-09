/* Peta kawasan Lembah Pandawa — SVG interaktif light, dipakai di menu tiket. */
const PARK = {
  vb: '0 0 1000 640',
  pins: [
    { id: 'kapal-karam',    n: 1,  x: 118, y: 300, zona: 'Lembah Barat' },
    { id: 'rumah-cermin',   n: 2,  x: 128, y: 492, zona: 'Lembah Barat' },
    { id: 'komidi-putar',   n: 3,  x: 322, y: 556, zona: 'Zona Keluarga' },
    { id: 'kereta-mini',    n: 4,  x: 478, y: 506, zona: 'Zona Keluarga' },
    { id: 'flying-fox',     n: 5,  x: 556, y: 214, zona: 'Punggungan Atas' },
    { id: 'bianglala',      n: 6,  x: 690, y: 232, zona: 'Punggungan Atas' },
    { id: 'ombak-raksasa',  n: 7,  x: 862, y: 226, zona: 'Zona Adrenalin' },
    { id: 'seluncur-naga',  n: 8,  x: 676, y: 352, zona: 'Zona Air' },
    { id: 'tornado-air',    n: 9,  x: 880, y: 352, zona: 'Zona Air' },
    { id: 'bumper-boat',    n: 10, x: 648, y: 438, zona: 'Zona Air' },
    { id: 'kolam-ombak',    n: 11, x: 828, y: 446, zona: 'Zona Air' },
    { id: 'dunia-air-cilik',n: 12, x: 700, y: 540, zona: 'Zona Anak' },
    { id: 'taman-lumba',    n: 13, x: 892, y: 540, zona: 'Zona Anak' }
  ]
};
const PARK_COL = { Ekstrem: '#C7372F', Air: '#13809F', Santai: '#1B6B44', Anak: '#8B5E3C' };
const parkPin = id => PARK.pins.find(p => p.id === id);
const isEN = () => window.LANG === 'en';
const tP = (id, en) => isEN() ? en : id;
const pinName = w => w ? (window.PTX ? window.PTX.wn(w) : w.nama) : '';
const zoneT = z => window.PTX ? window.PTX.zt(z) : z;

function meruGlyph(x, y, s, fill) {
  const tiers = [34, 27, 20, 13];
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${tiers.map((w, i) => {
      const yy = -i * 20, top = -(17 + i * 20);
      return `<path d="M-${w} ${yy} C-${w * .58} ${yy - 5} -${w * .26} ${yy - 11} 0 ${top} C${w * .26} ${yy - 11} ${w * .58} ${yy - 5} ${w} ${yy} Z" fill="${fill}"/>
      <rect x="${-w - 2}" y="${yy - 2}" width="${(w + 2) * 2}" height="3.4" rx="1.7" fill="#3A2718"/>
      <rect x="${-w}" y="${yy + 2}" width="${w * 2}" height="1.6" fill="#EBCF8E" opacity=".7"/>`;
    }).join('')}
    <rect x="-26" y="0" width="52" height="8" rx="2.5" fill="#3A2718"/>
    <rect x="-20" y="6" width="40" height="5" rx="2" fill="#2E6B44"/>
    <rect x="-1.4" y="-90" width="2.8" height="13" fill="#EBCF8E"/><circle cx="0" cy="-93" r="3.6" fill="#EBCF8E"/></g>`;
}

function parkMapSVG(opt) {
  const mine = new Set(opt.mine || []), used = new Set(opt.used || []), sel = opt.sel || null;
  const wahana = opt.wahana || [];
  const pins = PARK.pins.map(p => {
    const w = wahana.find(x => x.id === p.id);
    const col = PARK_COL[(w || {}).kategori] || '#7B837E';
    const isMine = mine.has(p.id), isUsed = used.has(p.id), isSel = sel === p.id;
    return `<g class="pin ${isMine ? 'mine' : ''} ${isSel ? 'sel' : ''}" onclick="pickPin('${p.id}')" tabindex="0" role="button"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();pickPin('${p.id}')}"
      aria-label="${p.n}. ${pinName(w) || p.id}">
      <circle class="halo" cx="${p.x}" cy="${p.y}" r="32" fill="${col}" opacity="0" fill-opacity=".22"/>
      ${isMine ? `<circle class="ring" cx="${p.x}" cy="${p.y}" r="26" fill="none" stroke="#D99A2B" stroke-width="2.5" stroke-dasharray="5 5"/>` : ''}
      <circle class="dot" cx="${p.x}" cy="${p.y}" r="19" fill="${isUsed ? '#8C948E' : col}" stroke="#FFFFFF" stroke-width="3.5"/>
      <text x="${p.x}" y="${p.y + 4.6}" text-anchor="middle" font-size="13" font-weight="800" fill="#FFFFFF" aria-hidden="true">${p.n}</text>
    </g>`;
  }).join('');

  return `<svg viewBox="${PARK.vb}" role="img" aria-label="${tP('Peta kawasan Lembah Pandawa','Pandawa Valley area map')}">
  <defs>
    <linearGradient id="pmSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#CFE7EF"/><stop offset="1" stop-color="#EAF5EE"/></linearGradient>
    <linearGradient id="pmHill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8FC8A9"/><stop offset="1" stop-color="#4F9C74"/></linearGradient>
    <linearGradient id="pmGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#DCEAE0"/><stop offset="1" stop-color="#C2E3D0"/></linearGradient>
    <linearGradient id="pmLake" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7FC4D6"/><stop offset="55" stop-color="#3FB0CC"/><stop offset="1" stop-color="#2E8F8C"/></linearGradient>
    <linearGradient id="pmPool" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9FD9E6"/><stop offset="1" stop-color="#5FB9CC"/></linearGradient>
    <radialGradient id="pmSun" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#FFE9A8" stop-opacity=".8"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
  </defs>

  <rect width="1000" height="640" fill="url(#pmSky)"/>
  <circle cx="760" cy="70" r="120" fill="url(#pmSun)"/>
  <circle cx="760" cy="70" r="21" fill="#FCD34D" opacity=".9"/>

  <path d="M0 196 L92 118 L162 158 L262 74 L364 152 L470 92 L582 162 L692 108 L804 168 L902 122 L1000 190 L1000 260 L0 260 Z" fill="#B8D4C4"/>
  <path d="M0 244 L142 194 L282 232 L424 184 L562 230 L702 192 L844 236 L1000 204 L1000 320 L0 320 Z" fill="url(#pmHill)"/>
  <rect y="286" width="1000" height="354" fill="url(#pmGround)"/>

  <g fill="#4F9C74" opacity=".7">
    <ellipse cx="70" cy="360" rx="58" ry="30"/><ellipse cx="200" cy="330" rx="46" ry="24"/>
    <ellipse cx="470" cy="330" rx="62" ry="26"/><ellipse cx="560" cy="400" rx="44" ry="24"/>
    <ellipse cx="60" cy="560" rx="66" ry="32"/><ellipse cx="230" cy="600" rx="72" ry="30"/>
    <ellipse cx="960" cy="440" rx="52" ry="30"/><ellipse cx="420" cy="620" rx="60" ry="26"/>
  </g>
  <g stroke="#1B6B44" stroke-width="2" opacity=".18" fill="none">
    <path d="M0 300 Q 250 286 500 302 T 1000 296"/><path d="M0 316 Q 250 302 500 318 T 1000 312"/>
  </g>

  <path d="M155 390 Q 165 316 295 312 Q 428 316 435 390 Q 428 466 295 468 Q 165 464 155 390 Z" fill="url(#pmLake)" stroke="#2E8F8C" stroke-opacity=".4" stroke-width="2"/>
  <g stroke="#FFFFFF" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M196 356 q 18 -8 36 0 t 36 0"/><path d="M320 424 q 18 -8 36 0 t 36 0"/><path d="M212 430 q 18 -8 36 0"/>
  </g>
  <ellipse cx="295" cy="392" rx="54" ry="30" fill="#2E6B44" stroke="#1B6B44" stroke-opacity=".3"/>
  ${meruGlyph(295, 384, 1.05, '#4A3220')}
  <g fill="#EBCF8E" opacity=".95"><rect x="288" y="352" width="14" height="2.5" rx="1"/><rect x="285" y="368" width="20" height="2.5" rx="1"/><rect x="281" y="384" width="28" height="2.5" rx="1"/></g>
  <path d="M348 400 q 34 6 52 22" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="4" fill="none"/>

  <rect x="612" y="316" width="286" height="152" rx="26" fill="url(#pmPool)" stroke="#2E8F8C" stroke-opacity=".4" stroke-width="2"/>
  <g stroke="#FFFFFF" stroke-opacity=".55" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M640 344 q 20 -9 40 0 t 40 0 t 40 0 t 40 0 t 40 0"/>
    <path d="M640 396 q 20 -9 40 0 t 40 0 t 40 0 t 40 0 t 40 0"/>
    <path d="M640 440 q 20 -9 40 0 t 40 0 t 40 0 t 40 0 t 40 0"/>
  </g>
  <circle cx="700" cy="540" r="42" fill="#5FB9CC" stroke="#2E8F8C" stroke-opacity=".35" stroke-width="2"/>
  <circle cx="892" cy="540" r="38" fill="#7FC4D6" stroke="#8B5E3C" stroke-opacity=".4" stroke-width="2"/>

  <g stroke="#C9B79A" stroke-opacity=".9" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="16 12">
    <path d="M500 604 L500 500 Q 500 470 470 462 L360 430"/>
    <path d="M500 500 Q 500 468 540 458 L620 440"/>
    <path d="M500 560 Q 420 566 340 556"/>
    <path d="M620 440 Q 700 420 760 400 L850 372"/>
    <path d="M470 462 Q 300 470 160 486"/>
    <path d="M540 300 Q 620 268 700 246 L850 232"/>
  </g>

  <g transform="translate(500 604)">
    <path d="M-46 22 L-46 -12 L0 -34 L46 -12 L46 22 Z" fill="#8B5E3C" stroke="#EBCF8E" stroke-width="2.5"/>
    <path d="M-16 22 L-16 -2 L16 -2 L16 22 Z" fill="#4A3220"/>
    <path d="M-52 -12 L0 -40 L52 -12" fill="none" stroke="#5A3B24" stroke-width="5" stroke-linecap="round"/>
  </g>

  <g font-family="Schibsted Grotesk,system-ui,sans-serif" font-weight="800" font-size="12" letter-spacing="2.2" fill="#4A524D" opacity=".72">
    <text x="500" y="46" text-anchor="middle">${tP('PUNGGUNG ARJUNO','ARJUNO RIDGE')}</text>
    <text x="295" y="298" text-anchor="middle" fill="#0F6E88" opacity=".9">${tP('DANAU BALI VAN JAVA','BALI VAN JAVA LAKE')}</text>
    <text x="755" y="304" text-anchor="middle" fill="#0F6E88" opacity=".9">${tP('ZONA AIR','WATER ZONE')}</text>
    <text x="240" y="616" text-anchor="middle">${tP('ZONA KELUARGA','FAMILY ZONE')}</text>
    <text x="500" y="630" text-anchor="middle" fill="#5A3B24" opacity=".9">${tP('GERBANG UTAMA','MAIN GATE')}</text>
  </g>
  ${pins}
</svg>`;
}