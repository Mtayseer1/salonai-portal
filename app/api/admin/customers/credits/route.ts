import {
  adminJson,
  optionalString,
  parsePositiveInteger,
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
    const credits = parsePositiveInteger(body.credits)
    const notes = optionalString(body.notes)

    if (!customerId || !credits) {
      return adminJson(
        { error: 'Customer and positive credit amount are required.' },
        { status: 400 },
      )
    }

    const { data: customer, error: customerError } = await admin.context.supabaseAdmin
      .from('barbers')
      .select('id,remaining_credits,total_credits')
      .eq('id', customerId)
      .maybeSingle()

    if (customerError || !customer) {
      return adminJson({ error: 'Customer not found.' }, { status: 404 })
    }

    const nextRemaining = Number(customer.remaining_credits || 0) + credits
    const nextTotal = Number(customer.total_credits || 0) + credits

    const { error: updateError } = await admin.context.supabaseAdmin
      .from('barbers')
      .update({
        remaining_credits: nextRemaining,
        total_credits: nextTotal,
      })
      .eq('id', customerId)

    if (updateError) {
      return adminJson({ error: updateError.message }, { status: 400 })
    }

    await admin.context.supabaseAdmin.from('credit_transactions').insert({
      customer_id: customerId,
      change_amount: credits,
      transaction_type: 'admin_add',
      notes: notes || `Admin added ${credits} credits`,
    })

    return adminJson({
      success: true,
      remainingCredits: nextRemaining,
      totalCredits: nextTotal,
    })
  } catch {
    return adminJson({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
