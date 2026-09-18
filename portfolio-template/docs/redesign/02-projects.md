# Projects Bölümü — Redesign Planı

İlgili dosyalar: `components/sections/projects-section.tsx`, `components/sections/project-detail-modal.tsx`, `components/projects/project-desk-scene.tsx`, `components/projects/project-desk-model.tsx`, `styles/sections/projects.css`.

## Mevcut durum / sorunlar

- **[P0]** `SectionHeading` import edilmiş (`projects-section.tsx:5`) ama hiç render edilmemiş — bölümün görünür başlığı yok, `aria-labelledby="work-title"` kırık referans (DOM'da `work-title` id'si yok). **Numaralandırma kaldırılsa bile başlık render edilmeli** (sadece `index` prop'u olmadan).
- Alttaki pill sekme çubuğu (`desk-projects-bar`, 6 proje ismi) ile 3D masadaki kağıtlar aynı bilgiyi iki kez gösteriyor.
- Uzun proje başlıkları (ör. "360° Performans Değerlendirme Sistemi") pill sekmede mobilde (`max-width: 8rem`) neredeyse okunmuyor.
- Masa konteyneri: `border-radius: 2rem` (32px, `projects.css:34,62`) — impeccable'ın "32px+ over-round" yasağına giriyor. Aynı konteynerde 1px border + 90px blur shadow + inset highlight (ghost-card deseni).
- Modal açılış animasyonu donuk: sadece `scale(0.95→1)` + 15px yukarı kayma + fade, 280ms (`projects.css:441-451`).

## Karar 1: Pill çubuğu kaldırılıyor

Duplikasyonu çözmek için pill sekme çubuğu tamamen kaldırılacak, keşif tamamen 3D sahneye bırakılacak.

**Wayfinding için eklenecekler** (tıklanabilirlik/discoverability'yi korumak amacıyla, Jordan-persona riskini azaltır):
- Kağıtlara hover'da üzerinde küçük bir başlık etiketi (tooltip).
- Sahnenin altında/yanında sade bir pozisyon göstergesi (ör. "3 / 6" gibi bir sayaç, tam liste değil).

Bu değişiklik uzun başlık kısaltma sorununu da otomatik çözüyor — tam başlık artık sadece modalda görünecek, pill'deki 8rem/13rem kısaltma problemi ortadan kalkıyor.

## Karar 2: Masa sahnesi "wow" seviyesine çıkarılacak

Kullanıcı masa/kağıt konseptini seviyor, konsepti değiştirmek değil **güçlendirmek** istiyor. Somut yönler:
- Sayfa yüklenince kamera uzaktan/yandan **dolly-in** yaparak masaya "iniyormuş" gibi bir giriş (mevcut `project-desk-scene.tsx`'teki kamera kurulumuna eklenecek).
- Kağıtlara hover'da hafif kalkma + eğilme + üzerinde ışık parlaması (glint) — şu an statikler.
- Masaya küçük atmosfer detayları (kalem, kahve fincanı, lamba ışığı gibi) — "gerçek bir masa" hissini güçlendirir. (3D asset gerekiyor — Blockbench'te modellenmesi gerekebilir, kullanıcının erişimi var.)
- Scroll ile hafif paralaks (kamera açısı veya ışık scroll'a tepki versin).
- Köşe/ghost-card sadeleştirmesi bu elevasyonla birlikte yapılacak — daha "vitrin" hissi, daha az "kutu içinde kutu".

## Karar 3: Modal açılışı — kağıttan morph geçişi

İki seçenek sunuldu: (a) kamera dolly-zoom (hızlı, kod-only), (b) tıklanan kağıttan modala shared-element morph (büyük efor, gerçek "wow"). **(b) seçildi.**

- Tıklanan kağıt, kendi konumundan/boyutundan başlayıp ekranı kaplayan modala dönüşecek (shared-element / FLIP-style transition).
- Bunun için **`motion` (framer-motion) kütüphanesi eklenecek** — kullanıcı onayladı, projede şu an yok (bkz. genel bakış madde 5). `layoutId` tabanlı bir geçiş muhtemelen en temiz çözüm.
- 3D sahne (WebGL/canvas) ile DOM tabanlı modal arasında koordinat eşleştirmesi gerekeceği için bu geçiş teknik olarak en karmaşık iş kalemi — kağıdın ekran-uzayı (screen-space) projeksiyonunu hesaplayıp modal'ın başlangıç `rect`'i olarak kullanmak gerekecek.

## Diğer notlar

- Numaralandırma (site geneli kararla) kaldırılacak: pill'de zaten proje `number` alanı vardı, gerekirse modal içinde (`project-modal-kicker`, `{project.number} / {project.category} · {project.year}`) formatının nasıl değişeceği implementasyon sırasında netleştirilecek — "numara" burada dekoratif bir section-index değil, projenin kendi meta verisi, ama tutarlılık için gözden geçirilmeli.
- Scroll-reveal: Projects'e özgü giriş — muhtemelen masa sahnesinin kendi dolly-in animasyonu bu rolü zaten üstleniyor, ayrı bir fade-up gerekmeyebilir (implementasyon sırasında karar verilecek).
