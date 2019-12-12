const axios = require('axios');

const pushDataToKlaviyo = async (payload) => {
  const string = JSON.stringify(payload);
  const buffer = Buffer.from(string);
  const base64 = buffer.toString('base64');

  const result = await axios.get(`https://a.klaviyo.com/api/track?data=${base64}`);

  if (result.data === 0) {
    throw new Error(`Failed to upload ${payload.properties.$event_id}`);
  }

  return true;
};

module.exports = pushDataToKlaviyo;


/*
This method is responsible for pushing data to Klaviyo. I tried to keep it as simple as possible to minimise the complexity of the code/ make it easy to re-use.
I am using axios to make the http call, while I use the Buffer class to convert the JSON object into a base64 encoded string.
If the result.data comes back with 0, it means the data was not succesfully uploaded to Klaviyo. In a case like this, I throw an error which I then catch
inside of placedOrder or orderedProduct and I log the issue (as mentioned in the logger.js file)
*/
