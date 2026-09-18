# Header & Footer — Redesign Planı

İlgili dosyalar: `components/shared/site-header.tsx`, `components/shared/site-footer.tsx`, `app/globals.css` (`.site-header` ve ilişkili class'lar).

## Header

### Sorun
`.site-header { position: absolute; }` (`app/globals.css:119`) — hero'dan sonra scroll edildiğinde logo, nav, dil değiştirici ve Contact CTA'sı tamamen kayboluyor. Geri dönüşün tek yolu footer'daki "yukarı çık" linki.

### Karar: `position: sticky`
`position: sticky; top: 0;` yapılacak. Backdrop-blur stili zaten yazılmış (`.site-header`'da mevcut olduğu varsayılıyor, implementasyon sırasında teyit edilecek), sadece sabitlenmesi gerekiyor.

### Karar: Mobil menüdeki "01/02/03" nav numaraları kaldırılıyor
`site-header.tsx:89` — `<span>0{index + 1}</span>` her nav linkinin önünde. Site genelinde numaralandırma kaldırıldığı için (bkz. genel bakış) burada da tutarlılık adına kaldırılacak. Bu, impeccable'ın "gerçek bir sıralı liste" istisnasına girebilecek bir durum olsa da kullanıcı tutarlılığı tercih etti.

## Footer

### Sorun
İsim iki kez art arda tekrar ediyor: wordmark ("ZÜBEYİR ALİ DEMİR") hemen üstünde copyright ("ZÜBEYİR ALİ DEMİR · 2026").

### Karar: Sosyal linkler eklenecek
Footer'a LinkedIn/GitHub küçük ikon linkleri olarak eklenecek (Contact bölümüne eklenen linklerle aynı hedefler, bkz. [04-contact.md](./04-contact.md)) — tekrarlı görünüm yerine footer'ın kendi işlevini kazanması sağlanacak.

- İsim tekrarı sorunu da bu geçişte çözülecek (wordmark + copyright ayrımı yeniden düşünülecek, implementasyon sırasında netleştirilecek — ör. copyright satırından isim çıkarılıp sadece yıl/hak saklıdır ifadesi bırakılabilir).
- "Sadece tekrarı düzelt, başka bir şey ekleme" seçilmedi — sosyal linkler ekleniyor.

## Notlar

- Header/Footer için ayrı bir scroll-reveal kararı alınmadı (bunlar sabit/her zaman görünür elemanlar, reveal animasyonu kapsamı dışında kalması muhtemel).
- Pill-buton stilinin tekilleştirilmesi (genel bakışta not edildi) `header-cta`, `mobile-menu-cta`, `footer` yeni sosyal linkleri gibi elemanları da kapsayabilir — implementasyon sırasında değerlendirilecek.
