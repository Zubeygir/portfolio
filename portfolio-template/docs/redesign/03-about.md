# About Bölümü — Redesign Planı

İlgili dosyalar: `components/sections/about-section.tsx`, `styles/sections/about.css`, `messages/tr.json` / `messages/en.json` (`Site.about`), CV kaynağı: kullanıcı tarafından paylaşılan `Zubeyir Ali Demir - Software Developer [TR].pdf`.

## Mevcut durum / sorunlar

- Başlık + iki paragraf bio + üç düz pill listesi (Technologies/Skills/Tools, 9-10'ar öğe, tek blok — cognitive load "chunking" ihlali).
- Hiçbir yerde gerçek iş/staj deneyimi (şirket adı vb.) geçmiyor.
- Mobilde About-Contact arası ~450px ölü boşluk (bkz. genel bakış / 04-contact.md).

## Kimlik kararı: "Nefes alma" anı olarak kalıyor

Hero ve Projects'in iki gösterişli 3D bölüm olmasının aksine, About **bilinçli olarak sakin/tipografi-ağırlıklı** kalacak. Buraya yeni bir görsel/interaktif eleman eklenmiyor — sadece içerik (bio + deneyim) ve toolkit sunumu güçlendiriliyor.

## Bio metni — CV'den gelen gerçek veriler

Kullanıcıdan CV alındı. Kullanılabilir gerçek veriler:
- **Eğitim**: İstanbul Üniversitesi-Cerrahpaşa, Bilgisayar Mühendisliği (Eylül 2022 – Temmuz 2026). Öncesinde İstinye Üniversitesi, Tıp Fakültesi (Eylül 2020 – Temmuz 2022) — **alan değiştirmiş**.
- **Şu an**: Freelance Software Engineer.
- **Stajlar**: Baykar Teknoloji (Frontend Developer, Şub–Haz 2026, SSE/React/TypeScript), Vakıfbank (İnternet Bankacılığı Altyapı Stajyeri, Ağu–Eyl 2025), Uyumsoft (Yazılım Mühendisliği Stajyeri, ERP/.NET Razor, Tem–Ağu 2025).
- **Liderlik/girişimcilik**: Finans Direktörü, İÜC Bilgisayar Bilimleri Kulübü (Tem 2023 – Oca 2024); Ortak, Parker's Family eğitim girişimi (Tem 2020 – Oca 2023).
- **Teknik yelpaze**: JS/TS, React, Next.js, Swift/SwiftUI, .NET, Python, Java, C, SQL; ML tarafında LightGBM/XGBoost/Pandas/NumPy deneyimi (lisans tezi projesi).

### Onaylanan taslak (yön onaylandı, ince ayar implementasyon sırasında yapılabilir)

> "Bilgisayar Mühendisliği okurken önce Tıp Fakültesi'nden geçtim — galiba en başından beri detaylara takılan biriydim, sadece alanı değiştirdim. Şu an İstanbul'da freelance yazılım geliştiriyorum; Baykar'da gerçek zamanlı veri akışları kurdum, Vakıfbank'ta bankacılık altyapısını, Uyumsoft'ta ERP sistemlerini içeriden gördüm. React'tan SwiftUI'a, LightGBM'den .NET'e uzanan geniş bir yelpazede çalışıyorum ama en çok bir arayüzün arkasındaki kararların kullanıcıya nasıl hissettirdiğiyle ilgileniyorum."

- **Tıp→Bilgisayar Mühendisliği geçiş hikayesi**: açıkça bio'da kalacak (kullanıcı onayladı, farklılaştırıcı bir detay olarak görüyor).
- Ton: samimi/kişisel (mevcut sitenin genel diliyle uyumlu).
- İngilizce çeviri implementasyon sırasında aynı ton korunarak yapılacak.

## Yeni eleman: Deneyim listesi/zaman çizelgesi

Baykar/Vakıfbank/Uyumsoft deneyimleri şu an About'ta hiç görünmüyor. **Karar: ayrı, taranabilir bir mini "deneyim" listesi/zaman çizelgesi ekleniyor** (bio paragrafı içine gömülü kalmak yerine).

- İçerik: şirket adı, rol, tarih aralığı (CV'deki 3 staj + isteğe bağlı liderlik/girişimcilik satırları) — implementasyon sırasında kaç satırın gösterileceği netleştirilebilir (muhtemelen 3 staj öncelikli, finans direktörlüğü/Parker's Family opsiyonel/ikincil).
- Görsel format: About'un "sakin/nefes alma" kimliğine uygun, sade bir liste/zaman çizelgesi — Projects'teki gibi gösterişli olmayacak. **Numaralandırma (01/02/03) kullanılmayacak** (site geneli karara uygun).
- Not: `CapabilitiesSection`/`JourneySection` silinecek olsa da (bkz. genel bakış), bu yeni deneyim listesi onların yerini doğrudan almıyor — çok daha küçük, About'un içine gömülü bir eleman. `JourneySection`'ın orijinal amacı (kariyer zaman çizelgesi) kısmen burada karşılanmış oluyor ama ayrı bir bölüm olarak değil.

## Toolkit (Technologies/Skills/Tools) — yeni format

**Karar: ikonlu chip + grid** (öneri onaylandı, seviye/yeterlilik göstergesi eklenmeyecek — "sakin mola" kararıyla çelişir).

- Her üç kategori de küçük tek-renk ikonlu chip'lere çevrilecek (16-18px ikon, marka altın rengiyle uyumlu monokrom).
- `flex-wrap` yerine `auto-fit`/grid ile 4'lü satırlara bölünecek (mevcut `toolkit-group` düz `flex-wrap` yapısının yerine).
- İkon kaynağı implementasyon sırasında belirlenecek (ör. `lucide-react` zaten projede var ama teknoloji-spesifik ikonlar için `simple-icons` gibi ayrı bir set gerekebilir — bu da yeni bir bağımlılık kararı, implementasyon öncesi teyit edilmeli).

## Diğer teknik notlar

- Mobilde About-Contact arası dev boşluk: `about.css` `padding-bottom: clamp(8rem, 14vw, 15rem)` → dar viewport'ta ~4-5rem'e sabitlenecek breakpoint eklenecek.
- `#about-title` letter-spacing `-0.06em`, `.about-details h3` `-0.05em` → `-0.02em`–`-0.04em` aralığına çekilecek (genel typography kararıyla uyumlu, Cabinet Grotesk'e geçince zaten yeniden ayarlanacak).
- Numaralandırma (`.section-index`, `t('index')`) kaldırılacak.
