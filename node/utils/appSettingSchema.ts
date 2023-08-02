import Joi from 'joi'

const customReturnReasonSchema = Joi.object({
  reason: Joi.string().optional(),
  maxDays: Joi.number().optional(),
  translations: Joi.array()
    .items(
      Joi.object({
        locale: Joi.string().pattern(/^[a-z]{2}-[A-Z]{2}$/),
        translation: Joi.string(),
      })
    )
    .allow(null)
    .optional(),
})

const schemaAppSetting = Joi.object({
  maxDays: Joi.number().max(730).optional(),
  excludedCategories: Joi.array().items(Joi.string()).optional(),
  paymentOptions: Joi.object({
    enablePaymentMethodSelection: Joi.boolean().optional(),
    allowedPaymentTypes: Joi.object({
      bank: Joi.boolean(),
      card: Joi.boolean(),
      giftCard: Joi.boolean(),
    }).optional(),
    automaticallyRefundPaymentMethod: Joi.boolean().optional(),
  }).optional(),
  termsUrl: Joi.string().uri().optional(),
  customReturnReasons: Joi.array().items(customReturnReasonSchema).optional(),
  options: Joi.object({
    enableOtherOptionSelection: Joi.boolean().optional(),
    enablePickupPoints: Joi.boolean().optional(),
    enableProportionalShippingValue: Joi.boolean().optional(),
    enableSelectItemCondition: Joi.boolean().optional(),
    enableHighlightFormMessage: Joi.allow(null).optional(),
  }).optional(),
  orderStatus: Joi.string().optional(),
})

export default schemaAppSetting
