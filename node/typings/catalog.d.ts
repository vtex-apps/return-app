interface CategoryTree {
  id: string
  name: string
  hasChildren: boolean
  children: CategoryTree[]
}
