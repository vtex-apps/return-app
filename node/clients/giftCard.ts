import type { IOContext, InstanceOptions } from '@vtex/api'
import { JanusClient } from '@vtex/api'

interface GiftCardInfo {
  relationName: string
  caption: string
  expiringDate: string
  balance: number
  profileId: string
  discount: boolean
}

interface CreateGiftCardResponse {
  id: string
  redemptionToken: string
  redemptionCode: string
  balance: number
  relationName: string
  emissionDate: string
  expiringDate: string
  caption: string
  discount: boolean
  transaction: {
    href: string
  }
}

interface UpdateGiftCard {
  description: string
  value: number
}

interface GiftCardCreditResponse {
  id: string
  redemptionCode: string
  balance: number
  emissionDate: string
  expiringDate: string
  multipleCredits: boolean
  multipleRedemptions: boolean
  restrictedToOwner: boolean
  statusId: number
}

interface GiftCardResponse {
  id: string
  redemptionCode: string
  redemptionToken: string
  balance: number
  emissionDate: string
  expiringDate: string
  discount: boolean
  transaction: {
    href: string
  }
}

export class GiftCard extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        VtexIdClientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken,
      },
    })
  }

  public createGiftCard = async (giftCardInfo: GiftCardInfo) =>
    this.http.post<CreateGiftCardResponse>('/api/giftcards', giftCardInfo, {
      metric: 'giftcard-create',
    })

  public updateGiftCard = async (
    giftCardId: string,
    giftCardInfo: UpdateGiftCard
  ) =>
    this.http.post<GiftCardCreditResponse>(
      `/api/gift-card-system/pvt/giftCards/${giftCardId}/credit`,
      giftCardInfo,
      { metric: 'giftcard-update' }
    )

  public getGiftCard = async (giftCardId: string) =>
    this.http.get<GiftCardResponse>(`/api/giftcards/${giftCardId}`, {
      metric: 'giftcard-get',
    })
}
