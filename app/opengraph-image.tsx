import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'CloudNote - 모든 기기에서 연결되는 당신의 생각'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    // Font loading
    const fontData = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #1e3a8a, #4c1d95)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Noto Sans KR", sans-serif',
                    color: 'white',
                }}
            >
                {/* Background decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'rgba(56, 189, 248, 0.1)', // Light blue
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'rgba(139, 92, 246, 0.1)', // Violet
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: 100,
                            fontWeight: 700,
                            marginBottom: 20,
                            background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            letterSpacing: '-0.05em',
                            textShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        }}
                    >
                        CloudNote
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 700, // Using Bold because we only load Bold
                            opacity: 0.9,
                            color: '#cbd5e1',
                            textAlign: 'center',
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}
                    >
                        모든 기기에서 연결되는 당신의 생각
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Noto Sans KR',
                    data: fontData,
                    style: 'normal',
                    weight: 700,
                },
            ],
        }
    )
}
