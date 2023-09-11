import Joi from 'joi'

const refundPaymentDataSchema = Joi.object({
  refundPaymentMethod: Joi.string().required(),
})

const goodwilShema = Joi.object({
  orderId: Joi.string().required(),
  creditAmount: Joi.number().min(0).required(),
  reason: Joi.string().max(120).required(),
  sellerId: Joi.string().required(),
  refundPaymentData: refundPaymentDataSchema.required(),
})

export default goodwilShema
