export const localMap: ReportMap = {
  id: '7a42a323-1faa-11ed-835d-16acdede38c5',
  name: 'Return Requests',
  path: 'items',
  domain: null,
  skipRecordOnError: false,
  isGlobal: false,
  columns: [
    {
      header: 'status',
      query: 'status',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'order_id',
      query: 'orderId',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sequence_number',
      query: 'sequenceNumber',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'date_submitted',
      query: 'dateSubmitted',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refundable_amount',
      query: 'refundableAmount',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refundable_amount_items',
      query: "refundableAmountTotals[id='items'].value",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refundable_amount_shipping',
      query: "refundableAmountTotals[id='shipping'].value",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refundable_amount_tax',
      query: "refundableAmountTotals[id='tax'].value",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'customer_profile_data_id',
      query: 'customerProfileData.userId',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'customer_profile_data_name',
      query: 'customerProfileData.name',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'customer_profile_data_email',
      query: 'customerProfileData.email',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'customer_profile_data_phone',
      query: 'customerProfileData.phoneNumber',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_id',
      query: 'pickupReturnData.addressId',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_address',
      query: 'pickupReturnData.address',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_city',
      query: 'pickupReturnData.city',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_state',
      query: 'pickupReturnData.state',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_country',
      query: 'pickupReturnData.country',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_zip_code',
      query: 'pickupReturnData.zipCode',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_type',
      query: 'pickupReturnData.addressType',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'pickup_return_data_return_label',
      query: "pickupReturnData.( returnLabel ? returnLabel : 'NA' )",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refund_payment_data_payment_method',
      query: 'refundPaymentData.refundPaymentMethod',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refund_payment_data_payment_iban',
      query: "refundPaymentData.( iban ? iban : 'NA' )",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refund_payment_data_payment_account_holder_name',
      query:
        "refundPaymentData.( accountHolderName ? accountHolderName : 'NA' )",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refund_payment_data_payment_automatic_refund',
      query:
        "refundPaymentData.( automaticallyRefundPaymentMethod ? automaticallyRefundPaymentMethod : 'NA' )",
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'culture_info_data_currency_code',
      query: 'cultureInfoData.currencyCode',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'culture_info_data_currency_locale',
      query: 'cultureInfoData.locale',
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'refund_status_new',
      query:
        "($a := refundStatusData.[status = 'new'].Product; $a ? $a : 'NA')",
      usePath: false,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_order_item_index',
      query: 'orderItemIndex',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_id',
      query: 'id',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_product_id',
      query: 'productId',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_ref_id',
      query: 'refId',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_name',
      query: 'name',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_localized_name',
      query: "( localizedName ? localizedName : 'NA' )",
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_image',
      query: 'imageUrl',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_seller_id',
      query: 'sellerId',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_seller_name',
      query: 'sellerName',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_quantity',
      query: 'quantity',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_unit_multiplier',
      query: 'unitMultiplier',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_condition',
      query: 'condition',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_selling_price',
      query: 'sellingPrice',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_tax',
      query: 'tax',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_return_reason',
      query: 'returnReason.reason',
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
    {
      header: 'sku_other_return_reson',
      query: "returnReason.( otherReason ? otherReason : 'NA' )",
      usePath: true,
      translationPrefix: null,
      defaultLanguage: null,
    },
  ],
}
