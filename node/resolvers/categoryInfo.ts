import type { CategoryInfo } from 'vtex.return-app'

const transformCategoryTree = (
  categoryTree: CategoryTree[],
  parentName = ''
): CategoryInfo[] => {
  const result = []

  for (const category of categoryTree) {
    if (!category.hasChildren) {
      result.push({
        id: category.id,
        name: parentName ? `${parentName} > ${category.name}` : category.name,
      })
    } else {
      const pName = parentName
        ? `${parentName} > ${category.name}`
        : category.name

      const group = transformCategoryTree(category.children, pName)

      result.push(...group, { id: category.id, name: pName })
    }
  }

  return result
}

export const categoryInfo = async (
  _: unknown,
  _args: unknown,
  ctx: Context
): Promise<CategoryInfo[]> => {
  const {
    clients: { catalog },
  } = ctx

  const categoryTree = await catalog.getCategoryTree()

  return transformCategoryTree(categoryTree)
}
