import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth/auth/confirm-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/confirm-email"!</div>
}
