# Return App V3

## Description

The **Return App** gives merchants the option to allow customers to request a return for their items and it gives them the ability to manage the Return Request Process on their store.

## Features

### Store: Returns

A specific section under **My Account** on each store.
Here a customer will be able to visualize the history, status and details of their created returns. As well as creating a new **Return Request**.

### Admin: Return Request List

In this section of the merchant's admin, merchants are capable of visualizing and managing all the return requests created by their customers.

### Admin: Return Settings

In this section of the merchant's admin, merchants control what are the conditions of allowing the return process for a given item or items per customer.

- **Max Days**: when an order creation date is older than the Max Days to return, user won't be able to select that order for a return
- **Terms and Conditions**: link to the Terms and conditions offered by the store. (not provided by the app)
- **Excluded categories**: List of categories to be excluded for the return process. Any item that belongs to any of these categories, will not be allowed to be returned. The store user will see a message stating that that item is not allowed to be returned.
- **Return Payment Options**:

  -- Same as Order: Payment will be refunded to the same payment method used in the order.
  -- Automatically refund requests - Automatically refund any payment method when the configuration to refund is set to be same as order.

  -- Allowed to choose: customer will select any of the refund options selected by the store.
  **Disclaimer**: Requests that were set to refund via credit card trigger the automatic refund.

**Disclaimer**: For the cases that the return app creates a refund, the return invoice ([invoice type input](https://developers.vtex.com/vtex-rest-api/reference/invoicenotification)) will be created in the OMS with the return request id as the invoice number.

- **Custom Return Reasons**: Allows the store to define their own custom return reasons. This setting will overwrite the default reasons.
  The custom Return Reasons can be translated manually by the admin.
  |Default return reason|
  |---------|
  |Accidental Order|
  |Better Price|
  |Performance|
  |Incompatible|
  |Item Damaged|
  |Missed Delivery|
  |Missing Parts|
  |Box Damaged|
  |Different Product|
  |Defective|
  |Arrived in addition|
  |No Longer Needed|
  |Unauthorized purchase|
  |Different from website|

- **Other Option**: toggle this to include a generic other return request reason. The store user can input any generic value if this one is chosen.
- **Allow PickUp Points**: allow the customer to set a pick up point to drop off the items to return. It uses the geocoordinates from the order to find the closest pickup points.
- **Proportional shipping value**: the shipping value to be refunded per item will be automatically calculated based on the item value percentage of the total order value.
- **Item condition selector**: require the store user to select the condition of the items

### Transactional Emails

The app leverages the capabilites of VTEX Message Center to notify the customers when a return request is created and when the status of their return changes.

When creating a return request for the first time, the app creates a default template `oms-return-request-confirmation_{locale}` that is modifiable on the Message Center to suit each store needs.
the locale will be filled with the locale the store user had when browsing the store.

Additional to the confirmation template, on successful Return Request Status update, the app also creates a `oms-return-request-status-update_{locale}`.

Both templates will always be created in English, it is responsability of the store to translate them to the desired locale.

## Return Request Statuses

The Return App uses a status-based workflow to track the progress of return requests. Each status represents a specific stage in the return process.

### Available Statuses

- **`new`**: Initial status when a return request is first created
- **`processing`**: Return request is being processed by the merchant
- **`pickedUpFromClient`**: Items have been collected from the customer
- **`pendingVerification`**: Items are awaiting verification by staff
- **`packageVerified`**: Items have been verified and approved for refund
- **`amountRefunded`**: Refund has been processed and completed
- **`denied`**: Return request has been denied
- **`cancelled`**: Return request has been cancelled
- **`closed`**: Return request has been closed (final status after refund completion)

### Status Flow

The typical return request flow follows this sequence:

```
new → processing → pickedUpFromClient → pendingVerification → packageVerified → amountRefunded → closed
```

**Alternative paths:**

- At any point before `pendingVerification`, the request can be `denied` or `cancelled`
- After `pendingVerification`, the system automatically assigns either `packageVerified` or `denied` based on verification results
- The `closed` status is a terminal status that can only be reached from `amountRefunded`

### Status Transitions

Each status has specific allowed transitions:

- **`new`**: Can transition to `processing`, `denied`, or `cancelled`
- **`processing`**: Can transition to `pickedUpFromClient`, `denied`, or `cancelled`
- **`pickedUpFromClient`**: Can transition to `pendingVerification` or `denied`
- **`pendingVerification`**: System automatically assigns `packageVerified` or `denied`
- **`packageVerified`**: Can transition to `amountRefunded`
- **`amountRefunded`**: Can transition to `closed`
- **`denied`**: Terminal status (no further transitions)
- **`cancelled`**: Terminal status (no further transitions)
- **`closed`**: Terminal status (no further transitions)

## API

### GraphQL API

The Return App provides a comprehensive GraphQL API for managing return requests and adjustment notes. All GraphQL queries and mutations require authentication via session cookies or app credentials.

#### Authentication

GraphQL queries use the following authentication directives:

- `@withUserProfile`: Extracts user profile from session cookie and sets it in context
- `@auth`: Validates authentication via session cookie or app credentials

#### Return Request Schema

The return request schema includes the following fields:

**Core Fields:**

- `id`: Unique identifier for the return request
- `orderId`: ID of the order being returned
- `sequenceNumber`: Sequential number for the return request
- `status`: Current status of the return request
- `dateSubmitted`: Date when the return was submitted
- `refundableAmount`: Total amount that can be refunded

**Additional Fields:**

- `locationCode`: Location code for the return request
- `returnType`: Type of return (enum: `standardReturn`, `creditReturn`, `notDeliveryReturn`)
- `reasonCode`: Reason code for the return
- `originalPaymentMethod`: Original payment method used for the order
- `externalReference`: External reference for the return request

**Related Data:**

- `customerProfileData`: Customer information
- `pickupReturnData`: Pickup/return address information
- `refundPaymentData`: Refund payment method details
- `items`: Array of items being returned
- `refundData`: Refund processing information
- `refundStatusData`: Status history and comments

#### Return Request List Query

Query return requests with filtering and pagination:

```graphql
query getReturnRequestList($filter: ReturnRequestFilters, $page: Int!) {
  returnRequestList(filter: $filter, page: $page) {
    list {
      id
      sequenceNumber
      createdIn
      status
      orderId
      externalReference
      returnType
      reasonCode
      originalPaymentMethod
      refundData {
        invoiceNumber
        invoiceValue
      }
      items {
        id
        imageUrl
      }
    }
    paging {
      total
      pages
      currentPage
      perPage
    }
  }
}
```

**Available Filters:**

- `status`: Filter by return request status
- `sequenceNumber`: Filter by sequence number
- `id`: Filter by return request ID
- `createdIn`: Filter by date range
- `orderId`: Filter by order ID
- `userId`: Filter by user ID (admin only)
- `userEmail`: Filter by user email (admin only)
- `returnType`: Filter by return type
- `reasonCode`: Filter by reason code
- `originalPaymentMethod`: Filter by original payment method
- `externalReference`: Filter by external reference
- `locationCode`: Filter by location code

#### Create Return Request Mutation

Create a new return request:

```graphql
mutation createReturnRequest($returnRequest: ReturnRequestInput!) {
  createReturnRequest(returnRequest: $returnRequest) {
    id
    sequenceNumber
  }
}
```

**Input Fields:**

- `orderId`: Order ID (required)
- `items`: Array of items to return (required)
- `customerProfileData`: Customer information (required)
- `pickupReturnData`: Pickup/return address (required)
- `refundPaymentData`: Refund payment method (required)
- `locale`: Locale for the request (required)
- `userComment`: User comment (optional)
- `additionalInfo`: Additional information (optional)
- `financialStatus`: Financial status (optional)
- `locationCode`: Location code (optional)
- `returnType`: Return type (optional)
- `reasonCode`: Reason code (optional)
- `originalPaymentMethod`: Original payment method (optional)

#### Adjustment Note List Query

Query adjustment notes with filtering and pagination:

```graphql
query getAdjustmentNoteList($filter: AdjustmentNoteFilters, $page: Int!) {
  adjustmentNoteList(filter: $filter, page: $page) {
    list {
      id
      orderId
      requestAmount
      sequenceNumber
      createdIn
      status
      dateSubmitted
      reasonCode
      locationCode
      originalPaymentMethod
      customerProfileData {
        name
        email
        phoneNumber
      }
      paymentData {
        paymentMethod
      }
    }
    paging {
      total
      pages
      currentPage
      perPage
    }
  }
}
```

**Available Filters:**

- `status`: Filter by adjustment note status
- `sequenceNumber`: Filter by sequence number
- `id`: Filter by adjustment note ID
- `createdIn`: Filter by date range
- `orderId`: Filter by order ID
- `userId`: Filter by user ID (admin only)
- `userEmail`: Filter by user email (admin only)
- `reasonCode`: Filter by reason code
- `locationCode`: Filter by location code
- `originalPaymentMethod`: Filter by original payment method

#### Create Adjustment Note Mutation

Create a new adjustment note:

```graphql
mutation createAdjustmentNote($adjustmentNote: AdjustmentNoteInput!) {
  createAdjustmentNote(adjustmentNote: $adjustmentNote) {
    adjustmentNoteId
  }
}
```

**Input Fields:**

- `orderId`: Order ID (required)
- `type`: Adjustment note type (required)
- `requestAmount`: Request amount (required)
- `customerProfileData`: Customer information (required)
- `paymentData`: Payment data (required)
- `locale`: Locale for the request (required)
- `userComment`: User comment (optional)
- `additionalInfo`: Additional information (optional)
- `financialStatus`: Financial status (optional)
- `reasonCode`: Reason code (optional)
- `locationCode`: Location code (optional)
- `originalPaymentMethod`: Original payment method (optional)

### Adjustment Notes

Adjustment Notes allow merchants to create credit or debit notes for orders, providing a way to handle financial adjustments outside of the standard return process. This feature is particularly useful for handling partial refunds, overcharges, or other financial corrections.

#### Adjustment Note Types

- **Credit Note**: Used to provide a credit/refund to the customer
- **Debit Note**: Used to charge additional amounts to the customer

#### Adjustment Note Statuses

- **pending**: Initial status when the adjustment note is created
- **authorized**: The adjustment has been approved by an admin
- **refunded**: The credit has been processed (for credit notes)
- **charged**: The debit has been processed (for debit notes)
- **denied**: The adjustment request has been rejected
- **cancelled**: The adjustment request has been cancelled

### Create Adjustment Note

To create an Adjustment Note make a POST request to the following endpoint:
`https://{accountName}.myvtex.com/_v/adjustment-note`
with an example body in the form of:

```
{
    "orderId": "1240221188059-01",
    "type": "creditNote",
    "requestAmount": 5000,
    "customerProfileData": {
        "name": "Filadelfo Braz",
        "email": "filadelfo.braz+test@gmail.com",
        "phoneNumber": "123432122"
    },
    "paymentData": {
        "paymentMethod": "sameAsPurchase"
    },
    "userComment": "This is a test adjustment note from API",
    "locale": "pt-PT",
    "additionalInfo": "Additional information for the adjustment note"
}
```

| Field                           | Description                                                    | isRequired |
| ------------------------------- | -------------------------------------------------------------- | ---------- |
| orderId                         | `string` orderId to where the Adjustment Note is being made to | true       |
| type                            | `enum` values: creditNote, debitNote                           | true       |
| requestAmount                   | `integer` amount to be adjusted (in cents)                     | true       |
| customerProfileData             | `object` with customer information                             | true       |
| customerProfileData name        | `string` Customer name for the adjustment note                 | true       |
| customerProfileData email       | `string` customer's email for the adjustment note              | true       |
| customerProfileData phoneNumber | `string` customer's phone number for the adjustment note       | true       |
| paymentData                     | `object` with payment information                              | true       |
| paymentData paymentMethod       | `enum` possible values: giftCard, sameAsPurchase               | true       |
| userComment                     | `string` comment to be added to the creation                   | false      |
| locale                          | `string` locale for the customer to visualize the adjustment   | true       |
| additionalInfo                  | `string` additional information for the adjustment note        | false      |
| financialStatus                 | `string` financial status for the adjustment note              | false      |
| reasonCode                      | `string` reason code for the adjustment note                   | false      |
| locationCode                    | `string` location code for the adjustment note                 | false      |
| originalPaymentMethod           | `string` original payment method used for the order            | false      |

A successful creation of an Adjustment Note should return a status 201 with a response in the form of:

```
{
    "adjustmentNoteId": "adjustmentNoteId"
}
```

### Update an Adjustment Note Status

Make a PUT request to the following endpoint:
`https://{accountName}.myvtex.com/_v/adjustment-note/{adjustmentId}`
with the following example body:

```
{
    "status": "authorized",
    "comment": {
        "value": "Adjustment approved by admin",
        "visibleForCustomer": true
    },
    "authorizationData": {
        "authorizedAmount": 5000
    }
}
```

For refunded status (credit notes only):

```
{
    "status": "refunded",
    "comment": {
        "value": "Refund processed successfully",
        "visibleForCustomer": true
    },
    "transactionData": {
        "invoiceValue": 5000
    }
}
```

| Field                              | Description                                                                       | isRequired |
| ---------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| status                             | `enum` possible values: pending, authorized, refunded, charged, denied, cancelled | true       |
| comment                            | `object` only required if not updating status                                     | false      |
| comment value                      | `string` only required if not updating status                                     | true       |
| comment visibleForCustomer         | `boolean` the comment will be shown to the customer. Default false                | false      |
| authorizationData                  | `object` only considered when status sent is `authorized`                         | false      |
| authorizationData authorizedAmount | `integer` amount authorized for the adjustment (in cents)                         | true       |
| transactionData                    | `object` only considered when status sent is `refunded` or `charged`              | false      |
| transactionData invoiceValue       | `integer` invoice value for the transaction (in cents)                            | true       |

To update the request to the next possible status, one just needs to pass a payload with the key status and the status as its value.
It's possible to send the comment payload with all the status. When sending the status `authorized` it's necessary to send the `authorizationData` object. When sending the status `refunded` or `charged` it's necessary to send the `transactionData` object.

**Add comments without updating status**
To add a comment to an adjustment note, one only needs to send the payload with status equals to the current one and pass the comment object.

### Retrieve an Adjustment Note

To get an Adjustment Note make a GET request to the following endpoint:
`https://{accountName}.myvtex.com/_v/adjustment-note/{adjustmentId}`

#### Example (Credit Note GET response)

```
{
  "id": "055a4c59-fdee-4d78-ad40-6bd0bc340ed1",
  "dataEntityId": "odp_return_app_adjustmentNote",
  "orderId": "1520340500774-01",
  "requestAmount": 100,
  "type": "creditNote",
  "createdBy": "1234567890",
  "status": "refunded",
  "customerProfileData": {
    "userId": "53fa1533-eea0-11ef-b37f-d8f903c0054a",
    "name": "John Doe",
    "email": "john.doe@vtex.com",
    "phoneNumber": "+13511234567"
  },
  "paymentData": {
    "paymentMethod": "sameAsPurchase",
    "automaticallyCreateTransaction": true
  },
  "authorizationData": {
    "authorizedAmount": 100
  },
  "transactionData": {
    "invoiceNumber": "CN-1",
    "invoiceValue": 100
  },
  "statusData": [
    {
      "status": "pending",
      "submittedBy": "User",
      "createdAt": "2025-10-02T06:37:50.347Z",
      "comments": [
        {
          "comment": "This is a test from API",
          "createdAt": "2025-10-02T06:37:50.347Z",
          "submittedBy": "User",
          "visibleForCustomer": true,
          "role": "storeUser"
        }
      ]
    },
    {
      "status": "authorized",
      "submittedBy": "User",
      "createdAt": "2025-10-02T06:42:56.195Z",
      "comments": [
        {
          "comment": "Test comment",
          "createdAt": "2025-10-02T06:42:56.195Z",
          "submittedBy": "User",
          "visibleForCustomer": false,
          "role": "adminUser"
        },
        {
          "comment": "Test comment",
          "createdAt": "2025-10-02T07:04:30.686Z",
          "submittedBy": "User",
          "visibleForCustomer": false,
          "role": "adminUser"
        }
      ]
    },
    {
      "status": "refunded",
      "submittedBy": "User",
      "createdAt": "2025-10-02T07:13:11.174Z",
      "comments": [
        {
          "comment": "Test comment refund",
          "createdAt": "2025-10-02T07:13:11.174Z",
          "submittedBy": "User",
          "visibleForCustomer": false,
          "role": "adminUser"
        }
      ]
    }
  ],
  "cultureInfoData": {
    "currencyCode": "USD",
    "locale": "en-US"
  },
  "dateSubmitted": "2025-10-02T06:37:50.347Z",
  "createdBy_USER": {
    "Id": "1234567890",
    "Login": "user@user.com",
    "Name": null
  },
  "createdIn": "2025-10-02T06:37:50.6112866Z",
  "lastInteractionBy": "1234567890",
  "lastInteractionBy_USER": {
    "Id": "8e23850e-c2b0-4745-873d-0bc2e38ab66f",
    "Login": "user@user.com",
    "Name": null
  },
  "lastInteractionIn": "2025-10-02T07:13:11.9857701Z",
  "tags": [],
  "dataInstanceId": "055a4c59-fdee-4d78-ad40-6bd0bc340ed1",
  "sequenceNumber": 1,
  "updatedBy": "1234567890",
  "updatedBy_USER": {
    "Id": "1234567890",
    "Login": "user@user.com",
    "Name": null
  },
  "updatedIn": "2025-10-02T07:13:11.9857693Z"
}
```

### Retrieve Adjustment Note List

To retrieve a List of Adjustment Notes make a GET request to the following endpoint:
`https://{accountName}.myvtex.com/_v/adjustment-note`
The search params available are:

**Basic Parameters:**

- \_page `integer`
- \_perPage `integer`
- \_status `enum`
- \_sequenceNumber `string`
- \_id `string`
- \_dateSubmitted `string` e.g: \_dateSubmitted=2022-06-12,2022-07-13
- \_orderId `string`
- \_userEmail `string`

**Additional Filter Parameters:**

- \_reasonCode `string` - Filter by reason code
- \_locationCode `string` - Filter by location code
- \_originalPaymentMethod `string` - Filter by original payment method

**Additional Parameters:**

- \_allFields `string` (any truthy value) - By default, the requests will only have a summary of the adjustment note. If you want to get all the fields for the adjustment notes, you can pass this parameter.

**Example Request:**

```
GET https://{accountName}.myvtex.com/_v/adjustment-note?_page=1&_perPage=25&_reasonCode=DEFECTIVE&_locationCode=NYC001&_originalPaymentMethod=credit_card
```

### Update Adjustment Note Additional Info

To update additional information for an Adjustment Note make a PUT request to the following endpoint:
`https://{accountName}.myvtex.com/_v/adjustment-note/{adjustmentId}/additional-info`
with the following example body:

```
{
    "additionalInfo": "Updated additional information",
    "externalReference": "EXT-REF-123"
}
```

| Field             | Description                                             | isRequired |
| ----------------- | ------------------------------------------------------- | ---------- |
| additionalInfo    | `string` additional information for the adjustment note | true       |
| externalReference | `string` external reference for the adjustment note     | false      |

### Get Adjustment Note Additional Info

To retrieve additional information for an Adjustment Note make a GET request to the following endpoint:
`https://{accountName}.myvtex.com/_v/adjustment-note/{adjustmentId}/additional-info`

This endpoint returns the parsed JSON from the additionalInfo field.

### Create Return Request

To create a Return Request make a POST request to the following endpoint:
`https://{accountName}.myvtex.com/_v/return-request`
with an example body in the form of:

```
{
    "items": [{
        "orderItemIndex": 0,
        "quantity": 1,
        "returnReason": {
            "reason": "Wrong type"
        },
        "condition": "newWithBox"
    }],
    "orderId": "1240221188059-01",
    "refundPaymentData": {
        "refundPaymentMethod": "sameAsPurchase"
    },
    "pickupReturnData": {
        "addressId":"",
        "addressType": "CUSTOMER_ADDRESS",
        "address": "Rua Haddock Lobo",
        "city": "São Paulo",
        "state": "SP",
        "country": "Br",
        "zipCode": "01403003"
    },
    "customerProfileData": {
        "name": "Filadelfo Braz",
        "email": "filadelfo.braz+test@gmail.com",
        "phoneNumber": "123432122"
    },
    "userComment": "This is a test from API",
    "locale": "pt-PT",
    "additionalInfo": "Additional information for the return request"
}
```

| Field                                 | Description                                                            | isRequired |
| ------------------------------------- | ---------------------------------------------------------------------- | ---------- |
| orderId                               | `string` orderId to where the Return Request is being made to          | true       |
| items                                 | array of individual itemObject to be returned                          | true       |
| items orderItemIndex                  | `integer` Index of the item in the Order object form the OMS           | true       |
| items quantity                        | `integer` number to be returned for the given `orderItemIndex`         | true       |
| items condition                       | `enum` values: newWithBox, newWithoutBox, usedWithBox, usedWithoutBox  | false      |
| items returnReason                    | `object` with reason to return the item                                | true       |
| items returnReason reason             | `string` reason to return                                              | true       |
| items returnReason otherReason        | `string` Description of the reason when it is `otherReason`            | false      |
| customerProfileData                   | `object` with customer information                                     | true       |
| customerProfileData name              | `string` Customer name for the return request                          | true       |
| customerProfileData email             | `string` customer's email for the return request                       | true       |
| customerProfileData phoneNumber       | `string` customer's phone number for the return request                | true       |
| pickupReturnData                      | `object` with information where the items should be picked up          | true       |
| pickupReturnData addressId            | `string` id of the customer's address can be empty string              | true       |
| pickupReturnData address              | `string`customer address                                               | true       |
| pickupReturnData city                 | `string` city of the address                                           | true       |
| pickupReturnData country              | `string` country of the address                                        | true       |
| pickupReturnData zipCode              | `string` postal code of the address                                    | true       |
| pickupReturnData addressType          | `enum` possible values: PICKUP_POINT, CUSTOMER_ADDRESS                 | true       |
| refundPaymentData                     | `object` with refund information                                       | true       |
| refundPaymentData refundPaymentMethod | `enum` possible values: bank, card, giftCard, sameAsPurchase           | true       |
| refundPaymentData iban                | `string`required when refundPaymentMethod is set as bank               | false      |
| refundPaymentData accountHolderName   | `string` required when refundPaymentMethod is set as bank              | false      |
| userComment                           | `string` comment to be added to the creation                           | false      |
| locale                                | `string` locale for the customer to visualize the return               | true       |
| additionalInfo                        | `string` additional information for the return request                 | false      |
| locationCode                          | `string` location code for the return request                          | false      |
| returnType                            | `enum` type of return: standardReturn, creditReturn, notDeliveryReturn | false      |
| reasonCode                            | `string` reason code for the return                                    | false      |
| originalPaymentMethod                 | `string` original payment method used for the order                    | false      |

A successful creation of a Return Request should return a status 201 with a response in the form of:

```
{
    "requestId": "requestId"
}
```

### Update a Return Request Status

Make a PUT request to the following endpoint:
`https://{accountName}.myvtex.com/_v/return-request/{requestId}`
with the following example body:

```
{
    "status":"packageVerified",
    "comment":{
        "value":"Test comment",
        "visibleForCustomer": false
    },
    "refundData":{
        "items":[{
            "orderItemIndex":0,
            "quantity":1,
            "restockFee":12
        }],
        "refundedShippingValue":1
    }
}
```

| Field                              | Description                                                                                                                                 | isRequired |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| status                             | `enum` possible values: new, processing, pickedUpFromClient,pendingVerification, packageVerified, amountRefunded, denied, cancelled, closed | true       |
| comment                            | `object` only required if not updating status                                                                                               | false      |
| comment value                      | `string` only required if not updating status                                                                                               | true       |
| comment visibleForCustomer         | `boolean` the comment will be shown to the customer. Default false                                                                          | false      |
| refundData                         | `object` only considered when status sent is `packagedVerified`                                                                             | false      |
| refundData items                   | `array` of `objects` with items approved to be returned                                                                                     | true       |
| refundData items orderItemIndex    | `integer`Index of the item in the Order object form the OMS                                                                                 | true       |
| refundData items quantity          | `integer` number to be returned for the given `orderItemIndex`                                                                              | true       |
| refundData items restockFee        | `integer` discount to be applied to the amount to be refunded, can be zero                                                                  | true       |
| refundData refundedShippingValue   | `integer` shipping amount to be refunded, can be zero                                                                                       | true       |
| refundData refundedAdditionalValue | `integer` additional amount to be refunded, can be zero                                                                                     | true       |

To update the request to the next possible status, one just needs to pass a payload with the key status and the status as its value.
It's possible to send the comment payload with all the status. When sending the status packageVerified it's necessary to send the refundData object.

The request can be denied up to the pickedUpFromClient status. After that, it's only possible to deny a request by passing quantity zero to all items when sending the status packageVerified.

When sending the status packageVerified, the next status will be automatically set to packageVerified or denied based on the information inside refundData.items.

When sending the status amountRefunded, the app will refund the payment method when the store user paid the order using credit card, and has selected to be refunded via credit card or the store forces refunds in the same method as the purchase.

**Add comments without updating status**
To add a comment to a request, ones only needs to send the payload with status equals to the current one and pass the comment object.

### Retrieve a Return Request

To get a Return Request make a GET request to the following endpoint:
`https://{accountName}.myvtex.com/_v/return-request/{requestId}`

### Retrieve Return Request List

To retrieve a List of Return Requests make a GET request to the following endpoint:
`https://{accountName}.myvtex.com/_v/return-request`
The search params available are:

**Basic Parameters:**

- \_page `integer`
- \_perPage `integer`
- \_status `enum`
- \_sequenceNumber `string`
- \_id `string`
- \_dateSubmitted `string` e.g: \_dateSubmitted=2022-06-12,2022-07-13
- \_orderId `string`
- \_userEmail `string`

**Additional Filter Parameters:**

- \_returnType `enum` - Filter by return type (standardReturn, creditReturn, notDeliveryReturn)
- \_reasonCode `string` - Filter by reason code
- \_originalPaymentMethod `string` - Filter by original payment method
- \_externalReference `string` - Filter by external reference
- \_locationCode `string` - Filter by location code

**Additional Parameters:**

- \_allFields `string` (any truthy value) - By default, the requests will only have a summary of the request. If you want to get all the fields for the requests, you can pass this parameter.

**Example Request:**

```
GET https://{accountName}.myvtex.com/_v/return-request?_page=1&_perPage=25&_returnType=standardReturn&_reasonCode=DEFECTIVE&_locationCode=NYC001
```

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles COMMON                   |
| ------------------------------------ |
| 'contactDetailsCommonContainer'      |
| 'currentRequestStatusContainer'      |
| 'itemDetailsListContainer'           |
| 'itemVerificationDeniedContainer'    |
| 'itemVerificationApprovedContainer'  |
| 'itemVerificationPartiallyContainer' |
| 'itemVerificationNewContainer'       |
| 'commonPickupContainer'              |
| 'refundMethodDetailContainer'        |
| 'approvedValuesContainer'            |
| 'requestedValuesContainer'           |
| 'returnValuesContainer'              |
| 'totalContainer'                     |
| 'totalWrapperContainer'              |
| 'statusHistoryContainer'             |
| 'jumpToPageContainer'                |
| 'listTableContainer'                 |
| 'listTableFilterContainer'           |
| 'mobileReturnListContainer'          |
| 'controlGridVisibility'              |
| 'controlGridVisibilityButtons'       |
| 'emptyList'                          |
| 'returnList'                         |
| 'returnListSingle'                   |
| 'returnListDouble'                   |
| 'returnListItem'                     |
| 'returnListItemHeader'               |
| 'returnListItemImage'                |
| 'returnListItemInfo'                 |
| 'returnListItemInfoDate'             |
| 'returnListItemInfoIdContainer'      |
| 'returnListItemInfoStatus'           |

| CSS Handles STORE                  |
| ---------------------------------- |
| 'contactPickupContainer'           |
| 'addressContainer'                 |
| 'addressHeaderWrapper'             |
| 'pickupAddressTitle'               |
| 'tooltipToggleWrapper'             |
| 'addressInputContainer'            |
| 'cityInputContainer'               |
| 'stateInputContainer'              |
| 'zipCodeInputContainer'            |
| 'countryInputContainer'            |
| 'submitDetailsContainer'           |
| 'contactAddressWrapper'            |
| 'paymentCommentWrapper'            |
| 'confirmationActionsContainer'     |
| 'backButtonWrapper'                |
| 'submitButtonWrapper'              |
| 'confirmContactContainer'          |
| 'confirmContactTitle'              |
| 'confirmContactText'               |
| 'confirmPaymentContainer'          |
| 'confirmPaymentTitle'              |
| 'accountHolderWrapper'             |
| 'ibanWrapper'                      |
| 'accountHolderText'                |
| 'confirmPaymentValue'              |
| 'ibanText'                         |
| 'refundPaymentText'                |
| 'confirmPickupContainer'           |
| 'confirmPickupTitle'               |
| 'confirmPickupText'                |
| 'contactDetailsContainer'          |
| 'contactDetailsTitle'              |
| 'contactNameInputWrapper'          |
| 'contactEmailInputWrapper'         |
| 'contactPhoneInputWrapper'         |
| 'detailsRowContainer'              |
| 'detailsTdWrapper'                 |
| 'productSectionWrapper'            |
| 'productText'                      |
| 'productImageWrapper'              |
| 'productImage'                     |
| 'itemsDetailText'                  |
| 'itemsListContainer'               |
| 'itemsListTheadWrapper'            |
| 'paymentMethodContainer'           |
| 'paymentBankWrapper'               |
| 'pickupPointContainer'             |
| 'conditionDropdwonContainer'       |
| 'otherReasonOptionContainer'       |
| 'returnDetailsContainer'           |
| 'orderIdDetailsWrapper'            |
| 'creationDateDetailsWrapper'       |
| 'returnInfoTableContainer'         |
| 'returnInfoTheadContainer'         |
| 'returnInfoTableText'              |
| 'returnInfoBodyContainer'          |
| 'itemsListTheadWrapper'            |
| 'paymentMethodContainer'           |
| 'paymentBankWrapper'               |
| 'pickupPointContainer'             |
| 'conditionDropdwonContainer'       |
| 'otherReasonOptionContainer'       |
| 'returnDetailsContainer'           |
| 'orderIdDetailsWrapper'            |
| 'creationDateDetailsWrapper'       |
| 'returnInfoTableContainer'         |
| 'returnInfoTheadContainer'         |
| 'returnInfoTableText'              |
| 'returnInfoBodyContainer'          |
| 'returnInfoTrBodyWrapper'          |
| 'returnInfoBodyImgWrapper'         |
| 'returnInfoReasonConditionWrapper' |
| 'termsAndConditionsContainer'      |
| 'termsAndConditionsLink'           |
| 'userCommentDetailsContainer'      |
| 'cardItemsWrapper'                 |
| 'itemDetailsListWrapper'           |
| 'cardWrapper'                      |
| 'statusWrapper'                    |
| 'productImageWrapper'              |
| 'productImage'                     |
| 'productDetailsWrapper'            |
| 'productNameWrapper'               |
| 'productName'                      |
| 'productRefWrapper'                |
| 'productReasonWrapper'             |
| 'productConditionWrapper'          |
| 'productSellerWrapper'             |
| 'productQuantityWrapper'           |
| 'productSellingPriceWrapper'       |
| 'productTaxWrapper'                |
| 'productTotalWrapper'              |
| 'productKey'                       |
| 'productValue'                     |
| 'productText'                      |
| 'quantityWrapper'                  |
| 'quantityKey'                      |
| 'quantityValue'                    |
| 'availableToReturnWrapper'         |
| 'availableToReturnKey'             |
| 'availableToReturnValue'           |
| 'quantitySelectorWrapper'          |
| 'reasonWrapper'                    |
| 'conditionWrapper'                 |
| 'highlightedFormMessage'           |

## Known issues

- When a store has a process to create return invoices ([invoice type input](https://developers.vtex.com/vtex-rest-api/reference/invoicenotification)) outside the return app, the app will consider those items and they will not be able to be returned via the app. However when an item is already committed in a return request and an invoice is created considering that item with a invoice number different than the return request id, there will be more processed items to return then invoices items - It can be seen using the query `orderToReturnSummary` on GraphQL.

- When installing the app in a workspace - or creating a new one - the app will not behavior as expected. This is due to the masterdata builder not creating a schema for that workspace automatically. To fix that, one can just link the app in the workspace using the toolbelt. Doing so, there will be a new masterdata schema related to that workspace and the app should work fine.

---
