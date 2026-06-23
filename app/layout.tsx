import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Một Ngày Đi Câu',
  description: 'Hệ thống theo dõi kèo cá cược cá nhân',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="bg-[#0a1f21] overflow-hidden">{children}</body>
    </html>
  )
}
