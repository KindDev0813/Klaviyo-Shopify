const Shopify = require('shopify-api-node');

const shopName = process.env.SHOP_NAME;
const apiKey = process.env.API_KEY;
const password = process.env.PASSWORD;

const shopify = new Shopify({
  shopName,
  apiKey,
  password,
});

const getOrdersFromShopify = async (created_at_max, created_at_min, financial_status) => {
  try {
    return await shopify.order.list({ created_at_max, created_at_min, financial_status });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = getOrdersFromShopify;


/*
I tried to keep each file as simple as possible, for re-usability and clarity for the user/reader.
Instead of making direct request to Shopify orders endpoint (using request or axios), I've downloaded the
shopify-api-node module.

I instantiated the class by passing in an object with the shopName, apiKey and the password. All of them may be found inside
the config file. (I am using dev.env since this app is not being deployed to production)

Once the shopify object is ready, I run an async/await function to grab the order list with created_at_max, created_at_min and financial_status
as the parameters. If something goes wrong, I throw an error which is then handled inside the index.js file and logged appropriately.
*/