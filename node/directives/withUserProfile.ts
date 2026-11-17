import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { resolveGraphQLCaller } from '../utils/resolveCaller'

export class WithUserProfile extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<unknown, Context>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root, args, ctx, info) => {
      await resolveGraphQLCaller(ctx)

      return resolve(root, args, ctx, info)
    }
  }
}
