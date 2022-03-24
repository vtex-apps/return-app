import type { GraphQLInputField } from 'graphql'
import { GraphQLNonNull, GraphQLScalarType } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export class HasUniqueValues extends SchemaDirectiveVisitor {
  public visitInputFieldDefinition(field: GraphQLInputField) {
    this.wrapType(field)
  }

  public wrapType(field: GraphQLInputField) {
    if (field.type instanceof GraphQLNonNull) {
      field.type = new GraphQLNonNull(new CheckUniqueValues(this.args.field))
    } else {
      field.type = new CheckUniqueValues(this.args.field)
    }
  }
}

class CheckUniqueValues extends GraphQLScalarType {
  constructor(field: string) {
    super({
      name: `CheckUniqueValuesBy${field}`,
      serialize(value: unknown) {
        return value
      },

      parseValue(value: unknown) {
        if (!field || !Array.isArray(value)) {
          return value
        }

        const uniqueMap = new Map()

        for (const singleValue of value) {
          if (!singleValue[field]) {
            continue
          }

          if (uniqueMap.has(singleValue[field])) {
            throw new Error(
              `Duplicate value ${singleValue[field]} for field ${field}`
            )
          }

          uniqueMap.set(singleValue[field], true)
        }

        return value
      },
    })
  }
}
