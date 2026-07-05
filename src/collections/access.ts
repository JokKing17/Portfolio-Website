import type { Access } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const publicReadAuthenticatedWrite = {
  read: anyone,
  create: authenticated,
  update: authenticated,
  delete: authenticated
}
