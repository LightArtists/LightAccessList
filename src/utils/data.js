import { defaultNewCollection } from "../modules/data";
import {MAX_DROP_SIZE} from "../modules/ImageContext";

export const publicByte32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export function parseAddressesCSV(data) {
  const newData = data.map((arr, index) => ({
    address: arr[0],
    quantity: arr[1],
    id: index,
  }));
  if (isNaN(parseInt(newData[0].quantity))) {
    newData.shift();
  }
  return newData;
}

export function getNextName(defaultName, existNames) {
  if (!existNames.includes(defaultName)) {
    return defaultName;
  }

  let maxNum = Math.max(
    0,
    ...existNames
      .map((name) =>
        parseInt(name.replace(defaultName, "").replace(/[\s-]/gm, ""))
      )
      .filter((item) => !isNaN(item))
  );
  if (!maxNum) {
    maxNum = 1;
  } else {
    maxNum++;
  }
  const suffix = ` - ${maxNum}`;
  return defaultName + suffix;
}

export const parseArtists = (artists) => {
  let result = [];
  for (let i = 0; i < artists.length; i++) {
    let item = {};
    Object.keys(artists[i]).map((key, j) => {
      item[key.toLowerCase()] = artists[i][key];
    });
    item['url'] = item['name'].toLowerCase().replace(/ /gm, '-')
    item['profile name'] = item['profile image'].replace(/ /gm, '')
    const imageEx = /\.(jpe?g|png)$/i.test(item['profile image']) ? '' : '.jpg';
    const fullImageSrc = `https://light.art/images/artists/${item['profile image']}${imageEx}`;
    const imageSrc = `../../../images/artists/${item['profile image']}${imageEx}`;
    item.fullImageSrc = fullImageSrc;
    item.imageSrc = imageSrc;
    result.push(item);
  }
  result = result.sort((a, b) => a['profile image'].localeCompare(b['profile image']))
  return result;
};


const mapFields = {
  'id': 'id',
  'artist': 'artist',
  'Number': 'internalNumber',
  'name': 'title',
  'set' : 'set',
  'file': 'fileName',
  'description': 'description',
  'genres': 'tags',
  'tone': 'tone',
  'camera': 'camera',
  'camera manufacturer': 'cameraManufacturer',
  'location': 'location',
  'license': 'license',
  'country': 'country',
  'image': 'imageIPFS',
  'composite': 'composite'
}

const COLLECTION_IMAGE_BASE_URL = 'https://light-art.s3.us-east-1.amazonaws.com/collections/';

export function mapCollectionImages(collectionData, imageData, artists) {
  const images = imageData.map((jsonItem, index) => {
    const mappedData = mapCollectionImage(jsonItem);
    mappedData.image = `${COLLECTION_IMAGE_BASE_URL}${collectionData.imageDir}/${mappedData.fileName}.jpg`;
    mappedData.smallImage = `${COLLECTION_IMAGE_BASE_URL}${collectionData.imageDir}/${mappedData.fileName}-small.jpg`;
    mappedData.internalNumber = parseInt(mappedData.internalNumber);
    mappedData.collection = collectionData.name;
    if (!mappedData.id) {
      mappedData.id = index;
    }
    if (!mappedData.subtitle) {
      mappedData.subtitle = collectionData.name;
    }
    if (!mappedData.artistImg) {
      mappedData.artistImg = findArtistImageFullPathByName(artists, mappedData.artist);
    }
    mappedData.tags = mappedData.tags ? mappedData.tags.split(',') : [];
    return mappedData;
  });
  let zeroTokenNumber = collectionData.startIdNumber;
  if (!zeroTokenNumber && collectionData.dropId) {
    zeroTokenNumber = (collectionData.dropId * MAX_DROP_SIZE);
  }
  if (!zeroTokenNumber) {
    return images;
  }

  images.concat().sort((a, b) => a.internalNumber - b.internalNumber).forEach((item, index) => {
    if (!item.tokenId) {
      item.tokenId = zeroTokenNumber + index;
    }

    if (!item.internalNumber) {
      item.internalNumber = index;
    }
  });

  return images
}

function mapCollectionImage(data) {
  return Object.keys(mapFields).reduce((newObject, sourceKey) => {
    const targetKey = mapFields[sourceKey];
    newObject[targetKey] = data[sourceKey] || '';
    return newObject;
  }, {})
}

export function mapImageToIPFS(image, collection) {
  const data = {
    name: image.title,
    description: image.description,
    image: image.imageIPFS,
    external_url: "https://light.art",
    license_document: "ipfs://bafkreidvs3sgzpuoxaubpvg5gax2luj5j7422l2i5icfqmgtplk5medw3u",
    attributes: [],
  }
  data.attributes.push({
    trait_type: "Artist",
    value: image.artist,
  });
  data.attributes.push({
    trait_type: "Tone",
    value: image.tone,
  });
  data.attributes.push({
    trait_type: "Set",
    value: image.set,
  });
  data.attributes.push({
    trait_type: "Camera Manufacturer",
    value: image.cameraManufacturer,
  });
  data.attributes.push({
    trait_type: "Camera",
    value: image.camera,
  });
  data.attributes.push({
    trait_type: "Country",
    value: image.country,
  });
  data.attributes.push({
    trait_type: "Genres",
    value: image?.tags?.join(',') || [],
  })
  data.attributes.push({
    trait_type: "License",
    value: image.license,
  });
  data.attributes.push({
    trait_type: "Collection",
    value: collection.name,
  });
  data.attributes.push({
    trait_type: "Collection Year",
    value: (new Date()).getFullYear(),
  });
  return data;
}

function findArtistImageFullPathByName(artists, name) {
  const artist = artists.find(item => item.name?.toLowerCase() == name?.toLowerCase());
  if (!artist) {
    return '';
  }
  return artist.imageSrc;
}
