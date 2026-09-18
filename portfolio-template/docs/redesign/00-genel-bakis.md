# Redesign Planı — Genel Bakış

Bu klasördeki dosyalar, 2026-09-16 tarihinde yapılan tasarım kritiği (`.impeccable/critique/2026-09-16T12-09-53Z__app-locale-page-tsx.md`) ve ardından bölüm bölüm yapılan planlama konuşması sonucu ortaya çıktı. Aşağıdaki maddelerden bir kısmı (numaralandırma kaldırma, radius/ghost-card sadeleştirme, P0 aria düzeltmesi, ölü kod silme, header sticky, uppercase düzeltmesi) 2026-09-16'da uygulandı — durumları madde madde işaretli. Kalan maddeler hâlâ referans alınacak plan.

Sayfa render sırası: Header → Hero → Projects → About → Contact → Footer (bkz. `app/[locale]/page.tsx`).

**Bağlayıcı referans**: [`docs/design-language.md`](../design-language.md) — bu redesign'ın ve sonrasındaki her değişikliğin uyacağı kalıcı tasarım kuralları (renk, tipografi, radius/motion sınırları, numaralandırma yasağı, mutlak yasaklar). Implementasyon sırasında bu dosyanın dışına çıkılmaz.

## Bölüm bazlı plan dosyaları

- [01-hero.md](./01-hero.md)
- [02-projects.md](./02-projects.md)
- [03-about.md](./03-about.md)
- [04-contact.md](./04-contact.md)
- [05-header-footer.md](./05-header-footer.md)

## Site geneli kararlar

### 1. Numaralı bölüm başlıkları (01/02/03…) tamamen kaldırılıyor — ✅ tamamlandı (2026-09-16)
`impeccable` skill'inin kendi "absolute ban" listesindeki *"Numbered section markers as default scaffolding"* maddesiyle birebir eşleşiyor. `components/shared/section-heading.tsx`'deki `index` prop'u ve kullanıldığı her yer (About, Contact başlıkları, `messages/*.json`'daki `"index"` key'leri) kaldırıldı. Artık kullanılmayan `.section-index` CSS kuralları da (`globals.css`, `about.css`, `contact.css`, `projects.css`) temizlendi.

Mobil menüdeki nav linklerinin önündeki "01/02/03" (`components/shared/site-header.tsx`) de kaldırıldı — kullanıcı tutarlılık için sitedeki diğer numaralarla birlikte bunun da gitmesini istedi.

### 2. Tipografi: ikinci bir aile ekleniyor
- Gövde metni ve mono etiketler: **Geist Sans / Geist Mono** (değişmiyor, kurulu kimliğin parçası)
- Başlıklar (h1/h2/h3, display boyutlar): **Cabinet Grotesk** (Fontshare, ücretsiz/self-hosted)
- Gerekçe: impeccable'ın reflex-reject font listesindeki hiçbir isme (Inter, Space Grotesk, DM Sans, IBM Plex, Outfit, Plus Jakarta Sans, Fraunces, Playfair, Cormorant vb.) girmiyor; büyük boyutlarda (hero başlığı `clamp(3.75rem, 7.5vw, 7.75rem)`) karakteristik kesişme detayları var, Geist'ten yeterince farklı bir iskelete sahip olduğu için gerçek bir kontrast ekseni yaratıyor.
- Uygulama notu: font dosyalarının self-host edilmesi gerekiyor (Fontshare'den indirilip `public/fonts/` veya `next/font/local` ile).

### 3. Aşırı köşe yuvarlaklığı / ghost-card deseni sadeleştirilecek — ✅ tamamlandı (2026-09-16)
`design-language.md` referans alınarak uygulandı:
- `styles/sections/projects.css` — `.project-desk-canvas-wrap` / `.project-desk-loading` / `.project-modal-content`: `border-radius` `--radius-xl` (1rem/16px) tavanına çekildi (masaüstü + mobil breakpoint). Canvas-wrap'teki 1px border kaldırıldı, shadow (depth için asıl işi yapan) korundu.
- `styles/sections/hero.css` — `.hero-enter` butonu: border (marka rengi) korundu, shadow blur ≤8px'e indirildi (base + hover).
- Aynı sadeleştirme `.desk-hover-overlay-pill`, `.desk-project-tab:hover/.is-active` ve `globals.css`'teki `.locale-menu`'ye de uygulandı.

### 4. Scroll-reveal motion
Bölümler şu an scroll'da direkt görünüyor (reveal animasyonu yok). Eklenecek — ama **tek tip fade-on-scroll değil**, her bölüme kendi girişine uygun bir hareket (impeccable'ın "uniform reflex" uyarısına göre). Detaylar her bölüm dosyasında.

### 5. Yeni bağımlılık: `motion` (framer-motion)
Projects modal'ındaki shared-element morph geçişi (bkz. [02-projects.md](./02-projects.md)) için gerekli. Kullanıcı onayı alındı. Şu an projede yok (`package.json`'da styled-components var ama framer-motion/motion yok).

### 6. Genel palet
Koyu (near-black) + altın (`#d4af37`) paleti korunuyor, büyük bir palet değişikliği yok. Sadeleştirmeler (madde 3) dekoratif fazlalığı azaltacak ama renk stratejisi aynı kalıyor.

## Kritik raporundan hâlâ açık olan/teyit gereken maddeler

- ✅ **P0 — tamamlandı (2026-09-16)**: Projects bölümünde `SectionHeading` artık render ediliyor (`id="work-title"`, `title`, `description` ile) — `aria-labelledby="work-title"` referansı artık geçerli bir DOM id'sine işaret ediyor.
- Mobilde bölümler arası dev boşluklar (`about.css`/`contact.css` clamp taban değerleri dar viewport'ta küçülmüyor) — **hâlâ açık**.
- ✅ **Header `position: absolute` → `position: sticky` — tamamlandı (2026-09-16)** (bkz. [05-header-footer.md](./05-header-footer.md)). Merkezleme `left:50%+transform` yerine `margin-inline:auto`'ya çevrildi; hero'nun `padding-top` değeri header artık flow'da yer kapladığı için düşürüldü — **görsel olarak kullanıcı tarafından doğrulanmalı**.
- 3D hero canvas'ında fare tekerleğinin sayfa scroll'unu yutması (`components/character/character-stage.tsx`, `character-scene.tsx`) — **hâlâ açık**.
- ✅ **`.character-note` / `.project-desk-instruction` üzerindeki `text-transform: uppercase` — tamamlandı (2026-09-16)** (55-71 karakterlik metinlerde okunabilirliği bozuyordu). `design-language.md`'deki ilgili not artık doğru.
- ✅ **Ölü kod silindi (2026-09-16)**: `CapabilitiesSection`, `JourneySection` ve ilişkili `capabilities.css`, `journey.css`, `lib/types.ts`'teki `Capability`/`JourneyItem` tipleri, `messages/*.json`'daki `Site.capabilities`, `Site.journey`, `Site.navigation.capabilities`, `Site.navigation.journey` key'leri kaldırıldı.
- Pill-buton stilinin (`header-cta`, `hero-enter`, `contact-link`, `desk-project-tab`, `mobile-menu-cta`) 5 farklı yerde bağımsız tanımlanması — ortak bir class/component'e çıkarılabilir (düşük öncelik, teknik borç) — **hâlâ açık**.
