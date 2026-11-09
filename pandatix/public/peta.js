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
/* Peta portrait untuk layar sempit: semua titik masuk tanpa potong. */
const PARK_M = {
  vb: '0 0 640 820',
  pins: [
    { id: 'kapal-karam',    n: 1,  x: 96,  y: 380, zona: 'Lembah Barat' },
    { id: 'rumah-cermin',   n: 2,  x: 120, y: 540, zona: 'Lembah Barat' },
    { id: 'komidi-putar',   n: 3,  x: 176, y: 620, zona: 'Zona Keluarga' },
    { id: 'kereta-mini',    n: 4,  x: 336, y: 616, zona: 'Zona Keluarga' },
    { id: 'flying-fox',     n: 5,  x: 322, y: 262, zona: 'Punggungan Atas' },
    { id: 'bianglala',      n: 6,  x: 432, y: 244, zona: 'Punggungan Atas' },
    { id: 'ombak-raksasa',  n: 7,  x: 548, y: 280, zona: 'Zona Adrenalin' },
    { id: 'seluncur-naga',  n: 8,  x: 452, y: 420, zona: 'Zona Air' },
    { id: 'tornado-air',    n: 9,  x: 556, y: 472, zona: 'Zona Air' },
    { id: 'bumper-boat',    n: 10, x: 428, y: 546, zona: 'Zona Air' },
    { id: 'kolam-ombak',    n: 11, x: 556, y: 582, zona: 'Zona Air' },
    { id: 'dunia-air-cilik',n: 12, x: 238, y: 690, zona: 'Zona Anak' },
    { id: 'taman-lumba',    n: 13, x: 462, y: 704, zona: 'Zona Anak' }
  ]
};
const compactMap = () => window.matchMedia('(max-width:719px)').matches;
const PARK_COL = { Ekstrem: '#C7372F', Air: '#13809F', Santai: '#1B6B44', Anak: '#8B5E3C' };
const parkPin = id => PARK.pins.find(p => p.id === id) || PARK_M.pins.find(p => p.id === id);
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

function parkPinsSVG(list, opt) {
  const mine = new Set(opt.mine || []), used = new Set(opt.used || []), sel = opt.sel || null;
  const wahana = opt.wahana || [], c = !!opt.compact;
  const r = c ? 27 : 19, halo = c ? 40 : 32, ring = c ? 34 : 26, fs = c ? 18 : 13;
  return list.map(p => {
    const w = wahana.find(x => x.id === p.id);
    const col = PARK_COL[(w || {}).kategori] || '#7B837E';
    const isMine = mine.has(p.id), isUsed = used.has(p.id), isSel = sel === p.id;
    return `<g class="pin ${isMine ? 'mine' : ''} ${isSel ? 'sel' : ''}" onclick="pickPin('${p.id}')" tabindex="0" role="button"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();pickPin('${p.id}')}"
      aria-label="${p.n}. ${pinName(w) || p.id}">
      ${c ? `<circle cx="${p.x}" cy="${p.y}" r="${halo - 2}" fill="#FFFFFF" fill-opacity="0.001"/>` : ''}
      <circle class="halo" cx="${p.x}" cy="${p.y}" r="${halo}" fill="${col}" opacity="0" fill-opacity=".22"/>
      ${isMine ? `<circle class="ring" cx="${p.x}" cy="${p.y}" r="${ring}" fill="none" stroke="#D99A2B" stroke-width="${c ? 3 : 2.5}" stroke-dasharray="5 5"/>` : ''}
      <circle class="dot" cx="${p.x}" cy="${p.y}" r="${r}" fill="${isUsed ? '#8C948E' : col}" stroke="#FFFFFF" stroke-width="${c ? 4 : 3.5}"/>
      <text x="${p.x}" y="${p.y + fs * .35}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="#FFFFFF" aria-hidden="true">${p.n}</text>
    </g>`;
  }).join('');
}

function parkWideSVG(pins) {
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

function parkCompactSVG(pins) {
  return `<svg viewBox="${PARK_M.vb}" role="img" aria-label="${tP('Peta kawasan Lembah Pandawa','Pandawa Valley area map')}">
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

  <rect width="640" height="820" fill="url(#pmSky)"/>
  <circle cx="512" cy="66" r="108" fill="url(#pmSun)"/>
  <circle cx="512" cy="66" r="18" fill="#FCD34D" opacity=".9"/>

  <path d="M0 188 L74 116 L140 158 L228 82 L318 156 L406 104 L496 164 L584 118 L640 166 L640 250 L0 250 Z" fill="#B8D4C4"/>
  <path d="M0 228 L92 186 L192 220 L302 180 L404 218 L512 188 L608 220 L640 202 L640 310 L0 310 Z" fill="url(#pmHill)"/>
  <rect y="272" width="640" height="548" fill="url(#pmGround)"/>

  <g fill="#4F9C74" opacity=".7">
    <ellipse cx="58" cy="336" rx="54" ry="24"/><ellipse cx="588" cy="330" rx="46" ry="20"/>
    <ellipse cx="560" cy="668" rx="60" ry="26"/><ellipse cx="86" cy="712" rx="62" ry="28"/>
    <ellipse cx="596" cy="772" rx="56" ry="26"/><ellipse cx="176" cy="596" rx="46" ry="20"/>
  </g>
  <g stroke="#1B6B44" stroke-width="2" opacity=".18" fill="none">
    <path d="M0 292 Q160 280 320 294 T640 288"/><path d="M0 308 Q160 296 320 310 T640 304"/>
  </g>

  <ellipse cx="238" cy="436" rx="154" ry="98" fill="url(#pmLake)" stroke="#2E8F8C" stroke-opacity=".4" stroke-width="2"/>
  <g stroke="#FFFFFF" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M156 398 q 16 -7 32 0 t 32 0"/><path d="M292 486 q 16 -7 32 0 t 32 0"/><path d="M178 490 q 16 -7 32 0"/>
  </g>
  <ellipse cx="238" cy="438" rx="48" ry="27" fill="#2E6B44" stroke="#1B6B44" stroke-opacity=".3"/>
  ${meruGlyph(238, 430, .9, '#4A3220')}
  <g fill="#EBCF8E" opacity=".95"><rect x="231" y="400" width="14" height="2.5" rx="1"/><rect x="228" y="416" width="20" height="2.5" rx="1"/><rect x="224" y="432" width="28" height="2.5" rx="1"/></g>
  <path d="M296 446 q 34 6 52 22" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="4" fill="none"/>

  <rect x="392" y="348" width="226" height="154" rx="24" fill="url(#pmPool)" stroke="#2E8F8C" stroke-opacity=".4" stroke-width="2"/>
  <g stroke="#FFFFFF" stroke-opacity=".55" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M416 378 q 18 -8 36 0 t 36 0 t 36 0 t 36 0"/>
    <path d="M416 430 q 18 -8 36 0 t 36 0 t 36 0 t 36 0"/>
    <path d="M416 478 q 18 -8 36 0 t 36 0 t 36 0 t 36 0"/>
  </g>

  <circle cx="238" cy="690" r="32" fill="#5FB9CC" stroke="#2E8F8C" stroke-opacity=".35" stroke-width="2"/>
  <circle cx="462" cy="704" r="30" fill="#7FC4D6" stroke="#8B5E3C" stroke-opacity=".4" stroke-width="2"/>

  <g stroke="#C9B79A" stroke-opacity=".9" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="15 11">
    <path d="M330 786 L330 700 Q330 668 300 658 L220 628"/>
    <path d="M330 700 Q330 670 366 660 L424 638"/>
    <path d="M220 628 Q158 608 128 552 L122 508"/>
    <path d="M424 638 Q488 616 532 576 L550 522"/>
    <path d="M300 322 Q360 300 426 290 L524 278"/>
    <path d="M220 628 Q186 672 214 686"/>
  </g>

  <g transform="translate(330 766)">
    <path d="M-42 20 L-42 -10 L0 -32 L42 -10 L42 20 Z" fill="#8B5E3C" stroke="#EBCF8E" stroke-width="2.5"/>
    <path d="M-15 20 L-15 -2 L15 -2 L15 20 Z" fill="#4A3220"/>
    <path d="M-48 -10 L0 -38 L48 -10" fill="none" stroke="#5A3B24" stroke-width="5" stroke-linecap="round"/>
  </g>

  <g font-family="Schibsted Grotesk,system-ui,sans-serif" font-weight="800" font-size="14" letter-spacing="1.6" fill="#4A524D" opacity=".72">
    <text x="320" y="48" text-anchor="middle">${tP('PUNGGUNG ARJUNO','ARJUNO RIDGE')}</text>
    <text x="238" y="322" text-anchor="middle" fill="#0F6E88" opacity=".9">${tP('DANAU BALI VAN JAVA','BALI VAN JAVA LAKE')}</text>
    <text x="505" y="336" text-anchor="middle" fill="#0F6E88" opacity=".9">${tP('ZONA AIR','WATER ZONE')}</text>
    <text x="140" y="806" text-anchor="middle">${tP('ZONA KELUARGA','FAMILY ZONE')}</text>
    <text x="330" y="806" text-anchor="middle" fill="#5A3B24" opacity=".9">${tP('GERBANG UTAMA','MAIN GATE')}</text>
    <text x="490" y="806" text-anchor="middle">${tP('ZONA ANAK','KIDS ZONE')}</text>
  </g>
  ${pins}
</svg>`;
}
function parkMapSVG(opt) {
  const compact = !!opt.compact;
  return compact ? parkCompactSVG(parkPinsSVG(PARK_M.pins, opt)) : parkWideSVG(parkPinsSVG(PARK.pins, opt));
}