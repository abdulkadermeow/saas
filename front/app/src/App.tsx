import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { StoreProvider, useStore } from '@/hooks/useStore'
import Layout, { type PageKey } from '@/components/Layout'
import Login from '@/pages/Login'
import Overview from '@/sections/Overview'
import Conversations from '@/sections/Conversations'
import Assistants from '@/sections/Assistants'
import WhatsAppConnect from '@/sections/WhatsAppConnect'
import Subscription from '@/sections/Subscription'

function Shell() {
  const { user, bootstrapped, needsSubscription, subscriptionDepleted } = useStore()
  const [page, setPage] = useState<PageKey>('overview')

  // تنبيه عند نفاد الرصيد
  useEffect(() => {
    if (subscriptionDepleted) {
      toast.error('رصيد رسائلك خلص — جدّد باقتك للمتابعة')
    }
  }, [subscriptionDepleted])

  // شاشة تحميل أولية أثناء سحب البيانات من الباك
  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#12141f] text-sm text-slate-400">
        جاري تحميل بياناتك...
      </div>
    )
  }

  if (!user) return <Login />

  // ─── بوابة الاشتراك ───
 
 // const locked = needsSubscription || subscriptionDepleted
 const locked = false 
  const currentPage = locked ? 'subscription' : page
  const handleNavigate = locked ? () => {} : setPage

  return (
    <Layout page={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'overview' && <Overview onNavigate={handleNavigate} />}
      {currentPage === 'conversations' && <Conversations />}
      {currentPage === 'assistants' && <Assistants />}
      {currentPage === 'whatsapp' && <WhatsAppConnect />}
      {currentPage === 'subscription' && <Subscription />}
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
