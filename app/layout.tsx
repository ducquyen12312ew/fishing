import type { Metadata } from 'next'
import { Silkscreen } from 'next/font/google'
import './globals.css'

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'A Fishing Day',
  description: 'Personal bet tracking — pixel art style',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={silkscreen.variable}>
      <body className="bg-[#0a1f21] overflow-hidden">{children}</body>
    </html>
  )
}
