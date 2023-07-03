import React from 'react'
import AuthenticatedLayout from './AuthenticatedLayout'
import SidebarLayout from '@/components/SidebarLayout/SidebarLayout'

const Layout = ({children}) => {
  return (
    <AuthenticatedLayout>
      <SidebarLayout>
        {children}
        </SidebarLayout>
    </AuthenticatedLayout>
  )
}

export default Layout