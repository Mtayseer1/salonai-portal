import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerId, packageName } = body

    const { data: barber } = await supabase
      .from('barbers')
      .select('*')
      .eq('id', customerId)
      .single()

    if (!barber) {
      return NextResponse.json({ error: 'Customer not found' })
    }

    const { data: pkg } = await supabase
      .from('packages')
      .select('*')
      .eq('name', packageName)
      .eq('is_active', true)
      .single()

    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package' })
    }

    const total = Number(
      Number(pkg.price_before_vat) +
        (Number(pkg.price_before_vat) * Number(pkg.vat_percent)) / 100
    ).toFixed(2)

    const { data: payment } = await supabase
      .from('customer_payments')
      .insert({
        customer_id: customerId,
        package_name: pkg.name,
        credits: pkg.images_count,
        amount: pkg.price_before_vat,
        vat_amount:
          (Number(pkg.price_before_vat) * Number(pkg.vat_percent)) / 100,
        total_amount: total,
        currency: 'JOD',
        country: barber.country,
        gateway: 'fatora',
        status: 'pending',
      })
      .select()
      .single()

    const response = await fetch(
      'https://api.fatora.io/v1/payments/checkout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.FATORA_API_KEY!,
        },
        body: JSON.stringify({
          amount: total,
          currency: 'JOD',
          order_id: payment.id,
          client: {
            name: barber.shop_name || 'Salon AI',
            email: barber.email,
            phone: barber.phone,
          },
          language: 'en',
          success_url: `${process.env.APP_URL}/payment-success`,
          failure_url: `${process.env.APP_URL}/payment-cancel`,
          note: pkg.name,
        }),
      }
    )

    const result = await response.json()

    if (result.status !== 'SUCCESS') {
      return NextResponse.json({
        error: JSON.stringify(result),
      })
    }

    return NextResponse.json({
      payment_url: result.result.checkout_url,
    })
  } catch {
    return NextResponse.json({
      error: 'Unexpected error',
    })
  }
}