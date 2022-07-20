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

const stream = M.stream('streaming/user');

stream.on('message', response => {
  if (response.event === 'notification' && response.data.type === 'mention') {
    const id = response.data.status.id;
    const acct = response.data.account.acct;
    const content = response.data.status.content;

    const arr = content.split(" ");

    toot(acct, id, arr)
      .then(response => console.log(response))
      .catch(error => console.error(error));
  }
});

async function toot(acct, reply_id, arr) {

  const regex1 = /(公主)/i;
  const regex2 = /(做1|做一|攻)/i;

  if (regex1.test(arr[0])) {
    if (arr.length < 3) {
      const params = {
        status: `@${acct} 至少要两个对象。`,
        in_reply_to_id: reply_id
      }
      await M.post('statuses', params);
      return {
        success: true,
        arr: -1
      };
    }
  } else if (regex2.test(arr[0])) {
    if (arr.length < 3) {
      const params = {
        status: `@${acct} 至少要两个对象。`,
        in_reply_to_id: reply_id
      }
      await M.post('statuses', params);
      return {
        success: true,
        arr: -1
      };
    }
  }
}


// // function toot() {
// const num = Math.floor(Math.random() * 100);
// const params = {
//   spoiler_text: "The meaning of life is: ",
//   status: num
// }

// M.post('statuses', params, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     //fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
//     //console.log(data);
//     console.log(`ID: ${data.id} and timestamp: ${data.created_at}`);
//     console.log(data.content);
//   }
// });
// }