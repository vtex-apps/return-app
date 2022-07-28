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
    |Default return reason| |
    |---------| |
    |Accidental Order|Arrived in addition|
    |Better Price|No Longer Needed|
    |Performance|Unauthorized purchase|
    |Incompatible|Different from website|
    |Item Damaged|
    |Missed Delivery|
    |Missing Parts|
    |Box Damaged|
    |Different Product|
    |Defective|


---
Documentation for v2 [here](https://github.com/vtex-apps/return-app/tree/v2).

v3 consists on a major change from v2, please do not refer to v2 documents for v3. 
