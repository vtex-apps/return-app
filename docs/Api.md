### Return App - API

#### Get requests list
![Generic badge](https://img.shields.io/badge/GET-green.svg)  `https://{accountName}.{environment}.com.br/no-cache/no-cache/returns/api/get-requests`  

*Url Parameters:*

| Param | Type | Required | Default | Values |
| --- | --- |--- | --- | --- |
|page|number|no|1| |
|limit|number|no|10| |
|status|string|no|-| `New`/<br>`Picked up from client`/<br>`Pending verification`/<br>`Approved`/<br>`Partially approved`/<br>`Denied`/<br>`Refunded` |
|dateStart|date YYYY-MM-DD|no|-| |
|dateEnd|date YYYY-MM-DD|no|-| |

#####Response body example:
```
[
    {
        "id": "request_id_1",
        "orderId": "1000000000000-01",
        "totalPrice": 9400,
        "refundedAmount": 0,
        "status": "New",
        "dateSubmitted": "2021-05-07T10:02:06.983Z",
        "customerInfo": {
            "name": "Customer Name",
            "email": "customer_email@domain.com",
            "phoneNumber": "0720000000",
            "country": "Romania",
            "locality": "Constanta",
            "address": "Str. mea 1, bl.1, sc.2, ap.3"
        },
        "paymentInfo": {
            "paymentMethod": "giftCard",
            "iban": "",
            "giftCardCode": "",
            "giftCardId": ""
        },
        "products": [
            {
                "image": "Product image url",
                "refId": "sku reference code",
                "skuId": "sku id",
                "brandName": "",
                "brandId": "",
                "manufacturerCode": "",
                "productId": "product id",
                "name": "Product Name",
                "unitPrice": 3000,
                "quantity": 2,
                "totalPrice": 6000,
                "goodProducts": 0,
                "reasonCode": "reasonBetterPrice",
                "reasonText": "",
                "status": "New"
            }
        ],
        "statusHistory": [
            {
                "status": "New",
                "dateSubmitted": "2021-05-07T10:02:07.432Z",
                "submittedBy": "Submitted by name"
            }
        ],
        "comments": []
    },
    {
        "id": "request_id_2",
        "orderId": "1000000000001-01",
        "totalPrice": 1000,
        "refundedAmount": 0,
        "status": "Pending verification",
        "dateSubmitted": "2021-05-07T10:02:06.983Z",
        "customerInfo": {
            "name": "Customer Name",
            "email": "customer_email@domain.com",
            "phoneNumber": "0720000000",
            "country": "Romania",
            "locality": "Iasi",
            "address": "Str. mea 1, bl.1, sc.2, ap.3"
        },
        "paymentInfo": {
            "paymentMethod": "bankTransfer",
            "iban": "RO00 0000 0000 0000 0000",
            "giftCardCode": "",
            "giftCardId": ""
        },
        "products": [
            {
                "image": "Product image url",
                "refId": "sku reference code",
                "skuId": "sku id",
                "brandName": "",
                "brandId": "",
                "manufacturerCode": "",
                "productId": "product id",
                "name": "Product Name",
                "unitPrice": 3000,
                "quantity": 2,
                "totalPrice": 6000,
                "goodProducts": 0,
                "reasonCode": "reasonBetterPrice",
                "reasonText": "",
                "status": "New"
            }
        ],
        "statusHistory": [
            {
                "status": "New",
                "dateSubmitted": "2021-05-07T10:02:07.432Z",
                "submittedBy": "Submitted by name"
            },
			{
                "status": "Picked up from client",
                "dateSubmitted": "2021-05-07T10:02:07.432Z",
                "submittedBy": "Submitted by name"
            },
			{
                "status": "Pending Verification",
                "dateSubmitted": "2021-05-07T10:02:07.432Z",
                "submittedBy": "Submitted by name"
            }
        ],
        "comments": []
    }
]
```

#### Get request by id
![Generic badge](https://img.shields.io/badge/GET-green.svg)  `https://{accountName}.{environment}.com.br/no-cache/returns/api/get-request/{request_id}`  

#####Response body example:
```
{
    "success": true,
    "errorMessage": "",
    "data": {
        "id": "request_id",
        "orderId": "1000000000000-01",
        "totalPrice": 4700,
        "refundedAmount": 0,
        "status": "Denied",
        "dateSubmitted": "2021-05-05T07:44:50.443Z",
        "customerInfo": {
            "name": "Customer fullname",
            "email": "customer_email@domain.com",
            "phoneNumber": "0720000000",
            "country": "Romania",
            "locality": "Contanta",
            "address": "Full address"
        },
        "paymentInfo": {
            "paymentMethod": "giftCard",
            "iban": "",
            "giftCardCode": "",
            "giftCardId": ""
        },
        "products": [
            {
                "image": "https://customsoft.vteximg.com.br/arquivos/ids/177023-55-55/image-a2759e73daed4c73b98c4f57f46929bd.jpg?v=637523674108530000",
                "refId": "REPARATIILE CASEI MELE-13",
                "skuId": 'sku id',
                "brandName": 'brand',
                "brandId": 'brand id',
                "manufacturerCode": 'manufacturer code',
                "productId": 1,
                "name": "REPARATIILE CASEI MELE",
                "unitPrice": 1700,
                "quantity": 1,
                "totalPrice": 1700,
                "goodProducts": 0,
                "reasonCode": "reasonBetterPrice",
                "reasonText": "",
                "status": "New"
            }
        ],
        "statusHistory": [
            {
                "status": "Pending verification",
                "dateSubmitted": "2021-05-07T09:32:08.673Z",
                "submittedBy": ""
            }
        ],
        "comments": []
    }
}
```

#### Add comment
![Generic badge](https://img.shields.io/badge/POST-blue.svg)  `https://{accountName}.{environment}.com.br/no-cache/returns/api/add-comment/{request_id}`  

*Body Parameters:*

| Param | Type | Required | Default |
| --- | --- |--- | --- |
|submittedBy|string|yes||
|comment|string|yes||
|visibleForCustomer|boolean|no|false|

Body example:
```
{
    "submittedBy": "your fullname here",
    "comment": "Comment Here",
    "visibleForCustomer": true
}
```
#### Change product status
![Generic badge](https://img.shields.io/badge/POST-blue.svg)  `https://{accountName}.{environment}.com.br/no-cache/returns/api/change-product-status/{request_id}`  

*Body Parameters:*

| Param | Type | Required | Default |
| --- | --- |--- | --- |
|skuId|string|yes, optional if `refId` is present||
|refId|string|yes, optional if `skuId` is present||
|goodQuantity|number|yes||

***Info:***
* If `refId` is present, `skuId` will be ignored
* If `goodQuantity` is 0, the product status will be "`denied`".
* If `goodQuantity` is lower than quantity from request, the product status will be "`partially approved`".
* If `goodQuantity` is equal with quantity from request, the product status will be "`approved`".


#####Response body example:
```
{
    "success": true,
    "errorMessage": ""
}
```


#### Check request status
![Generic badge](https://img.shields.io/badge/GET-green.svg)  `https://{accountName}.{environment}.com.br/no-cache/returns/api/check-status/{request_id}`  


#####Response body example:
```
{
    "success": true,
    "status": "Pending verification",
    "nextStatus": "Approved, Partially approved, Denied",
    "requiredSteps": [
        {
            skuId: 'skuId',
            skuRefId: 'sku refId',
            name: 'Sku name',
            info: "Verification required",
            status: 'Current product status'
        }           
    ],
    "errorMessage": ""
}
```
#### Update request status
![Generic badge](https://img.shields.io/badge/POST-blue.svg)   `https://{accountName}.{environment}.com.br/no-cache/returns/api/update-status/{request_id}`  

*Body Parameters:*

| Param | Type | Required | Default |
| --- | --- |--- | --- |
|submittedBy|string|yes| -|

#####Response body example:
```
{
    "success": true,
    "errorMessage": ""
}
```
