/**
 * Animated Payment Form — demo logic
 * No external dependencies. Pure vanilla JS.
 *
 * This is a FRONTEND DEMO ONLY. No real payment is processed.
 * Card numbers are never sent anywhere — everything happens in the browser.
 */

let curType = null;
let txnId = '';
let payDate = '';

const colors = { visa: '#1A1F71', mastercard: '#1d1d1d', amex: '#006FCF', troy: '#B00D0D', discover: '#E45E00' };
const cnames = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', troy: 'Troy', discover: 'Discover' };

const logos = {
  visa: `<svg width="50" height="32" viewBox="0 0 56 36"><text x="28" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" font-style="italic" fill="white">VISA</text></svg>`,
  mastercard: `<svg width="50" height="32" viewBox="0 0 56 36"><circle cx="22" cy="18" r="12" fill="#EB001B"/><circle cx="34" cy="18" r="12" fill="#F79E1B"/><path d="M28 8a12 12 0 010 20 12 12 0 010-20z" fill="#FF5F00"/></svg>`,
  amex: `<svg width="50" height="32" viewBox="0 0 56 36"><text x="28" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="white">AMERICAN</text><text x="28" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="white" letter-spacing="1.5">EXPRESS</text></svg>`,
  troy: `<svg width="50" height="32" viewBox="0 0 56 36"><text x="28" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="white" letter-spacing="1.5">TROY</text></svg>`,
  discover: `<svg width="50" height="32" viewBox="0 0 56 36"><text x="28" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="white">DISCOVER</text></svg>`
};

/** Detect card brand from a (partial) card number using standard IIN ranges. */
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
  const c = t ? colors[t] : '#1a1a2e';
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
    il.innerHTML = logos[t].replace(/width="50"/g, 'width="36"').replace(/height="32"/g, 'height="20"');
  } else {
    il.innerHTML = '<i class="ti ti-credit-card" style="font-size:20px;color:var(--color-text-secondary)" aria-hidden="true"></i>';
  }
}

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
    card.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
  });
  scene.addEventListener('mouseleave', () => {
    if (!card.classList.contains('flipped')) {
      card.style.transform = '';
      card.style.animation = '';
    }
  });
}

function goStep(s) {
  if (s === 2) {
    let ok = true;
    ['a-name', 'a-email', 'a-phone', 'a-addr'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.classList.add('err');
        ok = false;
      } else {
        el.classList.remove('err');
      }
    });
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

function confetti() {
  const box = document.getElementById('confetti-box');
  box.innerHTML = '';
  const cols = ['#EB001B', '#F79E1B', '#1A1F71', '#00C853', '#FF4081', '#448AFF', '#FFD600', '#7C4DFF'];
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
    payDate = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const payTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('s-txn').textContent = '#' + txnId;
    document.getElementById('s-date').textContent = payDate + ', ' + payTime;
    document.getElementById('s-card').textContent = (curType ? cnames[curType] + ' ' : '') + '•••• ' + last4;
    document.getElementById('s-tak').textContent = ts.options[ts.selectedIndex].text.split('—')[0].trim();

    document.getElementById('ov-ok').classList.add('show');
    confetti();
  }, 2000);
}

function showInvoice() {
  document.getElementById('ov-ok').classList.remove('show');

  const numVal = document.getElementById('i-num').value.replace(/\s/g, '');
  const last4 = numVal.length >= 4 ? numVal.slice(-4) : '0000';
  const ts = document.getElementById('i-taksit');

  document.getElementById('inv-no').textContent = '#' + txnId;
  document.getElementById('inv-date').textContent = payDate;
  document.getElementById('inv-name').textContent = document.getElementById('a-name').value;
  document.getElementById('inv-addr').textContent = document.getElementById('a-addr').value;
  document.getElementById('inv-city2').textContent = document.getElementById('a-city').value;
  document.getElementById('inv-email').textContent = document.getElementById('a-email').value;
  document.getElementById('inv-phone').textContent = document.getElementById('a-phone').value;
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

  // Stamp slam animation
  setTimeout(() => {
    stamp.classList.add('slam');
  }, 50);

  // Dust particles + screen shake when stamp lands
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

  // Swap "verifying" status to final "approved" status
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

function printInv() {
  window.print();
}

function downloadInv() {
  const w = window.open('', '', 'width=600,height=800');
  w.document.write('<html><head><title>Fatura #' + txnId + '</title><style>body{font-family:sans-serif;padding:2rem;color:#222}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #eee}th{font-size:11px;color:#888;text-transform:uppercase}.total td{border:none;font-weight:700;font-size:16px;padding-top:14px}.stamp{float:right;border:3px solid #2e7d32;color:#2e7d32;padding:6px 18px;border-radius:8px;transform:rotate(-15deg);opacity:0.6;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-top:-40px;font-size:14px}</style></head><body>');
  w.document.write('<h1 style="font-size:22px">FATURA</h1><p style="color:#888">#' + txnId + ' | ' + payDate + '</p>');
  w.document.write('<div class="stamp">Onaylandı</div>');
  w.document.write('<hr><p><strong>' + document.getElementById('a-name').value + '</strong><br>' + document.getElementById('a-addr').value + '<br>' + document.getElementById('a-city').value + '<br>' + document.getElementById('a-email').value + '<br>' + document.getElementById('a-phone').value + '</p>');
  w.document.write('<table><thead><tr><th>Ürün</th><th>Adet</th><th>Birim fiyat</th><th style="text-align:right">Tutar</th></tr></thead><tbody>');
  w.document.write('<tr><td>Premium Ürün</td><td>1</td><td>₺1.100,85</td><td style="text-align:right">₺1.100,85</td></tr>');
  w.document.write('<tr><td colspan="3" style="color:#888">KDV (%18)</td><td style="text-align:right">₺198,15</td></tr>');
  w.document.write('<tr class="total"><td colspan="3">Genel toplam</td><td style="text-align:right">₺1.299,00</td></tr>');
  w.document.write('</tbody></table><br><p style="text-align:center;color:#aaa;font-size:12px">Bu fatura elektronik olarak oluşturulmuştur. | MağazaAI Dijital Ticaret A.Ş.</p></body></html>');
  w.document.close();
  w.print();
}

document.addEventListener('DOMContentLoaded', () => {
  initCardTilt();
  document.querySelectorAll('.inp-row input').forEach((el) =>
    el.addEventListener('input', () => el.classList.remove('err'))
  );
});
