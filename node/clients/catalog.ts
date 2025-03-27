import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class Catalog extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
    })
  }

  public getCategoryTree = async (): Promise<CategoryTree[]> =>
    this.http.get('/api/catalog_system/pub/category/tree/100', {
      metric: 'catalog-get-category-tree',
    })
}
