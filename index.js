const getOrdersFromShopify = require('./utils/shopify');
const placedOrder = require('./models/placed_order');
const orderedProduct = require('./models/ordered_product');
const getLogger = require('./utils/logger');
/*
getOrdersFromShopify method is an async function, which retrieves
the order list from Shopify inside a try/catch block.
We only want to log something when an error is caught and thrown,
so we catch the error on the promise that is returned from getOrdersFromShopify
*/

const orderedProductsFromShopfiy = getOrdersFromShopify('2016-12-31T23:59:59', '2016-01-01T00:00:00', 'paid').catch((error) => {
  getLogger().error('error:', error);
  throw new Error('Unable to grab orders from Shopify');
});

/*
pushOrderToKlaviyo function runs two functions that are required. The first one pushes orderedProducts while the second one pushes the placedOrder.
I've kept it as a separate function for the clarity..
*/

const pushOrderToKlayivo = (order) => {
  orderedProduct(order);
  placedOrder(order);
};

/*
Since orderedProductsFromShopify is a promise, we catch any errors and log it (as seen above). If everything gets returned correctly, I simply
run a forEach loop on each order object and push it to Klaviyo
*/

orderedProductsFromShopfiy.then((orders) => {
  orders.forEach((order) => pushOrderToKlayivo(order));
});

/*
It is important to notice the way errors are handled, when retrieving orders from shopify. If an error is caughted and thrown I use a logger which creates a new file
and saves any errors there. This is very helpful since it allows the user to monitor any faults/ find where the mistake lies.
At the end of `orderedProductsFromShopfiy` method I throw an error which stop the script from running. This is to prevent any calls being made to Klaviyo if I am unable
to retrieve the order list from Shopify
*/
