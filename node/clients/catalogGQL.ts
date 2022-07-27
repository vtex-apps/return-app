import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'
import type { SKU } from '@vtex/api/lib/clients/apps/catalogGraphQL/sku'

const CATALOG_GRAPHQL_APP = 'vtex.catalog-graphql@1.x'

type SKUname = Pick<SKU, 'name'>

export const GET_SKU_TRANSLATION_QUERY = `
  query getSKUTranslation($identifier: SKUUniqueIdentifier) {
    sku(identifier: $identifier) {
      name
    }
  }
`

/**
 * A slimmer version of the original node client.
 * We only require specific fields when translating.
 */
export class CatalogGQL extends AppGraphQLClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(CATALOG_GRAPHQL_APP, ctx, {
      ...opts,
      headers: {
        ...opts?.headers,
        cookie: `VtexIdclientAutCookie=${ctx.authToken}`,
        'x-vtex-locale': ctx.locale ?? '',
        'X-Vtex-Tenant': ctx.account,
      },
    })
  }

  public getSKUTranslation = async (id: string) => {
    const variables = {
      identifier: {
        field: 'id',
        value: id,
      },
    }

    const { data } = await this.graphql.query<
      { sku: SKUname },
      typeof variables
    >({
      inflight: true,
      query: GET_SKU_TRANSLATION_QUERY,
      variables,
    })

    return data?.sku.name
  }
}
