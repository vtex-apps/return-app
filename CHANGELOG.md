# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `orderDataStatsService` / `GET /_v/order-data/:orderId/stats`: per-item `taxRefunded`, `taxToRefund`, `taxAvailableForRefund` (SalesTax; `taxAvailableForRefund` = line tax after completed refunds, pending in `taxToRefund`).

### Changed

- `shippingAvailableForReturn` → `shippingAvailableForRefund` (same value).
- SalesTax lines update `amountRefunded` / `amountToRefund` and tax columns; tax only on each `itemsReturns` row (no top-level tax totals).
- `validateAdjustmentNoteCreation` / `validateAdjustmentNoteRefund`: `sum(additionalInfo.items[].amount) === requestAmount`; SalesTax lines also capped by `taxAvailableForRefund - taxToRefund` per line.

## [3.20.1] - 2026-03-09

### Fixed

- Ensure `createReturnRequestService` persists `locationCode`, `returnType`, `reasonCode`, and `originalPaymentMethod` fields to Master Data when creating return requests (including via `/_v/return-request`), making list filters and GraphQL fields consistent with stored data.

## [3.20.0] - 2026-01-28

### Added

- Validation step for creating adjustment notes (`validateAdjustmentNoteCreation`) that validates refund amounts against available amounts using `orderDataStatsService`:
  - Requires `additionalInfo` with `items` property unless `refundType === 'DeliveryFee'`
  - For `DeliveryFee` refunds: allows creation without item-level data (validation to be implemented)
  - For other refund types: validates each item's refund amount against `amountAvailableForRefund` when items are provided
  - Returns validation result with `valid` boolean and `message` string
- Validation step for updating adjustment note status to `refunded` (`validateAdjustmentNoteRefund`) that validates refund amounts for credit notes:
  - Only runs when updating credit notes to `refunded` status
  - Requires `additionalInfo` with `items` property unless `refundType === 'DeliveryFee'`
  - For `DeliveryFee` refunds: allows refund without item-level data (validation to be implemented)
  - For other refund types: validates each item's amount against `amountAvailableForRefund` when items are provided
  - Returns validation result with `valid` boolean and `message` string
- Unified validation logic for both `validateAdjustmentNoteCreation` and `validateAdjustmentNoteRefund`:
  - Both functions now use the same code path to handle missing `additionalInfo` or missing `items`
  - Consistent error messages and validation behavior across creation and refund flows
- Validation step for updating return request status to `amountRefunded` (`validateReturnRequestRefund`) that validates refund amounts:
  - Only runs when updating return request status to `amountRefunded`
  - Requires `refundData.items` to be present and non-empty (validation fails if missing)
  - Validates each item in `refundData.items` to ensure refund amounts (price \* quantity - restockFee) don't exceed `amountAvailableForRefund`
  - Note: Does not validate `quantityAvailableForReturn` as the current return request's items are already subtracted from available quantities
  - Returns validation result with `valid` boolean and `message` string
- Added `amountsToRefund` field to `orderDataStatsService` return value:
  - Calculates the sum of all adjustment notes that are not refunded (status is not `refunded` or `charged`)
  - Returns per-item amounts as an array, matching the structure of `amountsReturned` and `amountsAvailableForReturn`
  - Useful for tracking pending refund amounts from adjustment notes that have been created but not yet processed
- Added shipping-related fields to `orderDataStatsService` return value:
  - `shippingRefunded`: Total shipping amount refunded from return requests (status `amountRefunded`) and adjustment notes (status `refunded` or `charged` with `refundType === 'DeliveryFee'`)
  - `shippingToRefund`: Total shipping amount pending refund from adjustment notes with `refundType === 'DeliveryFee'` that are not yet refunded/charged
  - `shippingAvailableForReturn`: Shipping amount still available for refund, calculated as `orderShippingTotal - shippingRefunded`
  - Shipping amounts are tracked separately from item amounts and follow the same calculation patterns

### Changed

- Added `orderDataStats` REST endpoint to expose per-order return statistics (items and amounts returned/available) based on OMS orders, return requests, and adjustment notes.
- `orderDataStatsService` now only includes amounts from return requests with status `amountRefunded` when calculating `amountsReturned`. Previously, amounts from all return requests (excluding cancelled/denied) were included, which could incorrectly reduce available refund amounts for requests that haven't been refunded yet.
- `orderDataStatsService` now considers return requests with status `closed` as refunded in addition to `amountRefunded` when calculating `amountsReturned` and `shippingRefunded`.
- `validateAdjustmentNoteCreation` now accounts for pending adjustment notes when validating refund amounts: The validation checks that the amount doesn't exceed `(amountAvailableForRefund - amountToRefund)`, ensuring new adjustment notes don't exceed the available amount after accounting for already created (but not yet refunded) adjustment notes. This prevents creating adjustment notes that would collectively exceed the available refund amount.

### Fixed

- Fixed inconsistency in `amount` field calculation in `orderDataStatsService`: The `amount` field in `OrderItemStats` now includes tax in its calculation `(sellingPrice + tax) * quantity`, matching the `amountAvailableForRefund` calculation and the documented base amount formula. Previously, `amount` was calculated as `sellingPrice * quantity` without tax, causing data inconsistency when no refunds had occurred.
- Fixed tax calculation in `orderDataStatsService` and `createRefundableTotals` to include CustomTax fields:
  - `orderDataStatsService` now calculates tax from `priceTags` (TAXHUB entries) when `item.tax` is zero or missing, ensuring CustomTax values are properly included in item-level tax calculations
  - `createRefundableTotals` now sums all `CustomTax` entries from the order totals array in addition to the standard `Tax` field, ensuring complete tax totals are used for refund calculations

## [3.19.1] - 2025-12-11

### Added

- Added "Deny request" button to admin cancellation popup, allowing admins to deny return requests directly from the cancellation modal

### Changed

- Updated returnRequest schema with customerProfileData fields indexed
- Updated cancellation popup to display Deny and Cancel buttons based on status transition rules (buttons only show when the transition is allowed according to backend validation)
- Updated admin cancellation modal message logic to follow status transition rules instead of hardcoded status checks

## [3.19.0] - 2025-11-25

### Added

- GitHub Actions workflows for automated CI/CD:
  - `release.yml` workflow for automated versioning and release management using semantic-release
  - `deploy.yml` workflow for automated deployment to VTEX environments (dev, staging, production)
- `.releaserc.json` configuration file for semantic-release automation with plugins:
  - `@semantic-release/commit-analyzer` for version bump analysis
  - `@semantic-release/release-notes-generator` for automated release notes
  - `@semantic-release/changelog` for CHANGELOG.md updates
  - `@semantic-release/github` for GitHub release creation

### Changed

- Validation for adding items to a new return:
  - Ignore returns with status `cancelled` or `denied` when computing previously processed quantities.
  - Consider only approved items (`refundData.items`) from prior finalized requests; items denied during verification no longer block new returns.
  - Internally performs two MasterData searches (not-cancelled and not-denied) and intersects by `id` to reliably exclude both statuses.

## [3.18.4] - 2025-11-11

### Added

- Event data logging for adjustment note status updates to track data sent to external systems
- Event data logging for return request status updates to track data sent to external systems

### Fixed

- Fixed event data to use the final `requestStatus` instead of input `status` parameter in `updateRequestStatusService`. When `acceptOrDenyPackage` transforms the status (e.g., from `packageVerified` to `denied` based on item quantities), events sent to external systems now correctly reflect the actual status saved to the database.
- Fixed event data to use `requestStatus` instead of input `status` parameter in `updateAdjustmentStatusService` for consistency with return request service. This ensures external systems receive correct status values if transformation logic is added in the future.

## [3.18.3] - 2025-11-10

### Fixed

- Fixed TypeScript compilation error in `setupLogger` middleware by adding explicit type annotation for `environment` variable (`'prod' | 'dev'`)
- Refactored logger initialization to use `createVtexLogger` factory method for cleaner VTEX-specific configuration

## [3.18.2] - 2025-11-07

### Added

- `refundType` field to adjustmentNote schema with enum values: `Miscellaneous`, `PriceVariation`, `DeliveryFee`, `SalesTax`
- `RefundType` enum to GraphQL schema for adjustment notes
- `refundType` field to `AdjustmentNoteInput` and `AdjustmentNoteResponse` GraphQL types
- `refundType` filter to `AdjustmentNoteFilters` for querying adjustment notes by refund type
- Support for `refundType` in adjustment note creation service
- Support for `refundType` filtering in adjustment note list service

## [3.18.1] - 2025-11-06

### Fixed

- Remove unsafe cast in `react/common/components/ReturnDetails/AdditionalInfo/AdditionalInfo.tsx` causing TS2352 during React build. Parse `additionalInfo` directly from `ReturnRequestResponse` to align with GraphQL types (`refundStatusData.comments` is `RefundStatusComment[]`).

## [3.18.0] - 2025-11-03

### Added

- Comprehensive Dynatrace logging integration using `@odp-ecom/js-logger@^0.3.4`
- `setupLogger` middleware for all API routes to initialize Dynatrace logger per request
- `commonLogger.ts` utility providing standardized VTEX logging patterns with full context
- Structured logging for all return request operations:
  - Return request creation with business metadata (orderId, locale, itemCount)
  - Return request status updates with before/after states
  - Return request list queries with pagination and filter parameters
  - Individual return request retrievals
- Structured logging for all adjustment note operations:
  - Adjustment note creation with business metadata (orderId, reasonCode, itemCount)
  - Adjustment note status updates with state transitions
  - Adjustment note list queries with pagination and filter parameters
  - Individual adjustment note retrievals
  - Additional info retrieval and updates with error handling
- Source location tracing in all logs (file and function names for easier debugging)
- Full VTEX context metadata in logs:
  - App identification (appId, appName, appVersion, appVendor)
  - Request context (account, workspace, method, path)
  - User context (userId, userRole when available)
  - Timestamp and operation type classification

### Changed

- All API routes now include `setupLogger` middleware as the first middleware in the chain
- Enhanced error handling middleware to log all errors with full VTEX context
- Improved error boundary pattern to ensure logging failures don't break request flow

### Fixed

- TypeScript compilation errors in logging implementation by using correct GraphQL return types
- Property access issues by verifying actual service return types vs. assumed types
- Removed repetitive logger initialization logs to reduce noise and improve signal-to-noise ratio

## [3.17.1] - 2025-10-29

### Changed

- Update return request status transition rules:
  - Removed transition from "new" → "denied".
  - Allowed transition from "pendingVerification" → "denied".
  - Replaced "packageVerified" → "cancelled" with "packageVerified" → "denied".

## [3.17.0] - 2025-10-27

### Added

- New "closed" status for return requests to mark them as completely closed after refund completion
- Status transition from "amountRefunded" to "closed" to provide a final terminal status
- UI rendering support for the "closed" status with gray styling and check icon
- Translations for "closed" status in English and Spanish (both regular and timeline messages)
- Updated GraphQL schema and masterdata schema to include the "closed" status
- Comprehensive documentation of return request statuses and workflow in README.md

## [3.16.0] - 2025-10-21

### Changed

- Fixed SQL injection vulnerability in buildWhereClause functions by implementing proper string escaping with correct order of operations (escape backslashes before quotes)
- Fix camelCase naming in schemas

## [3.15.0] - 2025-10-21

### Added

- New fields to returnRequest schema: `locationCode`, `returnType`, `reasonCode`, `originalPaymentMethod`
- `ReturnType` enum with values: `standardReturn`, `creditReturn`, `notDeliveryReturn`
- New fields to ReturnRequestList GraphQL response: `externalReference`, `returnType`, `reasonCode`, `originalPaymentMethod`, `refundData.invoiceNumber`, `refundData.invoiceValue`
- New filters to ReturnRequestList GraphQL: `returnType`, `reasonCode`, `originalPaymentMethod`, `externalReference`, `locationCode`
- New fields to adjustmentNote schema: `reasonCode`, `locationCode`, `originalPaymentMethod`
- New fields to AdjustmentNoteList GraphQL response: `reasonCode`, `locationCode`, `originalPaymentMethod`
- New filters to AdjustmentNoteList GraphQL: `reasonCode`, `locationCode`, `originalPaymentMethod`
- New fields to AdjustmentNoteInput GraphQL: `reasonCode`, `locationCode`, `originalPaymentMethod`
- `@auth` GraphQL directive for authentication
- Support for new filter fields in REST API endpoints for both return requests and adjustment notes

### Changed

- Updated returnRequest schema to include new indexed fields
- Updated adjustmentNote schema to include new indexed fields
- Enhanced GraphQL query capabilities with additional filter options for both return requests and adjustment notes
- Improved authentication system for GraphQL queries
- Enhanced service layer to handle new filter parameters with proper string quoting and escaping
- Updated REST API middleware to support new filter parameters

## [3.14.0] - 2025-10-09

### Added

- Adjustment Notes implementation

## [3.13.0] - 2025-09-30

- Adding keep alive route implementation

## [3.12.1] - 2025-09-11

### Fixed

- Inferring types to the invoice payload

## [3.12.0] - 2025-09-11

### Added

- `finantialStatus` field to the return Schema

## [3.11.11] - 2025-08-28

## [3.11.10] - 2025-08-21

### Fixed

- Fixed duplicate closeReturn events by only sending when status actually changes

## [3.11.9] - 2025-08-20

### Fixed

- Fixed missing refundData in updateReturn events for amountRefunded status

## [3.11.8] - 2025-08-20

### Added

- Added logging for final refund invoice and external system event data

## [3.11.7] - 2025-08-20

### Added

- Enhanced logging for refund amount calculation to debug MF return processing

## [3.11.6] - 2025-08-20

### Fixed

- Fixed refund amount calculation for Miscellaneous Refunds (MF) to use only refundAdditionalValue + refundShippingValue instead of refundableAmount
- Fixed function signature to properly accept additionalInfo parameter for MF return handling

## [3.11.5] - 2025-08-19

## [3.11.4] - 2025-08-18

### Fixed

- Fixed frontend validation to allow cancellation button for returns in "Package verified" status

## [3.11.3] - 2025-08-18

### Fixed

- Allow cancellation of returns in "Package verified" status to support Credit Returns without physical items

## [3.11.2] - 2025-08-07

## [3.11.1] - 2025-08-04

### Fixed

- Fixed the packageVerified validation for returns with no items

## [3.10.2] - 2025-05-16

### Added

- Additional information section in return request details
- Updated translations for return request details

## [3.9.3] - 2025-04-25

### Added

- Display item quantity in return items form for enhanced order details
- Enhanced return creation form with order data integration
- Added loading state for order ID completion

### Changed

- Adjusted README documentation

## [3.9.2] - 2025-04-24

### Added

- Success message for return request creation in English and Spanish language files
- Return request creation functionality with forms for customer profile, pickup return, and refund payment
- AdditionalInfo field for return requests
- ESLint and Prettier configuration files

### Changed

- Renamed additinalInfo field to additionalInfo

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
