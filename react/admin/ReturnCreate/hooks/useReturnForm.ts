import { useState } from 'react'
import { useMutation } from 'react-apollo'

import CREATE_RETURN_REQUEST from '../../graphql/createReturn.gql'

interface ReturnItem {
  orderItemIndex: number
  quantity: number
  condition: string
  returnReason: {
    reason: string
    otherReason?: string
  }
}

interface FormData {
  orderId: string
  items: ReturnItem[]
  customerProfileData: {
    name: string
    email?: string
    phoneNumber: string
  }
  pickupReturnData: {
    addressId: string
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    addressType: 'PICKUP_POINT' | 'CUSTOMER_ADDRESS'
  }
  refundPaymentData: {
    refundPaymentMethod: string
    iban?: string
    accountHolderName?: string
  }
  userComment?: string
  additionalInfo?: string
  locale: string
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
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [success, setSuccess] = useState(false)

  const [createReturnRequest] = useMutation(CREATE_RETURN_REQUEST)

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await createReturnRequest({
        variables: {
          returnRequest: formData,
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
  }
}
