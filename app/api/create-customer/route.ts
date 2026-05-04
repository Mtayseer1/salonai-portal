import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      barberName,
      shopName,
      country,
      description,
      phone,
      email,
      password,
      partnerId,
    } = body

    const { data: createdUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = createdUser.user.id

    const { error: barberError } = await supabase.from('barbers').insert({
      id: userId,
      barber_name: barberName,
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
      return NextResponse.json({ error: barberError.message }, { status: 400 })
    }

    const { error: linkError } = await supabase
      .from('partner_customers')
      .insert({
        partner_id: partnerId,
        customer_id: userId,
      })

    if (linkError) {
      return NextResponse.json({ error: linkError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    )
  }
}