import { defineField, defineType } from 'sanity';

/**
 * Core schema — Site Settings (singleton).
 *
 * This schema is part of the reusable boilerplate core.
 * It stores site-wide settings that almost every client project needs.
 * All fields except `brand` are optional so the schema adapts to any project.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand Name',
      type: 'string',
      description: 'Primary brand name displayed in header/footer (e.g. "STUDIO/BASE")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'Canonical site URL (e.g. https://yourdomain.com)',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Site logo — used in header and metadata',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Preview Image',
      type: 'image',
      description: 'Open Graph image for social sharing (1200×630 recommended)',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Default page title — falls back to brand name if empty',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Default meta description for the site',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'X (Twitter)', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Dribbble', value: 'dribbble' },
                  { title: 'Behance', value: 'behance' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'brand' },
  },
});
