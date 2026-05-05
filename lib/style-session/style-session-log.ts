type StyleSessionLogLevel = 'info' | 'warn' | 'error'

export function logStyleSessionEvent(
  event: string,
  details: Record<string, string | number | boolean | null | undefined> = {},
  level: StyleSessionLogLevel = 'info',
) {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const payload = {
    scope: 'style-session',
    event,
    details,
  }

  if (level === 'error') {
    console.error(payload)
    return
  }

  if (level === 'warn') {
    console.warn(payload)
    return
  }

  console.info(payload)
}

export async function logStyleSessionSuccess(details: {
  userId: string
  gender: string
  styleType: string
  customerName?: string
  customerPhone?: string
}) {
  const { supabase } = await import('@/src/lib/supabase')
  const timestamp = new Date().toISOString()

  const { error } = await supabase.from('session_logs').insert({
    user_id: details.userId,
    gender: details.gender,
    style_type: details.styleType,
    customer_name: details.customerName || null,
    customer_phone: details.customerPhone?.trim() || null,
    created_at: timestamp,
  })

  if (error) {
    logStyleSessionEvent(
      'log_insert_failed',
      { message: error.message, timestamp },
      'warn',
    )
  }
}
