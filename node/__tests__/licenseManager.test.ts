import type { IOContext } from '@vtex/api'

import { LicenseManager } from '../clients/licenseManager'

// The jest 24 resolver bundled with @vtex/test-tools cannot resolve the
// "exports" map used by @vtex/api's OpenTelemetry dependencies, so the real
// package cannot be loaded here. Replace the base class with a minimal fake.
jest.mock('@vtex/api', () => ({
  ExternalClient: class {
    public context: unknown

    constructor(_baseURL: string, context: unknown) {
      this.context = context
    }
  },
}))

const context = {
  account: 'acme',
  authToken: 'app-token',
  userAgent: 'test',
} as unknown as IOContext

const build = (get: jest.Mock) => {
  const client = new LicenseManager(context)

  Object.assign(client, { http: { get } })

  return client
}

describe('LicenseManager.isGranted', () => {
  it('returns true when the API answers true', async () => {
    const get = jest.fn().mockResolvedValue(true)

    expect(await build(get).isGranted('a@b.com')).toBe(true)
    expect(get).toHaveBeenCalledWith(
      'pvt/accounts/acme/logins/a%40b.com/granted',
      expect.objectContaining({ metric: expect.any(String) })
    )
  })

  it('returns false when the API answers false', async () => {
    const get = jest.fn().mockResolvedValue(false)

    expect(await build(get).isGranted('a@b.com')).toBe(false)
  })

  it('returns false on a 404 error', async () => {
    const get = jest.fn().mockRejectedValue({ response: { status: 404 } })

    expect(await build(get).isGranted('a@b.com')).toBe(false)
  })

  it('rejects on a 500 error', async () => {
    const error = { response: { status: 500 } }
    const get = jest.fn().mockRejectedValue(error)

    await expect(build(get).isGranted('a@b.com')).rejects.toBe(error)
  })
})
