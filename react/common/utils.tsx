import { FormattedMessage } from "react-intl";
import React from "react";
import styles from "../styles.css";
import {
  IconClock,
  IconFailure,
  IconSuccess,
  IconVisibilityOn,
  IconWarning,
  IconCheck,
  IconExternalLinkMini
} from "vtex.styleguide";

import axios from "axios";

export function getCurrentDate() {
  return new Date().toISOString();
}

export function getYesterday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate() - 1;
  return new Date(year, month, day).toISOString();
}

export function getOneYearLaterDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const oneYearLater = new Date(year + 1, month, day);
  return oneYearLater.toISOString();
}

export function FormattedMessageFixed(props) {
  return <FormattedMessage {...props} />;
}

export function beautifyDate(date: string) {
  return new Date(date).toLocaleString();
}

export function returnFormDate(date: string, intl: string) {
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
  const seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  const minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

  return (
    <FormattedMessageFixed id={`${intl}.${monthNames[d.getMonth()]}`}>
      {monthName =>
        d.getDate() +
        " " +
        monthName +
        " " +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        minutes +
        ":" +
        seconds
      }
    </FormattedMessageFixed>
  );
}

export const sortColumns = {
  id: "id",
  dateSubmitted: "dateSubmitted",
  orderId: "orderId",
  status: "status"
};

export const order = {
  asc: "ASC",
  desc: "DESC"
};

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
  picked: "Picked up from client",
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
};

export const statusHistoryTimeline = {
  new: "new",
  picked: "Picked up from client",
  pending: "Pending verification",
  verified: "Package verified",
  refunded: "Amount refunded"
};

export const intlArea = {
  admin: "admin/returns",
  store: "store/my-returns"
};

export function getStatusTranslation(status: string) {
  const s = requestsStatuses[status];
  let words = s.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  words = words.join("");

  return words;
}

export function getProductStatusTranslation(status: string) {
  if (typeof status !== "undefined") {
    let words: any = status.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join("");

    return words;
  }
  return;
}

export function renderIcon(product: any, intl: string) {
  if (product.status === requestsStatuses.approved) {
    return (
      <div>
        <span className={styles.statusApproved}>
          <IconSuccess size={14} />{" "}
          <FormattedMessageFixed
            id={
              `${intl}.productStatus` +
              getProductStatusTranslation(product.status)
            }
          />
        </span>
      </div>
    );
  }

  if (product.status === requestsStatuses.denied) {
    return (
      <div>
        <span className={styles.statusDenied}>
          <IconFailure size={14} />{" "}
          <FormattedMessageFixed
            id={
              `${intl}.productStatus` +
              getProductStatusTranslation(product.status)
            }
          />
        </span>
      </div>
    );
  }

  if (product.status === requestsStatuses.partiallyApproved) {
    return (
      <div>
        <span className={styles.statusPartiallyApproved}>
          <IconWarning size={14} />{" "}
          <FormattedMessageFixed
            id={
              `${intl}.productStatus` +
              getProductStatusTranslation(product.status)
            }
          />{" "}
          {product.goodProducts}/{product.quantity}
        </span>
      </div>
    );
  }

  if (product.status === requestsStatuses.pendingVerification) {
    return (
      <div>
        <span className={styles.statusPendingVerification}>
          <IconClock size={14} />{" "}
          <FormattedMessageFixed
            id={
              `${intl}.productStatus` +
              getProductStatusTranslation(product.status)
            }
          />
        </span>
      </div>
    );
  }

  return (
    <div>
      <span className={styles.statusNew}>
        <IconVisibilityOn size={14} />{" "}
        <FormattedMessageFixed
          id={
            `${intl}.productStatus` +
            getProductStatusTranslation(product.status)
          }
        />
      </span>
    </div>
  );
}

export function isInt(value: any) {
  return (
    !isNaN(value) &&
    parseInt(String(Number(value))) == value &&
    !isNaN(parseInt(String(value), 10))
  );
}

export function prepareHistoryData(comment: any, request: any, intl: string) {
  return [
    {
      status: statusHistoryTimeline.new,
      text: (
        <span>
          <FormattedMessageFixed id={`${intl}.timelineNew`} />{" "}
          {returnFormDate(request.dateSubmitted, intl)}
        </span>
      ),
      step: 1,
      comments: comment.filter(item => item.status === requestsStatuses.new),
      active: 1
    },
    {
      status: statusHistoryTimeline.picked,
      text: <FormattedMessageFixed id={`${intl}.timelinePicked`} />,
      step: 2,
      comments: comment.filter(item => item.status === requestsStatuses.picked),
      active:
        request.status === requestsStatuses.picked ||
        request.status === requestsStatuses.pendingVerification ||
        request.status === requestsStatuses.partiallyApproved ||
        request.status === requestsStatuses.approved ||
        request.status === requestsStatuses.denied ||
        request.status === requestsStatuses.refunded
          ? 1
          : 0
    },
    {
      status: statusHistoryTimeline.pending,
      text: <FormattedMessageFixed id={`${intl}.timelinePending`} />,
      step: 3,
      comments: comment.filter(
        item => item.status === requestsStatuses.pendingVerification
      ),
      active:
        request.status === requestsStatuses.pendingVerification ||
        request.status === requestsStatuses.partiallyApproved ||
        request.status === requestsStatuses.approved ||
        request.status === requestsStatuses.denied ||
        request.status === requestsStatuses.refunded
          ? 1
          : 0
    },
    {
      status: statusHistoryTimeline.verified,
      text: <FormattedMessageFixed id={`${intl}.timelineVerified`} />,
      step: 4,
      comments: comment.filter(
        item =>
          item.status === requestsStatuses.partiallyApproved ||
          item.status === requestsStatuses.approved ||
          item.status === requestsStatuses.denied
      ),
      active:
        request.status === requestsStatuses.partiallyApproved ||
        request.status === requestsStatuses.approved ||
        request.status === requestsStatuses.denied ||
        request.status === requestsStatuses.refunded
          ? 1
          : 0
    },
    {
      status: statusHistoryTimeline.refunded,
      text:
        request.status === requestsStatuses.refunded ? (
          <FormattedMessageFixed id={`${intl}.timelineRefunded`} />
        ) : request.status === requestsStatuses.denied ? (
          <FormattedMessageFixed id={`${intl}.timelineDenied`} />
        ) : (
          <FormattedMessageFixed id={`${intl}.timelineRefunded`} />
        ),
      step: 5,
      comments: comment.filter(
        item => item.status === requestsStatuses.refunded
      ),
      active:
        request.status === requestsStatuses.refunded ||
        request.status === requestsStatuses.denied
          ? 1
          : 0
    }
  ];
}

export function sendMail(jsonData) {
  axios
    .post(`/returns/sendMail`, {
      TemplateName: "oms-return-request",
      applicationName: "email",
      logEvidence: false,
      jsonData: jsonData
    })
    .then(r => {});
}

export function renderStatusIcon(request: any, intl: string) {
  if (request === requestsStatuses.approved) {
    return (
      <div>
        <span className={styles.statusApproved}>
          <IconSuccess size={14} />{" "}
          <FormattedMessageFixed
            id={`${intl}.status` + getProductStatusTranslation(request)}
          />
        </span>
      </div>
    );
  }

  if (request === requestsStatuses.denied) {
    return (
      <div>
        <span className={styles.statusDenied}>
          <IconFailure size={14} />{" "}
          <FormattedMessageFixed
            id={`${intl}.status` + getProductStatusTranslation(request)}
          />
        </span>
      </div>
    );
  }

  if (request === requestsStatuses.partiallyApproved) {
    return (
      <div>
        <span className={styles.statusPartiallyApproved}>
          <IconWarning size={14} />{" "}
          <FormattedMessageFixed
            id={`${intl}.status` + getProductStatusTranslation(request)}
          />
        </span>
      </div>
    );
  }

  if (request === requestsStatuses.pendingVerification) {
    return (
      <div>
        <span className={styles.statusPendingVerification}>
          <IconClock size={14} />{" "}
          <FormattedMessageFixed
            id={`${intl}.status` + getProductStatusTranslation(request)}
          />
        </span>
      </div>
    );
  }

  if (request === requestsStatuses.refunded) {
    return (
      <div>
        <span className={styles.statusRefunded}>
          <IconCheck size={14} />{" "}
          <FormattedMessageFixed
            id={`${intl}.status` + getProductStatusTranslation(request)}
          />
        </span>
      </div>
    );
  }

  if (request === requestsStatuses.picked) {
    return (
      <div>
        <span className={styles.statusPicked}>
          <IconExternalLinkMini size={14} />{" "}
          <FormattedMessageFixed
            id={`${intl}.status` + getProductStatusTranslation(request)}
          />
        </span>
      </div>
    );
  }

  return (
    <div>
      <span className={styles.statusNew}>
        <IconVisibilityOn size={14} />{" "}
        <FormattedMessageFixed
          id={`${intl}.status` + getProductStatusTranslation(request)}
        />
      </span>
    </div>
  );
}
