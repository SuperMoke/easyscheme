import { Inter } from "next/font/google"
import "./globals.css"
import SessionProvider from "./SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EasyScheme",
  description: " A Web-based Proctoring System with Students and Faculty Portal for City College of Angeles."
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}