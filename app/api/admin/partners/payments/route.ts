import { adminJson, optionalString, requireAdmin, requiredString } from '../../_lib'

type PartnerRow = {
  id: string
  name?: string
  email?: string
  phone?: string
  country?: string
  is_active?: boolean
  created_at?: string
}

type CommissionRow = {
  partner_id: string
  commission_amount: number
  status?: string | null
}

type PayoutRow = {
  partner_id: string
  amount: number
  paid_at?: string | null
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim()

  let query = admin.context.supabaseAdmin
    .from('partners')
    .select('id,name,email,phone,country,is_active,created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (search) {
    const escapedSearch = search.replace(/[%_]/g, (match) => `\\${match}`)
    query = query.or(
      [
        `name.ilike.%${escapedSearch}%`,
        `email.ilike.%${escapedSearch}%`,
        `phone.ilike.%${escapedSearch}%`,
        `country.ilike.%${escapedSearch}%`,
      ].join(','),
    )
  }

  const { data: partners, error } = await query

  if (error) {
    return adminJson({ error: error.message }, { status: 400 })
  }

  const partnerRows = (partners || []) as PartnerRow[]
  const partnerIds = partnerRows.map((partner) => partner.id)

  if (partnerIds.length === 0) {
    return adminJson({ partners: [] })
  }

  const [{ data: commissions }, { data: payouts }] = await Promise.all([
    admin.context.supabaseAdmin
      .from('partner_commissions')
      .select('partner_id,commission_amount,status')
      .in('partner_id', partnerIds),
    admin.context.supabaseAdmin
      .from('partner_payouts')
      .select('partner_id,amount,paid_at')
      .in('partner_id', partnerIds),
  ])

  const commissionSummary = summarizeCommissions((commissions || []) as CommissionRow[])
  const payoutSummary = summarizePayouts((payouts || []) as PayoutRow[])

  return adminJson({
    partners: partnerRows.map((partner) => ({
      ...partner,
      dueCommission: commissionSummary[partner.id]?.dueCommission || 0,
      pendingCommissionCount: commissionSummary[partner.id]?.pendingCommissionCount || 0,
      totalPaid: payoutSummary[partner.id]?.totalPaid || 0,
      lastPaidAt: payoutSummary[partner.id]?.lastPaidAt || null,
    })),
  })
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  try {
    const body = await request.json()
    const partnerId = requiredString(body.partnerId)
    const notes = optionalString(body.notes)

    if (!partnerId) {
      return adminJson({ error: 'Partner is required.' }, { status: 400 })
    }

    const { data, error } = await admin.context.supabaseAdmin
      .rpc('admin_pay_partner_commissions', {
        p_partner_id: partnerId,
        p_admin_id: admin.context.user.id,
        p_notes: notes,
      })

    if (error) {
      return adminJson({ error: error.message }, { status: 400 })
    }

    const result = Array.isArray(data) ? data[0] : data

    return adminJson({
      success: true,
      payoutId: result?.payout_id || null,
      paidAmount: Number(result?.paid_amount || 0),
      paidCount: Number(result?.paid_count || 0),
      paidAt: result?.paid_at || null,
    })
  } catch {
    return adminJson({ error: 'Unexpected server error.' }, { status: 500 })
  }
}

function summarizeCommissions(rows: CommissionRow[]) {
  return rows.reduce<Record<string, { dueCommission: number; pendingCommissionCount: number }>>(
    (summary, row) => {
      if (row.status === 'paid') {
        return summary
      }

      const current = summary[row.partner_id] || {
        dueCommission: 0,
        pendingCommissionCount: 0,
      }

      current.dueCommission += Number(row.commission_amount || 0)
      current.pendingCommissionCount += 1
      summary[row.partner_id] = current
      return summary
    },
    {},
  )
}

function summarizePayouts(rows: PayoutRow[]) {
  return rows.reduce<Record<string, { totalPaid: number; lastPaidAt: string | null }>>(
    (summary, row) => {
      const current = summary[row.partner_id] || {
        totalPaid: 0,
        lastPaidAt: null,
      }

      current.totalPaid += Number(row.amount || 0)

      if (
        row.paid_at &&
        (!current.lastPaidAt || new Date(row.paid_at) > new Date(current.lastPaidAt))
      ) {
        current.lastPaidAt = row.paid_at
      }

      summary[row.partner_id] = current
      return summary
    },
    {},
  )
}
