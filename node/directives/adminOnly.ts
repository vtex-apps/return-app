import { ForbiddenError } from '@vtex/api'
import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { resolveGraphQLCaller } from '../utils/resolveCaller'

const FORBIDDEN_MESSAGE = 'Only admin users can perform this operation'

export class AdminOnly extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<unknown, Context>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root, args, ctx, info) => {
      // Directive order is not guaranteed, so resolve the caller here.
      try {
        await resolveGraphQLCaller(ctx)
      } catch {
        throw new ForbiddenError(FORBIDDEN_MESSAGE)
      }

      const { state } = ctx

      if (!state.appkey && state.userProfile?.role !== 'admin') {
        throw new ForbiddenError(FORBIDDEN_MESSAGE)
      }

      return resolve(root, args, ctx, info)
    }
  }
}
