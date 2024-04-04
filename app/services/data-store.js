import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class DataStoreService extends Service {
  @tracked actualizarDatos;
  @tracked actualizarDatosMovies;

  async init() {
    super.init(...arguments);
    await this.updateList223();
    await this.updateListMovie();
  }

  setActualizarDatos(value) {
    this.actualizarDatos = value;
  }

  setActualizarDatosMovies(value){
    this.actualizarDatosMovies = value;
  }

  async updateList223() {
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/usuarios');
      const { data } = response;
      this.actualizarDatos = data;
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas de conexión al actualizar',
        showConfirmButton: false,
        timer: 1500,
    });
      throw new Error(`Error al actualizar los datos: ${error.message}`);
    }
  }

  async updateListMovie() {
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/peliculas');
      const { data } = response;
      this.actualizarDatosMovies = data;
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas de conexión al actualizar',
        showConfirmButton: false,
        timer: 1500,
    });
      throw new Error(`Error al actualizar los datos: ${error.message}`);
    }
  }

  getActualizarDatos() {
    return this.actualizarDatos;
  }

  getActualizarDatosMovie(){
    return this.actualizarDatosMovies;
  }
}
