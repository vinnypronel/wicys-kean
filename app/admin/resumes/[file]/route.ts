import path from 'path';

import { verifyAdminSession } from '@/lib/admin-auth';
import { readResume } from '@/lib/submissions';

const TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// Sends a saved resume to a signed-in admin only. Resumes live outside the
// public folder, so this is the only way to open one.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  if (!(await verifyAdminSession())) {
    return new Response('Not found', { status: 404 });
  }

  const { file } = await params;
  // Only a plain file name, never a path into another folder.
  const name = path.basename(decodeURIComponent(file));
  const type = TYPES[path.extname(name).toLowerCase()];
  if (!type || name !== decodeURIComponent(file)) {
    return new Response('Not found', { status: 404 });
  }

  const data = await readResume(name).catch(() => null);
  if (!data) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': type,
      'Content-Disposition': `inline; filename="${name}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
