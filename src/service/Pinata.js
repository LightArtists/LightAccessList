import Pinata from '@pinata/sdk';

export class PinataService {

  setKeys(apiKey, secretApiKey) {
    this.apiKey = apiKey;
    this.secretApiKey = secretApiKey;
  }

  getPinata() {
    if (this.pinata) {
      return this.pinata;
    }

    if (!this.secretApiKey || !this.apiKey) {
      throw Error('Please provide api keys.');
    }

    this.pinata = new Pinata(this.apiKey, this.secretApiKey);
  }

  testAuth() {
    return this.getPinata().testAuthentication();
  }

  pinJSONToIPFS(json, options) {
    return this.getPinata().pinJSONToIPFS(json, options);
  }

}