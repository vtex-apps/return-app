import type { ItemPackage, PackageDetail } from '@vtex/clients'

type InvoiceType = 'Output' | 'Input'

export const getInvoicedItems = (
  packageDetails: PackageDetail[],
  invoiceType: InvoiceType
): ItemPackage[] => {
  const invoices = packageDetails.filter(({ type }) => type === invoiceType)

  const invoicedItemsRaw = invoices.map(
    ({ items: invoicedItems }) => invoicedItems
  )

  const invoicedItemsFlatten = invoicedItemsRaw.reduce((acc, invoicedItems) => {
    return [...acc, ...invoicedItems]
  }, [])

  return invoicedItemsFlatten
}
