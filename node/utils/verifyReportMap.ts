import assert from 'assert'

import { ResolverError } from '@vtex/api'

import { localMap } from '../report/json_return-request-map'
import type { ReturnRequestReport } from '../clients/report'

export const verifyReportMap = async (
  reportClient: ReturnRequestReport
): Promise<void> => {
  try {
    const remoteMap = await reportClient.getMap(localMap.id)

    /* Tests for deep equality, throws error with a custom message if it fails */
    assert.deepStrictEqual(remoteMap, localMap, 'unequal-maps')
  } catch (error) {
    if (error.message !== 'unequal-maps' && error.response.status !== 404) {
      throw new ResolverError(
        `An error ocurred while verifying if the local report map differs from to the remote one: ${error.message}`
      )
    }

    await reportClient.createOrUpdateMap(localMap)
  }
}
