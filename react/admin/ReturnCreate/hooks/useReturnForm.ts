import { useState } from 'react'
import { useMutation } from 'react-apollo'

import CREATE_RETURN_REQUEST from '../../graphql/createReturn.gql'
import type { Order } from '../types/Order'
import type { ReturnRequestForm } from '../types/ReturnRequestForm'

interface FormData extends Omit<ReturnRequestForm, 'additionalInfo'> {
  additionalInfo: {
    returnAction?: string
    reasonCode?: string
    shippingMethod?: string
    locationCode?: string
    refundShippingValue?: number
    refundAdditionalValue?: number
  }
}

export const useReturnForm = () => {
  const [formData, setFormData] = useState<FormData>({
    orderId: '',
    items: [],
    customerProfileData: {
      name: '',
      phoneNumber: '',
    },
    pickupReturnData: {
      addressId: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      addressType: 'CUSTOMER_ADDRESS',
    },
    refundPaymentData: {
      refundPaymentMethod: '',
    },
    locale: 'en-US',
    additionalInfo: {
      returnAction: '',
      reasonCode: '',
      shippingMethod: '',
      locationCode: '',
      refundShippingValue: 0,
      refundAdditionalValue: 0,
    },
  })

  const [loading, setLoading] = useState(false)
  const [
    loadingCompleteFormDataFromOrderId,
    setLoadingCompleteFormDataFromOrderId,
  ] = useState(false)

  const [error, setError] = useState<Error | null>(null)
  const [success, setSuccess] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  const [createReturnRequest] = useMutation(CREATE_RETURN_REQUEST)

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const completeFormDataFromOrderId = async (orderId: string) => {
    setLoadingCompleteFormDataFromOrderId(true)
    const orderFromApi = await fetch(`/api/oms/pvt/orders/${orderId}`)
    const orderData = (await orderFromApi.json()) as Order

    setOrder(orderData)

    setLoadingCompleteFormDataFromOrderId(false)

    setFormData((prev) => ({
      ...prev,
      customerProfileData: {
        name: `${orderData.clientProfileData.firstName} ${orderData.clientProfileData.lastName}`,
        email: orderData.clientProfileData.email,
        phoneNumber: orderData.clientProfileData.phone,
      },
      items: orderData.items.map((_item, index) => ({
        orderItemIndex: index,
        quantity: 0,
        condition: 'unspecified',
        returnReason: {
          reason: '',
          otherReason: '',
        },
      })),
      pickupReturnData: {
        addressId: orderData.shippingData.address.addressId,
        address: orderData.shippingData.address.street,
        city: orderData.shippingData.address.city,
        state: orderData.shippingData.address.state,
        country: orderData.shippingData.address.country,
        zipCode: orderData.shippingData.address.postalCode,
        addressType: 'CUSTOMER_ADDRESS',
      },
    }))
  }

  const handleNestedInputChange = (
    parentField: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as Record<string, any>),
        [field]: value,
      },
    }))
  }

  const clearForm = () => {
    setFormData({
      orderId: '',
      items: [],
      customerProfileData: {
        name: '',
        phoneNumber: '',
      },
      pickupReturnData: {
        addressId: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        addressType: 'CUSTOMER_ADDRESS',
      },
      refundPaymentData: {
        refundPaymentMethod: '',
      },
      locale: 'en-US',
      additionalInfo: {
        returnAction: '',
        reasonCode: '',
        shippingMethod: '',
        locationCode: '',
        refundShippingValue: 0,
        refundAdditionalValue: 0,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const filteredItems = formData.items.filter((item) => item.quantity > 0)

    const { additionalInfo } = formData

    additionalInfo.refundShippingValue =
      (additionalInfo?.refundShippingValue ?? 0) * 100
    additionalInfo.refundAdditionalValue =
      (additionalInfo?.refundAdditionalValue ?? 0) * 100

    const returnRequestPayload = {
      ...formData,
      items: filteredItems,
      additionalInfo: JSON.stringify(additionalInfo),
    }

    try {
      await createReturnRequest({
        variables: {
          returnRequest: returnRequestPayload,
        },
      })
      setSuccess(true)
      clearForm()
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    loading,
    error,
    success,
    handleSubmit,
    handleInputChange,
    handleNestedInputChange,
    completeFormDataFromOrderId,
    loadingCompleteFormDataFromOrderId,
    order,
  }
}
