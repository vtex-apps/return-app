import { defineMessages } from 'react-intl'
import { messageId } from './messageId'

export const defaultReturnConditionsMessages = defineMessages({
  newWithBox: {
    id: messageId('store/return-app.return-order-details.conditions.new-with-box'),
  },
  newWithoutBox: {
    id: messageId('store/return-app.return-order-details.conditions.new-without-box'),
  },
  usedWithBox: {
    id: messageId('store/return-app.return-order-details.conditions.used-with-box'),
  },
  usedWithoutBox: {
    id: messageId('store/return-app.return-order-details.conditions.used-without-box'),
  },
  selectCondition: {
    id: messageId('store/return-app.return-order-details.dropdown-conditions.placeholder.select-condition'),
  },
})
