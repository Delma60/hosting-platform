import PublicNavbar from '@/components/layout/public-navbar'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <PublicNavbar />
        {children}
    </div>
  )
}

export default Layout