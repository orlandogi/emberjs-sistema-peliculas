import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import axios from 'axios';
import { action } from '@ember/object';
import Swal from 'sweetalert2';

export default class DataStoreService extends Service {
  @tracked actualizarDatos;
  @tracked actualizarDatosMovies;
  @tracked actualizarPeliculasSubidas;
  @tracked pruebaHorarios = 5;
  @tracked actualizarPeliculasPublicadas;

  async init() {
    super.init(...arguments);
    await this.updateList223();
    await this.updateListMovie();
    await this.updateUploadMovies();
    await this.updatePeliculasPublicadas();
  }

 @action setActualizarDatos(value) {
    this.actualizarDatos = value;
  }

  @action setPruebaHorarios(value){
    this.pruebaHorarios += value;
  }


  @action setActualizarDatosMovies(value){
    this.actualizarDatosMovies = value;
  }

 @action setActualizarPeliculasSubidas(value){
    this.actualizarPeliculasSubidas = value;
  }

 @action setActualizarPeliculasPublicadas(value){
    this.actualizarPeliculasPublicadas = value;
  }

 @action async updateList223() {
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

 @action async updateListMovie() {
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

 @action async updateUploadMovies(){
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/peliculasDisponibles');
      const { data } = response;
      this.actualizarPeliculasSubidas = data;
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

 @action async updatePeliculasPublicadas(){
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/uploadMovies');
      const { data } = response;
      this.actualizarPeliculasPublicadas = data;
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

 @action getActualizarDatos() {
    return this.actualizarDatos;
  }

 @action getActualizarDatosMovie(){
    return this.actualizarDatosMovies;
  }

 @action getPruebaHorarios(){
    return this.pruebaHorarios;
  }

 @action getActualizarPeliculasSubidas(){
    return this.actualizarPeliculasSubidas;
  }

 @action getActualizarPeliculasPublicadas(){
    return this.actualizarPeliculasPublicadas;
  }
}
