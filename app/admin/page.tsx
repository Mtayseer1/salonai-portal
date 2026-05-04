'use client'

import { AppShell, Card, StatCard, adminNav } from '../components/ui'

export default function AdminPage() {
  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="High-level portal controls and platform performance indicators."
      role="Admin"
      navItems={adminNav}
      userLabel="Admin account"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total Customers" value="0" detail="Salon accounts" />
          <StatCard label="Total Partners" value="0" detail="Partner accounts" />
          <StatCard label="Monthly Revenue" value="0 JD" detail="Current month" />
          <StatCard label="Pending Commissions" value="0 JD" detail="Awaiting payout" />
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-white">Platform snapshot</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Admin metrics are ready for future data integration without changing the layout.
          </p>
        </Card>
      </div>
    </AppShell>
  )
}
