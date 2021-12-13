# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
