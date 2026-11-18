import { ForbiddenError } from '@vtex/api'
import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { NoSessionCookieError } from '../utils/getUserProfileFromSession'
import {
  InvalidSessionError,
  resolveGraphQLCaller,
} from '../utils/resolveCaller'

const FORBIDDEN_MESSAGE = 'Only admin users can perform this operation'

export class AdminOnly extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<unknown, Context>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root, args, ctx, info) => {
      // Directive order is not guaranteed, so resolve the caller here.
      // A caller without a usable session is Forbidden. Other errors,
      // such as a session service failure, propagate unchanged.
      try {
        await resolveGraphQLCaller(ctx)
      } catch (error) {
        if (
          error instanceof NoSessionCookieError ||
          error instanceof InvalidSessionError
        ) {
          throw new ForbiddenError(FORBIDDEN_MESSAGE)
        }

        throw error
      }

      // GraphQL never sets state.appkey, so only an admin profile passes.
      if (ctx.state.userProfile?.role !== 'admin') {
        throw new ForbiddenError(FORBIDDEN_MESSAGE)
      }

      return resolve(root, args, ctx, info)
    }
  }
}
