import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export type OgParams = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
};

export function renderOgImage({
  title,
  eyebrow = 'Aurtos Studio',
  subtitle = 'Digital Marketing · Web · Apps · SEO',
}: OgParams) {
  const safeTitle = title.slice(0, 120);
  const safeEyebrow = eyebrow.slice(0, 60);
  const safeSubtitle = subtitle.slice(0, 100);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #1A1A24 100%)',
          color: '#FAFAFA',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '999px',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '999px',
            background:
              'radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366F1, #F472B6, #FB923C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700 }}>
            <span
              style={{
                background: 'linear-gradient(90deg, #6366F1, #F472B6, #FB923C)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Aurtos
            </span>
            <span style={{ color: '#FAFAFA', marginLeft: '8px' }}>Studio</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#818CF8',
              marginBottom: '20px',
            }}
          >
            {safeEyebrow}
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: '1000px',
              display: 'flex',
            }}
          >
            {safeTitle}
          </div>
          <div
            style={{
              marginTop: '28px',
              fontSize: '26px',
              color: '#A1A1B5',
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {safeSubtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
            color: '#A1A1B5',
            fontSize: '20px',
          }}
        >
          <div style={{ display: 'flex' }}>aurtostechnologies.in</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Web</span>
            <span style={{ color: '#2A2A38' }}>·</span>
            <span>Apps</span>
            <span style={{ color: '#2A2A38' }}>·</span>
            <span>Marketing</span>
            <span style={{ color: '#2A2A38' }}>·</span>
            <span>SEO</span>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
