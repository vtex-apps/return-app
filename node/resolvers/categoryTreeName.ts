import type { CategoryInfo } from '../../typings/Category'

const transformCategoryTree = (
  categoryTree: CategoryTree[],
  parentName = ''
): CategoryInfo[] => {
  const categoryInfoFlatten = []

  for (const category of categoryTree) {
    if (!category.hasChildren) {
      categoryInfoFlatten.push({
        id: category.id,
        name: parentName ? `${parentName} > ${category.name}` : category.name,
      })
    } else {
      const categoryTreeName = parentName
        ? `${parentName} > ${category.name}`
        : category.name

      const group = transformCategoryTree(category.children, categoryTreeName)

      categoryInfoFlatten.push(...group, {
        id: category.id,
        name: categoryTreeName,
      })
    }
  }

  return categoryInfoFlatten
}

export const categoryTreeName = async (
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
