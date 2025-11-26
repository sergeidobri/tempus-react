import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth/auth/confirm-email-sent')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/confirm-email-sent"!</div>
}
