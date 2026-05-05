import { StyleSessionProvider, StyleSessionShell } from '@/components/style-session'

export default function StyleLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyleSessionProvider>
      <StyleSessionShell>{children}</StyleSessionShell>
    </StyleSessionProvider>
  )
}
