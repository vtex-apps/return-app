import { defineMessages } from 'react-intl'

export const defaultPaymentMethodsMessages = defineMessages({
  card: {
    id: 'store/return-app.return-order-details.payment-options.card',
  },
  giftCard: {
    id: 'store/return-app.return-order-details.payment-options.gift-card',
  },
  bank: {
    id: 'store/return-app.return-order-details.payment-options.bank',
  },
  sameAsPurchase: {
    id: 'store/return-app.confirm-payment-methods.refund-method.p-same-as-purchase',
  },
})
