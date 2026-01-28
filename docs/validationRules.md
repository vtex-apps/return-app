# Validation Rules

This document describes all validation rules for creating and processing Adjustment Notes and Return Requests.

## Table of Contents

- [Adjustment Note Creation](#adjustment-note-creation)
- [Adjustment Note Refund](#adjustment-note-refund)
- [Return Request Creation](#return-request-creation)
- [Return Request Refund](#return-request-refund)

---

## Validation Summary

This document covers validation rules for four distinct steps in the return and refund process. Each step validates different aspects to ensure data integrity and prevent invalid operations:

### 1. Adjustment Note Creation

Validates that adjustment notes can be created without exceeding available refund amounts. When item-level data is provided, validates both quantity availability and amount limits per item, accounting for pending adjustment notes that haven't been refunded yet. When item-level data is absent, validates the total amount against the aggregate available refund amount across all order items.

### 2. Adjustment Note Refund

Validates that an adjustment note can transition to `refunded` status without causing double-refunding. Recalculates available amounts at refund time and ensures the refund amounts don't exceed what's available. For `DeliveryFee` refunds, allows total amount validation; for other types, requires item-level validation.

### 3. Return Request Creation

Validates that all items in a return request are available to be returned by checking quantity availability. Ensures items aren't excluded (e.g., in excluded categories) and that requested quantities don't exceed available quantities after accounting for previously processed returns.

### 4. Return Request Refund

Validates that refund amounts in `refundData` don't exceed available refund amounts when transitioning a return request to `amountRefunded` status. Requires item-level refund data and recalculates available amounts at refund time to prevent double-refunding. Accounts for restock fees in refund calculations.

### Common Validation Principles

- **Real-time Calculation**: Available amounts and quantities are recalculated at validation time using `orderDataStatsService`, ensuring validation reflects the current state of all returns and adjustments.
- **Status Exclusions**: Cancelled and denied return requests are excluded from availability calculations, while only `amountRefunded` return requests and `refunded`/`charged` adjustment notes count toward refunded amounts.
- **Item-level vs Total**: Most validations require item-level data for precision, except `DeliveryFee` adjustment notes which will use delivery fee amount validation.

---

## Adjustment Note Creation

### Amount Validation

The validation behavior depends on whether `additionalInfo` contains item-level data:

#### When `additionalInfo` is NOT provided or doesn't contain items:

- Validates that the total `requestAmount` doesn't exceed the total `amountAvailableForRefund` across all order items
- Uses `orderDataStatsService` to calculate available amounts based on:
  - Previous return requests (excluding cancelled and denied)
  - Previous adjustment notes with status `refunded` or `charged`
  - Order line item values

#### When `additionalInfo` contains item-level data:

For each item in `additionalInfo.items`:

1. **Amount Validation**

   - `amount` must be a number
   - `amount` must be >= 0

2. **Quantity Available Validation**

   - `quantityAvailableForReturn` must be > 0 for the item
   - **Error**: `"Cannot create adjustment note for item {orderItemIndex}: no items available for return"`

3. **Amount Available Validation**
   - `amount` must be <= `(amountAvailableForRefund - amountToRefund)` for the item
   - Accounts for pending adjustment notes that have been created but not yet refunded (`amountToRefund`)
   - **Error**: `"Amount to refund for item {orderItemIndex} ({amount}) exceeds available amount ({effectiveAmountAvailable}). Already pending: {amountToRefund}, Total available: {amountAvailableForRefund}"`

### Notes

- The `orderDataStatsService` calculates `amountAvailableForReturn` by:
  - Starting with the full line value (unitPrice \* quantity) for each order item
  - Subtracting amounts already refunded through return requests (using `refundData.items`)
  - Subtracting amounts already refunded through adjustment notes (with status `refunded` or `charged`)
  - Only considering return requests that are NOT cancelled and NOT denied
- When validating new adjustment notes, the system accounts for pending adjustment notes (`amountToRefund`) that have been created but not yet refunded. This ensures that the sum of all pending and new adjustment notes doesn't exceed the available refund amount.

---

## Adjustment Note Refund

### When Validation Applies

- Validation only runs when updating an adjustment note status to `refunded`
- Only applies to `creditNote` type (debit notes use `charged` status)

### Validation Rules

The validation behavior depends on whether `additionalInfo` contains item-level data:

#### When `additionalInfo` is NOT provided:

- **Requires `refundType === 'DeliveryFee'`** to proceed with validation
- If `refundType !== 'DeliveryFee'`: **Error**: `"Missing additionalInfo. Cannot validate refund without item-level data unless refundType is DeliveryFee."`
- If `refundType === 'DeliveryFee'`: Validates that the total `requestAmount` doesn't exceed the total `amountAvailableForRefund` across all order items

#### When `additionalInfo` is provided but doesn't contain `items`:

- **Requires `refundType === 'DeliveryFee'`** to proceed with validation
- If `refundType !== 'DeliveryFee'`: **Error**: `"Missing items in additionalInfo. Cannot validate refund without item-level data unless refundType is DeliveryFee."`
- If `refundType === 'DeliveryFee'`: Validates that the total `requestAmount` doesn't exceed the total `amountAvailableForRefund` across all order items

#### When `additionalInfo` contains item-level data:

For each item in `additionalInfo.items`:

1. **Amount Validation**

   - Validates each item's amount against `amountAvailableForRefund`
   - Validates `quantityAvailableForReturn > 0` for each item

2. **Status Transition Validation**
   - Validates status transition is allowed (handled by `validateAdjustmentStatusUpdate`)
   - For credit notes: cannot transition to `charged` status
   - For debit notes: cannot transition to `refunded` status

### Notes

- The validation uses the current state of the adjustment note (including its `requestAmount`, `additionalInfo`, and `refundType`)
- It recalculates available amounts at the time of refund, ensuring no double-refunding occurs
- Item-level validation is required for all refund types except `DeliveryFee`, which can use total amount validation

---

## Return Request Creation

### Item Availability Validation

The `canReturnAllItems` function validates that all items in the return request are available to be returned.

#### Validation Process

1. **Calculate Available Quantities**

   The function uses `createOrdersToReturnSummary` to determine:

   - `invoicedItems`: Items that were invoiced and sent to the customer
   - `excludedItems`: Items in excluded categories (cannot be returned)
   - `processedItems`: Items already committed to return or already returned

2. **Build Availability Maps**

   - Creates an `excludedItemsIndexMap` mapping item indices to exclusion status
   - Creates a `processedItemsQuantityIndexMap` mapping item indices to processed quantities
   - Calculates available quantity for each item:
     - If item is excluded: `quantityAvailable = 0`
     - Otherwise: `quantityAvailable = invoicedQuantity - processedQuantity`

3. **Validate Requested Items**

   For each item in the return request (`itemsToReturn`):

   - Checks if `quantityAvailable` exists and is >= requested `quantity`
   - **Error**: If item is not available or quantity requested exceeds available:
     - `"Items with index {orderItemIndex1}, {orderItemIndex2}, ... are not available to be returned"`
     - Status code: `400`

#### Notes

- Uses `orderItemIndex` from the return request items to match against available quantities
- Only considers return requests that are NOT cancelled and NOT denied when calculating processed quantities
- Items in excluded categories (configured via `excludedCategories` setting) are always unavailable
- The validation ensures no item can be returned more times than its available quantity

---

## Return Request Refund

### When Validation Applies

- Validation only runs when updating a return request status to `amountRefunded`
- Validates the refund amounts in `refundData` against available amounts at the time of refund

### Validation Rules

The validation behavior depends on whether `refundData` contains item-level data:

#### When `refundData.items` is NOT provided or is empty:

- **Error**: `"Missing refundData.items. Cannot validate refund without item-level refund data."`
- Validation fails immediately

#### When `refundData.items` contains item-level data:

For each item in `refundData.items`:

1. **Amount Available Validation**

   - Calculates refund amount: `refundAmount = price * quantity - restockFee`
   - `refundAmount` must be <= `amountAvailableForRefund` for the item
   - **Error**: `"Amount to refund for item {orderItemIndex} ({refundAmount}) exceeds available amount ({amountAvailableForRefund})"`

   Note: Field validations (orderItemIndex, quantity, price, restockFee) are not performed here as they are already validated when `refundData` is created.

### Notes

- The validation uses the current state of the return request (including its `refundData`)
- It recalculates available amounts at the time of refund, ensuring no double-refunding occurs
- `quantityAvailableForReturn` is not validated because the current return request's items are already subtracted from available quantities when calculating stats, so checking it would incorrectly fail validation for the current return
- The `orderDataStatsService` calculates `amountAvailableForRefund` by:
  - Starting with the full line value (unitPrice \* quantity) for each order item
  - Subtracting amounts already refunded through return requests (using `refundData.items`)
  - Subtracting amounts already refunded through adjustment notes (with status `refunded` or `charged`)
  - Only considering return requests that are NOT cancelled and NOT denied
- The refund amount calculation accounts for restock fees: `(price * quantity) - restockFee`

---

## Common Concepts

### Amount Available for Refund Calculation

The `orderDataStatsService` calculates `amountAvailableForRefund` for each order item:

1. **Base Amount**: `(sellingPrice + tax) * quantity` for the order line item
2. **Refunded Amounts**: Sum of:
   - Amounts from return requests with status `amountRefunded` (using `refundData.items`)
   - Amounts from adjustment notes with status `refunded` or `charged` (from `additionalInfo.items`)
3. **Available Amount**: `max(0, baseAmount - refundedAmounts)`

### Quantity Available for Return Calculation

The `orderDataStatsService` calculates `quantityAvailableForReturn`:

1. **Base Quantity**: Original quantity from invoiced items
2. **Excluded Items**: Items in excluded categories are set to 0
3. **Processed Quantity**: Sum of quantities from:
   - Return requests (using `refundData.items` when available, otherwise `items`)
   - Excluding cancelled and denied requests
4. **Available Quantity**: `max(0, baseQuantity - processedQuantity)`

### Status Exclusions

When calculating available amounts/quantities:

- Return requests with status `cancelled` are excluded
- Return requests with status `denied` are excluded
- For `amountsReturned`: Only return requests with status `amountRefunded` are included (amounts from other statuses are excluded)
- For `itemsReturned`: Return requests that are not cancelled or denied are included (using `refundData.items` when available, otherwise `items`)
- Adjustment notes with status other than `refunded` or `charged` are excluded from amount calculations
