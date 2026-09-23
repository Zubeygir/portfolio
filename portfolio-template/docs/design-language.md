# Design Language — Zübeyir Ali Demir Portfolyosu

Bu dosya kalıcıdır ve bağlayıcıdır. Redesign implementasyonu (bkz. `docs/redesign/`) da, sonrasındaki her değişiklik de bu kurallara uyacak. Burada tanımlanmayan yeni bir tasarım kararı gerekiyorsa önce kullanıcıya sorulup bu dosya güncellenecek — sessizce dışına çıkılmayacak.

## 1. Renk

Token kaynağı: `app/globals.css` `:root`. Yeni renk **eklenmeyecek**, mevcut tokenlar kullanılacak.

| Token | Değer | Kullanım |
|---|---|---|
| `--background` | `#08090c` | Ana zemin (near-black) |
| `--foreground` | `#ededf0` | Ana metin |
| `--primary` / `--ring` | `#d4af37` | Tek accent — altın |
| `--primary-foreground` | `#08090c` | Primary üzerindeki metin |
| `--card` / `--popover` | `#0f1117` | Yükseltilmiş yüzeyler |
| `--muted-foreground` | `#9ca2b0` | İkincil metin |
| `--border` | `rgba(255,255,255,0.08)` | Standart border |
| `--ink-soft` | `#a0a6b5` | Yumuşatılmış body metin |

- **Strateji**: near-black zemin + tek saturated accent (gold). Bu "committed, tek renk" stratejisi korunacak — yeni bir ikinci/üçüncü accent rengi eklenmeyecek (onay alınmadan).
- **Kontrast**: body metin ≥4.5:1, büyük metin/başlık ≥3:1. Gerçek zemin rengine göre hesapla — `--primary`'nin kendisi düşük opaklıkla glow/gradient olarak kullanıldığında (ör. `rgba(212,175,55,0.18)`) bunun üstündeki metnin kontrastını **alfa-bileşik piksele göre** değerlendir, token'ın tam-opak değerine göre değil (kritikte tam bu yüzden bir yanlış-pozitif çıktı).
- **Yasak**: gradient text (`background-clip: text` + gradient arkaplan).
- **Onaylı istisna — kağıt paleti**: Proje detay modal'ı masadaki 3D kağıdın büyütülmüş hali olduğu için kağıt dokusunun (`project-desk-paper-texture.ts`) renklerini kullanır: zemin `#efe6cf`, mürekkep `#201c14`, altın çizgi `#a8823a`, kicker `#7d5f22`, rol `#6f5420`. Bunlar `projects.css`'te `.project-modal-content` içinde `--paper-*` değişkenleri olarak tanımlı, sadece o kapsamda kullanılır; sitenin geri kalanına taşınmaz. Ataçın gümüş metal tonları da bu istisnaya dahildir.

## 2. Tipografi

- **Gövde metni + mono etiketler**: Atkinson Hyperlegible Next / Atkinson Hyperlegible Mono (`--font-body`, `--font-mono-label`). Geist (Next.js starter varsayılanı) bilinçli olarak bırakıldı.
- **Başlıklar (h1–h3, display boyutlar)**: **Cabinet Grotesk** (Fontshare, self-hosted) — genel bakış kararı, uygulanacak.
- **Letter-spacing tabanı**: `-0.04em`'in altına inilmeyecek. Mevcut `-0.05em` ile `-0.085em` arası ihlaller (`hero.css:95`, `about.css:21,43`, `contact.css:49` vb.) `-0.02em`–`-0.04em` aralığına çekilecek.
- **Satır uzunluğu**: body/paragraf metni 65–75ch tavan (mevcut `max-width: Nch` kullanımı korunacak, yeni metin blokları da bu kurala uyacak).
- **Ölçek**: `clamp()` tabanlı fluid scale, adımlar arası oran ≥1.25. Flat (1.1× benzeri) ölçek kullanılmayacak.
- `text-wrap: balance` h1–h3'te, `text-wrap: pretty` uzun paragraflarda tercih edilir.
- All-caps (`text-transform: uppercase`) sadece kısa etiketlerde (kicker, nav, buton metni gibi ~20 karakterin altı). Uzun cümle/açıklama metninde asla (bkz. `.character-note`, `.project-desk-instruction` düzeltmesi).

## 3. Spacing & Radius

- **border-radius tavanı**: kart/section/görsel-konteyner/input için mevcut `--radius-xl` (**1rem / 16px**) üstüne çıkılmayacak. `2rem`, `1.8rem` gibi değerler (ör. `projects.css:34,62,252`) bu tavana indirilecek.
- **Pill istisnası**: tam yuvarlak (`999px`) sadece gerçek pill-şeklindeki öğelerde (buton, etiket/chip, tag) kullanılır — büyük dikdörtgen kart/konteynerlerde pill-radius kullanılmaz.
- **Ghost-card yasağı**: ince border (≤1px) + geniş blur gölge (≥16px blur) **aynı öğede birlikte kullanılmaz**. Ya tanımlı tek bir border (marka rengiyle) ya da ≤8px blur'lu bir gölge — ikisi birden değil.
- **z-index skalası**: rastgele büyük sayılar (999/9999) kullanılmaz. Mevcut kullanılan katmanlar referans alınıp genişletilir: `hero background` (0-2) < `content` (2-4) < `sticky header` (~30) < `modal-backdrop/modal` (~100) < `toast/tooltip` (gerekirse en üst). Yeni bir katman eklenirken bu sıralamaya oturtulur.

## 4. Motion

- Tüm geçişlerde mevcut `--ease-portfolio` (`cubic-bezier(0.16, 1, 0.3, 1)`, ease-out-expo ailesi) kullanılır — yeni bir easing eğrisi icat edilmez.
- Bounce/elastic easing yasak.
- `prefers-reduced-motion: reduce` her zaman saygı görür. `globals.css`'teki global fallback (`animation-duration: 0.01ms`) tüm yeni animasyonları otomatik kapsar, ama kritik/uzun geçişler (intro spin, modal morph gibi) component seviyesinde de kendi `reducedMotion` kontrolünü yapmalı (bkz. `hero-section.tsx`, `character-model.tsx`'teki mevcut örnek).
- **Scroll-reveal**: her bölüm kendi içeriğine uygun kendi girişiyle belirir — tüm sayfada tek tip/uniform "fade-up" yasak (impeccable'ın "uniform reflex" uyarısı).
- Reveal animasyonları her zaman "zaten görünür bir varsayılanı güçlendirir" — içerik class-tetiklemeli bir görünürlük şartına bağlanmaz (headless/gizli sekmede reveal hiç tetiklenmeyip bölüm boş kalmasın diye).

## 5. Bileşen kalıpları

- **Buton/pill**: Şu an `header-cta`, `hero-enter`, `contact-link`, `desk-project-tab`, `mobile-menu-cta` 5 ayrı yerde bağımsız tanımlı — teknik borç. Yeni buton eklerken **mevcut stillerden biri yeniden kullanılır**, yenisi icat edilmez. Fırsat bulundukça ortak bir class/component'e çıkarılır.
- **Kart**: nested card (kart içinde kart) yasak. Kart sadece gerçekten en iyi afordans olduğunda kullanılır — liste/grid için önce `flex`/`grid` + sade satır düşünülür.
- **Modal**: backdrop-blur + giriş animasyonu deseni korunur. Projects modal'ı shared-element morph'a geçse de (bkz. `docs/redesign/02-projects.md`), ileride yeni bir modal eklenirse bu genel yaklaşım (backdrop-blur, `Escape`/backdrop-click ile kapanma, `aria-modal`) temel alınır.
- **Proje detay modal'ı = kağıt belge**: Koyu kart değil, masadaki kağıdın büyütülmüş hali (krem zemin + aynı lif dokusu, üstte altın çizgi, kategori + durum·yıl etiketi, filigran). Proje görseli varsa (`imageSrc` → `public/projects/`, ya da Sanity `image`) ince beyaz çerçeveli, hafif yamuk basılı fotoğraf olarak gümüş ataçla tutturulmuş gösterilir; ataç iki parçalı SVG'dir (arka bacak fotoğrafın arkasında, ön bacak önünde). Bu, madde 11'deki el-çizimi/sketchy SVG yasağına girmez — temiz, geometrik bir nesne çizimidir.

## 6. Numaralandırma / scaffolding yasağı

- `01 / Başlık` tipi section-index deseni **kalıcı olarak yasak** — impeccable'ın "Numbered section markers as default scaffolding" maddesiyle birebir örtüşüyor, bu proje için tekrar eklenmeyecek.
- **İstisna**: gerçekten sıralı bir süreç/liste varsa (ör. numaralı bir "nasıl çalışırım" akışı) numara kullanılabilir — ama bu, dekoratif bir "bölüm kimliği" değil, bilgi taşıyan gerçek bir sıra olmalı.
- Eyebrow/kicker (Hero'daki gibi küçük uppercase etiket) tek, bilinçli bir marka öğesi olarak kalabilir ama her bölümün üstüne tekrarlanmaz.

## 7. İkonografi

- UI ikonları: `lucide-react` (mevcut, değişmiyor).
- Teknoloji/araç ikonları (About toolkit grid'i için): implementasyon sırasında seçilecek tek bir set — tutarlı, tek-renk/monokrom stil, marka altın rengiyle uyumlu.

## 8. Erişilebilirlik

- `:focus-visible` her zaman görünür (global kural, `globals.css:107-110` — korunur, yeni interaktif öğeler bunu miras alır, `outline: none` ile ezilmez).
- Kontrast: body ≥4.5:1, büyük metin/başlık ≥3:1.
- `aria-labelledby`/`aria-describedby` her zaman gerçek bir DOM id'sine işaret eder — render edilmeyen bir başlığa referans verilmez (Projects P0 hatası bir daha tekrarlanmaz).
- Klavye-only gezinme her interaktif öğede çalışır (3D sahnelerdeki özel etkileşimler dahil — drag-to-rotate gibi fare-özel etkileşimlerin yanında en azından temel erişim/skip yolu bulunur).

## 9. Metin/ton

- Türkçe öncelikli, **samimi/kişisel** ton — kurumsal/jenerik "passionate developer" dili yasak.
- İngilizce çeviri aynı tonu korur, kelimesi kelimesine çeviri yapılmaz.
- İçerik her zaman doğrulanabilir gerçek bilgiye dayanır (CV, kullanıcı onayı) — uydurma biyografi/deneyim eklenmez.

## 10. 3D / karakter kuralları

- Voxel/pixel-art doku filtreleme (`THREE.NearestFilter` / `NearestMipmapNearestFilter`) korunur — yeni 3D asset eklenirse aynı görsel dile (keskin piksel kenarları, yumuşatılmamış doku) uyar.
- Karakter parça-bazlı rig deseni (her uzuv/parça ayrı, kendi pivot'una sahip bir grup — `head`, `body`, `left_arm`, `right_arm`, `left_leg`, `right_leg`) yeni pozlar/animasyonlar için temel alınır; Blockbench'e geri dönmeden kod tarafında (Three.js grup rotasyon/pozisyonları) pozlandırılır.
- Drag-to-rotate + pointer-follow etkileşim deseni (Hero karakterinde kurulu) sitenin "imza etkileşimi" — yeni 3D sahnelerde (ör. Projects masası) benzer sezgisellikte etkileşim tercih edilir.

## 11. Mutlak yasaklar

impeccable'ın global "absolute ban" listesinden bu projede özellikle geçerli olanlar + bu projede zaten bulunup düzeltilen ihlaller (bir daha eklenmeyecek):

- Side-stripe border'lar (kart/liste öğesinde dekoratif `border-left`/`border-right`).
- Gradient text.
- Glassmorphism'in varsayılan/süsleyici kullanımı (nadir ve amaçlı olmadıkça).
- Hero-metric şablonu (büyük sayı + küçük etiket + gradient accent).
- Aynı boyutlu, aynı desende tekrarlayan kart gridleri.
- Her bölümün üstünde küçük uppercase tracked "eyebrow" (tek, bilinçli bir marka öğesi hariç — madde 6).
- Numaralı section-marker'lar (01/02/03) — madde 6.
- Konteyner/kart taşan metin (her breakpoint'te headline/description test edilecek).
- İnce border + geniş blur gölge birlikte (ghost-card) — madde 3.
- `border-radius: 32px+` kart/section/input üzerinde — madde 3.
- El-çizimi/sketchy SVG illüstrasyon, `feTurbulence`/`feDisplacementMap` "kağıt dokusu" filtreleri.
- `repeating-linear-gradient` çizgili dekoratif arkaplanlar.
- İki eksenli CSS grid overlay dekoratif arkaplanlar (gerçek bir canvas/harita/blueprint değilse).
- Meta-eleştiri kopya (bir kavramı adlandırıp ironik biçimde "düzeltme" numarası yapmak).

## 12. Bu dosyanın kullanım kuralı

- Yeni bir implementasyon kararı bu dosyayla çelişiyorsa: önce kullanıcıya sorulur, karar netleşince bu dosya güncellenir, sonra kod yazılır.
- Bu dosya `docs/redesign/00-genel-bakis.md` ve diğer plan dosyalarından daha kalıcıdır — redesign bittikten sonra da geçerliliğini korur, gelecekteki her değişiklik için referans alınır.
