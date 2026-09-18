# Contact Bölümü — Redesign Planı

İlgili dosyalar: `components/sections/contact-section.tsx`, `styles/sections/contact.css`, `messages/tr.json` / `messages/en.json` (`Site.contact`).

## Mevcut durum / sorunlar

- Sadece kicker + başlık + tek bir mailto pill + bir not var.
- Not metni "LinkedIn üzerinden de ulaşabilirsin" diyor ama sayfada hiçbir yerde LinkedIn linki yok — tutulmayan vaat.
- Site'nin kapanışı (peak-end rule açısından kritik an) şu an en sönük yer: iki gösterişli 3D bölümden sonra tek satırlık düz bir buton ile bitiyor.
- Mobilde Contact'ın üstünde (About'tan gelen) ~450px ölü boşluk var (bkz. [03-about.md](./03-about.md)).

## Karar 1: Yeni iletişim kanalları

Email dışında eklenecekler (kullanıcı seçti):
- **LinkedIn**: `linkedin.com/in/zubeyiralidemir/` (CV'den alındı, teyitli)
- **GitHub**: `GitHub/Zubeygir` (CV'de bu şekilde yazılmış — implementasyon sırasında tam URL'in `github.com/Zubeygir` mi yoksa farklı bir kullanıcı adı mı olduğu teyit edilmeli)
- **CV indirme**: İndirilebilir PDF linki — kullanıcının paylaştığı `Zubeyir Ali Demir - Software Developer [TR].pdf` dosyası projeye eklenip (`public/` altına) bir indirme linki olarak sunulacak. İngilizce sürüm için ayrı bir CV olup olmadığı implementasyon öncesi teyit edilmeli (yoksa TR CV her iki locale'de de sunulabilir, ya da sadece TR locale'de gösterilir).

Kanalların görsel sunumu (email pill'in yanına ikon-link olarak mı, yoksa ayrı bir mini liste olarak mı ekleneceği) implementasyon sırasında karara bağlanacak.

## Karar 2: Kapanış enerjisi güçlendirilecek

Seçilen yön: **"Daha güçlü bir kapanış ifadesi + görsel vurgu"** (müsaitlik rozeti değil, sadelik-koruma değil).

- Başlık/mesaj daha iddialı bir ifadeye çekilecek (mevcut metin implementasyon sırasında CV'deki freelance/güncel duruma göre revize edilebilir).
- Hafif bir motion/görsel vurgu eklenecek — spesifik uygulama (ör. büyütülmüş glow, giriş animasyonu, tipografik vurgu) implementasyon sırasında tasarlanacak, bu doküman sadece yönü sabitliyor.
- Not: "müsaitlik durumu ekle" seçeneği seçilmedi ama kullanıcı freelance olduğunu belirtti — kapanış metni yazılırken bu bilgi (freelance software engineer) doğal olarak yansıtılabilir, ayrı bir "rozet" olarak değil.

## Diğer teknik notlar

- Numaralandırma (`.section-index`, `t('index')`) kaldırılacak.
- `#contact-title` letter-spacing `-0.065em` → `-0.02em`–`-0.04em` aralığına çekilecek.
- Mobilde üstteki dev boşluk: `contact.css` `padding-top: clamp(9rem, 15vw, 16rem)` → dar viewport'ta sabitlenecek breakpoint eklenecek (bkz. genel bakış).
- Scroll-reveal: Contact'a özgü bir giriş hareketi tasarlanacak (genel karar, tek tip fade değil).
