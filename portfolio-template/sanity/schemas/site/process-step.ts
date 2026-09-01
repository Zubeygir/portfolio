/**
 * Site-specific schema — DEMO / EXAMPLE IMPLEMENTATION.
 *
 * This schema belongs to the creative studio demo site.
 * Replace or remove it for your client project.
 */
import { defineField, defineType } from 'sanity';

export const processStep = defineType({
  name: 'processStep',
  title: 'Süreç Adımı',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
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
    select: { title: 'title', num: 'number', lang: 'language' },
    prepare({ title, num, lang }) {
      return { title: `${num} — ${title} [${lang?.toUpperCase()}]` };
    },
  },
});
