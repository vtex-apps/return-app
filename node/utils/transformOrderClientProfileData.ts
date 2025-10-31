import type { ClientProfileDetail } from '@vtex/clients'
import type { ClientProfileData } from 'odp.return-app'

export const transformOrderClientProfileData = (
  clientProfileData: ClientProfileDetail,
  email: string
): ClientProfileData => {
  return {
    userId: clientProfileData.userProfileId || '',
    name: `${clientProfileData.firstName} ${clientProfileData.lastName}`,
    email,
    phoneNumber: clientProfileData.phone,
  }
}
