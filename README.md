# Shopify Klaviyo Script

Perfect Klaviyo script
This simple node.js script allows the user to retrieve the order list from their Shopify store and upload that data to Klaviyo (Both for ordered products and placed orders)

### Prerequisites

You will require node to run the script

### Installing

Step 1

```
Clone the repo
```

Step 2

```
Navigate to projects root directory
```

Step 3

```
You will need to enter your credentials into the dev.env file which may be found under config

The layout should look like this:

PORT=8000
SHOP_NAME=Please enter your Shopify's shop name
PUBLIC_API_KEY=Please enter your Klaviyo's public key
API_KEY=Please enter your Shopify's API Key
PASSWORD=Please enter your Shopify's password
```

Step 4

```
Run ** npm install ** from the root directory to download/install all dependencies
```

Step 5

```
Once everything is in place, simply run ** npm run dev **. This will run the script and move your orders and product list to your Klaviyos account
```

## Running the tests

There are currently no unit tests for this project. I have added a JEST package which may be used to write unit tests. Since most of the script makes
API calls, it is important to use MOCKED data. It is important not to run API calls inside of tests, as we only want to test the functionality we wrote.
In our case it would be the transformation of data between Shopify and Klaviyo.

### And coding style tests

The code is formatted with the help of esLint using the airbnb configuration

## Versioning

Version 1.0.0 Initial Release

## Authors

- **Kamil Klasicki** - (https://github.com/kamil-klasicki)

## Description

- The project uses few extra modules such as shopify-api-node, lodash and axios
- Currently the list of orders from Shopify is retrieved using shopify-api-node. The orders which are being returned
  fall into the data range of 2016-12-31T23:59:59 -> 2016-01-01T00:00:00, and have a financial status of "paid".
  It may be easily modified by changing the object that is being passed inside shopify.js file.
  You can pass the parameters you want Shopify to filter by inside index.js file.
- Shopify now allows users to access orders data using graphql. In the future, it may be beneficial to introduce the graphql
  endpoint to specify exactly the data which is returned from Shopify.
- Although the amount of orders coming from Shopify is fairly low, the script is made to handle a large amount of data.
  For that reason I decided to use Winston logger to log any errors that may occur.

## Possible Improvements

- Place Both payloads for orderedProduct and placedOrder into its own file. Call to Klaviyo should be done outside of the payload
- Write two unit tests (for orderedProduct and placedOrder), to make sure the payload is being transformed correctly.
