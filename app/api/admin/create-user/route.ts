import { adminJson, optionalString, requireAdmin, requiredString } from '../_lib'

type CreateRole = 'admin' | 'partner' | 'customer'

export async function POST(request: Request) {
  const admin = await requireAdmin(request)

  if ('error' in admin) {
    return admin.error
  }

  try {
    const body = await request.json()
    const role = requiredString(body.role) as CreateRole
    const email = requiredString(body.email)
    const password = requiredString(body.password)
    const name = requiredString(body.name)
    const phone = optionalString(body.phone)
    const country = optionalString(body.country)
    const shopName = optionalString(body.shopName)
    const description = optionalString(body.description)
    const partnerId = optionalString(body.partnerId)

    if (!['admin', 'partner', 'customer'].includes(role)) {
      return adminJson({ error: 'Choose a valid account type.' }, { status: 400 })
    }

    if (!email || !password || !name) {
      return adminJson(
        { error: 'Name, email, and password are required.' },
        { status: 400 },
      )
    }

    if (role === 'customer' && !shopName) {
      return adminJson({ error: 'Shop name is required for customers.' }, { status: 400 })
    }

    const { data: createdUser, error: authError } =
      await admin.context.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError || !createdUser.user) {
      return adminJson(
        { error: authError?.message || 'Could not create auth user.' },
        { status: 400 },
      )
    }

    const userId = createdUser.user.id
    const insertError = await insertRoleProfile({
      role,
      userId,
      email,
      name,
      phone,
      country,
      shopName,
      description,
      partnerId,
      createdBy: admin.context.user.id,
      supabaseAdmin: admin.context.supabaseAdmin,
    })

    if (insertError) {
      await admin.context.supabaseAdmin.auth.admin.deleteUser(userId).catch(() => null)
      return adminJson({ error: insertError }, { status: 400 })
    }

    return adminJson({ success: true, userId })
  } catch {
    return adminJson({ error: 'Unexpected server error.' }, { status: 500 })
  }
}

async function insertRoleProfile({
  role,
  userId,
  email,
  name,
  phone,
  country,
  shopName,
  description,
  partnerId,
  createdBy,
  supabaseAdmin,
}: {
  role: CreateRole
  userId: string
  email: string
  name: string
  phone: string | null
  country: string | null
  shopName: string | null
  description: string | null
  partnerId: string | null
  createdBy: string
  supabaseAdmin: any
}) {
  if (role === 'admin') {
    const { error } = await supabaseAdmin.from('admins').insert({
      id: userId,
      name,
      email,
      is_active: true,
      created_by: createdBy,
    })

    return error?.message
  }

  if (role === 'partner') {
    const { error } = await supabaseAdmin.from('partners').insert({
      id: userId,
      name,
      email,
      phone,
      country,
      is_active: true,
    })

    return error?.message
  }

  const { error: barberError } = await supabaseAdmin.from('barbers').insert({
    id: userId,
    barber_name: name,
    shop_name: shopName,
    country,
    description,
    phone,
    email,
    is_active: true,
    total_credits: 0,
    remaining_credits: 0,
  })

  if (barberError) {
    return barberError.message
  }

  if (!partnerId) {
    return undefined
  }

  const { error: linkError } = await supabaseAdmin
    .from('partner_customers')
    .insert({
      partner_id: partnerId,
      customer_id: userId,
    })

  return linkError?.message
}
