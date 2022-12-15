
const needle = require('needle');
const fs = require("fs");

// this is the ID for @TwitterDev
const bearerToken = process.env.BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAOZmggEAAAAAWufBGdHIg70BOnCYpFh6%2BdRHW4k%3DoQw1Lm3ykj3i1hoINRBmbEsQ7yf2902noNqexfTJLsdjeuwpGQ';

const getFollowersV2 = async (userId) => {
  let users = [];
  let params = {
    "max_results": 1000,
    "user.fields": "created_at"
  }

  const options = {
    headers: {
      "User-Agent": "v2FollowersJS",
      "authorization": `Bearer ${bearerToken}`
    }
  }

  let hasNextPage = true;
  let nextToken = null;
  console.log("Retrieving followers...");
  while (hasNextPage) {
    let resp = await getPageV2(userId, params, options, nextToken);
    if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
      if (resp.data) {
        users.push.apply(users, resp.data);
      }
      if (resp.meta.next_token) {
        nextToken = resp.meta.next_token;
      } else {
        hasNextPage = false;
      }
    } else {
      hasNextPage = false;
    }
  }

  const fileName = `./followers_exports_v2_${userId}.json`
  fs.writeFileSync(fileName, JSON.stringify(users));
  console.log(`Got ${users.length} users.`);

}


const getFollowersV1 = async (userId) => {
  let users = [];
  let params = {
    count: 200
  }

  const options = {
    headers: {
      'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAOZmggEAAAAAWufBGdHIg70BOnCYpFh6%2BdRHW4k%3DoQw1Lm3ykj3i1hoINRBmbEsQ7yf2902noNqexfTJLsdjeuwpGQ',
      'Cookie': 'guest_id=v1%3A166415372553839954; guest_id_ads=v1%3A166415372553839954; guest_id_marketing=v1%3A166415372553839954; personalization_id="v1_MN1ri6JyDKWu6ydqK+mfrQ=="'
    }
  }

  let hasNextPage = true;
  let nextToken = -1;
  console.log("Retrieving followers...");
  while (hasNextPage) {
    let resp = await getPageV1(userId, params, options, nextToken);
    if (resp) {
      if (resp.users) {
        users = users.concat(resp.users);
      }
      if (resp.next_cursor) {
        nextToken = resp.next_cursor;
      } else {
        hasNextPage = false;
      }
    } else {
      hasNextPage = false;
    }
  }

  const fileName = `./followers_exports_v1_${userId}.json`
  fs.writeFileSync(fileName, JSON.stringify(users));
  console.log(`Got ${users.length} users.`);

}


const getPageV2 = async (userId, params, options, nextToken) => {
  if (nextToken) {
    params.pagination_token = nextToken;
  }

  try {
    const url = `https://api.twitter.com/2/users/${userId}/followers`;
    const resp = await needle('get', url, params, options);

    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1500);
    })
    if (resp.statusCode != 200) {
      console.log(`${resp.statusCode} ${resp.statusMessage}:\n${JSON.stringify(resp.body)}`);
      return;
    }
    return resp.body;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
}

const getPageV1 = async (userId, params, options, nextToken) => {
  return new Promise((resolve, reject) => {
    var https = require('follow-redirects').https;
    var fs = require('fs');
    console.log(`/1.1/followers/list.json?screen_name=${userId}&count=${params.count}&cursor=${nextToken}`)
    var options = {
      'method': 'GET',
      'hostname': 'api.twitter.com',
      'path': `/1.1/followers/list.json?screen_name=${userId}&count=${params.count}&cursor=${nextToken}`,
      'headers': {
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAOZmggEAAAAAWufBGdHIg70BOnCYpFh6%2BdRHW4k%3DoQw1Lm3ykj3i1hoINRBmbEsQ7yf2902noNqexfTJLsdjeuwpGQ',
        'Cookie': 'guest_id=v1%3A166415372553839954; guest_id_ads=v1%3A166415372553839954; guest_id_marketing=v1%3A166415372553839954; personalization_id="v1_MN1ri6JyDKWu6ydqK+mfrQ=="'
      },
      'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        const data = JSON.parse(body);
        resolve(data);
      });

      res.on("error", function (error) {
        console.error(error);
        reject(error);
      });
    });

    req.end();
  })
  if (nextToken) {
    params.cursor = nextToken;
  }

  try {
    const url = `https://api.twitter.com/1.1/followers/list.json?screen_name=${userId}`;
    const resp = await needle('get', url, params, options);

    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1500);
    })
    if (resp.statusCode != 200) {
      console.log(`${resp.statusCode} ${resp.statusMessage}:\n${JSON.stringify(resp.body)}, ${url}`);
      return;
    }
    const fileName = `./followers_exports_v1_${userId}.json`
    fs.writeFileSync(fileName, JSON.stringify(resp.body));
    return resp.body;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
}

async function run(){
  //await getFollowersV1('light_artists');
  //await getFollowersV1('ts446photo');
  //const data2 = await getFollowers(2754951018);\
}

run();