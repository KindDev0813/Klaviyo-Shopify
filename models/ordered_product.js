const pushDataToKlaviyo = require('../utils/klaviyo');
const getLogger = require('../utils/logger');

const orderedProduct = (value) => {
  value.line_items.forEach((item) => { // Since there can be multiple items for each order, I loop through each item to make sure I call Klaviyo for each item. Each order must have at least one item so it's safe to assume this payload will be mapped at least once for each order.
    const payload = {
      token: process.env.PUBLIC_API_KEY,
      event: 'Ordered Product',
      customer_properties: {
        $email: value.email, //Email, first_name and last_name are always required when placing the order so we can be confident that they get returned from Shopify. Worst case that can happen is one of the values being set to undefined.
        $first_name: value.customer.first_name,
        $last_name: value.customer.last_name,
      },
      properties: {
        $event_id: item.id,
        $value: item.price,
        ProductID: item.product_id,
        SKU: item.sku,
        ProductName: item.name,
        Quantity: item.quantity,
        ProductURL: (item.url !== undefined) ? `${process.env.SHOP_NAME}.myshopify.com${item.url}` : '' , // Shopify has the ability to return relative url for each item. If it does not exist, I simply pass an empty string
        ProductCategories: item.properties, // returns array
      },
      time: (new Date(value.processed_at).valueOf()) / 1000,
    };
    pushDataToKlaviyo(payload) // To make the code more versatile, I would extract the pushDataToKlaviyo function from here and simply return a model object in each model file. I could then simply run pushDataToKlaviyo in its own file, while passing in the payload.
      .catch((error) => getLogger().error('error:', error));
  });
};

module.exports = orderedProduct;

/*
Things to note, according to Shopify's documentation, a relative url for line_item may be returned. I don't see anything being returned in our case,
however I have added logic that will pass it if item.url parameter exists. ProductImage

Since ordered_products may run multiple times for each order (depending on the number of line items), I've included the payload inside value.line_items.forEach().
As mentioned in placedOrder, if I had more payloads to map I would place each model inside it's own file, and then I would push the data to Klaviyo in a file on it's own.
Since the project involves only 2 different payloads, running  pushDataToKlaviyo() inside each individual fine is adequate
*/