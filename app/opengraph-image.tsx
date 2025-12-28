import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

// Route segment config
export const runtime = 'edge';
export const alt = siteConfig.site.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Open Graph Image generation
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(234, 88, 12, 0.2) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            zIndex: 1,
          }}
        >
          {/* Icon/Logo */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 30,
              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 40,
              boxShadow: '0 20px 60px rgba(234, 88, 12, 0.4)',
            }}
          >
            MK
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            {siteConfig.user.name}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            {siteConfig.user.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: '#64748b',
              textAlign: 'center',
              maxWidth: 900,
              marginTop: 32,
            }}
          >
            Full-Stack Developer • Embedded Systems • Technical Writing
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#475569',
          }}
        >
          {siteConfig.site.url.replace('https://', '')}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
