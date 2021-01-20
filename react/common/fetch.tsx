export const fetchPath = {
  getDocuments: "/returns/getDocuments/",
  getProfile: "/no-cache/profileSystem/getProfile",
  saveDocuments: "/returns/saveDocuments/",
  getCategories: "/returns/getCategories",
  getSchema: "/returns/getSchema/",
  generateSchema: "/returns/generateSchema/",
  createCoupon: "/returns/createCoupon/",
  createPromotion: "/returns/createPromotion/",
  getOrders: "/api/oms/pvt/orders",
  renderTemplates: "/api/template-render/pvt/templates"
};

export const fetchMethod = {
  get: "GET",
  post: "POST"
};

export const fetchHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};
