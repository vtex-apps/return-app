const STORE_PREFIX = 'store/'
const ADMIN_PREFIX = 'admin/'

const isAdminRoute = () =>
  typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/admin/')

/**
 * Admin bundles only ship `admin/` message keys, so shared components map
 * `store/` ids to their `admin/` twin when they render inside the admin.
 */
export const messageId = (id: string) =>
  isAdminRoute() && id.startsWith(STORE_PREFIX)
    ? ADMIN_PREFIX + id.slice(STORE_PREFIX.length)
    : id
