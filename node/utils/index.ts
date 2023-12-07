export const cleanObject = <T extends Record<string, any>>(
  objectData: T
): T => {
  return Object.fromEntries(
    Object.entries(objectData).filter(([_, value]) => value !== null)
  ) as T
}
