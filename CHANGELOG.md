# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.10.1] - 2023-06-28

### Fixed
- Messages standardization.
- Missing translations in several languages.

## [3.8.5] - 2023-05-15

## [3.8.1] - 2023-05-02

## [3.8.0] - 2023-05-01

## [3.7.1] - 2023-04-05

## [3.7.0] - 2023-04-05
### Added
- German translation.

## [3.6.0] - 2023-04-03
### Added
- Create new layout for My Returns List and Request Returns Available List (change from table to Grid Layout with cards)
### Fixed
- Change structure of solicitation details and new request (from table to card) in mobile devices.

## [3.5.6] - 2023-02-06

## [3.5.5] - 2022-11-11
### Fixed
- Allow creation of a return for orders placed with a ` PICKUP_POINT` as customer address.

## [3.5.4] - 2022-11-07
### Fixed
- Allow creation of a return that contains only gifts

## [3.5.3] - 2022-10-04
### Fixed
- Email template for status update.

## [3.5.2] - 2022-09-21
### Fixed
- Default `refId` to an empty string when the value coming from the order is falsy.

## [3.5.1] - 2022-09-12
### Fixed
- Allow other reason to be submitted when account is using custom reasons.

## [3.5.0] - 2022-08-24

### Fixed

- Frontend validation for payment methods on settings page.
- Bulgarian, Dutch, English, French, Italian, Portuguese, Romanian, Spanish and Thai translations.

### Added

- Add `IBAN` validation in frontend and backend.
- Remove `IBAN` and `accountHolderNumber` when refund method is different than bank.
- Add `perPage` parameter to `returnRequestList` query.

## [3.4.1] - 2022-08-18

### Fixed

- My account mobile inconsistencies
- Dynamic messages declared statically

## [3.4.0] - 2022-08-17

### Fixed

- Prevent order list and order details paegs to show negative numbers for available items.
- Avoid having a minus sign when restock fee is 0.
- English translations.

### Changed

- Resolve dateSubmitted value into createdIn field because we lost the original value of createdIn (migration data from v2 to v3).

### Added

- Bulgarian, Dutch, French, Italian, Portuguese, Romanian, Spanish and Thai translations.

## [3.3.0] - 2022-08-11

### Added

- Allow admin users to choose if the store user is required to select item conditions.

## [3.2.0] - 2022-08-11

### Added

- Ability to cancel a request on admin and store side. This action allows the store use to create a return request with the same items.

### Fixed

- Order list's mobile responsiveness

## [3.1.0] - 2022-08-08

### Added

- Allow admin users to set automatic refund (creates invoice type Input for the order) when the request is set to refund the same payment method used for the purchase.

## [3.0.1] - 2022-08-02

### Fixed

- Add locale into context to allow item names to be translated when creating a new request via API.

## [3.0.0] - 2022-07-26

## [2.19.12] - 2022-06-27

### Fixed

- Encode user email when getting orders to be returned.

## [2.19.11] - 2022-06-17

### Fixed

- Revert fix encode URI email.

# Added

- Save seller information for new requests and display it to the customer and admin

## [2.19.10] - 2022-06-16

### Fixed

- Fix encode URI email value to avoid breaking the URL.

## [2.19.9] - 2022-06-15

### Fixed

- Doesn't show message about user not having order to return while the app is still preparing the order to show.

## [2.19.8] - 2022-06-02

### Fixed

- Fix total amount of products price by calculating directly the sum of each product value instead of relying on the totalPrice from the return request.

## [2.19.7] - 2022-05-30

### Added

- Manifest settingsSchema
- Get settings endpoint
- New setting 'displayConditionSelector' which hides the product's condition select
- Translate select reason, select condition and characters left messages.
- Provide min-width to quantity input on store and admin.

## [2.19.6] - 2022-05-26

### Changed

- Increase timeout limit and TTL.

## [2.19.5] - 2022-05-23

### Fixed

- Use safer value for display total amount of products price.

## [2.19.5] - 2022-05-09

### Fixed

## [2.19.4] - 2022-05-09

- Internationalize message and add linebreak variable.

## [2.19.4] - 2022-05-02

## [2.19.3] - 2022-03-25

### Fixed

- Prevent undefined price values on verify items by adding property `totalValue` on every scenario.

## [2.19.2] - 2022-03-24

### Fixed

- Allow call center operators to create RMA for store users when impersonating them. Set `userId`, `email`, and `name` from session API when impersonating is happening.

### Added

- Unify schema properties and indexes to avoid updating each client after deployment when we change a schema.

## [2.19.1] - 2022-03-15

### Fixed

- Mismatch between products returned and order id when an order takes too long to resolve (e.g. due to slow internet) when a store user is selecting an order to be returned.

### Added

- Error handler for middlewares

## [2.19.0] - 2022-02-28

### Changed

- Add `refundId` to `returnRequests` schema so it matches `returnProducts` and avoid breaking the search, which was preventing to display the history information in the RMAs.

### Added

- A new setting to prevent customers changing to a different payment method, as a refund, from the one in the order.

### Fixed

- `ReturnsTableContent` refactor and fix the returns list table when search for any item you will get an empty list and then you have to go back to the first page to see the results
- Clean state when store user navigates between different orders trying to avoid the error where there is a mismatch between the order id and the products in a RMA.
- Show total amount for the RMA in the admin side.

## [2.18.2] - 2022-02-22

### Fixed

- `createReturnRequest` throwing a 403 due to wrong auth cookies passed to get order details.

## [2.18.1] - 2022-02-21

### Fixed

- RMA details page for binding bounded accounts.

## [2.18.0] - 2022-02-21

### Added

- Graphql mutation `createReturnRequest` to create a new return request. Make it atomic, deleting all objects related to it if something fails during the process.
- Graphql mutation `deleteReturnRequest` to delete documents on master data.
- Error handler when submitting new request.
- Flag `v-immediate-indexing` in all schemas to force faster indexing.

### Changed

- Request to create a new RMA is now using Graphql mutation `createReturnRequest`.
- RMA sequence number is created using the order sequence number.

### Fixed

- Total products value on return request details page in the Admin side. It was being divided by 100.

## [2.1.0 to 2.17.0]

### Fixed

- The card refund method is valid only if the customer has paid for the order with the card.
- Fix shipping value available in frontend
- Fix shipping value refunded in frontend
- Email fixes
- The total value of the products was multiplied by 100 in frontend
- The value of the product available for refund is displayed as "NAN" if the product did not have the tax set
- "Submitted by" was blank in history timeline because of a prop.
- Check to prevent users from viewing other users' return requests.

### Fixed

- Profile request for production environment
- Fix requests schema for older requests

### Fixed

- Access for telesales user
- GetProfile request from FE switched back to fetch instead of axios.
- Quantity and availability of a product if there is already a return request placed for that product.

### Fixed

- totalPrice for partial requests

### Changes

- Get requests method has been changed to `searchDocumentsWithPaginationInfo`

### Added

- Cache-control: no-cache on middlewares
- Navigation has been added in admin area to keep users on the same page when they open a request

### Fixed

- Update the refundedShippingValue in the front if it was declared via API.
- Filter correctly the available orders to request on MyReturnsPageAdd.

### Fixed

- Fixed orders available to show.
- Fixed API for verify package.

### Added

- API to verify package setting restock fee and shipping value to refund

### Fixed

- Fix build errors

### Added

- I18n It

- Add validation to remove orders that have already been returned through the OMS

### Added

- Add the posibility of refund a partial amount for each product (Restock Fee)
- Add the posibility of refund the total or partial value of the order shipping

### Fixed

- Denied items does not show up in the OMS as returned anymore

### Added

- Update return labels to be saved as part of request
- Add ability to view shipping labels on both customer and admin sides

### Added

- Update status history timeline to be adaptive

### Added

- Add tax logic to credit card returns

### Removed

- Removed label creation button from customer side

### Added

- Added dropdown for customers to specify condition of the product they are returning

## [2.1.0] - 2021-08-27

### Added

- Added ability to deny a return request in the request status dropdown

### Fixed

- Fix return requests being automatically denied
- Fix inability to save max days in settings
- Fix missing Beneficiary Name on request page
- Changed zip and state fields to be optional for international returns
- Fix re-rendering on initial install

## [2.0.0] - 2021-08-25

### Added

- Add Easypost integration to create shipping labels
- Add refund method with credit cards

## [1.1.0] - 2017-07-02

### Added

- New custom return options
- New extra request comment
- New scroll to top when navigating My account section
- Fixed 'null' user's address number
- Fixed admin settings layout
- Fixed outstanding requests with missing products
- Fixed cross checking outstanding requests with eligible orders

## [1.0.11] - 2021-06-12

### Added

- New CSS Handles for the My account section

## [1.0.10] - 2017-06-20

### Added

- Fix messages warn
- Code improvement
- Improve loading time
- Different client for masterdata
- Fix products schema for older versions

### Added

- Auto-update schemas
- Payment method settings - display or hide payment methods
