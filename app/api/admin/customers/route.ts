import { adminJson, requireAdmin } from '../_lib'

export async function GET(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim()

  let query = admin.context.supabaseAdmin
    .from('barbers')
    .select('id,barber_name,shop_name,email,phone,country,remaining_credits,total_credits,is_active,created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (search) {
    const escapedSearch = search.replace(/[%_]/g, (match) => `\\${match}`)
    query = query.or(
      [
        `barber_name.ilike.%${escapedSearch}%`,
        `shop_name.ilike.%${escapedSearch}%`,
        `email.ilike.%${escapedSearch}%`,
        `phone.ilike.%${escapedSearch}%`,
      ].join(','),
    )
  }

  const { data, error } = await query

  if (error) {
    return adminJson({ error: error.message }, { status: 400 })
  }

  return adminJson({ customers: data || [] })
}
