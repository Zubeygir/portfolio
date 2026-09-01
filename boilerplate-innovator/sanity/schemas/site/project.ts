/**
 * Site-specific schema — DEMO / EXAMPLE IMPLEMENTATION.
 *
 * This schema belongs to the creative studio demo site.
 * Replace or remove it for your client project.
 * For example, a clinic site might use: doctor, treatment, department.
 */
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
      description: 'Ör: Hospitality · Digital flagship',
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
      name: 'accent',
      title: 'Vurgu Rengi',
      type: 'string',
      description: 'HEX renk kodu (ör: #1b2cff)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Ton',
      type: 'string',
      options: {
        list: [
          { title: 'Koyu (Dark)', value: 'dark' },
          { title: 'Açık (Light)', value: 'light' },
        ],
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'mark',
      title: 'Büyük Harf İşareti',
      type: 'string',
      description: 'Kart üzerinde büyük gösterilecek tek harf (ör: A, S, F)',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'image',
      title: 'Proje Görseli',
      type: 'image',
      options: { hotspot: true },
      description: 'Opsiyonel — Yüklenmezse placeholder görünür.',
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
