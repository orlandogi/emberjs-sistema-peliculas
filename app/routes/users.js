import Route from '@ember/routing/route';
import { action } from '@ember/object';
import axios from 'axios';
import { tracked } from '@glimmer/tracking';

export default class UsersRoute extends Route {
  @tracked users = [];

  async model() {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      return response.data;
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

  @action
  async eliminarUsuario(id) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/usuario/${id}`,
      );
      console.log('Usuario eliminado:', response.data);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  }
}
