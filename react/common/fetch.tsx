export const fetchPath = {
  getDocuments: "/returns/getDocuments/",
  getProfile: "/no-cache/profileSystem/getProfile",
  saveDocuments: "/returns/saveDocuments/",
  savePartialDocument: "/returns/savePartialDocument/",
  getCategories: "/returns/getCategories",
  getSchema: "/returns/getSchema/",
  generateSchema: "/returns/generateSchema/",
  createGiftCard: "/returns/giftCard/",
  getGiftCard: "/returns/getGiftCard/",
  getOrders: "/api/oms/pvt/orders",
  renderTemplates: "/api/template-render/pvt/templates"
};

export const fetchMethod = {
  get: "GET",
  post: "POST",
  put: "PUT"
};

export const fetchHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};
