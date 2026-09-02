# Portfolio Handoff — Zübey

> Bu belge, projeyi başka bir yapay zekânın veya geliştiricinin güvenle devralabilmesi için hazırlanmıştır. Önce bu belgeyi, ardından kökteki `AGENTS.md` dosyasını okuyun. Mevcut tasarım ve kullanıcı kararları, boilerplate içindeki eski demo önerilerinden önceliklidir.

## 1. Proje özeti

- **Proje yolu:** `C:\Users\zubey\OneDrive\Desktop\Projelerim\portfolio\portfolio-template`
- **Teknoloji:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, next-intl, isteğe bağlı Sanity, Three.js + React Three Fiber + Drei.
- **Dil:** İngilizce (`/en`) ve Türkçe (`/tr`). Varsayılan dil İngilizce.
- **Kullanıcının unvanı:** **Software Developer**. “Junior Frontend Developer” ifadesi kullanılmamalı.
- **Amaç:** Kullanıcının özgün Blockbench karakterini merkezine alan, ama içerik ve proje sunumunda Erika Kondratjeva’nın portfolyosundan **yapısal** ilham alan kişisel portfolio.

## 2. Kesin kullanıcı kararları

Bu maddeler tasarım kararlarının kaynağıdır; aksi açıkça istenmedikçe değiştirilmemelidir.

1. Karakterin arkasında gerçek fotoğraf kullanılmayacak. Bu fikir tamamen rafa kaldırıldı.
2. Karakter bir Minecraft/Blockbench estetiğinde, kullanıcıyı temsil eden özgün bir modeldir. CraftzDog’dan ilham alınmıştır ama kopya karakter yapılmayacaktır.
3. Karakter landing ekranında ana unsur olmalı; başlangıçta dönmeli, gözleri fareyi takip etmeli.
4. Karakter “bir kez gösterilip kaybolan” bir unsur değildir. Landing’e geri dönüldüğünde tekrar görünür; ileride başka uygun yerlerde yeniden kullanılabilir.
5. Kullanıcı Erika’nın portfolyosunu kendi sitesine en yakın referans olarak seçti. Ondan alınacak şey görsel kopya değil; sade yapı, net landing, doğrudan proje sunumu ve kişisel About akışıdır.
6. Kullanıcı About bölümünün proje bölümünden önce gelmesini tercih etti.
7. Boilerplate’in önceki “Creative Studio” demo tasarım dili geçerli değildir. Mevcut portfolio tasarımı kaynak gerçektir.
8. Henüz gerçek proje, e-posta, sosyal medya veya CV bilgisi verilmediyse başarı/deneyim/iletişim bilgisi uydurulmamalıdır. Yer tutucular açıkça yer tutucu olarak kalmalıdır.

## 3. Referans yapı: Erika’dan alınan ilham

Referans: <https://www.erikaportfolio.com/>

Erika’nın sayfasından alınan yapısal ilkeler:

- Üstte sade kapsül (pill) navigasyon.
- İlk ekranda ayrı hissedilen, tek ekranlık landing.
- Landing’de net isim, kısa rol açıklaması ve tek ana CTA.
- About, teknoloji/beceri/araçlar bilgisini tek yerde toplar.
- Projeler uzun ve anlaşılır satırlar/kartlar halinde sunulur; isim, açıklama, teknoloji ve bağlantı doğrudan görünür.
- Contact kısa ve nettir.

Bu proje için kabul edilmiş sıra:

```text
Landing (karakter) → About → Selected Projects → Contact → Footer
```

Önceki sürümdeki bağımsız `Capabilities` ve `Journey` bölümleri bu ana akışa uyum sağlamadığı için artık sayfada **render edilmiyor**. Dosyaları şimdilik silinmedi; gelecekte gerekirse tekrar kullanılabilirler.

## 4. Şu ana kadar tamamlananlar

### 4.1. Landing ve genel tasarım

- Tam ekran, koyu renkli gerçek bir landing ekranı oluşturuldu.
- Erika yapısına yakın ama özgün kapsül navigasyon eklendi.
- Landing’de solda isim/açıklama/CTA, sağda 3D karakter bulunuyor.
- CTA: **“Portfolyoyu keşfet”**. Tıklanınca landing görseli hafifçe kararıp hareket ediyor ve About bölümüne yumuşak kaydırma yapıyor.
- Landing DOM’da kalır; kullanıcı header/footerdan en üste döndüğünde karakter tekrar görülür.
- `prefers-reduced-motion: reduce` aktifse dönüş ve yumuşak kaydırma azaltılır/atlanır.

İlgili dosyalar:

- `components/sections/hero-section.tsx`
- `styles/sections/hero.css`
- `components/shared/site-header.tsx`
- `app/globals.css`

### 4.2. 3D karakter

Model proje içine kopyalandı:

- Uygulamada kullanılan dosya: `public/models/personal-character.glb`
- Kullanıcının orijinal kaynak dosyası: `C:\Users\zubey\OneDrive\Desktop\blockbench\personal-character.glb`

Model teknik bilgisi:

- GLB 2.0, yaklaşık 41 KB.
- Gövde sabittir; GLB’nin içinde animasyon klibi yoktur.
- Ayrı gözbebeği node’ları vardır: `pupil_negX` ve `pupil_posX`.
- Model Blockbench’ten 1/16 ölçeğinde export edilmiştir. Bu nedenle webde `MODEL_SCALE = 9.2` kullanılmaktadır. Bu değer sebepsiz değiştirilmemelidir.
- Karakter kameraya negatif Z tarafından bakar. Ekran ve model eksenleri ters olduğu için fare takip hareketinde X yönü bilinçli biçimde negatife çevrilmiştir.

Karakter kodu:

- `components/character/character-stage.tsx` — SSR kapalı dinamik sahne yüklemesi.
- `components/character/character-scene.tsx` — Canvas, kamera ve ışıklar.
- `components/character/character-model.tsx` — GLB klonlama, başlangıç dönüşü, reduced-motion, göz takibi.

Davranışlar:

- İlk yüklemede yaklaşık **1.7 saniyede bir tam Y ekseni dönüşü**.
- Fare hassassa iki gözbebeği ekranda imleci takip eder.
- Fare pencere dışına çıkarsa veya pencere focus kaybederse gözler ortaya döner.
- Dokunmatik cihazlarda gözler ortada kalır.
- Texture’lara nearest filtre uygulanır; piksel karakter görüntüsü yumuşatılmaz.

### 4.3. İçerik bölümleri

**About** yeniden yapılandırıldı:

- Kısa giriş: “Ben Zübey, Software Developer.”
- İki dürüst açıklama paragrafı.
- Ana Teknolojiler / Ana Beceriler / Araçlar listeleri.
- Kaynaklar: `components/sections/about-section.tsx`, `styles/sections/about.css`, `messages/tr.json`, `messages/en.json`.

**Projects** yeniden yapılandırıldı:

- Yan yana, sırayla yön değiştiren bilgi + görsel kart yapısı.
- Her kart: numara, kategori, başlık, açıklama, teknoloji, yıl ve durum bilgisi içerir.
- Gerçek medya/bağlantı henüz yoksa soyut ama sade yer tutucu görünür.
- Kaynaklar: `components/sections/projects-section.tsx`, `components/sections/project-card.tsx`, `styles/sections/projects.css`.

**Contact** koyu, sade bir kapanış bölümü olarak düzenlendi.

- `hello@example.com` bilinçli yer tutucudur. Gerçek e-posta ile değiştirilmelidir.
- Kaynaklar: `components/sections/contact-section.tsx`, `styles/sections/contact.css`.

### 4.4. Veri, CMS ve altyapı

- Sanity isteğe bağlı bırakıldı; Sanity yapılandırılmasa bile `messages/tr.json` ve `messages/en.json` içindeki fallback verilerle site çalışır.
- Sanity `project` şeması portfolio alanlarına uyarlandı: `technologies`, `status`, `tone`, `mark`, opsiyonel `href`, alt metni zorunlu proje görseli.
- Eski Creative Studio `service` ve `process-step` şemaları ve ilgili render edilen demo bölümleri kaldırıldı.
- `styled-components`, Sanity Studio’nun production build sırasında ihtiyaç duyduğu eksik runtime bağımlılığı olarak eklendi.
- Three.js bağımlılıkları eklendi: `three`, `@react-three/fiber`, `@react-three/drei`.
- SVG favicon eklendi: `app/icon.svg`.
- Sitemap locale rotalarına göre güncellendi.

Önemli altyapı dosyaları:

- `app/[locale]/page.tsx`
- `app/[locale]/layout.tsx`
- `lib/types.ts`
- `lib/site.config.ts`
- `sanity/lib/queries.ts`
- `sanity/schemas/site/project.ts`
- `sanity/schemas/index.ts`
- `messages/tr.json`
- `messages/en.json`

## 5. En son görsel durum

Son görsel testte doğrulanan durum:

- Kapsül navigasyon koyu landing üzerinde görünür.
- Landing artık ayrı bir giriş ekranı gibi algılanır; önceki açık renkli hero akışı kaldırıldı.
- Karakter landing’de doğru ölçekle, tam boy ve gözleri çalışan şekilde görünür.
- “Portfolyoyu keşfet” CTA’sı About bölümüne animasyonlu geçer.
- About bölümü, Erika’daki kişisel bilgi + teknoloji yapısına daha yakın olacak şekilde sadeleştirildi.
- Project kartları, soyut kutu ızgaraları yerine metin/görsel dengeli uzun satırlar hâlinde düzenlendi.

Bu görsel kararlar yakın zamanda uygulanmıştır. Yeni bir AI işe başlarken, ilk iş olarak kullanıcıyla bu son görünümü kontrol etmeli; önceki açık renkli/editoryal tasarıma geri dönmemelidir.

## 6. Doğrulama durumu

Başarıyla çalıştırılan kontroller:

```bash
npm run typecheck
npm run build
```

Notlar:

- Production build, bu handoff öncesindeki bir sürümde başarıyla geçmiştir.
- En son landing/structure revizyonundan sonra `npm run typecheck` başarıyla geçmiştir ve tarayıcıda görsel olarak test edilmiştir.
- Bir sonraki kişi, kendi değişikliğinden önce ve sonra `npm run build` çalıştırmalıdır.
- Genel `npm run check` komutu, proje ile birlikte gelen `components/ui/*` dosyalarındaki önceden var olan oxlint uyarıları ve bazı deprecated bağımlılık kullanımları yüzünden başarısız olabilir. `components/ui/` dosyaları kullanıcı özellikle istemedikçe değiştirilmemelidir.
- Three.js 0.185 ile geliştirme konsolunda `THREE.Clock` deprecation uyarısı görülebilir; bu React Three Fiber’ın iç kullanımından gelir, fonksiyonel hata değildir.

## 7. Mevcut çalışma ağacı ve dikkat edilmesi gerekenler

- Git çalışma ağacı **kirli**; mevcut değişiklikler henüz commit edilmedi.
- Tüm ilgili portfolio değişiklikleri bu çalışma ağacındadır; `git reset --hard`, `git checkout --` veya geniş kapsamlı silme komutları kullanılmamalıdır.
- `AGENTS.md`, `next-env.d.ts` ve `tsconfig.tsbuildinfo` Next.js geliştirme/derleme sürecinde değişmiş görünebilir. Bunların bir kısmı otomatik üretim çıktısıdır; gerçek tasarım değişiklikleriyle karıştırılmamalıdır.
- Repository üst klasöründe (`..`) oluşmuş olabilecek `package-lock.json` untracked dosyasını incelemeden silmeyin. Next.js, birden fazla lockfile gördüğüne dair uyarı verebilir.
- Geliştirme sunucusu port 3000’de zaten çalışıyorsa ikinci kez `npm run dev` komutu port 3001 denemesi yapabilir veya “another next dev server” uyarısı verebilir. Önce çalışan process’i doğrulayın.

## 8. Sonraki işler — öncelik sırası

### Önce kullanıcıdan alınması gereken bilgiler

1. Gerçek e-posta adresi.
2. GitHub, LinkedIn ve varsa diğer sosyal bağlantılar.
3. CV dosyası veya CV bağlantısı.
4. Her gerçek proje için:
   - Proje adı ve kısa açıklama
   - Canlı link ve/veya GitHub linki
   - Ekran görüntüsü/kapak görseli
   - Kullanılan teknolojiler
   - Kullanıcının gerçekten yaptığı katkı ve sonuçlar
5. Kullanıcının kendi adı/marka yazımı için kesin tercih: şimdilik `ZÜBEY/DEV` ve “Zübey” varsayımdır.

### Ardından uygulanacak işler

1. `messages/tr.json` ve `messages/en.json` içindeki yer tutucu proje/iletişim bilgilerini gerçek verilerle güncelleyin.
2. Gerçek proje görsellerini ekleyin. Sanity kullanılacaksa image alt metni zorunludur; kullanılmayacaksa lokal görseller için erişilebilir `alt` metni ekleyin.
3. Her gerçek proje için yalnızca kullanıcı onayladıktan sonra canlı demo/GitHub CTA’ları ekleyin.
4. Kullanıcı görsel yönü onayladıktan sonra landing mikro etkileşimlerini hafifçe iyileştirin; ana yapıyı tekrar karmaşıklaştırmayın.
5. Mobil boyutlarda (`375px`, `768px`) kapsül header, landing karakteri, CTA ve project kartlarını görsel olarak test edin.
6. `prefers-reduced-motion` ile dönüş, göz takibi ve CTA geçişini test edin.
7. `npm run typecheck` ve `npm run build` çalıştırın.
8. Kullanıcı isterse gerçek içerikleri Sanity Studio’dan yönetmek üzere proje dokümanlarını girin. Sanity zorunlu değildir.

### Şimdilik yapılmaması gerekenler

- Karakterin arkasına gerçek fotoğraf koymayın.
- Kullanıcıya ait olmayan başarı, iş deneyimi, proje sonucu veya bağlantı uydurmayın.
- Landing’i sıradan bir sayfa içi hero’ya dönüştürmeyin; tam ekran giriş deneyimi olarak koruyun.
- Karakteri tek kullanımlık hale getirmeyin veya “enter” tıklanınca DOM’dan kalıcı olarak kaldırmayın.
- `components/ui/` bileşenlerini tasarım için yeniden yazmayın.
- Erika’nın marka adını, metinlerini, görsellerini veya efektlerini kopyalamayın. Sadece bilgi mimarisi ve sadelik düzeyi referanstır.

## 9. Hızlı başlangıç komutları

```bash
cd "C:\Users\zubey\OneDrive\Desktop\Projelerim\portfolio\portfolio-template"
npm install
npm run dev
```

Tarayıcıda:

```text
http://localhost:3000/tr
http://localhost:3000/en
```

Kontrol:

```bash
npm run typecheck
npm run build
```

## 10. Yeni AI için önerilen ilk mesaj / çalışma talimatı

> Bu repodaki `AI_HANDOFF.md` ve `AGENTS.md` dosyalarını tamamen oku. Kullanıcının portfolio projesini devralıyorsun. Tasarımın kaynağı eski boilerplate demo değil; Erika’dan yapısal ilham alan, koyu tam ekran landing + özgün 3D Blockbench karakter + About → Projects → Contact akışıdır. Kullanıcının unvanı Software Developer’dır. Karakter gerçek fotoğraf kullanmaz, landingde döner ve gözleri imleci takip eder. Mevcut çalışma ağacı kirli; kullanıcıya ait değişiklikleri silme. Önce mevcut localhost görünümünü doğrula, sonra yalnızca kullanıcıdan gelen gerçek içeriklerle yer tutucuları değiştir.

## 11. Eski plan belgesi

İlk hazırlık/yol haritası ayrıca şurada bulunur:

`C:\Users\zubey\Documents\Codex\2026-09-01\eve\outputs\portfolio-uygulama-yol-haritasi.md`

Bu belge, yukarıdaki son kullanıcı kararlarıyla birlikte okunmalıdır. Çelişki varsa bu handoff ve kullanıcının en güncel mesajı önceliklidir.
