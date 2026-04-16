import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto',
  display: 'swap',
  preload: false,
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BizplatForm | コミットプラン AIシミュレーター',
  description: '税理士事務所向け顧客紹介サービス — 株式会社BizplatForm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
