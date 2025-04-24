import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Dropdown, Input } from 'vtex.styleguide'

interface ReturnItem {
  orderItemIndex: number
  quantity: number
  condition: string
  returnReason: {
    reason: string
    otherReason?: string
  }
}

interface ReturnItemsFormProps {
  items: ReturnItem[]
  onChange: (items: ReturnItem[]) => void
}

const ITEM_CONDITIONS = [
  { value: 'unspecified', label: 'Unspecified' },
  { value: 'newWithBox', label: 'New with box' },
  { value: 'newWithoutBox', label: 'New without box' },
  { value: 'usedWithBox', label: 'Used with box' },
  { value: 'usedWithoutBox', label: 'Used without box' },
]

const RETURN_REASONS = [
  { value: 'defective', label: 'Defective' },
  { value: 'wrongItem', label: 'Wrong item' },
  { value: 'sizeIssue', label: 'Size issue' },
  { value: 'other', label: 'Other' },
]

export const ReturnItemsForm: React.FC<ReturnItemsFormProps> = ({
  items,
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem: ReturnItem = {
      orderItemIndex: 0,
      quantity: 1,
      condition: 'unspecified',
      returnReason: {
        reason: 'defective',
      },
    }

    onChange([...items, newItem])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)

    onChange(newItems)
  }

  const handleItemChange = (
    index: number,
    field: keyof ReturnItem,
    value: any
  ) => {
    const newItems = [...items]

    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  const handleReasonChange = (
    index: number,
    field: keyof ReturnItem['returnReason'],
    value: string
  ) => {
    const newItems = [...items]

    newItems[index] = {
      ...newItems[index],
      returnReason: {
        ...newItems[index].returnReason,
        [field]: value,
      },
    }
    onChange(newItems)
  }

  return (
    <div className="mb5">
      <div className="flex justify-between items-center mb4">
        <h3 className="t-heading-3">
          <FormattedMessage id="admin/return-app.return-items.title" />
        </h3>
        <Button variation="secondary" onClick={handleAddItem}>
          <FormattedMessage id="admin/return-app.return-items.add" />
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="mb5 pa4 ba b--muted-4 br3">
          <div className="flex justify-between items-center mb4">
            <h4 className="t-heading-4">
              <FormattedMessage
                id="admin/return-app.return-items.item"
                values={{ number: index + 1 }}
              />
            </h4>
            <Button
              variation="danger"
              size="small"
              onClick={() => handleRemoveItem(index)}
            >
              <FormattedMessage id="admin/return-app.return-items.remove" />
            </Button>
          </div>

          <div className="mb4">
            <Input
              label="Order Item Index"
              type="number"
              value={item.orderItemIndex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleItemChange(
                  index,
                  'orderItemIndex',
                  parseInt(e.target.value, 10)
                )
              }
              required
            />
          </div>

          <div className="mb4">
            <Input
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleItemChange(
                  index,
                  'quantity',
                  parseInt(e.target.value, 10)
                )
              }
              required
            />
          </div>

          <div className="mb4">
            <Dropdown
              label="Condition"
              options={ITEM_CONDITIONS}
              value={item.condition}
              onChange={(_, value) =>
                handleItemChange(index, 'condition', value)
              }
              required
            />
          </div>

          <div className="mb4">
            <Dropdown
              label="Return Reason"
              options={RETURN_REASONS}
              value={item.returnReason.reason}
              onChange={(_, value) =>
                handleReasonChange(index, 'reason', value)
              }
              required
            />
          </div>

          {item.returnReason.reason === 'other' && (
            <div className="mb4">
              <Input
                label="Other Reason"
                value={item.returnReason.otherReason || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleReasonChange(index, 'otherReason', e.target.value)
                }
                required
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
