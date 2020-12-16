export function getCurrentDate() {
  return new Date().toISOString();
}

export function beautifyDate(date: string) {
  return new Date(date).toLocaleString();
}

export function filterDate(date: string) {
  const d = new Date(date);
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

export function diffDays(date1: string, date2: string) {
  const dayMap = 24 * 60 * 60 * 1000;
  const diff = Date.parse(date1) - Date.parse(date2);
  return Math.floor(diff / dayMap);
}

export const schemaTypes = {
  settings: "settings",
  requests: "request",
  history: "statusHistory",
  comments: "comment",
  products: "product"
};

export const requestsStatuses = {
  new: "New"
};
