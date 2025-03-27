import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { getUserProfileFromSession } from '../utils/getUserProfileFromSession'

const VTEX_SESSEION = 'vtex_session'

export class WithUserProfile extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<unknown, Context>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root, args, ctx, info) => {
      const {
        cookies,
        clients: { session },
      } = ctx

      const sessionCookie = cookies.get(VTEX_SESSEION)

      const userProfile = await getUserProfileFromSession(
        session,
        sessionCookie
      )

      ctx.state.userProfile = userProfile

      return resolve(root, args, ctx, info)
    }
  }
}
