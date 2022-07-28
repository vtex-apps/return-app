# Return App V3 <sup>BETA</sup>

Return app v3 is still in BETA. Docs are WIP.

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
- **Allow PickUp Points**: allow the customer to set a pick up point to drop off the items to return. 
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
|orderId|orderId to where the Return Request is being made to|true|
|items|array of individual itemObject to be returned|true|
|orderItemIndex|`integer`Index of the item in the Order object form the OMS|true|
|quantity|`integer` number to be returned for the given `orderItemIndex`|true|
|condition|`enum` values: newWithBox, newWithoutBox, usedWithBox,usedWithoutBox|true|



---
Documentation for v2 [here](https://github.com/vtex-apps/return-app/tree/v2).

v3 consists on a major change from v2, please do not refer to v2 documents for v3. 
