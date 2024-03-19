import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DataStoreService extends Service {
  @tracked insertedSuccessfully = true;

  setInsertedSuccessfully(value) {
    this.insertedSuccessfully = value;
  }

  getInsertedSuccessfully() {
    return this.insertedSuccessfully;
  }
}
