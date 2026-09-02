import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Proje',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Dil',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Türkçe', value: 'tr' },
        ],
      },
      initialValue: 'en',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Numara',
      type: 'string',
      description: 'Gösterim sırası numarası (ör: 01, 02)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      description: 'Ör: Kişisel ürün · Web deneyimi',
    }),
    defineField({
      name: 'year',
      title: 'Yıl',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'technologies',
      title: 'Teknolojiler',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'status',
      title: 'Durum',
      type: 'string',
      description: 'Ör: Geliştiriliyor, Yayında, Vaka çalışması yakında',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Ton',
      type: 'string',
      options: {
        list: [
          { title: 'Sıcak', value: 'warm' },
          { title: 'Koyu', value: 'dark' },
          { title: 'Vurgulu', value: 'accent' },
        ],
      },
      initialValue: 'warm',
    }),
    defineField({
      name: 'mark',
      title: 'Kart İşareti',
      type: 'string',
      description: 'Kartta gösterilecek kısa işaret (ör: 01, P)',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'href',
      title: 'Proje Bağlantısı',
      type: 'url',
      description: 'Opsiyonel canlı proje veya depo bağlantısı.',
    }),
    defineField({
      name: 'image',
      title: 'Proje Görseli',
      type: 'image',
      options: { hotspot: true },
      description: 'Opsiyonel — Yüklenmezse placeholder görünür.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif Metin',
          type: 'string',
          description:
            'Görseli ekran okuyucu kullanan biri için kısaca açıklayın.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      description: 'Düşük numara önce gösterilir.',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Sıraya göre',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', lang: 'language' },
    prepare({ title, subtitle, lang }) {
      return {
        title: `${title} [${lang?.toUpperCase()}]`,
        subtitle,
      };
    },
  },
});
