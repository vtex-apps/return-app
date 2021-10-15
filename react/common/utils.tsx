/* eslint-disable no-restricted-globals */
import { defineMessages, FormattedMessage } from 'react-intl'
import React from 'react'
import {
  IconClock,
  IconFailure,
  IconSuccess,
  IconVisibilityOn,
  IconWarning,
  IconCheck,
  IconExternalLinkMini,
} from 'vtex.styleguide'
import axios from 'axios'

import styles from '../styles.css'
import {
  COMMENTS_SCHEMA,
  HISTORY_SCHEMA,
  PRODUCTS_SCHEMA,
  RETURNS_SCHEMA,
  SETTINGS_SCHEMA,
} from '../../common/constants'
import { fetchPath } from './fetch'

export function getCurrentDate() {
  return new Date().toISOString()
}

export function substractDays(days: any) {
  const d = new Date()

  d.setDate(d.getDate() - days)
  d.setUTCHours(0, 0, 0)

  return d.toISOString()
}

export function getOneYearLaterDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()
  const oneYearLater = new Date(year + 1, month, day)

  return oneYearLater.toISOString()
}

export function FormattedMessageFixed(props: any) {
  return <FormattedMessage {...props} />
}

export function beautifyDate(date: string) {
  return new Date(date).toLocaleString()
}

export function returnFormDate(date: string) {
  const d = new Date(date)
  const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
  let message = defineMessages({
    month: {
      id: 'returns.January',
    },
  })

  if (d.getMonth() === 0) {
    message = defineMessages({
      month: {
        id: 'returns.January',
      },
    })
  } else if (d.getMonth() === 1) {
    message = defineMessages({
      month: {
        id: 'returns.February',
      },
    })
  } else if (d.getMonth() === 2) {
    message = defineMessages({
      month: {
        id: 'returns.March',
      },
    })
  } else if (d.getMonth() === 3) {
    message = defineMessages({
      month: {
        id: 'returns.April',
      },
    })
  } else if (d.getMonth() === 4) {
    message = defineMessages({
      month: {
        id: 'returns.May',
      },
    })
  } else if (d.getMonth() === 5) {
    message = defineMessages({
      month: {
        id: 'returns.June',
      },
    })
  } else if (d.getMonth() === 6) {
    message = defineMessages({
      month: {
        id: 'returns.July',
      },
    })
  } else if (d.getMonth() === 7) {
    message = defineMessages({
      month: {
        id: 'returns.August',
      },
    })
  } else if (d.getMonth() === 8) {
    message = defineMessages({
      month: {
        id: 'returns.September',
      },
    })
  } else if (d.getMonth() === 9) {
    message = defineMessages({
      month: {
        id: 'returns.October',
      },
    })
  } else if (d.getMonth() === 10) {
    message = defineMessages({
      month: {
        id: 'returns.November',
      },
    })
  } else if (d.getMonth() === 11) {
    message = defineMessages({
      month: {
        id: 'returns.December',
      },
    })
  }

  return (
    <FormattedMessageFixed id={message.month.id}>
      {(monthName: string) =>
        `${d.getDate()} ${monthName} ${d.getFullYear()} ${d.getHours()}:${minutes}:${seconds}`
      }
    </FormattedMessageFixed>
  )
}

export const sortColumns = {
  id: 'id',
  dateSubmitted: 'dateSubmitted',
  orderId: 'orderId',
  status: 'status',
}

export const order = {
  asc: 'ASC',
  desc: 'DESC',
}

export function filterDate(date: string, separator = '-') {
  const newDate = new Date(date)
  const day = newDate.getDate()
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${day < 10 ? `0${day}` : `${day}`}`
}

export function currentDate() {
  const d = new Date()

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export const schemaNames = {
  request: 'returnRequests',
  product: 'returnProducts',
  comment: 'returnComments',
  history: 'returnStatusHistory',
  settings: 'returnSettings',
}

export const schemaTypes = {
  settings: 'settings',
  requests: 'request',
  history: 'statusHistory',
  comments: 'comment',
  products: 'product',
}

export const requestsStatuses = {
  new: 'New',
  picked: 'Picked up from client',
  pendingVerification: 'Pending verification',
  approved: 'Approved',
  partiallyApproved: 'Partially approved',
  denied: 'Denied',
  refunded: 'Refunded',
}

export const productStatuses = {
  new: 'New',
  pendingVerification: 'Pending verification',
  approved: 'Approved',
  partiallyApproved: 'Partially approved',
  denied: 'Denied',
}

export const statusHistoryTimeline = {
  new: 'new',
  picked: 'Picked up from client',
  pending: 'Pending verification',
  verified: 'Package verified',
  refunded: 'Amount refunded',
}

export const intlArea = {
  admin: 'admin/returns',
  store: 'store/my-returns',
}

export function getStatusTranslation(status: string) {
  const s: any = requestsStatuses[status]
  const words: string[] = s.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }

  return words.join('')
}

export function getProductStatusTranslation(status: string) {
  if (typeof status === 'undefined') return
  const words: string[] = status.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }

  return words.join('')
}

export function renderIcon(product: any) {
  let messages = defineMessages({
    status: {
      id: `returns.productStatusNew`,
    },
  })

  if (getProductStatusTranslation(product.status) === 'Approved') {
    messages = defineMessages({
      status: {
        id: 'returns.productStatusApproved',
      },
    })
  } else if (
    getProductStatusTranslation(product.status) === 'Pending verification'
  ) {
    messages = defineMessages({
      status: {
        id: 'returns.productStatusPendingVerification',
      },
    })
  } else if (
    getProductStatusTranslation(product.status) === 'Partially approved'
  ) {
    messages = defineMessages({
      status: {
        id: 'returns.productStatusPartiallyApproved',
      },
    })
  } else if (getProductStatusTranslation(product.status) === 'Denied') {
    messages = defineMessages({
      status: {
        id: 'returns.productStatusDenied',
      },
    })
  }

  if (product.status === requestsStatuses.approved) {
    return (
      <div>
        <span className={styles.statusApproved}>
          <IconSuccess size={14} />{' '}
          <FormattedMessageFixed id={messages.status.id} />
        </span>
      </div>
    )
  }

  if (product.status === requestsStatuses.denied) {
    return (
      <div>
        <span className={styles.statusDenied}>
          <IconFailure size={14} />{' '}
          <FormattedMessageFixed id={messages.status.id} />
        </span>
      </div>
    )
  }

  if (product.status === requestsStatuses.partiallyApproved) {
    return (
      <div>
        <span className={styles.statusPartiallyApproved}>
          <IconWarning size={14} />{' '}
          <FormattedMessageFixed id={messages.status.id} />{' '}
          {product.goodProducts}/{product.quantity}
        </span>
      </div>
    )
  }

  if (product.status === requestsStatuses.pendingVerification) {
    return (
      <div>
        <span className={styles.statusPendingVerification}>
          <IconClock size={14} />{' '}
          <FormattedMessageFixed id={messages.status.id} />
        </span>
      </div>
    )
  }

  return (
    <div>
      <span className={styles.statusNew}>
        <IconVisibilityOn size={14} />{' '}
        <FormattedMessageFixed id={messages.status.id} />
      </span>
    </div>
  )
}

export function isInt(value: any) {
  return (
    !isNaN(value) &&
    parseInt(String(Number(value)), 10) === value &&
    !isNaN(parseInt(String(value), 10))
  )
}

export function prepareHistoryData(comment: any, request: any) {
  const messages = defineMessages({
    new: {
      id: 'returns.timelineNew',
    },
    picked: {
      id: 'returns.timelinePicked',
    },
    pending: {
      id: 'returns.timelinePending',
    },
    verified: {
      id: 'returns.timelineVerified',
    },
    refunded: {
      id: 'returns.timelineRefunded',
    },
    denied: {
      id: 'returns.timelineDenied',
    },
  })

  const timeline = [
    {
      status: statusHistoryTimeline.new,
      text: (
        <span>
          <FormattedMessageFixed id={messages.new.id} />{' '}
          {returnFormDate(request.dateSubmitted)}
        </span>
      ),
      step: 1,
      comments: comment.filter(
        (item: any) => item.status === requestsStatuses.new
      ),
      active: 1,
    },
    {
      status: statusHistoryTimeline.picked,
      text: <FormattedMessageFixed id={messages.picked.id} />,
      step: 2,
      comments: comment.filter(
        (item: any) => item.status === requestsStatuses.picked
      ),
      active:
        request.status === requestsStatuses.picked ||
        request.status === requestsStatuses.pendingVerification ||
        request.status === requestsStatuses.partiallyApproved ||
        request.status === requestsStatuses.approved ||
        request.status === requestsStatuses.denied ||
        request.status === requestsStatuses.refunded
          ? 1
          : 0,
    },
    {
      status: statusHistoryTimeline.pending,
      text: <FormattedMessageFixed id={messages.pending.id} />,
      step: 3,
      comments: comment.filter(
        (item: any) => item.status === requestsStatuses.pendingVerification
      ),
      active:
        request.status === requestsStatuses.pendingVerification ||
        request.status === requestsStatuses.partiallyApproved ||
        request.status === requestsStatuses.approved ||
        request.status === requestsStatuses.denied ||
        request.status === requestsStatuses.refunded
          ? 1
          : 0,
    },
    {
      status: statusHistoryTimeline.verified,
      text: <FormattedMessageFixed id={messages.verified.id} />,
      step: 4,
      comments: comment.filter(
        (item: any) =>
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
          : 0,
    },
    {
      status: statusHistoryTimeline.refunded,
      text:
        request.status === requestsStatuses.refunded ? (
          <FormattedMessageFixed id={messages.refunded.id} />
        ) : request.status === requestsStatuses.denied ? (
          <FormattedMessageFixed id={messages.denied.id} />
        ) : (
          <FormattedMessageFixed id={messages.refunded.id} />
        ),
      step: 5,
      comments: comment.filter(
        (item: any) => item.status === requestsStatuses.refunded
      ),
      active:
        request.status === requestsStatuses.refunded ||
        request.status === requestsStatuses.denied
          ? 1
          : 0,
    },
  ]

  if (request.status === requestsStatuses.denied) {
    const newTimeline: Array<{
      status: string
      text: JSX.Element
      step: number
      comments: any
      active: number
    }> = []

    for (const item of timeline) {
      if (item.step === 1 || item.step === 5 || item.comments.length) {
        newTimeline.push(item)
      }
    }

    return newTimeline
  }

  return timeline
}

export function sendMail(jsonData: any) {
  axios
    .post(`/returns/sendMail`, {
      TemplateName: 'oms-return-request',
      applicationName: 'email',
      logEvidence: false,
      jsonData,
    })
    .then(() => {})
}

export function renderStatusIcon(request: any) {
  if (request === requestsStatuses.approved) {
    return (
      <div>
        <span className={styles.statusApproved}>
          <IconSuccess size={14} />{' '}
          <FormattedMessageFixed
            id={`returns.status${getProductStatusTranslation(request)}`}
          />
        </span>
      </div>
    )
  }

  if (request === requestsStatuses.denied) {
    return (
      <div>
        <span className={styles.statusDenied}>
          <IconFailure size={14} />{' '}
          <FormattedMessageFixed
            id={`returns.status${getProductStatusTranslation(request)}`}
          />
        </span>
      </div>
    )
  }

  if (request === requestsStatuses.partiallyApproved) {
    return (
      <div>
        <span className={styles.statusPartiallyApproved}>
          <IconWarning size={14} />{' '}
          <FormattedMessageFixed
            id={`returns.status${getProductStatusTranslation(request)}`}
          />
        </span>
      </div>
    )
  }

  if (request === requestsStatuses.pendingVerification) {
    return (
      <div>
        <span className={styles.statusPendingVerification}>
          <IconClock size={14} />{' '}
          <FormattedMessageFixed
            id={`returns.status${getProductStatusTranslation(request)}`}
          />
        </span>
      </div>
    )
  }

  if (request === requestsStatuses.refunded) {
    return (
      <div>
        <span className={styles.statusRefunded}>
          <IconCheck size={14} />{' '}
          <FormattedMessageFixed
            id={`returns.status${getProductStatusTranslation(request)}`}
          />
        </span>
      </div>
    )
  }

  if (request === requestsStatuses.picked) {
    return (
      <div>
        <span className={styles.statusPicked}>
          <IconExternalLinkMini size={11} />{' '}
          <FormattedMessageFixed
            id={`returns.status${getProductStatusTranslation(request)}`}
          />
        </span>
      </div>
    )
  }

  return (
    <div>
      <span className={styles.statusNew}>
        <IconVisibilityOn size={14} />{' '}
        <FormattedMessageFixed
          id={`returns.status${getProductStatusTranslation(request)}`}
        />
      </span>
    </div>
  )
}

export async function verifySchemas() {
  const settingsSchemaResponse = await fetch(
    `${fetchPath.getSchema}${schemaNames.settings}`
  )

  const requestSchemaResponse = await fetch(
    `${fetchPath.getSchema}${schemaNames.request}`
  )

  const commentsSchemaResponse = await fetch(
    `${fetchPath.getSchema}${schemaNames.comment}`
  )

  const historySchemaResponse = await fetch(
    `${fetchPath.getSchema}${schemaNames.history}`
  )

  const productsSchemaResponse = await fetch(
    `${fetchPath.getSchema}${schemaNames.product}`
  )

  const settingsSchema = await settingsSchemaResponse.json()
  const requestsSchema = await requestSchemaResponse.json()
  const commentsSchema = await commentsSchemaResponse.json()
  const historySchema = await historySchemaResponse.json()
  const productsSchema = await productsSchemaResponse.json()

  return (
    JSON.stringify(settingsSchema) !== JSON.stringify(SETTINGS_SCHEMA) ||
    JSON.stringify(requestsSchema) !== JSON.stringify(RETURNS_SCHEMA) ||
    JSON.stringify(commentsSchema) !== JSON.stringify(COMMENTS_SCHEMA) ||
    JSON.stringify(historySchema) !== JSON.stringify(HISTORY_SCHEMA) ||
    JSON.stringify(productsSchema) !== JSON.stringify(PRODUCTS_SCHEMA)
  )
}
