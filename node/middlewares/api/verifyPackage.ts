/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { json } from 'co-body'

export async function verifyPackage(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient, returnApp: returnAppClient },
  } = ctx

  const body = await json(ctx.req)

  let output = {
    success: true,
    errorMessage: '',
    totalRefundAmount: 0,
    newTotalRefundAmount: 0,
    refundedProducts: [],
    updatedRequest: {}
  }
  const { request_id } = ctx.vtex.route.params
  const [request] = await masterDataClient.getDocuments(
    ctx,
    'returnRequests',
    'request',
    `id=${request_id}`
  )

  if (request.status !== 'Pending verification') {
    output = {
      ...output,
      success: false,
      errorMessage: 'No pending verification status',
    } 

  } else {
    
    const { items } = await returnAppClient.getOrder(ctx, request.orderId)
    const productsResponse = await masterDataClient.getDocuments(
      ctx, 
      'returnProducts', 
      'product', 
      `orderId=${request.orderId}`
    )

    const refundedProducts = productsResponse.filter((product: any) => product.refundId === request_id)
    const refundedProductsIds = refundedProducts.map((x: any) => x.sku)
    const totalTaxes = items
      .filter((x: any) => refundedProductsIds.some((refundedProductsId: any) => x.id === refundedProductsId))
      .reduce((acc: any, currentProduct: any) => {
        let tax = (currentProduct.priceTags
          .filter((x: any) => x.name.includes('TAXHUB'))
          .reduce((acc: any, el: any) => acc + Number(el.rawValue), 0) / currentProduct.quantity).toFixed(2)

        return [...acc, {sku: currentProduct.id, tax}]
      }, [])
      
    const refundedProductsTax = refundedProducts.map((x: any) => ({
      ...x,
      goodProducts: x.quantity,
      status: "Approved",
      tax: Number(totalTaxes.find((y: any) => y.sku === x.sku).tax),
      totalValue: (Number(totalTaxes.find((y: any) => y.sku === x.sku).tax) + Number(x.unitPrice / 100)) * Number(x.quantity)
    }))

    const totalRefundAmount = refundedProductsTax.reduce((acc: any,el: any) =>  acc + Number(el.totalValue), 0)
    const newTotalRefundAmount = (totalRefundAmount - (body?.restockFee || 0) + (body?.refundedShippingValue || 0))


    for (let i = 0; i < refundedProductsTax.length; i++) {
      const currentProduct = refundedProductsTax[i]
      await masterDataClient.saveDocuments(ctx, 'returnProducts', currentProduct)
    }

    const updatedRequest = { 
      ...request, 
      status: 'Pending verification', 
      refundedAmount: (newTotalRefundAmount.toFixed(2)) * 100 ,
      refundedShippingValue: body.refundedShippingValue,
      orderRestockFee: body.restockFee
    }

    await masterDataClient.saveDocuments(ctx, 'returnRequests', updatedRequest)

    output = {
      ...output,
      totalRefundAmount,
      newTotalRefundAmount: newTotalRefundAmount,
      refundedProducts: refundedProductsTax,
      updatedRequest,
    }
  }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = output

  await next()
}