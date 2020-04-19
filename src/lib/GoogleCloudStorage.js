import { Storage } from '@google-cloud/storage';

import { bucketName, uploadConfig } from '../config/googleCloudStorage';

class GoogleCloudStorage {
  constructor() {
    this.storage = new Storage();
    this.initBucket();
  }

  async initBucket() {
    this.bucket = await this.storage.bucket(bucketName);
  }

  upload(fileName) {
    return this.bucket.upload(
      `${process.cwd()}/temp/${fileName}`,
      uploadConfig
    );
  }

  getRemoteFile(fileNameInServer) {
    return this.bucket.file(fileNameInServer);
  }

  delete(fileNameInServer) {
    return this.getRemoteFile(fileNameInServer).delete();
  }
}

export default new GoogleCloudStorage();
