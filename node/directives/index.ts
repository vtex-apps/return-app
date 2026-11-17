import { AdminOnly } from './adminOnly'
import { WithUserProfile } from './withUserProfile'

export const schemaDirectives = {
  withUserProfile: WithUserProfile,
  adminOnly: AdminOnly,
}
