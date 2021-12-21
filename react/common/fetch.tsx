export const fetchPath = {
  getDocuments: '/returns/getDocuments/',
  getRequests: '/returns/getRequests/',
  getProfile: (rootPath?: string) =>
    `${rootPath ?? ''}/no-cache/profileSystem/getProfile`,
  saveDocuments: '/returns/saveDocuments/',
  savePartialDocument: '/returns/savePartialDocument/',
  getCategories: '/returns/getCategories',
  getSchema: '/returns/getSchema/',
  generateSchema: '/returns/generateSchema/',
  createGiftCard: '/returns/giftCard/',
  updateGiftCard: '/returns/updateGiftCard/',
  getGiftCard: '/returns/getGiftCard/',
  getSkuById: '/returns/getSkuById/',
  getOrders: '/returns/getOrders/',
  getOrder: '/returns/getOrder/',
  renderTemplates: '/api/template-render/pvt/templates',
  createRefund: '/returns/createRefund/',
}

export const fetchMethod = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
}

export const fetchHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}
