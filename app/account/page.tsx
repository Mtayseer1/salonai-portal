'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AppShell, Button, Card } from '../components/ui'
import { supabase } from '../../src/lib/supabase'

export default function AccountPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    return localStorage.getItem('salon_lang') === 'ar' ? 'ar' : 'en'
  })

  const changeLang = (value: 'en' | 'ar') => {
    setLang(value)
    localStorage.setItem('salon_lang', value)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <AppShell title="Account" role="Salon" navItems={[]}>
      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Language</h2>
              <p className="mt-1 text-sm text-zinc-500">Choose app language.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
              {(['en', 'ar'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeLang(value)}
                  className={`h-12 rounded-xl text-sm font-bold transition ${
                    lang === value
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-3 pt-2">
          <Button
            type="button"
            className="h-14 w-full text-base"
            onClick={() => router.push('/buy-package')}
          >
            Buy Credits
          </Button>
          <Button
            type="button"
            variant="danger"
            className="h-14 w-full text-base"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
