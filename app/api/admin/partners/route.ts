import { adminJson, requireAdmin } from '../_lib'

export async function GET(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  const { data, error } = await admin.context.supabaseAdmin
    .from('partners')
    .select('id,name,email,phone,country,is_active,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return adminJson({ error: error.message }, { status: 400 })
  }

  return adminJson({ partners: data || [] })
}
