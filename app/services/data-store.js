import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import axios from 'axios';

export default class DataStoreService extends Service {
  @tracked actualizarDatos = this.UpdateList223();

  setActualizarDatos(value) {
    this.actualizarDatos = value;
  }

   getActualizarDatos() {
    return this.actualizarDatos;
  }

  async UpdateList223() {
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/usuarios');
      const { data } = response;
      this.setActualizarDatos(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
      return [];
    }
  }
}
