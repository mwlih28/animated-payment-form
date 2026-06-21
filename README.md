# 💳 Animated Payment Form

Saf HTML, CSS ve vanilla JavaScript ile yapılmış, **3D kart animasyonlu**, **otomatik kart tipi tespiti** ve **fatura damga efekti** içeren bir ödeme formu demo'su.

> ⚠️ Bu proje sadece bir **frontend görsel demo**'dur. Gerçek bir ödeme işlemi gerçekleştirmez, hiçbir veri sunucuya gönderilmez ve hiçbir ödeme altyapısına (Stripe, iyzico, PayTR vb.) bağlı değildir. Kendi projenize entegre etmek isterseniz aşağıdaki [Gerçek ödeme entegrasyonu](#gerçek-ödeme-entegrasyonu) bölümüne bakın.

## ✨ Özellikler

- 🔄 **3 adımlı checkout akışı** — adres, ödeme, onay
- 🎨 **3D kart animasyonu** — mouse ile tilt efekti, CVV'ye tıklayınca flip
- 💳 **Otomatik kart tipi tespiti** — Visa, Mastercard, American Express, Troy, Discover
- ✅ **Başarı ekranı** — konfeti, çizilen tik animasyonu
- 🧾 **Kişiye özel fatura** — girilen bilgilerle otomatik dolan, "Onaylandı" damgası vuruş animasyonlu
- 🌗 **Karanlık mod desteği** — `prefers-color-scheme` ile otomatik
- 📦 **Sıfır bağımlılık** — sadece [Tabler Icons](https://tabler.io/icons) webfont CDN'den

## 🖼️ Önizleme

| Form | Fatura |
|---|---|
| ![form](screenshots/form.png) | ![fatura](screenshots/invoice.png) |

## 🚀 Kullanım

Repo'yu klonlayın ve `index.html` dosyasını bir tarayıcıda açın:

```bash
git clone https://github.com/mwlih28/animated-payment-form.git
cd animated-payment-form
open index.html   # veya çift tıklayın
```

Yerel bir sunucu üzerinden çalıştırmak isterseniz (önerilir):

```bash
python3 -m http.server 8000
# tarayıcıda http://localhost:8000 açın
```

## 🧪 Test kartları

Kart tipi tespitini denemek için herhangi bir 16 haneli sayı yazabilirsiniz, gerçek kart bilgisi gerekmez:

| Kart tipi | Başlangıç |
|---|---|
| Visa | `4` ile başlayan herhangi bir numara |
| Mastercard | `51`–`55` veya `22`–`27` |
| American Express | `34` veya `37` |
| Troy | `9792` |
| Discover | `6011` veya `65` |

## 📁 Proje yapısı

```
animated-payment-form/
├── index.html              # Ana sayfa (markup + stiller)
├── assets/
│   └── payment-form.js     # Tüm form mantığı (kart tespiti, animasyonlar, fatura)
├── screenshots/            # README görselleri
├── LICENSE
└── README.md
```

## 🔧 Gerçek ödeme entegrasyonu

Bu form sadece arayüzdür. Gerçek bir ödeme akışına bağlamak için:

1. `startPay()` fonksiyonundaki `setTimeout` simülasyonunu kaldırın
2. Kart bilgilerini kendi sunucunuza **değil**, doğrudan seçtiğiniz ödeme sağlayıcısının (iyzico, PayTR, Stripe vb.) client-side SDK'sına veya tokenizasyon servisine gönderin
3. Sağlayıcıdan dönen sonuca göre `ov-ok` (başarı) veya bir hata ekranı gösterin

**Önemli güvenlik notu:** Ham kart numarası ve CVV'yi asla kendi backend'inize göndermeyin/loglamayın. PCI-DSS uyumluluğu için ödeme sağlayıcının tokenizasyon akışını kullanın.

## 📄 Lisans

MIT — [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir issue açmanızı rica ederiz.
