import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from './env';

// Sanity henüz yapılandırılmamışsa (projectId yoksa) boş bir client oluştur
// Bu sayede proje Sanity olmadan da çalışabilir (JSON fallback)
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

export const isSanityConfigured = !!projectId;
