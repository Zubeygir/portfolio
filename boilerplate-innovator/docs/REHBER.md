# 🇹🇷 Boilerplate Kullanım Kılavuzu

Bu rehber, projedeki **Sanity CMS**, **Vercel Deploy** ve **i18n (çoklu dil)** altyapılarının nasıl kullanılacağını adım adım anlatır. Hiç kullanmamış olsan bile bu kılavuzla sorunsuz ilerleyebilirsin.

---

## İçindekiler

1. [Sanity CMS Nedir?](#1-sanity-cms-nedir)
2. [Sanity Hesabı Oluşturma](#2-sanity-hesabı-oluşturma)
3. [Sanity'yi Projeye Bağlama](#3-sanityyi-projeye-bağlama)
4. [Sanity Studio Kullanımı](#4-sanity-studio-kullanımı)
5. [İçerik Ekleme ve Düzenleme](#5-içerik-ekleme-ve-düzenleme)
6. [Çoklu Dil (i18n) Sistemi](#6-çoklu-dil-i18n-sistemi)
7. [Vercel Nedir?](#7-vercel-nedir)
8. [Vercel'e Deploy Etme](#8-vercele-deploy-etme)
9. [Environment Variables (Ortam Değişkenleri)](#9-environment-variables-ortam-değişkenleri)
10. [Draft Mode (Önizleme)](#10-draft-mode-önizleme)
11. [Yeni Müşteri Projesi Başlatma Kontrol Listesi](#11-yeni-müşteri-projesi-başlatma-kontrol-listesi)

---

## 1. Sanity CMS Nedir?

**Sanity**, bir "Headless CMS"dir (İçerik Yönetim Sistemi). WordPress'e benzer ama çok daha modern ve esnek.

- **Headless** demek: İçerikleri (metin, görsel, proje bilgileri vb.) yönettiğin bir panel var ama bu panel sitenin tasarımıyla ilgilenmiyor. İçerik ayrı, tasarım ayrı.
- İçerikler Sanity'nin bulut sunucularında saklanır ve sen bu içerikleri API üzerinden çekersin.
- Müşterilerine `siteniz.com/studio` adresini verirsin, onlar içeriklerini oradan düzenler.

### Neden Sanity?
| Özellik | WordPress | Sanity |
|---------|-----------|--------|
| Hız | Yavaş | Çok hızlı (CDN) |
| Güvenlik | Sürekli güncelleme gerekir | Otomatik |
| Esneklik | Tema/Plugin'e bağlı | Tamamen özelleştirilebilir |
| Fiyat | Hosting + Domain | Free tier (3 kullanıcı, sınırsız içerik) |

---

## 2. Sanity Hesabı Oluşturma

1. [sanity.io](https://www.sanity.io) adresine git
2. **"Get started"** butonuna tıkla
3. GitHub veya Google hesabınla giriş yap
4. **"Create new project"** de
5. Proje adını yaz (ör: "Müşteri Adı Website")
6. Dataset olarak **"production"** seç
7. Proje oluşturulduktan sonra **Settings > API** sekmesine git
8. Şu bilgileri not al:
   - **Project ID** (ör: `abc123de`)
   - **Dataset** (genelde `production`)

### API Token Oluşturma
1. **Settings > API > Tokens** sekmesine git
2. **"Add API Token"** butonuna tıkla
3. İsim ver: `Read Token`
4. Rol olarak **"Viewer"** seç (sadece okuma izni)
5. **"Save"** de ve oluşan token'ı kopyala (bu token bir daha gösterilmez!)

### CORS Ayarları
1. **Settings > API > CORS Origins** sekmesine git
2. Şu adresleri ekle:
   - `http://localhost:3000` (geliştirme için)
   - `https://siteniz.com` (production URL'in — deploy ettikten sonra)
3. Her ikisinde de **"Allow credentials"** seçeneğini aç

---

## 3. Sanity'yi Projeye Bağlama

Projenin kök dizininde `.env.example` dosyasını kopyalayıp `.env.local` adıyla kaydet:

```bash
cp .env.example .env.local
```

Ardından `.env.local` dosyasını aç ve bilgilerini doldur:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=buraya-project-id-yaz
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=buraya-token-yaz
SANITY_STUDIO_PREVIEW_SECRET=gizli-bir-sifre-belirle
```

> ⚠️ `.env.local` dosyası git'e GÖNDERILMEZ (zaten `.gitignore`'da). Bu dosya sadece senin bilgisayarında kalır. Vercel'e deploy ederken bu değerleri Vercel panelinden de girmek gerekecek (aşağıda anlatılıyor).

---

## 4. Sanity Studio Kullanımı

Geliştirme sunucusunu başlat:

```bash
npm run dev
```

Tarayıcında şu adrese git:

```
http://localhost:3000/studio
```

Karşına Sanity Studio açılacak. Burada:
- **Sol tarafta** içerik tipleri listelenir (Projeler, Hizmetler, Süreç Adımları, Site Ayarları)
- **Sağ tarafta** seçtiğin içeriğin düzenleme formu açılır
- Değişiklik yaptıktan sonra sağ alttaki **"Publish"** butonuna basman gerekir

---

## 5. İçerik Ekleme ve Düzenleme

### Yeni Proje Ekleme
1. Sol menüden **"Projeler"** sekmesine tıkla
2. Sağ üstten **"+"** (Create) butonuna tıkla
3. Formu doldur:
   - **Dil**: İçeriğin hangi dilde olduğunu seç (EN veya TR)
   - **Numara**: Gösterim numarası (ör: "01")
   - **Başlık**: Proje adı
   - **Kategori**: Kısa açıklama (ör: "E-Ticaret · Web Platformu")
   - **Yıl**: Proje yılı
   - **Özet**: Kısa açıklama paragrafı
   - **Vurgu Rengi**: HEX renk kodu (ör: `#1b2cff`)
   - **Ton**: Koyu veya Açık (kart üzerindeki metin rengi için)
   - **Büyük Harf İşareti**: Kart üzerinde büyük gösterilecek harf (ör: "A")
   - **Sıralama**: Düşük numara önce gösterilir
4. **"Publish"** butonuna bas

> 💡 Her projeyi iki kez eklemen gerekiyor: bir kez **EN** dili için, bir kez **TR** dili için. Böylece site hangi dildeyse o dildeki projeleri gösterir.

### Site Ayarları
1. Sol menüden **"Site Ayarları"** sekmesine tıkla
2. Marka adını, iletişim e-postasını ve site URL'ini gir
3. **"Publish"** de

---

## 6. Çoklu Dil (i18n) Sistemi

Projede iki tür metin var:

### A) Statik UI Metinleri (Butonlar, Menü, Başlıklar)
Bunlar `messages/en.json` ve `messages/tr.json` dosyalarında tutulur. Örneğin "Projeye Başla" butonu, navigasyon linkleri gibi metinler.

**Yeni bir UI metni eklemek için:**
1. `messages/en.json` dosyasına İngilizce karşılığını ekle
2. `messages/tr.json` dosyasına Türkçe karşılığını ekle
3. Kodda `useTranslations()` hook'u ile kullan

### B) Dinamik İçerik (Projeler, Hizmetler)
Bunlar Sanity CMS'ten çekilir. Her içeriğin `language` alanı sayesinde EN ve TR versiyonları ayrı tutulur.

### Yeni Dil Eklemek
Diyelim ki Almanca eklemek istiyorsun:

1. `messages/de.json` dosyası oluştur (en.json'ı kopyalayıp çevir)
2. `i18n/routing.ts` dosyasında `locales` dizisine `'de'` ekle
3. `proxy.ts` dosyasında matcher'a `de` ekle: `'/(tr|en|de)/:path*'`
4. Sanity'deki schema'larda Dil alanına `{ title: 'Deutsch', value: 'de' }` ekle

---

## 7. Vercel Nedir?

**Vercel**, Next.js projelerini host etmek (yayınlamak) için kullanılan bir platformdur. Next.js'i zaten Vercel ekibi geliştiriyor, bu yüzden en optimize çalışan platform budur.

- GitHub'a push ettiğinde otomatik deploy eder
- Her PR (Pull Request) için ayrı bir "Preview" URL oluşturur
- SSL (HTTPS) otomatik
- CDN (dünya genelinde hızlı dağıtım) otomatik
- Free tier çoğu müşteri projesi için yeterli

---

## 8. Vercel'e Deploy Etme

### İlk Kurulum

1. [vercel.com](https://vercel.com) adresine git ve GitHub hesabınla giriş yap
2. **"Add New Project"** butonuna tıkla
3. GitHub repomu bul ve seç
4. Framework olarak **"Next.js"** otomatik algılanacak
5. **"Environment Variables"** bölümünde `.env.local` dosyasındaki tüm değişkenleri ekle:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_STUDIO_PREVIEW_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (Vercel'in vereceği URL veya kendi domainin)
6. **"Deploy"** butonuna bas

### Sonraki Deploy'lar
GitHub'a her push ettiğinde Vercel otomatik olarak yeni bir deploy oluşturur. Yani:

```bash
git add .
git commit -m "Yeni proje eklendi"
git push
```

Bu kadar! 1-2 dakika içinde site güncellenir.

### Özel Domain (Alan Adı) Bağlama
1. Vercel panelinde projenin **Settings > Domains** sekmesine git
2. Domaini yaz (ör: `www.müsterisitesi.com`)
3. Vercel sana DNS kayıtlarını gösterecek
4. Domain sağlayıcında (GoDaddy, Cloudflare vb.) bu DNS kayıtlarını ekle
5. Birkaç dakika içinde domain bağlanır

---

## 9. Environment Variables (Ortam Değişkenleri)

| Değişken | Nerede Kullanılır | Açıklama |
|----------|-------------------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client + Server | Sanity proje kimliği |
| `NEXT_PUBLIC_SANITY_DATASET` | Client + Server | Genelde `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Client + Server | API versiyonu (tarih formatında) |
| `SANITY_API_READ_TOKEN` | Sadece Server | Sanity okuma token'ı (taslak içerik için) |
| `SANITY_STUDIO_PREVIEW_SECRET` | Sadece Server | Draft Mode şifresi |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | Sitenin canonical URL'i |

> ⚠️ `NEXT_PUBLIC_` ile başlayan değişkenler tarayıcıda da görünür. Gizli token'lar **asla** `NEXT_PUBLIC_` ile başlamamalı.

---

## 10. Draft Mode (Önizleme)

Draft Mode, Sanity'de henüz "Publish" etmediğin (taslak) içerikleri sitede görmeni sağlar.

### Nasıl Kullanılır?

1. Tarayıcıda şu URL'ye git:
   ```
   http://localhost:3000/api/draft?secret=SENIN_SIFREN&slug=/
   ```
   (`SENIN_SIFREN` kısmını `.env.local` dosyasındaki `SANITY_STUDIO_PREVIEW_SECRET` değeriyle değiştir)

2. Artık site taslak içerikleri de gösterir

3. Önizlemeyi kapatmak için:
   ```
   http://localhost:3000/api/disable-draft
   ```

---

## 11. Yeni Müşteri Projesi Başlatma Kontrol Listesi

Yeni bir müşteri projesi başlarken şu adımları takip et:

```
□ Bu boilerplate'i klonla (veya template olarak kullan)
□ Sanity'de yeni bir proje oluştur
□ .env.local dosyasını oluştur ve bilgileri doldur
□ Sanity Studio'ya gir ve Site Ayarları'nı güncelle (marka, e-posta)
□ messages/en.json ve messages/tr.json'daki UI metinlerini müşteriye göre düzenle
□ app/globals.css'teki renk tokenlarını müşterinin markasına göre ayarla
□ Sanity'ye müşterinin projelerini, hizmetlerini ve süreç adımlarını ekle (EN + TR)
□ public/og.png sosyal medya önizleme görselini güncelle
□ GitHub reposunu oluştur ve Vercel'e bağla
□ Vercel'de environment variables'ları ekle
□ Deploy et ve test et
□ Sanity CORS ayarlarına production URL'i ekle
□ Müşteriye /studio erişimini ver
```

---

## Sıkça Sorulan Sorular

### Sanity bedava mı?
Evet, Free tier ile 3 kullanıcı ve sınırsız içerik kaydı oluşturabilirsin. Çoğu müşteri projesi için yeterli.

### Vercel bedava mı?
Hobby (kişisel) planı ücretsiz. Ticari projeler için Pro plan ($20/ay) gerekiyor. Müşteriye fatura edebilirsin.

### Sanity'de bir şey değiştirdim ama sitede görünmüyor
İçeriği **Publish** ettiğinden emin ol. Ayrıca site verileri 60 saniye cachelenir (önbelleklenir), bu yüzden değişikliklerin görünmesi 1 dakika sürebilir.

### Yeni bir sayfa nasıl eklerim?
`app/[locale]/` klasörünün altına yeni bir klasör oluştur. Örneğin `app/[locale]/about/page.tsx` → `/en/about` ve `/tr/about` sayfalarını oluşturur.
