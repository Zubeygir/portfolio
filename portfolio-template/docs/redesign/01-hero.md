# Hero Bölümü — Redesign Planı

İlgili dosyalar: `components/sections/hero-section.tsx`, `components/character/character-model.tsx`, `components/character/character-scene.tsx`, `components/character/character-stage.tsx`, `styles/sections/hero.css`.

## Mevcut durum / sorun

- 12 kolonluk grid'de metin (`hero-copy`, 1/7) ve 3D karakter (`hero-character-wrap`, 7/-1) kesin sınırla ayrılmış, aralarında hiçbir görsel köprü yok.
- `hero-copy` kendi içinde `text-align: center` — bu da onu sağdaki karakterden daha da koparıyor (kutunun içinde ayrı bir ada gibi duruyor).
- Karakterin etrafındaki dekoratif halka (`.character-orbit`) kendi kutusunun dışına taşmıyor.
- Karakter sadece düz ayakta duruyor; drag ile döndürülebiliyor, göz/kafa imleci takip ediyor (`character-model.tsx` — `pointerTarget`, `headTargetY/X`), ama gövde pozu her zaman aynı, statik.
- Zemin gölgesi (`.hero-character-wrap::after`) sadece kendi kutusunun altında, metin tarafıyla paylaşılmıyor.

**Kullanıcının kendi ifadesiyle**: *"3d modelimin bu kadar basit bir şekilde ayakta durması beni rahatsız etti... soldaki ve sağdaki bölümler çok ayrı iki bölüm gibi duruyor."*

## Karar: Poz değişikliği (Seçenek C)

Üç entegrasyon yönü sunuldu (A: taşma/kesişme, B: ortak sahne hissi, C: poz değişikliği). **C seçildi.**

**Önemli netleştirme**: Pozu yeniden tasarlama işini **ben (Claude) yapacağım**, kodlama oturumunda — kullanıcı Blockbench'te manuel iş yapmayacak. `.bbmodel` kaynak dosyası bile gerekmiyor.

### Neden Blockbench'e gerek yok

`public/models/personal-character.glb` dosyasının node hiyerarşisini inceledim (glb'nin JSON chunk'ını parse ederek). Karakter zaten Blockbench'ten **her uzuv ayrı, kendi pivot'una sahip bir grup olarak** export edilmiş:

```
character_root
├── head (head_cube, neck)                — zaten runtime'da pivot'a alınıp kullanılıyor (eye/head tracking)
├── hair (10 alt parça)
├── face_details (eyebrow/eye/mouth/nose/beard vb.)
├── body (torso_cube, tee_collar, tee_logo, waist)
├── left_arm (upper_arm_left, forearm_left, hand_left)
├── right_arm (upper_arm_right, forearm_right, hand_right)
├── left_leg (leg_left_cube, shoe_left + parçaları)
└── right_leg (leg_right_cube, shoe_right + parçaları)
```

Yani `character-model.tsx`'in şu an `head` için yaptığı şeyi (`getObjectByName` ile parçayı bulup rotation/position uygulamak — bkz. mevcut `headPartNames` / pivot mantığı) **`body`, `left_arm`, `right_arm`, `left_leg`, `right_leg` için de yapabilirim.** Yeni bir `.glb` export'una, Blockbench GUI'sine ya da kullanıcının müdahalesine gerek yok — tamamen kod tarafında, mevcut model dosyasıyla.

### Uygulama planı (implementasyon oturumunda)

1. Her uzuv grubuna sabit bir "rest pose" rotasyon/pozisyon offseti uygulanacak (şu anki "dümdüz ayakta" rest pose'un yerine).
2. Hedeflenen yön: **metne doğru yaslanan, ağırlığı tek bacağa vermiş, bir koluyla jest yapan** daha "anlatan" bir duruş — bu aynı zamanda Hero'nun asıl sorununu (sol/sağ iki ayrı blok gibi durması) da çözüyor, çünkü karakterin gövde/baş yönelimi görsel olarak metne doğru "eğilecek".
   - `body`: hafif rotasyon + gövde eğimi, metne (kameradan bakışta sola) doğru.
   - Bacaklar (`left_leg`/`right_leg`): contrapposto — biri ağırlık taşıyan düz duruş, diğeri hafif döndürülmüş/rahat pozisyon (voxel kutular tek parça olduğu için diz bükme yok, ama kalça rotasyonu/pozisyon kaymasıyla rahat duruş hissi verilebilir).
   - Kollar (`left_arm`/`right_arm`): biri bükülü/jest yapar pozisyonda (ör. çeneye yakın düşünme pozu ya da metne doğru işaret), diğeri gövdeye yakın rahat pozisyonda.
   - `head`: mevcut pointer-follow mantığı korunacak, ama imleç merkezdeyken (idle durumda) varsayılan dinlenme açısı hafifçe metne dönük olacak (şu an tam nötr/merkez).
3. Tam açı/offset değerleri implementasyon sırasında canlı önizlemeyle (Browser tool ile ekran görüntüsü alıp iterasyon) ayarlanacak — burada sadece yön ve teknik yaklaşım sabitleniyor.
4. Yeni poz mevcut etkileşimlerle (drag-to-rotate, eye-follow, mouth animasyonu, intro 360° spin) çakışmamalı — özellikle `group.current.rotation` üzerinden yapılan gövde-takip ve drag mantığının yeni rest pose'un üzerine **eklemeli** (additive) çalışması gerekiyor, üzerine yazmaması (overwrite etmemesi).
5. Yeni poz muhtemelen farklı bir siluet/ağırlık merkezi getireceği için grid/CSS tarafında (metin-karakter arası boşluk, zemin gölgesinin konumu, `MODEL_SCALE`, kamera pozisyonu) ince ayar gerekebilir.

## Headline / CTA metni

**Yön onaylandı: "Zanaate vurgu"**

> "Merhaba, ben Zübeyir — arayüzleri koda, kodu deneyime çeviriyorum."

- `messages/tr.json` → `Site.hero.title`, muhtemelen `Site.hero.description` de buna göre kısa bir revizyon alacak (implementasyon sırasında netleştirilecek, headline yönüyle çelişmeyecek şekilde).
- `messages/en.json` karşılığı da güncellenecek (İngilizce versiyon için ayrı bir ton kararı alınmadı — headline'ın İngilizce çevirisi bu Türkçe yöne sadık kalacak şekilde yapılacak).
- CTA butonu ("Portfolyoyu keşfet") metni/yapısı için ayrı bir değişiklik istenmedi, buton stili madde 3'teki (genel bakış) ghost-card sadeleştirmesinden etkilenecek.

## Scroll-reveal

Genel karara göre (bkz. [00-genel-bakis.md](./00-genel-bakis.md)) Hero'ya özel bir giriş hareketi tasarlanacak — Hero zaten kendi intro animasyonuna sahip (karakterin 360° dönüş girişi, `INTRO_DURATION = 1.7`), scroll-reveal burada muhtemelen minimal/sıfıra yakın olacak çünkü sayfa ilk açıldığında zaten görünür durumda.

## Diğer teknik notlar (genel bakıştan hatırlatma)

- Fare tekerleği 3D canvas üzerindeyken sayfa scroll'unu yutuyor — `character-stage.tsx` / `character-scene.tsx`'te wheel event passthrough düzeltilmeli.
- `.hero-kicker`, `.character-note` üzerindeki `text-transform: uppercase` — kicker kısa olduğu için impeccable kuralına göre sorun değil, ama `.character-note` (55 karakter) uppercase'ten çıkarılacak.
- `-0.07em` letter-spacing (`#hero-title`) → `-0.02em`–`-0.04em` aralığına çekilecek.
