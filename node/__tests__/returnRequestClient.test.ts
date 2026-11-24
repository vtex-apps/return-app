/* tslint:disable:max-classes-per-file */
import {
  RETURN_REQUEST_ENTITY,
  RETURN_REQUEST_SCHEMA,
  ReturnRequestClient,
  resetEnsuredSchemas,
} from '../clients/returnRequest'
import type { ReturnRequest } from '../typings/returnRequest'

// The jest 24 resolver cannot load @vtex/api (see licenseManager.test.ts).
// Replace MasterData with a fake whose methods are spies shared by all
// instances.
const mockMasterData = {
  getSchema: jest.fn(),
  createOrUpdateSchema: jest.fn(),
  getDocument: jest.fn(),
  createDocument: jest.fn(),
  updatePartialDocument: jest.fn(),
  searchDocuments: jest.fn(),
  searchDocumentsWithPaginationInfo: jest.fn(),
}

jest.mock('@vtex/api', () => ({
  MasterData: class {
    public context: unknown

    public getSchema = mockMasterData.getSchema
    public createOrUpdateSchema = mockMasterData.createOrUpdateSchema
    public getDocument = mockMasterData.getDocument
    public createDocument = mockMasterData.createDocument
    public updatePartialDocument = mockMasterData.updatePartialDocument
    public searchDocuments = mockMasterData.searchDocuments
    public searchDocumentsWithPaginationInfo =
      mockMasterData.searchDocumentsWithPaginationInfo

    constructor(context: unknown) {
      this.context = context
    }
  },
}))

const contextFor = (account: string) =>
  ({
    account,
    workspace: 'master',
    production: true,
    logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
  } as unknown as ConstructorParameters<typeof ReturnRequestClient>[0])

const notFound = () => ({ response: { status: 404 } })

beforeEach(() => {
  Object.values(mockMasterData).forEach((spy) => spy.mockReset())
  resetEnsuredSchemas()
  mockMasterData.getSchema.mockResolvedValue({ properties: {} })
  mockMasterData.searchDocumentsWithPaginationInfo.mockResolvedValue({
    data: [],
    pagination: { total: 0, page: 1, pageSize: 25 },
  })
})

describe('ReturnRequestClient', () => {
  it('uses the pinned schema for search, save and update', async () => {
    const client = new ReturnRequestClient(contextFor('acme'))

    await client.searchRaw({ page: 1, pageSize: 25 }, ['id'])
    await client.search({ page: 1, pageSize: 1 }, ['id'])
    await client.save({ orderId: '1' } as ReturnRequest)
    await client.update('request-id', { status: 'cancelled' })

    const calls = [
      mockMasterData.searchDocumentsWithPaginationInfo,
      mockMasterData.searchDocuments,
      mockMasterData.createDocument,
      mockMasterData.updatePartialDocument,
    ].map((spy) => spy.mock.calls[0][0])

    calls.forEach((input) => {
      expect(input).toMatchObject({
        dataEntity: RETURN_REQUEST_ENTITY,
        schema: RETURN_REQUEST_SCHEMA,
      })
    })
    expect(RETURN_REQUEST_SCHEMA).toBe('3.11.2')
  })

  it('reads a document by id without checking the schema', async () => {
    const client = new ReturnRequestClient(contextFor('acme'))

    await client.get('request-id', ['_all'])

    expect(mockMasterData.getDocument).toHaveBeenCalledWith({
      dataEntity: RETURN_REQUEST_ENTITY,
      id: 'request-id',
      fields: ['_all'],
    })
    expect(mockMasterData.getSchema).not.toHaveBeenCalled()
  })

  it('does not create the schema when the account already has it', async () => {
    const client = new ReturnRequestClient(contextFor('acme'))

    await client.searchRaw({ page: 1, pageSize: 25 }, ['id'])

    expect(mockMasterData.getSchema).toHaveBeenCalledWith({
      dataEntity: RETURN_REQUEST_ENTITY,
      schema: RETURN_REQUEST_SCHEMA,
    })
    expect(mockMasterData.createOrUpdateSchema).not.toHaveBeenCalled()
  })

  it('creates the schema as private when the account does not have it', async () => {
    mockMasterData.getSchema.mockRejectedValue(notFound())

    const client = new ReturnRequestClient(contextFor('newaccount'))

    await client.searchRaw({ page: 1, pageSize: 25 }, ['id'])

    expect(mockMasterData.createOrUpdateSchema).toHaveBeenCalledTimes(1)

    const [[input]] = mockMasterData.createOrUpdateSchema.mock.calls

    expect(input.dataEntity).toBe(RETURN_REQUEST_ENTITY)
    expect(input.schemaName).toBe(RETURN_REQUEST_SCHEMA)
    expect(input.schemaBody['v-security']).toEqual({ allowGetAll: false })
    expect(input.schemaBody['v-indexed']).toEqual(
      expect.arrayContaining(['customerProfileData', 'orderId', 'status'])
    )
  })

  it('checks the schema once per account', async () => {
    const first = new ReturnRequestClient(contextFor('acme'))
    const second = new ReturnRequestClient(contextFor('acme'))
    const other = new ReturnRequestClient(contextFor('other'))

    await Promise.all([
      first.searchRaw({ page: 1, pageSize: 25 }, ['id']),
      second.search({ page: 1, pageSize: 1 }, ['id']),
      other.searchRaw({ page: 1, pageSize: 25 }, ['id']),
    ])

    expect(mockMasterData.getSchema).toHaveBeenCalledTimes(2)
  })

  it('propagates other errors and retries the check on the next request', async () => {
    const failure = { response: { status: 503 } }

    mockMasterData.getSchema.mockRejectedValueOnce(failure)

    const client = new ReturnRequestClient(contextFor('acme'))

    await expect(
      client.searchRaw({ page: 1, pageSize: 25 }, ['id'])
    ).rejects.toBe(failure)
    expect(mockMasterData.createOrUpdateSchema).not.toHaveBeenCalled()

    await client.searchRaw({ page: 1, pageSize: 25 }, ['id'])

    expect(mockMasterData.getSchema).toHaveBeenCalledTimes(2)
    expect(
      mockMasterData.searchDocumentsWithPaginationInfo
    ).toHaveBeenCalledTimes(1)
  })
})
