import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'WiCyS Kean University Student Chapter';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/wicys-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={383} height={160} alt="" />
          <div
            style={{
              marginTop: 40,
              fontSize: 64,
              fontWeight: 700,
              color: '#20183a',
              letterSpacing: '-0.02em',
            }}
          >
            Kean University Student Chapter
          </div>
          <div style={{ marginTop: 16, fontSize: 30, color: '#55496f' }}>
            Workshops, speakers, Capture the Flag, and community in cybersecurity.
          </div>
        </div>
        <div style={{ display: 'flex', height: 28 }}>
          <div style={{ flex: 3, background: '#1d1138' }} />
          <div style={{ flex: 1, background: '#1c7d57' }} />
        </div>
      </div>
    ),
    size
  );
}
