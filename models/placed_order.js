const _ = require('lodash');
const pushDataToKlaviyo = require('../utils/klaviyo');
const getLogger = require('../utils/logger');

const personalDetails = (key, details) => ({ //Using lodash, please read the paragraph at the end for explanation
  first_name: _.get(details, `${key}.first_name`, ''),
  last_name: _.get(details, `${key}.last_name`, ''),
  company: _.get(details, `${key}.company`, ''),
  address1: _.get(details, `${key}.address1`, ''),
  address2: _.get(details, `${key}.address2`, ''),
  city: _.get(details, `${key}.city`, ''),
  region: _.get(details, `${key}.province`, ''),
  region_code: _.get(details, `${key}.province_code`, ''),
  country: _.get(details, `${key}.country`, ''),
  country_code: _.get(details, `${key}.country_code`, ''),
  zip: _.get(details, `${key}.zip`, ''),
  phone: _.get(details, `${key}.phone`, ''),
});

const placedOrder = (value) => {
  const payload = {
    token: process.env.PUBLIC_API_KEY,
    event: 'Placed Order',
    customer_properties: {
      $email: value.email,
      $first_name: value.customer.first_name,
      $last_name: value.customer.last_name,
      $phone_number: value.customer.phone,
      $address1: (typeof value.customer.default_address !== 'undefined') ? value.customer.default_address.address1 : '', // Since the following parameters differ from shipping and billing address, PersonalDetails function is not used here. It may be substituted into it's own function but there's only 6 repetitions
      $address2: (typeof value.customer.default_address !== 'undefined') ? value.customer.default_address.address2 : '',
      $city: (typeof value.customer.default_address !== 'undefined') ? value.customer.default_address.city : '',
      $zip: (typeof value.customer.default_address !== 'undefined') ? value.customer.default_address.zip : '',
      $region: (typeof value.customer.default_address !== 'undefined') ? value.customer.default_address.province_code : '',
      $country: (typeof value.customer.default_address !== 'undefined') ? value.customer.default_address.country : '',
    },
    properties: {
      $event_id: value.id,
      $value: value.total_price,
      Categories: [].concat([], ...value.line_items.map((item) => item.properties)), //There is a field called properties returned from Shopify, which usually seems to be an empty array. I am unsure if it matches with Categories, but if not it may be removed.
      ItemNames: value.line_items.map((itemName) => itemName.name), // I map through each line item and return the name attribute
      'Discount Code': (value.discount_codes.length > 0) ? (value.discount_codes.map(result => result.code)).toString() : '', // It looks like Discount Code can only take a string, however Shopify may return multiple discount codes. I check for the length, if it greater than zero I loop through and return codes as comma separated string
      'Discount Value': value.total_discounts,
      Items: value.line_items.map((item) => ({ // I map through each lineItem and return an object with required properties
        ProductID: item.id,
        SKU: item.sku,
        ProductName: item.name,
        Quantity: item.quantity,
        ItemPrice: item.price,
        RowTotal: (item.price * item.quantity),
        ProductURL: (item.url !== undefined) ? `${process.env.SHOP_NAME}.myshopify.com${item.url}` : '' , //Please see ProductURL under orderedProduct
        Categories: item.properties, //Same as Categories above
      })),
      billing_address: personalDetails('billing_address', value), // Both Billing and Shipping objects contain the same data, so it is useful to put it in a function
      shipping_address: personalDetails('shipping_address', value), // Same as above
    },
    time: (new Date(value.processed_at).valueOf()) / 1000, // Passing through the time at which the item has been processed by Shopify. I divido by 1000 since the value is in milliseconds
  };
  pushDataToKlaviyo(payload)
    .catch((error) => getLogger().error('error:', error)); // For each order, I push the payload to Klaviyo. If an error occurs (such as 0 is being returned instead of 1, and error is thrown and caughted in the promise)
};

module.exports = placedOrder;

/*
As mentioned above, billing and shipping objects have the same structure, which means it is beneficial to place it
in its own function. I am using lodash to verify if the parameter exists inside the object (for example billing_address.firstName).
If it does, I pass in the  value that is returned from shopify, otherwise it will simply pass an empty string.

Something similar could be done for default address fields, however they differ to the fields that may be found
inside of personalDetails function. If the payload was larger, it would make sense to restructure it a little bit
to obey the DRY principle, but since it is only 6 fields, it should not cause too many problems

As you can see at the end, after the creation of payload, I pass that data into pushDataToKlaviyo function (This is looped for each order placed).
Since this script is very simple (Only two different payloads), I decided to run this function inside both placedOrder and orderedProducts. For larger projects where we have a lot
more payloads mapped, I would place each mapped object into its own file, where just the mapped out object is returned.
Any loops/ calls to Klaviyo should be done outside in it's own file.

*/
