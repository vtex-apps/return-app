import { ResolverError } from '@vtex/api'

export const createGiftcardService = async (ctx: Context, body: any) => {
  const {
    clients: { giftCard: giftCardClient },
  } = ctx

  const getOneYearLaterDate = (createdAt: string) => {
    const date = new Date(createdAt)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const oneYearLater = new Date(year + 1, month, day)

    return oneYearLater.toISOString()
  }

  try {
    const { id, redemptionCode } = await giftCardClient.createGiftCard({
      relationName: body?.invoiceNumber as string,
      caption: 'Gift Card from Return Request',
      expiringDate: getOneYearLaterDate(body?.createdAt),
      balance: 0,
      profileId: body?.userEmail,
      discount: true,
    })

    const giftCardIdSplit = id.split('_')

    const giftCardId = giftCardIdSplit[giftCardIdSplit.length - 1]

    await giftCardClient.updateGiftCard(giftCardId, {
      description: 'Initial Charge',
      value: body?.invoiceValue as number,
    })

    return {
      giftCard: { id: giftCardId, redemptionCode },
    }
  } catch (error) {
    throw new ResolverError('Error creating/updating gift card')
  }
}
