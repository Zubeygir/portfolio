import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { previewSecret } from '@/sanity/env';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  // Güvenlik kontrolü — secret eşleşmezse erişimi engelle
  if (secret !== previewSecret) {
    return new Response('Invalid secret', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(slug);
}
