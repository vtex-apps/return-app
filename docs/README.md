# Return App

VTEX Return App

## Installation Guide

- Open the VTEX App Store and install this app on your store, or run the following command on VTEX toolbelt:

> vtex install vtex.return-app@0.x

- From the left side access the `Returns > Requests` page. The first time you access it, the application creates the masterdata schema and settings it needs automatically.

## Settings

- Go to `Returns > Returns Settings` and fill up the form with the settings you need.
    - `Max days:` The maximum number of days that customers can request the return of products, from the moment the order was invoiced.
    - `Terms and conditions URL:` The URL of the page with the return terms and conditions. The customer can access this URL from the form they fill out to request a return.
        - If you have the terms on conditions page on `http://example.com/terms-and-conditions` it's enough for you to type just `/terms-and-conditions`
    - `Excluded categories:` Products that are in those categories will not be eligible for return
