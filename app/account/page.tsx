'use client'

import { useRouter } from 'next/navigation'
import { AppShell, Button, Card, salonNav } from '../components/ui'

export default function AccountPage() {
  const router = useRouter()

  return (
    <AppShell title="Account" role="Salon" navItems={salonNav}>
      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Credits</h2>
              <p className="mt-1 text-sm text-zinc-500">Manage your package balance.</p>
            </div>
            <Button
              type="button"
              className="h-14 w-full text-base"
              onClick={() => router.push('/buy-package')}
            >
              Buy Credits
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
