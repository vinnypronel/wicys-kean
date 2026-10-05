import { buildSearchIndex } from '@/lib/search';

// Content only changes on redeploy or Keystatic edits, so cache for an hour.
export const revalidate = 3600;

export async function GET() {
  const items = await buildSearchIndex();
  return Response.json(items);
}
