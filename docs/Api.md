### Return App - API

#### Get requests list
*API URL:* `/no-cache/returns/api/get-requests`  
*Method:* `GET`  
*Url Parameters:*

| Param | Type | Required | Default |
| --- | --- |--- | --- |
|page|number|no|1|
|limit|number|no|10|
|status|string|no|-|
|dateStart|date YYYY-MM-DD|no|-|
|dateEnd|date YYYY-MM-DD|no|-|

#### Get request by id
*API URL:* `/no-cache/returns/api/get-request/{request_id}`  
*Method:* `GET` 

#### Add comment
*API URL:* `/no-cache/returns/api/add-comment/{request_id}`  
*Method:* `POST`  
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
*API URL:* `/no-cache/returns/api/change-product-status/{request_id}`  
*Method:* `POST`  
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

#### Check request status
*API URL:* `/no-cache/returns/api/check-status/{request_id}`  
*Method:* `GET` 

Response body example:
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
*API URL:* `/no-cache/returns/api/update-status/{request_id}`  
*Method:* `POST`  
*Body Parameters:*

| Param | Type | Required | Default |
| --- | --- |--- | --- |
|submittedBy|string|yes| -|

Response body example:
```
{
    "success": true,
    "errorMessage": ""
}
```
