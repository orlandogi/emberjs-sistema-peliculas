import Route from '@ember/routing/route';
import axios from 'axios';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PublicarRoute extends Route {
    @service dataStore;

    async model() {
        try {
          const response = await axios.get('http://localhost:3000/api/uploadMovies');
          const { data } = response;
          this.dataStore.setActualizarPeliculasPublicadas(data);
        } catch (error) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Problemas de conexión al actualizar',
            showConfirmButton: false,
            timer: 1500,
        });
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
