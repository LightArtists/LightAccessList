const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const https = require('https')

const url = `https://api.twitter.com/2/users?ids=1478390406425755649,1381796233581236224&user.fields=public_metrics`;
const token = '';
const allDataFileName = 'all-exports.json';
const bucketName = 'light-art';
const getDataPassword = 'marcos)POI';

exports.handler = async (event) => {
  if (event.requestContext && event.requestContext.accountId === 'anonymous') {
    const key = event["queryStringParameters"]['key'];
    if (!event["queryStringParameters"] || !event["queryStringParameters"]['key'] || event["queryStringParameters"]['key'] !== getDataPassword) {
      return 'Unauthorized';
    }
    const allDataJSON = await fetchS3FileData(allDataFileName)
    return allDataJSON;
  }
  const promise = new Promise(function(resolve, reject) {
    console.log("Get data", new Date);
    https.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = [];
      res.on('data', chunk => {
        data.push(chunk.toString());
      });
      res.on('end', async () => {
        console.log("Data recived", new Date);
        try {
          resolve(await processDataUpdate(data));
        } catch(err){
          console.log("Error during operation")
          console.error(err);
          reject(err);
        }

      });
    }).on('error', (e) => {
      console.log("Error");
      console.log(e);
      reject(Error(e))
    })
  })
  return promise
};


async function processDataUpdate(data) {

  let jsonData = data.join('');
  const dateStr = getFormatedDateString();
  const twitterData = JSON.parse(jsonData).data;
  twitterData.forEach(item => {
    item.fetchTimestamp = new Date().getTime() * 1000;
    item.fetchDate = dateStr;
  });
  await uploadToS3(`daily-${dateStr}.json`, twitterData);
  const allDataJSON = await fetchS3FileData(allDataFileName)
  console.log('allDataJSON', allDataJSON);
  let allData = [];
  try {
    allData = JSON.parse(allDataJSON) || [];
  } catch (err) {
    allData = [];
  }

  allData = allData.concat(twitterData);
  await uploadToS3(allDataFileName, allData);
  generatePublicUrl(allDataFileName);
  return 200;
}



async function uploadToS3(name, data) {
  const jsonData = JSON.stringify(data);
  const fileData = await s3.upload({
    Bucket: bucketName,
    Key: `twitter-exports/${name}`,
    Body: Buffer.from(jsonData),
    ContentEncoding: 'base64',
    ContentType: 'application/json',
  }).promise()
  console.log('File Uploaded', name, fileData);
  return fileData;
}

async function fetchS3FileData(name) {
  try {
    const response = await s3.getObject({ Bucket: bucketName, Key: `twitter-exports/${name}` }).promise()
    console.log(response);
    return response.Body.toString("utf8");
  } catch (err) {
    if (err.statusCode === 404) {
      return null;
    }

    throw err;
  }
}

function getFormatedDateString(date) {
  return (date || new Date())
    .toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit'})
    .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
}

async function generatePublicUrl(name) {
  const url = s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: `twitter-exports/${name}`,
    Expires: 60*60*60,
  });

  console.log(url);
}