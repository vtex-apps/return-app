/**
 * Body of the Master Data schema the app reads and writes with. It is the
 * schema that the masterdata builder saved for version 3.11.2, with
 * v-security made private, because Master Data rejects new schemas with
 * allowGetAll set to true. The app only creates it in an account that does
 * not have it yet.
 */
export const RETURN_REQUEST_SCHEMA_BODY = {
  $defs: {
    status: {
      enum: [
        'new',
        'processing',
        'pickedUpFromClient',
        'pendingVerification',
        'packageVerified',
        'amountRefunded',
        'denied',
        'cancelled',
      ],
      type: 'string',
    },
  },
  properties: {
    cultureInfoData: {
      properties: {
        currencyCode: {
          type: 'string',
        },
        locale: {
          type: 'string',
        },
      },
      required: ['currencyCode', 'locale'],
      type: 'object',
    },
    customerProfileData: {
      properties: {
        email: {
          format: 'email',
          type: 'string',
        },
        name: {
          type: 'string',
        },
        phoneNumber: {
          maxLength: 50,
          type: 'string',
        },
        userId: {
          type: 'string',
        },
      },
      required: ['userId', 'name', 'phoneNumber', 'email'],
      type: 'object',
    },
    dateSubmitted: {
      format: 'date-time',
      type: 'string',
    },
    items: {
      items: {
        properties: {
          condition: {
            enum: [
              'unspecified',
              'newWithBox',
              'newWithoutBox',
              'usedWithBox',
              'usedWithoutBox',
            ],
            type: 'string',
          },
          id: {
            type: 'string',
          },
          imageUrl: {
            type: 'string',
          },
          localizedName: {
            type: ['string', 'null'],
          },
          name: {
            type: 'string',
          },
          orderItemIndex: {
            type: 'integer',
          },
          productId: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
          },
          refId: {
            type: 'string',
          },
          returnReason: {
            properties: {
              otherReason: {
                type: ['string', 'null'],
              },
              reason: {
                required: true,
                type: 'string',
              },
            },
            required: ['reason'],
            type: 'object',
          },
          sellerId: {
            type: 'string',
          },
          sellerName: {
            type: 'string',
          },
          sellingPrice: {
            type: 'integer',
          },
          tax: {
            type: 'integer',
          },
          unitMultiplier: {
            type: 'number',
          },
        },
        required: [
          'orderItemIndex',
          'id',
          'name',
          'sellingPrice',
          'tax',
          'quantity',
          'imageUrl',
          'unitMultiplier',
          'sellerId',
          'productId',
          'refId',
          'returnReason',
          'condition',
        ],
        type: 'object',
      },
      type: 'array',
    },
    orderId: {
      type: 'string',
    },
    pickupReturnData: {
      properties: {
        address: {
          type: 'string',
        },
        addressId: {
          type: 'string',
        },
        addressType: {
          enum: ['PICKUP_POINT', 'CUSTOMER_ADDRESS'],
          type: 'string',
        },
        city: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
        returnLabel: {
          type: 'string',
        },
        state: {
          type: 'string',
        },
        zipCode: {
          type: 'string',
        },
      },
      required: [
        'addressId',
        'address',
        'city',
        'state',
        'country',
        'zipCode',
        'addressType',
      ],
      type: 'object',
    },
    refundData: {
      properties: {
        giftCard: {
          properties: {
            id: {
              type: 'string',
            },
            redemptionCode: {
              type: 'string',
            },
          },
          required: ['id', 'redemptionCode'],
          type: 'object',
        },
        invoiceNumber: {
          type: 'string',
        },
        invoiceValue: {
          type: 'integer',
        },
        items: {
          items: {
            properties: {
              id: {
                type: 'string',
              },
              orderItemIndex: {
                type: 'integer',
              },
              price: {
                type: 'integer',
              },
              quantity: {
                type: 'integer',
              },
              restockFee: {
                type: 'integer',
              },
            },
            required: [
              'orderItemIndex',
              'id',
              'price',
              'quantity',
              'restockFee',
            ],
            type: 'object',
          },
          type: 'array',
        },
        refundedItemsValue: {
          type: 'integer',
        },
        refundedShippingValue: {
          type: 'integer',
        },
      },
      required: [
        'invoiceNumber',
        'invoiceValue',
        'refundedItemsValue',
        'items',
      ],
      type: ['object', 'null'],
    },
    refundPaymentData: {
      properties: {
        accountHolderName: {
          type: ['string', 'null'],
        },
        automaticallyRefundPaymentMethod: {
          type: ['boolean', 'null'],
        },
        iban: {
          type: ['string', 'null'],
        },
        refundPaymentMethod: {
          enum: ['bank', 'card', 'giftCard', 'sameAsPurchase'],
          type: 'string',
        },
      },
      required: ['refundPaymentMethod'],
      type: 'object',
    },
    refundStatusData: {
      items: {
        properties: {
          comments: {
            items: {
              properties: {
                comment: {
                  type: 'string',
                },
                createdAt: {
                  format: 'date-time',
                  type: 'string',
                },
                role: {
                  enum: ['adminUser', 'storeUser'],
                  type: 'string',
                },
                submittedBy: {
                  type: 'string',
                },
                visibleForCustomer: {
                  type: 'boolean',
                },
              },
              required: [
                'comment',
                'createdAt',
                'role',
                'submittedBy',
                'visibleForCustomer',
              ],
              type: 'object',
            },
            type: 'array',
          },
          createdAt: {
            format: 'date-time',
            type: 'string',
          },
          status: {
            $ref: '#/$defs/status',
          },
          submittedBy: {
            type: 'string',
          },
        },
        required: ['status', 'submittedBy', 'createdAt', 'comments'],
        type: 'object',
      },
      type: 'array',
    },
    refundableAmount: {
      type: 'integer',
    },
    refundableAmountTotals: {
      items: {
        properties: {
          id: {
            enum: ['items', 'shipping', 'tax'],
            type: 'string',
          },
          value: {
            type: 'integer',
          },
        },
        required: ['id', 'value'],
        type: 'object',
      },
      type: 'array',
    },
    sequenceNumber: {
      type: 'string',
    },
    status: {
      $ref: '#/$defs/status',
    },
  },
  required: [
    'orderId',
    'refundableAmount',
    'sequenceNumber',
    'status',
    'refundableAmountTotals',
    'customerProfileData',
    'pickupReturnData',
    'refundPaymentData',
    'items',
    'refundData',
    'refundStatusData',
    'dateSubmitted',
    'cultureInfoData',
  ],
  'v-cache': false,
  'v-default-fields': [
    'id',
    'createdIn',
    'orderId',
    'sequenceNumber',
    'dateSubmitted',
    'status',
  ],
  'v-immediate-indexing': false,
  'v-indexed': [
    'id',
    'createdIn',
    'orderId',
    'customerProfileData',
    'status',
    'sequenceNumber',
    'dateSubmitted',
  ],
  'v-security': {
    allowGetAll: false,
  },
  'v-triggers': [],
}
