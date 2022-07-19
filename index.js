require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');

console.log("Princess Bot starting...");

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    api_url: 'https://m.quaoar.xyz/api/v1/', // optional, defaults to https://mastodon.social/api/v1/
  })

const params = {
    status: "Test!"
}

M.post('statuses', params, (error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});