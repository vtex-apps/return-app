# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
