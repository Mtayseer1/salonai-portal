import { adminJson, requireAdmin } from '../_lib'

export async function GET(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  const [customers, partners, admins, activeCustomers] = await Promise.all([
    admin.context.supabaseAdmin
      .from('barbers')
      .select('id', { count: 'exact', head: true }),
    admin.context.supabaseAdmin
      .from('partners')
      .select('id', { count: 'exact', head: true }),
    admin.context.supabaseAdmin
      .from('admins')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    admin.context.supabaseAdmin
      .from('barbers')
      .select('id', { count: 'exact', head: true })
      .gt('remaining_credits', 0),
  ])

  const failed = [customers, partners, admins, activeCustomers].find(
    (result) => result.error,
  )

  if (failed?.error) {
    return adminJson({ error: failed.error.message }, { status: 400 })
  }

  return adminJson({
    customers: customers.count || 0,
    activeCustomers: activeCustomers.count || 0,
    partners: partners.count || 0,
    admins: admins.count || 0,
  })
}
