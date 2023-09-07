"use client"
import { AppContextProvider } from '@/context/board-context'
import './globals.css'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <AppContextProvider>
          <section className='max-w-[1000px] m-auto'>
            {children}
          </section>
        </AppContextProvider>
      </body>
    </html>
  )
}
