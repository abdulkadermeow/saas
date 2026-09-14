import { useState } from 'react'
import { Toaster } from 'sonner'
import { StoreProvider, useStore } from '@/hooks/useStore'
import Layout, { type PageKey } from '@/components/Layout'
import Login from '@/pages/Login'
import Overview from '@/sections/Overview'
import Conversations from '@/sections/Conversations'
import Assistants from '@/sections/Assistants'
import WhatsAppConnect from '@/sections/WhatsAppConnect'
import Subscription from '@/sections/Subscription'

function Shell() {
  const { user } = useStore()
  const [page, setPage] = useState<PageKey>('overview')

  if (!user) return <Login />

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === 'overview' && <Overview onNavigate={setPage} />}
      {page === 'conversations' && <Conversations />}
      {page === 'assistants' && <Assistants />}
      {page === 'whatsapp' && <WhatsAppConnect />}
      {page === 'subscription' && <Subscription />}
    </Layout>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
      <Toaster position="top-center" dir="rtl" richColors />
    </StoreProvider>
  )
}
