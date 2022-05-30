import { defineMessages } from 'react-intl'

const pageHeaderConfigMessages = defineMessages({
  pageHeaderTitle: {
    id: 'store/return-app.return-order-details.page-header.title',
  },
  pageHeaderLinkTitle: {
    id: 'store/return-app.return-order-details.page-header.title',
  },
})

export const returnDetailsPageHeaderConfig = {
  namespace: 'vtex-account__return-details',
  title: pageHeaderConfigMessages.pageHeaderTitle,
  titleId: 'store/return-app.return-order-details.page-header.title',
  backButton: {
    titleId: pageHeaderConfigMessages.pageHeaderLinkTitle,
    path: '/my-returns/add',
  },
}
