export function getCurrentDate() {
  return new Date().toISOString();
}

export function getOneYearLaterDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const oneYearLater = new Date(year + 1, month, day);
  return oneYearLater.toISOString();
}

export function beautifyDate(date: string) {
  return new Date(date).toLocaleString();
}

export function returnFormDate(date: string) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const d = new Date(date);
  return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
}

export function filterDate(date: string, separator = "-") {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${day < 10 ? `0${day}` : `${day}`}`;
}

export function currentDate() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

export function diffDays(date1: string, date2: string) {
  const dayMap = 24 * 60 * 60 * 1000;
  const diff = Date.parse(date1) - Date.parse(date2);
  return Math.floor(diff / dayMap);
}

export const schemaNames = {
  request: "returnRequests",
  product: "returnProducts",
  comment: "returnComments",
  history: "returnStatusHistory",
  settings: "returnSettings"
};

export const schemaTypes = {
  settings: "settings",
  requests: "request",
  history: "statusHistory",
  comments: "comment",
  products: "product"
};

export const requestsStatuses = {
  new: "New",
  pendingVerification: "Pending verification",
  approved: "Approved",
  partiallyApproved: "Partially approved",
  denied: "Denied",
  refunded: "Refunded"
};

export const productStatuses = {
  new: "New",
  pendingVerification: "Pending verification",
  approved: "Approved",
  partiallyApproved: "Partially approved",
  denied: "Denied"
}

export const statusHistoryTimeline = {
  new: "new",
  picked: "Picked up from client",
  verified: "Package verified",
  refunded: "Amount refunded"
};
