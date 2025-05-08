import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Alert,
  Box,
  Button,
  Input,
  Layout,
  PageBlock,
  PageHeader,
  Textarea,
} from 'vtex.styleguide'
import { CommentFields } from './components/ReturnTypeForm'
import { CustomerProfileForm } from './components/CustomerProfileForm'
import { PickupReturnForm } from './components/PickupReturnForm'
import { RefundPaymentForm } from './components/RefundPaymentForm'
import { ReturnItemsForm } from './components/ReturnItemsForm'
import { useReturnForm } from './hooks/useReturnForm'

const ReturnCreate: React.FC = () => {
  const {
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
  } = useReturnForm()

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.return-request-list.page-header.create-return" />
          }
          subtitle={
            <FormattedMessage id="admin/return-app.return-request-list.page-header.create-return-description" />
          }
        />
      }
    >
      <PageBlock variation="full" fit="fill">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb5">
              <Alert type="error" onClose={() => {}}>
                {error.message}
              </Alert>
            </div>
          )}
          <div className="mb5 flex">
            <Input
              label="Order ID"
              value={formData.orderId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('orderId', e.target.value)
              }
              required
            />
            <div className="mt6 ml4">
              <Button
                onClick={() => completeFormDataFromOrderId(formData.orderId)}
                isLoading={loadingCompleteFormDataFromOrderId}
              >
                OK
              </Button>
            </div>
          </div>
          <div className="mb5">
            <Box>
              <ReturnItemsForm
                items={formData.items}
                onChange={(items) => handleInputChange('items', items)}
                order={order}
              />
            </Box>
          </div>
          <div className="mb5">
            <Box>
              <CustomerProfileForm
                data={formData.customerProfileData}
                onChange={(field, value) =>
                  handleNestedInputChange('customerProfileData', field, value)
                }
                order={order}
              />
            </Box>
          </div>
          <div className="mb5">
            <Box>
              <PickupReturnForm
                data={formData.pickupReturnData}
                onChange={(field, value) =>
                  handleNestedInputChange('pickupReturnData', field, value)
                }
              />
            </Box>
          </div>
          <div className="mb5">
            <Box>
              <RefundPaymentForm
                data={formData.refundPaymentData}
                onChange={(field, value) =>
                  handleNestedInputChange('refundPaymentData', field, value)
                }
              />
            </Box>
          </div>

          <div className="mb5">
            <Textarea
              label="User Comment"
              value={formData.userComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange('userComment', e.target.value)
              }
            />
          </div>

          <div className="mb5">
            <Box>
              <CommentFields
                returnAction={formData.additionalInfo?.returnAction || ''}
                reasonCode={formData.additionalInfo?.reasonCode || ''}
                onReturnActionChange={(value) => handleNestedInputChange('additionalInfo', 'returnAction', value)}
                onReasonCodeChange={(value) => handleNestedInputChange('additionalInfo', 'reasonCode', value)}
              />
            </Box>
          </div>

          <div className="mt5">
            <Button type="submit" variation="primary" isLoading={loading}>
              Create Return Request
            </Button>
          </div>
          {success && (
            <div className="mt5">
              <Alert type="success" onClose={()=>{}}>
                Return request created successfully!
              </Alert>
            </div>
          )}
        </form>
      </PageBlock>
    </Layout>
  )
}

export default ReturnCreate