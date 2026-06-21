/**
 * Animated Payment Form — demo logic
 * No external dependencies. Pure vanilla JS.
 * Frontend demo only — no real payment is processed.
 */

let curType = null;
let txnId = '';
let payDate = '';

/* ── CARD BRAND CONFIG ── */
const cardColors = {
  visa:       'linear-gradient(135deg,#1A1F71 0%,#0d1445 45%,#2535a0 100%)',
  mastercard: 'linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 45%,#0d0d0d 100%)',
  amex:       'linear-gradient(135deg,#006FCF 0%,#004a9c 45%,#0060b0 100%)',
  troy:       'linear-gradient(135deg,#8a0000 0%,#6a0000 45%,#b01010 100%)',
  discover:   'linear-gradient(135deg,#c85000 0%,#a04000 45%,#e86000 100%)'
};
const cnames = { visa:'Visa', mastercard:'Mastercard', amex:'American Express', troy:'Troy', discover:'Discover' };

const logos = {
  visa: `<svg width="64" height="22" viewBox="0 0 64 22">
    <text x="32" y="18" text-anchor="middle"
      font-family="Arial Black,Arial,sans-serif" font-size="22"
      font-weight="900" font-style="italic" fill="white"
      letter-spacing="-1">VISA</text>
  </svg>`,

  mastercard: `<svg width="56" height="38" viewBox="0 0 56 38">
    <circle cx="20" cy="19" r="14" fill="#EB001B"/>
    <circle cx="36" cy="19" r="14" fill="#F79E1B"/>
    <path d="M28 7.3a14 14 0 010 23.4 14 14 0 010-23.4z" fill="#FF5F00"/>
    <text x="28" y="36" text-anchor="middle"
      font-family="Arial,sans-serif" font-size="6.5"
      font-weight="700" fill="white" letter-spacing="0.3">mastercard</text>
  </svg>`,

  amex: `<svg width="68" height="38" viewBox="0 0 68 38">
    <rect x="1" y="1" width="66" height="36" rx="5"
      fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <text x="34" y="15" text-anchor="middle"
      font-family="Arial,sans-serif" font-size="7.5"
      font-weight="800" fill="white" letter-spacing="2">AMERICAN</text>
    <text x="34" y="26" text-anchor="middle"
      font-family="Arial,sans-serif" font-size="7"
      font-weight="800" fill="white" letter-spacing="2.5">EXPRESS</text>
    <text x="34" y="35" text-anchor="middle"
      font-family="Arial,sans-serif" font-size="5"
      fill="rgba(255,255,255,0.55)" letter-spacing="1.5">CENTURION</text>
  </svg>`,

  troy: `<svg width="60" height="30" viewBox="0 0 60 30">
    <rect x="0" y="0" width="30" height="30" fill="#D42B2B"/>
    <rect x="30" y="0" width="30" height="30" fill="#FFD000"/>
    <text x="30" y="21" text-anchor="middle"
      font-family="Arial Black,Arial,sans-serif" font-size="15"
      font-weight="900" fill="white" letter-spacing="1">troy</text>
  </svg>`,

  discover: `<svg width="62" height="34" viewBox="0 0 62 34">
    <rect x="1" y="1" width="60" height="32" rx="4" fill="rgba(255,255,255,0.1)"/>
    <circle cx="44" cy="17" r="13" fill="#F76F20" opacity="0.9"/>
    <text x="22" y="20" text-anchor="middle"
      font-family="Arial,sans-serif" font-size="7.5"
      font-weight="800" fill="white" letter-spacing="0.3">DISCOVER</text>
  </svg>`
};

/* ── CARD TYPE DETECTION ── */
function detect(n) {
  n = n.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^9792/.test(n)) return 'troy';
  if (/^6(011|5)/.test(n)) return 'discover';
  return null;
}

function setType(t) {
  if (t === curType) return;
  curType = t;
  const defaultGrad = 'linear-gradient(135deg,#1a1a2e 0%,#16213e 45%,#0f3460 100%)';
  const c = t ? cardColors[t] : defaultGrad;
  document.getElementById('face-f').style.background = c;
  document.getElementById('face-b').style.background = c;

  const lf = document.getElementById('logo-front');
  const lb = document.getElementById('logo-back');
  if (t && logos[t]) {
    lf.innerHTML = logos[t];
    lb.innerHTML = logos[t];
    lf.classList.remove('pop');
    void lf.offsetWidth;
    lf.classList.add('pop');
  } else {
    lf.innerHTML = '';
    lb.innerHTML = '';
  }

  const badge = document.getElementById('badge');
  const bt = document.getElementById('badge-text');
  if (t) {
    bt.textContent = cnames[t] + ' tespit edildi';
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }

  const il = document.getElementById('inp-logo');
  if (t && logos[t]) {
    const small = logos[t]
      .replace(/width="\d+"/g, 'width="36"')
      .replace(/height="\d+"/g, 'height="22"');
    il.innerHTML = small;
  } else {
    il.innerHTML = '<i class="ti ti-credit-card" style="font-size:20px;color:var(--color-text-secondary)" aria-hidden="true"></i>';
  }
}

/* ── CARD INPUT HANDLERS ── */
function uNum(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
  const raw = v.padEnd(16, '•');
  for (let i = 0; i < 4; i++) {
    const g = document.getElementById('ng' + i);
    g.textContent = raw.substring(i * 4, i * 4 + 4);
    g.className = 'num-group ' + (v.length >= i * 4 && v.length <= i * 4 + 4 ? 'active' : v.length > i * 4 ? 'filled' : 'empty');
  }
  setType(detect(el.value));
}

function uExp(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
  el.value = v;
  const p = el.value.replace(/\s/g, '').split('/');
  document.getElementById('f-exp').textContent = (p[0] || '••') + '/' + (p[1] || '••');
}

function uCvv(v) {
  document.getElementById('cvv-box').textContent = v || '•••';
}

function flipTo(back) {
  document.getElementById('card3d').classList.toggle('flipped', back);
}

/* ── CARD TILT ── */
function initCardTilt() {
  const scene = document.getElementById('scene');
  const card = document.getElementById('card3d');
  if (!scene || !card) return;
  scene.addEventListener('mousemove', (e) => {
    if (card.classList.contains('flipped')) return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.animation = 'none';
    card.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`;
  });
  scene.addEventListener('mouseleave', () => {
    if (!card.classList.contains('flipped')) {
      card.style.transform = '';
      card.style.animation = '';
    }
  });
}

/* ── COUNTRY PHONE CODES ── */
const phoneCountries = [
  {f:'🇹🇷',c:'+90',n:'Türkiye'},
  {f:'🇺🇸',c:'+1',n:'ABD'},
  {f:'🇬🇧',c:'+44',n:'İngiltere'},
  {f:'🇩🇪',c:'+49',n:'Almanya'},
  {f:'🇫🇷',c:'+33',n:'Fransa'},
  {f:'🇮🇹',c:'+39',n:'İtalya'},
  {f:'🇪🇸',c:'+34',n:'İspanya'},
  {f:'🇳🇱',c:'+31',n:'Hollanda'},
  {f:'🇧🇪',c:'+32',n:'Belçika'},
  {f:'🇨🇭',c:'+41',n:'İsviçre'},
  {f:'🇦🇹',c:'+43',n:'Avusturya'},
  {f:'🇵🇹',c:'+351',n:'Portekiz'},
  {f:'🇮🇪',c:'+353',n:'İrlanda'},
  {f:'🇸🇪',c:'+46',n:'İsveç'},
  {f:'🇳🇴',c:'+47',n:'Norveç'},
  {f:'🇩🇰',c:'+45',n:'Danimarka'},
  {f:'🇫🇮',c:'+358',n:'Finlandiya'},
  {f:'🇵🇱',c:'+48',n:'Polonya'},
  {f:'🇨🇿',c:'+420',n:'Çek Cumhuriyeti'},
  {f:'🇸🇰',c:'+421',n:'Slovakya'},
  {f:'🇭🇺',c:'+36',n:'Macaristan'},
  {f:'🇷🇴',c:'+40',n:'Romanya'},
  {f:'🇧🇬',c:'+359',n:'Bulgaristan'},
  {f:'🇭🇷',c:'+385',n:'Hırvatistan'},
  {f:'🇷🇸',c:'+381',n:'Sırbistan'},
  {f:'🇸🇮',c:'+386',n:'Slovenya'},
  {f:'🇬🇷',c:'+30',n:'Yunanistan'},
  {f:'🇷🇺',c:'+7',n:'Rusya'},
  {f:'🇺🇦',c:'+380',n:'Ukrayna'},
  {f:'🇧🇾',c:'+375',n:'Belarus'},
  {f:'🇲🇩',c:'+373',n:'Moldova'},
  {f:'🇱🇹',c:'+370',n:'Litvanya'},
  {f:'🇱🇻',c:'+371',n:'Letonya'},
  {f:'🇪🇪',c:'+372',n:'Estonya'},
  {f:'🇦🇿',c:'+994',n:'Azerbaycan'},
  {f:'🇬🇪',c:'+995',n:'Gürcistan'},
  {f:'🇦🇲',c:'+374',n:'Ermenistan'},
  {f:'🇰🇿',c:'+7',n:'Kazakistan'},
  {f:'🇺🇿',c:'+998',n:'Özbekistan'},
  {f:'🇰🇬',c:'+996',n:'Kırgızistan'},
  {f:'🇹🇲',c:'+993',n:'Türkmenistan'},
  {f:'🇸🇦',c:'+966',n:'Suudi Arabistan'},
  {f:'🇦🇪',c:'+971',n:'BAE'},
  {f:'🇶🇦',c:'+974',n:'Katar'},
  {f:'🇰🇼',c:'+965',n:'Kuveyt'},
  {f:'🇧🇭',c:'+973',n:'Bahreyn'},
  {f:'🇴🇲',c:'+968',n:'Umman'},
  {f:'🇮🇶',c:'+964',n:'Irak'},
  {f:'🇮🇷',c:'+98',n:'İran'},
  {f:'🇸🇾',c:'+963',n:'Suriye'},
  {f:'🇱🇧',c:'+961',n:'Lübnan'},
  {f:'🇯🇴',c:'+962',n:'Ürdün'},
  {f:'🇮🇱',c:'+972',n:'İsrail'},
  {f:'🇾🇪',c:'+967',n:'Yemen'},
  {f:'🇯🇵',c:'+81',n:'Japonya'},
  {f:'🇨🇳',c:'+86',n:'Çin'},
  {f:'🇰🇷',c:'+82',n:'Güney Kore'},
  {f:'🇮🇳',c:'+91',n:'Hindistan'},
  {f:'🇵🇰',c:'+92',n:'Pakistan'},
  {f:'🇧🇩',c:'+880',n:'Bangladeş'},
  {f:'🇸🇬',c:'+65',n:'Singapur'},
  {f:'🇲🇾',c:'+60',n:'Malezya'},
  {f:'🇮🇩',c:'+62',n:'Endonezya'},
  {f:'🇵🇭',c:'+63',n:'Filipinler'},
  {f:'🇻🇳',c:'+84',n:'Vietnam'},
  {f:'🇹🇭',c:'+66',n:'Tayland'},
  {f:'🇦🇺',c:'+61',n:'Avustralya'},
  {f:'🇳🇿',c:'+64',n:'Yeni Zelanda'},
  {f:'🇨🇦',c:'+1',n:'Kanada'},
  {f:'🇲🇽',c:'+52',n:'Meksika'},
  {f:'🇧🇷',c:'+55',n:'Brezilya'},
  {f:'🇦🇷',c:'+54',n:'Arjantin'},
  {f:'🇨🇱',c:'+56',n:'Şili'},
  {f:'🇨🇴',c:'+57',n:'Kolombiya'},
  {f:'🇵🇪',c:'+51',n:'Peru'},
  {f:'🇻🇪',c:'+58',n:'Venezuela'},
  {f:'🇿🇦',c:'+27',n:'Güney Afrika'},
  {f:'🇪🇬',c:'+20',n:'Mısır'},
  {f:'🇲🇦',c:'+212',n:'Fas'},
  {f:'🇩🇿',c:'+213',n:'Cezayir'},
  {f:'🇹🇳',c:'+216',n:'Tunus'},
  {f:'🇱🇾',c:'+218',n:'Libya'},
  {f:'🇳🇬',c:'+234',n:'Nijerya'},
  {f:'🇰🇪',c:'+254',n:'Kenya'},
  {f:'🇬🇭',c:'+233',n:'Gana'},
  {f:'🇸🇳',c:'+221',n:'Senegal'},
  {f:'🇪🇹',c:'+251',n:'Etiyopya'},
  {f:'🇸🇴',c:'+252',n:'Somali'},
  {f:'🇨🇲',c:'+237',n:'Kamerun'},
];

let selectedCC = phoneCountries[0];

function renderCountryList(list) {
  const el = document.getElementById('cc-list');
  el.innerHTML = list.map(cc =>
    `<div class="phone-dd-item${cc === selectedCC ? ' active' : ''}"
      onclick="selectCC(phoneCountries.find(x=>x.f==='${cc.f}'&&x.c==='${cc.c}'&&x.n==='${cc.n}'))">
      <span class="phone-dd-flag">${cc.f}</span>
      <span class="phone-dd-name">${cc.n}</span>
      <span class="phone-dd-code">${cc.c}</span>
    </div>`
  ).join('');
}

function selectCC(cc) {
  selectedCC = cc;
  document.getElementById('cc-flag').textContent = cc.f;
  document.getElementById('cc-code').textContent = cc.c;
  document.getElementById('cc-btn').classList.remove('open');
  document.getElementById('phone-dropdown').classList.remove('open');
  document.getElementById('cc-search').value = '';
  renderCountryList(phoneCountries);
}

function initPhoneCC() {
  const btn = document.getElementById('cc-btn');
  const dropdown = document.getElementById('phone-dropdown');
  const search = document.getElementById('cc-search');

  renderCountryList(phoneCountries);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('open');
    btn.classList.toggle('open', open);
    if (open) setTimeout(() => search.focus(), 50);
  });

  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    const filtered = phoneCountries.filter(cc =>
      cc.n.toLowerCase().includes(q) || cc.c.includes(q)
    );
    renderCountryList(filtered);
  });

  document.getElementById('a-phone').addEventListener('input', (e) => {
    const val = e.target.value;
    if (!val.startsWith('+')) return;
    const digits = val.replace(/\D/g, '');
    for (let len = 4; len >= 1; len--) {
      const prefix = '+' + digits.substring(0, len);
      const match = phoneCountries.find(cc => cc.c === prefix);
      if (match) { selectCC(match); break; }
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#phone-wrapper')) {
      btn.classList.remove('open');
      dropdown.classList.remove('open');
    }
  });
}

/* ── STEP NAVIGATION ── */
function goStep(s) {
  if (s === 2) {
    let ok = true;
    ['a-name','a-email','a-addr'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.classList.add('err'); ok = false; }
      else el.classList.remove('err');
    });
    const phone = document.getElementById('a-phone');
    const phoneErr = document.getElementById('phone-err');
    if (!phone.value.trim()) {
      phone.classList.add('err');
      phoneErr.style.display = 'block';
      ok = false;
    } else {
      phone.classList.remove('err');
      phoneErr.style.display = 'none';
    }
    if (!document.getElementById('a-city').value) ok = false;
    if (!ok) return;

    document.getElementById('f-name').textContent = document.getElementById('a-name').value.toUpperCase();
    document.getElementById('sd1').classList.remove('active');
    document.getElementById('sd1').classList.add('done');
    document.getElementById('sl1').classList.add('done');
    document.getElementById('sd2').classList.add('active');
    document.getElementById('p1').classList.remove('active');
    document.getElementById('p2').classList.add('active');
  } else {
    document.getElementById('sd2').classList.remove('active');
    document.getElementById('sd1').classList.remove('done');
    document.getElementById('sd1').classList.add('active');
    document.getElementById('sl1').classList.remove('done');
    document.getElementById('p2').classList.remove('active');
    document.getElementById('p1').classList.add('active');
  }
}

/* ── CONFETTI ── */
function confetti() {
  const box = document.getElementById('confetti-box');
  box.innerHTML = '';
  const cols = ['#EB001B','#F79E1B','#1A1F71','#00C853','#FF4081','#448AFF','#FFD600','#7C4DFF'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    const s = 6 + Math.random() * 8;
    el.style.left = Math.random() * 100 + '%';
    el.style.top = '-20px';
    el.style.width = s + 'px';
    el.style.height = s + 'px';
    const c = cols[Math.floor(Math.random() * cols.length)];
    if (Math.random() > 0.5) {
      el.style.background = c;
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    } else {
      el.style.background = 'transparent';
      el.style.borderLeft = s / 2 + 'px solid transparent';
      el.style.borderRight = s / 2 + 'px solid transparent';
      el.style.borderBottom = s + 'px solid ' + c;
    }
    el.style.animation = `confettiFall ${1.8 + Math.random() * 2}s ${Math.random() * 0.8}s forwards`;
    box.appendChild(el);
  }
  setTimeout(() => (box.innerHTML = ''), 5000);
}

/* ── PAYMENT ── */
function startPay() {
  const btn = document.getElementById('pay-btn');
  btn.classList.add('loading');
  document.getElementById('btn-text').innerHTML =
    '<span style="display:inline-flex;align-items:center;gap:8px"><span style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;display:inline-block;animation:spin 0.7s linear infinite"></span>İşleniyor...</span>';

  const c = document.getElementById('card3d');
  c.style.transition = 'transform 1s cubic-bezier(.4,0,.2,1),opacity 0.8s';
  c.style.transform = 'scale(0.7) translateY(-40px)';
  c.style.opacity = '0.3';

  setTimeout(() => {
    document.getElementById('sd2').classList.remove('active');
    document.getElementById('sd2').classList.add('done');
    document.getElementById('sl2').classList.add('done');
    document.getElementById('sd3').classList.add('active');

    const numVal = document.getElementById('i-num').value.replace(/\s/g, '');
    const last4 = numVal.length >= 4 ? numVal.slice(-4) : '0000';
    const ts = document.getElementById('i-taksit');

    txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    payDate = now.toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' });
    const payTime = now.toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit' });

    document.getElementById('s-txn').textContent = '#' + txnId;
    document.getElementById('s-date').textContent = payDate + ', ' + payTime;
    document.getElementById('s-card').textContent = (curType ? cnames[curType] + ' ' : '') + '•••• ' + last4;
    document.getElementById('s-tak').textContent = ts.options[ts.selectedIndex].text.split('—')[0].trim();

    document.getElementById('ov-ok').classList.add('show');
    confetti();
  }, 2000);
}

/* ── INVOICE ── */
function showInvoice() {
  document.getElementById('ov-ok').classList.remove('show');

  const numVal = document.getElementById('i-num').value.replace(/\s/g, '');
  const last4 = numVal.length >= 4 ? numVal.slice(-4) : '0000';
  const ts = document.getElementById('i-taksit');
  const phoneVal = selectedCC.c + ' ' + document.getElementById('a-phone').value;

  document.getElementById('inv-no').textContent = '#' + txnId;
  document.getElementById('inv-date').textContent = payDate;
  document.getElementById('inv-name').textContent = document.getElementById('a-name').value;
  document.getElementById('inv-addr').textContent = document.getElementById('a-addr').value;
  document.getElementById('inv-city2').textContent = document.getElementById('a-city').value;
  document.getElementById('inv-email').textContent = document.getElementById('a-email').value;
  document.getElementById('inv-phone').textContent = phoneVal;
  document.getElementById('inv-card-info').textContent = (curType ? cnames[curType] + ' ' : '') + '•••• ' + last4;
  document.getElementById('inv-taksit-info').textContent = ts.options[ts.selectedIndex].text.split('—')[0].trim();
  document.getElementById('inv-txn-info').textContent = 'Ref: ' + txnId;

  const bc = document.getElementById('inv-barcode');
  bc.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const b = document.createElement('span');
    b.style.width = (1 + Math.floor(Math.random() * 3)) + 'px';
    b.style.height = (18 + Math.floor(Math.random() * 12)) + 'px';
    bc.appendChild(b);
  }

  const stamp = document.getElementById('stamp');
  stamp.classList.remove('slam');
  document.getElementById('inv-status-pending').classList.add('show');
  document.getElementById('inv-status-final').style.opacity = '0';
  void stamp.offsetWidth;

  document.getElementById('inv-ov').classList.add('show');
  setTimeout(() => stamp.classList.add('slam'), 50);

  setTimeout(() => {
    const dust = document.getElementById('stamp-dust');
    dust.innerHTML = '';
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'dust-particle';
      const ang = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 30;
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      dust.appendChild(p);
    }
    const invEl = document.getElementById('invoice-el');
    invEl.classList.add('inv-screen-shake');
    setTimeout(() => invEl.classList.remove('inv-screen-shake'), 400);
  }, 1050);

  setTimeout(() => {
    document.getElementById('inv-status-pending').classList.remove('show');
    document.getElementById('inv-status-final').style.transition = 'opacity 0.4s';
    document.getElementById('inv-status-final').style.opacity = '1';
  }, 1500);
}

function closeOv() {
  document.getElementById('ov-ok').classList.remove('show');
  const btn = document.getElementById('pay-btn');
  btn.classList.remove('loading');
  document.getElementById('btn-text').innerHTML = '₺1.299,00 öde';
  const c = document.getElementById('card3d');
  c.style.transition = 'transform 0.8s,opacity 0.5s';
  c.style.transform = '';
  c.style.opacity = '1';
  document.getElementById('sd2').classList.add('active');
  document.getElementById('sd2').classList.remove('done');
  document.getElementById('sl2').classList.remove('done');
  document.getElementById('sd3').classList.remove('active');
}

function closeInv() {
  document.getElementById('inv-ov').classList.remove('show');
  closeOv();
}

function printInv() { window.print(); }

function downloadInv() {
  if (typeof window.jspdf === 'undefined') {
    alert('PDF kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });

  const numVal = document.getElementById('i-num').value.replace(/\s/g, '');
  const last4 = numVal.length >= 4 ? numVal.slice(-4) : '0000';
  const ts = document.getElementById('i-taksit');
  const cardLabel = (curType ? cnames[curType] + ' ' : '') + '•••• ' + last4;
  const taksitLabel = ts.options[ts.selectedIndex].text.split('—')[0].trim();

  const name  = document.getElementById('a-name').value || '-';
  const addr  = document.getElementById('a-addr').value || '-';
  const city  = document.getElementById('a-city').value || '-';
  const email = document.getElementById('a-email').value || '-';
  const phone = selectedCC.c + ' ' + (document.getElementById('a-phone').value || '-');

  const pageW = 210;
  let y = 20;

  doc.setFillColor(26, 26, 46);
  doc.roundedRect(15, y - 6, 10, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9); doc.setFont('helvetica','bold');
  doc.text('M', 20, y, { align:'center' });

  doc.setTextColor(30,30,30); doc.setFontSize(14);
  doc.text('MağazaAI', 30, y);
  doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(120,120,120);
  doc.text('Dijital Ticaret A.Ş.  |  VKN: 123 456 7890', 30, y + 6);

  doc.setTextColor(30,30,30); doc.setFontSize(20); doc.setFont('helvetica','bold');
  doc.text('FATURA', pageW - 15, y, { align:'right' });
  doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(120,120,120);
  doc.text('#' + txnId, pageW - 15, y + 6, { align:'right' });
  doc.text(payDate, pageW - 15, y + 11, { align:'right' });

  doc.setDrawColor(30,126,52); doc.setTextColor(30,126,52);
  doc.setLineWidth(1); doc.setFontSize(13); doc.setFont('helvetica','bold');
  const stampX = pageW - 45, stampY = y + 22;
  doc.text('ONAYLANDI', stampX, stampY, { angle:12, align:'center' });
  doc.roundedRect(stampX - 22, stampY - 6, 44, 10, 2, 2, 'S');

  y += 30;
  doc.setDrawColor(220,220,220); doc.line(15, y, pageW - 15, y); y += 10;

  doc.setTextColor(140,140,140); doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.text('FATURA ADRESİ', 15, y);
  doc.text('ÖDEME BİLGİLERİ', 110, y);
  y += 6;

  doc.setTextColor(30,30,30); doc.setFontSize(10); doc.setFont('helvetica','normal');
  const leftLines = [name, addr, city, email, phone];
  const rightLines = [cardLabel, taksitLabel + ' taksit', 'Ref: ' + txnId, 'Durum: Onaylandı'];
  let ly = y, ry = y;
  leftLines.forEach((line, i) => {
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.text(String(line), 15, ly); ly += 6;
  });
  rightLines.forEach(line => { doc.text(String(line), 110, ry); ry += 6; });

  y = Math.max(ly, ry) + 8;
  doc.setDrawColor(220,220,220); doc.line(15, y, pageW - 15, y); y += 8;

  doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(140,140,140);
  doc.text('ÜRÜN',15,y); doc.text('ADET',110,y);
  doc.text('BİRİM FİYAT',135,y); doc.text('TUTAR',pageW-15,y,{align:'right'});
  y += 4; doc.setDrawColor(220,220,220); doc.line(15,y,pageW-15,y); y += 7;

  doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(30,30,30);
  doc.text('Premium Ürün',15,y); doc.text('1',110,y);
  doc.text('₺1.100,85',135,y); doc.text('₺1.100,85',pageW-15,y,{align:'right'}); y+=8;

  doc.setTextColor(140,140,140); doc.text('KDV (%18)',15,y);
  doc.setTextColor(30,30,30); doc.text('₺198,15',pageW-15,y,{align:'right'}); y+=4;
  doc.setDrawColor(220,220,220); doc.line(15,y,pageW-15,y); y+=8;

  doc.setFont('helvetica','bold'); doc.setFontSize(13);
  doc.text('Genel toplam',15,y); doc.text('₺1.299,00',pageW-15,y,{align:'right'});

  y += 20;
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(160,160,160);
  doc.text('Bu fatura elektronik olarak oluşturulmuştur.',pageW/2,y,{align:'center'});
  doc.text('MağazaAI Dijital Ticaret A.Ş.',pageW/2,y+4,{align:'center'});

  doc.save('fatura-' + txnId + '.pdf');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCardTilt();
  initPhoneCC();
  document.querySelectorAll('.inp-row input').forEach(el =>
    el.addEventListener('input', () => el.classList.remove('err'))
  );
});