'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './sanity/env';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Boilerplate Innovator',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('İçerik')
          .items([
            // Site Ayarları — singleton olarak göster
            S.listItem()
              .title('Site Ayarları')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Ayarları'),
              ),
            S.divider(),
            // Projeler
            S.documentTypeListItem('project').title('Projeler'),
            // Hizmetler
            S.documentTypeListItem('service').title('Hizmetler'),
            // Süreç Adımları
            S.documentTypeListItem('processStep').title('Süreç Adımları'),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: {
    types: schemaTypes,
  },
});
