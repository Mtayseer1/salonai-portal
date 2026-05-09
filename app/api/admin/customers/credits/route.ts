import {
  adminJson,
  optionalString,
  requireAdmin,
  requiredString,
} from '../../_lib'

export async function POST(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  try {
    const body = await request.json()
    const customerId = requiredString(body.customerId)
    const packageId = requiredString(body.packageId)
    const notes = optionalString(body.notes)

    if (!customerId || !packageId) {
      return adminJson(
        { error: 'Customer and active package are required.' },
        { status: 400 },
      )
    }

    const { data, error } = await admin.context.supabaseAdmin
      .rpc('admin_add_package_credits', {
        p_customer_id: customerId,
        p_package_id: packageId,
        p_admin_id: admin.context.user.id,
        p_notes: notes,
      })

    if (error) {
      return adminJson({ error: error.message }, { status: 400 })
    }

    const result = Array.isArray(data) ? data[0] : data

    return adminJson({
      success: true,
      remainingCredits: result?.remaining_credits ?? 0,
      totalCredits: result?.total_credits ?? 0,
      creditsAdded: result?.credits_added ?? 0,
      packageName: result?.package_name ?? '',
      packageTotalAmount: result?.package_total_amount ?? 0,
      partnerId: result?.partner_id ?? null,
      commissionAmount: result?.commission_amount ?? 0,
    })
  } catch {
    return adminJson({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
