require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');

console.log("Mastodon Bot starting...");

const M = new Mastodon({
  client_key: process.env.CLIENT_KEY,
  client_secret: process.env.CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  api_url: 'https://m.quaoar.xyz/api/v1/', 
})

const listener = M.stream('streaming/user')
// listener.on('error', err => console.log(err))

listener.on('message', msg => {
  if (msg.event === 'notification') {
    const acct = msg.data.account.acct;
    if (msg.data.type === 'follow') {
      const params = {
        status: `@${acct} 感谢关注！`,
      }
      M.post('statuses', params);
      console.log(`@${acct} followed.`);
    } else if (msg.data.type === 'mention') {
      const regex1 = /(喜欢|点赞|笑|棒|真|好|么么|不错)/i;
      const content = msg.data.status.content;
      // let text = msg.data.status.content;
      const id = msg.data.status.id;
      if (regex1.test(content)) {
        M.post(`statuses/${id}/favourite`, (error, data) => {
          if (error) console.error(error);
          else console.log(`Favorited ${id} ${data.id}`);
        });
      }
      // console.log(content);
      const arr = content.split("> ");
      const arr2 = arr[arr.length-1].split("<");
      const arr3 = arr2[0].split(" ");
      const command = arr3.shift();
      const arrLen = arr3.length;

      const regex2 = /(公主)/i;
      const regex3 = /(一定)/i;
      const regex4 = /(做?一|做?1|当?一|当?1)/i;

      if (regex2.test(command)) {
        if (arrLen < 2) {
          toot(acct, id, -2)
            .then(response => console.log(response))
            .catch(error => console.error(error));
        } else {
          const arr_ = command.split("一定");
          const arr_1 = arr_[arr_.length-1].split("公主");
          const reg_ = /(做上?|当上?|成为)/i;
          const match_ = arr_1[0].match(reg_)[0];
          const arr_2 = arr_1[0].split(match_);
          const type_ = arr_2[arr_2.length-1];
          if (regex3.test(command)) {
            let random = Math.floor(Math.random() * arrLen);
            toot(acct, id, 1, arr3[random], type_)
              .then(response => console.log(response))
              .catch(error => console.error(error));
          } else {
            for (let i = arrLen; i<arrLen*2; i++) {
              arr3.push(-1);
            }
            let random2 = Math.floor(Math.random() * arr3.length);
            if (arr3[random2]==-1){
              toot(acct, id, -1, '', type_)
                .then(response => console.log(response))
                .catch(error => console.error(error));
            } else {
              toot(acct, id, 1, arr3[random2], type_)
                .then(response => console.log(response))
                .catch(error => console.error(error));
            }
        }
      }
    } else if (regex4.test(command)) {
      if (arrLen < 2) {
        toot(acct, id, -2)
          .then(response => console.log(response))
          .catch(error => console.error(error));
      } else {
        let random3 = Math.floor(Math.random() * arrLen);
        toot(acct, id, 2, arr3[random3])
          .then(response => console.log(response))
          .catch(error => console.error(error));
      }
    }
    // else {
    //   toot(acct, id, -3, command)
    //     .then(response => console.log(response))
    //     .catch(error => console.error(error));
    // }
  }
}
});

async function toot(acct, reply_id, flag, obj='', type_='') {
  if (flag == -2){
    const params = {
      status: `@${acct} 至少需要两个对象。`,
      in_reply_to_id: reply_id,
      language: "zh"
    }
    await M.post('statuses', params);
    return {
      success: true,
      flag: -2
    }
  } else if (flag == 1) {
    const params = {
      status: `@${acct} 这次${obj}做${type_}公主！`,
      in_reply_to_id: reply_id,
      language: "zh"
    }
    await M.post('statuses', params);
    return {
      success: true,
      flag: 1
    }
  } else if (flag == -1) {
    const params = {
      status: `@${acct} 抱歉，这次没有人可以做${type_}公主。`,
      in_reply_to_id: reply_id,
      language: "zh"
    }
    await M.post('statuses', params);
    return {
      success: true,
      flag: -1
    }
  } else if (flag == 2) {
    const params = {
      status: `@${acct} 这次${obj}做1！`,
      in_reply_to_id: reply_id,
      language: "zh"
    }
    await M.post('statuses', params);
    return {
      success: true,
      flag: 2
    }
  } else if (flag == -3) {
    const params = {
      status: `@${acct} 文本不符合规范，请重试。`,
      in_reply_to_id: reply_id,
      language: "zh"
    }
    await M.post('statuses', params);
    return {
      success: false,
      flag: -3,
      command: obj
    }
  }
}


// function toot(content, id, arr) {
//   const params = {
//     status: content,
//     language: "zh",
//     content_type: "text/markdown"
//   }
//   if (id) {
//     params.in_reply_to_id = id;
//   }
//   M.post('statuses', params, (error, data) => {
//     if (error) {
//       console.error(error);
//     } else {
//       //fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
//       //console.log(data);
//       console.log(`ID:${data.id}and timestamp:${data.created_at} `);
//       console.log(data.content);
//     }
//   });
// }