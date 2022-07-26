import type { TransactionDetail } from '@vtex/clients'

export const canRefundCard = (
  orderTransactions: TransactionDetail[]
): boolean =>
  orderTransactions.some((transactions) =>
    transactions.payments.some((transaction) => transaction.lastDigits)
  )
