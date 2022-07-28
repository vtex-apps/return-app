# Return App V3 <sup>BETA</sup>

Return app v3 is still in BETA. v2 will no longer be supported so please do not install it. 
 Docs are WIP.

## Description

The **Return App** gives merchants the ability to manage the Return Request Process on their store. 

## Features

### Admin Return Request List
In this section of the merchant's admin, merchants are capable of visualizing and managing all the return requests created by their customers. 
### Admin Return Settings
In this section of the merchant's admin, merchants control what are the conditions of allowing the return process for a given item or items per customer. 
- **Max Days**: when an order creation date is older than the Max Days to return, user won't be able to select that order for a return
- **Terms and Conditions**: link to the Terms and conditions offered by the store. (not provided by the app)
- **Excluded categories**: List of categories to be excluded for the return process. Any item that belongs to any of these categories, will not be allowed to be returned.
- **Return Payment Options**: 

  -- Same as Order: Payment will be refunded to the same payment method used in the order. 

  -- Allowed to choose: customer will select any of the refund options selected by the store. 
      **Disclaimer**: Only Credit Card triggers the automatic refund. **WIP: automatic refund for any payment method. **
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

- **Other Option**: toggle this to include a generic other return request reason
- **Allow PickUp Points**: allow the customer to set a pick up point to drop off the items to return. It uses the geocoordinates from the order to find the closest pickup points.
- **Proportional shipping value**: the shipping value to be refunded per item will be automatically calculated based on the item weight on the total order value. 

### Transactional Emails
The app leverages the capabilites of VTEX Message Center to notify the customers when a return request is created and when the status of their return changes. 

The app creates a default template `oms-return-request-confirmation` that is modifiable on the Message Center to suit each store needs. 

Additional to this template, in the case there are secondary languages on the account, a new template is created per locale based on the `cultureInfoData` to provide customers the ability to internationalize their templates. 

Each new template will include the locale appendend to the default template title for example: `oms-return-request-confirmation-en-GB`. 


## API
### Create Return Request

To create a Return Request make a POST request to the following endpoint:
`https://{accountName}.myvtex.com/return-request`
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
        "addressId:"",
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
    "locale": "pt-PT"
}
```

|Field | Description | isRequired |
|-----| ------|------|
|orderId|`string`orderId to where the Return Request is being made to|true|
|items|array of individual itemObject to be returned|true|
|orderItemIndex|`integer`Index of the item in the Order object form the OMS|true|
|quantity|`integer` number to be returned for the given `orderItemIndex`|true|
|condition|`enum` values: newWithBox, newWithoutBox, usedWithBox,usedWithoutBox|true|
|name|`string`Customer name for the return request|true|
|email|`string`customer's email for the return request|true|
|phoneNumber|`string` customer's phone number for the return request|true|
|addressId|`string` id of the customer's address can be empty string|true|
|address|`string`customer address|true|
|city|`string` city of the address|true|
|country|`string` country of the address|true|
|zipCode|`string` postal code of the address|true|
|addressType|`enum` possible values: PICKUP_POINT, CUSTOMER_ADDRESS|true|
|refundPaymentMethod|`enum` possible values: bank, card, giftCard, sameAsPurchase|true|
|iban|`string`required when refundPaymentMethod is set as bank|false|
|accountHolderName|`string` required when refundPaymentMethod is set as bank|false|
|userComment|`string` comment to be added to the creation|false|
|locale|`string` locale for the customer to visualize the return|true|

A successful creation of a Return Request should return a status 200 with a response in the form of:
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
    "status":"processing",
    "comment":{
        "value":"Test comment",
        "visibleForCustomer": false
    "refundData":{
        "items":[{
            "orderItemIndex":0,
            "quantity":1,
            "restockFee":12,
        }]
        "refundedShippingValue":1
    }
    }
}
```

|Field|Description|isRequired|
|----|----|----|
|status|`enum` possible values: new, processing, pickedUpFromClient,pendingVerification, packageVerified, amountRefunded, denied|true|
|comment value|`string` only required if not updating status|false|
|comment visibleForCustomer|`boolean` the comment will be shown to the customer. Default false|false|
|orderItemIndex|`integer`Index of the item in the Order object form the OMS|true|
|quantity|`integer` number to be returned for the given `orderItemIndex`|true|
|restockFee|`integer` discount to be applied to the amount to be refunded, can be zero|true|
|refundedShippingValue|`integer` shipping amount to be refunded, can be zero|true|

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

The search params available are:

- _page `integer`
- _status `enum`
- _sequenceNumber `string`
- _id `string`
- _createdIn `string` e.g: _createdIn=2022-06-12,2022-07-13
- _orderId `string`
- _userEmail `string`

By default, the requests will only have a summary of the request. If you want to get all the fields for the requests, you can pass another search param:

- _allFields `string` (any truthy value)


### Retrieve Return Request List
To retrieve a List of Return Requests make a GET request to the following endpoint:
`https://{accountName}.myvtex.com/_v/return-request`

## CSS handles

---
Documentation for v2 [here](https://github.com/vtex-apps/return-app/tree/v2).

v3 consists on a major change from v2, please do not refer to v2 documents for v3. 
